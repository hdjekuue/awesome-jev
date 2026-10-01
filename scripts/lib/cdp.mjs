/**
 * cdp.mjs — a minimal Chrome DevTools Protocol client over a plain WebSocket.
 *
 * No npm dependency, by design, matching the convention in the sibling
 * repositories. The endpoint is a URL, not a binary: Kitesurf's
 * `wss://kitesurf.dev/devtools/browser` is Cloudflare's stateless browser engine
 * running on Workers, so an agent can drive a real page with no local Chrome, no
 * container and no 300 MB download — and every connection is a fresh browser,
 * which is the right default for auditing someone else's page.
 *
 * Only the surface the checks need is implemented. Anything absent here is a
 * deliberate omission rather than an oversight.
 *
 *   const s = await launchCDP();
 *   const p = await s.newPage();
 *   await p.goto(url);
 *   await p.evaluate(() => document.title);
 *   await p.screenshot({ path: 'shot.png' });
 *   await s.close();
 */

export const KITESURF_WS = process.env.KITESURF_WS || 'wss://kitesurf.dev/devtools/browser';
const SEND_TIMEOUT = 60000;

/** One tab, on a flat CDP session. */
class Page {
  constructor(conn, sessionId, targetId) {
    this.conn = conn;
    this.sessionId = sessionId;
    this.targetId = targetId;
    this.errors = [];
    this.closed = false;
    this._loaded = null;

    conn.on((m) => {
      if (m.sessionId !== sessionId) return;
      if (m.method === 'Runtime.consoleAPICalled' && m.params?.type === 'error') {
        this.errors.push(
          (m.params.args || []).map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 160),
        );
      }
      if (m.method === 'Runtime.exceptionThrown') {
        this.errors.push(
          String(m.params?.exceptionDetails?.exception?.description || 'uncaught exception')
            .split('\n')[0].slice(0, 160),
        );
      }
      if (m.method === 'Page.loadEventFired' || m.method === 'Page.frameStoppedLoading') {
        this._resolveLoad?.();
      }
    });
  }

  send(method, params = {}) {
    return this.conn.send(method, params, this.sessionId);
  }

  /** Resolves on the next load, or after `ms`, whichever comes first. */
  load(ms = 30000) {
    return new Promise((resolve) => {
      const finish = () => {
        clearTimeout(timer);
        this._resolveLoad = null;
        resolve();
      };
      const timer = setTimeout(finish, ms);
      this._resolveLoad = finish;
    });
  }

  async setViewport({ width, height, deviceScaleFactor = 1 }) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor,
      mobile: width < 700,
    });
  }

  async goto(url, { wait = true, timeout = 40000 } = {}) {
    const loaded = wait ? this.load(timeout) : Promise.resolve();
    const res = await this.send('Page.navigate', { url });
    if (res?.errorText) throw new Error(`navigate failed: ${res.errorText}`);
    await loaded;
  }

  /**
   * Evaluates a function and returns its value, awaited. Passing a function
   * rather than a string keeps the page-side code readable and avoids a layer of
   * string escaping that hides syntax errors.
   */
  async evaluate(fn, ...args) {
    const expr = typeof fn === 'function' ? `(${fn.toString()})(${args.map((a) => JSON.stringify(a)).join(',')})` : String(fn);
    const { result, exceptionDetails } = await this.send('Runtime.evaluate', {
      expression: `(async () => (${expr}))()`,
      awaitPromise: true,
      returnByValue: true,
    });
    if (exceptionDetails) {
      throw new Error(`evaluate failed: ${exceptionDetails.exception?.description || exceptionDetails.text}`);
    }
    return result?.value;
  }

  async screenshot({ path, fullPage = false, clip = null, format = 'png' } = {}) {
    const params = { format };
    if (clip) {
      params.clip = { scale: 1, ...clip };
      params.captureBeyondViewport = true;
    } else if (fullPage) {
      const m = await this.send('Page.getLayoutMetrics');
      const width = Math.ceil(m.cssContentSize?.width || m.contentSize?.width || 1440);
      const height = Math.ceil(m.cssContentSize?.height || m.contentSize?.height || 900);
      params.clip = { x: 0, y: 0, width, height, scale: 1 };
      params.captureBeyondViewport = true;
    }
    const { data } = await this.send('Page.captureScreenshot', params);
    const buf = Buffer.from(data, 'base64');
    if (path) {
      const fs = await import('node:fs');
      const dir = path.replace(/[/\\][^/\\]+$/, '');
      if (dir) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path, buf);
    }
    return buf;
  }

  /** Sets a value and fires `input`, which is what the search island listens to. */
  async setValue(selector, value) {
    await this.evaluate((sel, v) => {
      const el = document.querySelector(sel);
      if (!el) throw new Error(`no element for ${sel}`);
      el.focus();
      el.value = v;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, selector, value);
  }

  async press(key) {
    const KEYS = {
      Escape: { key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 },
      Enter: { key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 },
      Tab: { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 },
      ArrowDown: { key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 },
      ArrowUp: { key: 'ArrowUp', code: 'ArrowUp', windowsVirtualKeyCode: 38 },
    };
    const k = KEYS[key] || { key, code: key };
    await this.send('Input.dispatchKeyEvent', { type: 'keyDown', ...k });
    await this.send('Input.dispatchKeyEvent', { type: 'keyUp', ...k });
  }

  async html() {
    const { outerHTML } = await this.send('DOM.getDocument', { depth: -1, pierce: true });
    return outerHTML;
  }

  async close() {
    if (this.closed) return;
    this.closed = true;
    await this.conn.send('Target.closeTarget', { targetId: this.targetId }).catch(() => {});
  }
}

/** One websocket, multiplexed over flat sessions. */
class Connection {
  constructor(ws) {
    this.ws = ws;
    this.seq = 0;
    this.pending = new Map();
    this.listeners = new Set();

    ws.addEventListener('message', (ev) => {
      let msg;
      try {
        msg = JSON.parse(typeof ev.data === 'string' ? ev.data : ev.data.toString());
      } catch {
        return;
      }
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject, timer } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        clearTimeout(timer);
        if (msg.error) reject(new Error(`${msg.error.message}${msg.error.data ? ` — ${msg.error.data}` : ''}`));
        else resolve(msg.result ?? {});
        return;
      }
      if (msg.method) for (const fn of this.listeners) fn(msg);
    });
  }

  on(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  send(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const id = ++this.seq;
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP timeout after ${SEND_TIMEOUT}ms: ${method}`));
      }, SEND_TIMEOUT);
      this.pending.set(id, { resolve, reject, timer });
      const frame = { id, method, params };
      if (sessionId) frame.sessionId = sessionId;
      try {
        this.ws.send(JSON.stringify(frame));
      } catch (e) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(e);
      }
    });
  }

  close() {
    try { this.ws.close(); } catch { /* already gone */ }
  }
}

/**
 * Opens a session and proves it is live.
 *
 * The proof matters: an endpoint can complete the TLS and WebSocket handshake and
 * then reject every call, which looks identical to "the browser is broken" from
 * the outside. `Target.getTargets` is the cheapest call that shows a session
 * actually exists, so it runs before success is reported.
 */
export async function launchCDP({ ws = KITESURF_WS, handshakeTimeout = 30000 } = {}) {
  const raw = new WebSocket(ws);
  const conn = new Connection(raw);

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`handshake timed out after ${handshakeTimeout}ms`)), handshakeTimeout);
    raw.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
    raw.addEventListener('error', () => { clearTimeout(timer); reject(new Error(`websocket error connecting to ${ws}`)); }, { once: true });
  });

  const { targetInfos } = await conn.send('Target.getTargets');
  const { product } = await conn.send('Browser.getVersion');
  let ua = null;
  try {
    ua = (await conn.send('Browser.getVersion'))?.userAgent || null;
  } catch { /* optional */ }

  return {
    conn,
    engine: 'kitesurf',
    remote: true,
    ws,
    version: product,
    userAgent: ua,
    targetsOnConnect: targetInfos.length,
    async newPage(opts = {}) {
      const { targetId } = await conn.send('Target.createTarget', { url: 'about:blank' });
      const { sessionId } = await conn.send('Target.attachToTarget', { targetId, flatten: true });
      const page = new Page(conn, sessionId, targetId);
      await page.send('Page.enable');
      await page.send('Runtime.enable');
      await page.send('DOM.enable');
      await page.setViewport(opts);
      return page;
    },
    close() {
      conn.close();
    },
  };
}

/** Convenience: open, run one function with a page, close. Never leaks a socket. */
export async function withPage(fn, opts = {}) {
  const session = await launchCDP(opts);
  const page = await session.newPage(opts.viewport);
  try {
    return await fn(page, session);
  } finally {
    await page.close().catch(() => {});
    session.close();
  }
}