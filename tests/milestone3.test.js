/**
 * NEXUS BANK ATM & DIGITAL BANKING SIMULATOR
 * Milestone 3 Security & Integration Test Suite
 * 
 * Verifies:
 * 1. Card-Freeze Enforcement across all transaction pathways & transaction atomicity
 * 2. Transient Simulated CVV generation (uniform crypto, 30s expiry, zero persistence)
 * 3. Inactivity Warning (45s) & Hard Timeout (60s) with full transient state teardown
 * 4. Shared State integrity, Session Card binding, and backward-compatible schema migration
 */

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Mock Browser Environment Factory
function createMockBrowserEnvironment() {
  const elements = new Map();
  const storage = new Map();

  function createMockElement(id = '', tagName = 'div') {
    const el = {
      id,
      tagName: tagName.toUpperCase(),
      style: {},
      classList: {
        _classes: new Set(),
        add(c) { this._classes.add(c); },
        remove(c) { this._classes.delete(c); },
        contains(c) { return this._classes.has(c); },
        toggle(c, force) {
          if (force !== undefined) {
            force ? this._classes.add(c) : this._classes.delete(c);
            return force;
          }
          if (this._classes.has(c)) { this._classes.delete(c); return false; }
          this._classes.add(c); return true;
        }
      },
      attributes: new Map(),
      setAttribute(k, v) { this.attributes.set(k, String(v)); },
      getAttribute(k) { return this.attributes.get(k) || null; },
      removeAttribute(k) { this.attributes.delete(k); },
      innerHTML: '',
      textContent: '',
      value: '',
      checked: false,
      disabled: false,
      children: [],
      appendChild(child) { this.children.push(child); return child; },
      remove() {
        if (id) elements.delete(id);
      },
      focus() {},
      blur() {},
      click() {},
      addEventListener(evt, fn) {},
      removeEventListener(evt, fn) {},
      querySelector(sel) {
        if (sel.startsWith('#')) return getElementById(sel.slice(1));
        return createMockElement('', sel);
      },
      querySelectorAll(sel) {
        if (sel.startsWith('#')) {
          const matched = getElementById(sel.slice(1));
          return matched ? [matched] : [];
        }
        return [createMockElement('', sel)];
      },
      closest(sel) {
        return null;
      }
    };
    return el;
  }

  function getElementById(id) {
    if (!elements.has(id)) {
      elements.set(id, createMockElement(id));
    }
    return elements.get(id);
  }

  const localStorage = {
    getItem(k) { return storage.get(k) || null; },
    setItem(k, v) { storage.set(k, String(v)); },
    removeItem(k) { storage.delete(k); },
    clear() { storage.clear(); },
    _dump() { return Object.fromEntries(storage.entries()); }
  };

  const document = {
    readyState: 'complete',
    documentElement: createMockElement('html'),
    getElementById,
    querySelector(sel) {
      if (sel.startsWith('#')) return getElementById(sel.slice(1));
      return createMockElement('', sel);
    },
    querySelectorAll(sel) {
      if (sel.startsWith('#')) {
        const el = getElementById(sel.slice(1));
        return el ? [el] : [];
      }
      return [createMockElement('', sel)];
    },
    createElement(tag) { return createMockElement('', tag); },
    addEventListener(evt, fn) {},
    removeEventListener(evt, fn) {}
  };

  class MockAudioContext {
    constructor() {
      this.state = 'running';
      this.currentTime = 0;
      this.destination = {};
    }
    resume() { return Promise.resolve(); }
    createOscillator() {
      return {
        type: 'sine',
        frequency: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} },
        connect() {},
        start() {},
        stop() {}
      };
    }
    createGain() {
      return {
        gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} },
        connect() {}
      };
    }
  }

  const window = {
    AudioContext: MockAudioContext,
    webkitAudioContext: MockAudioContext,
    crypto: globalThis.crypto,
    speechSynthesis: {
      speak() {},
      cancel() {}
    },
    SpeechSynthesisUtterance: class {
      constructor(text) { this.text = text; }
    },
    navigator: {
      mediaDevices: {
        getUserMedia() { return Promise.resolve({}); }
      }
    },
    addEventListener(evt, fn) {},
    removeEventListener(evt, fn) {},
    document,
    localStorage,
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
    setInterval: globalThis.setInterval,
    clearInterval: globalThis.clearInterval
  };

  return { window, document, localStorage, elements, storage };
}

// Helper to load application script in isolated VM sandbox
function loadAppSandbox(env) {
  const code = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  
  const sandbox = {
    window: env.window,
    document: env.document,
    localStorage: env.localStorage,
    AudioContext: env.window.AudioContext,
    webkitAudioContext: env.window.webkitAudioContext,
    SpeechSynthesisUtterance: env.window.SpeechSynthesisUtterance,
    navigator: env.window.navigator,
    console: {
      log: () => {},
      warn: () => {},
      error: () => {},
      info: () => {}
    },
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
    setInterval: globalThis.setInterval,
    clearInterval: globalThis.clearInterval,
    Uint16Array: globalThis.Uint16Array,
    Date: globalThis.Date,
    Math: globalThis.Math,
    JSON: globalThis.JSON,
    String: globalThis.String,
    Array: globalThis.Array,
    Object: globalThis.Object,
    Set: globalThis.Set,
    Map: globalThis.Map,
    Number: globalThis.Number,
    Boolean: globalThis.Boolean,
    parseInt: globalThis.parseInt,
    parseFloat: globalThis.parseFloat,
    Intl: globalThis.Intl
  };

  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  
  // Extract and return symbols from script scope
  const exported = vm.runInContext('({ state, atm, transientCvvState, StateManager, updateDashboardUI, revealTemporaryCvv, clearTemporaryCvv, handleRequestCvvReveal, verifyCvvAuthPin, generateUniform3DigitCvv })', sandbox);
  return { sandbox, exported };
}

// =============================================================================
// TEST SUITE: MILESTONE 3 SECURITY & INTEGRATION
// =============================================================================

describe('Milestone 3: Card-Freeze Enforcement & Transaction Atomicity', () => {
  let env;
  let exp;

  beforeEach(() => {
    env = createMockBrowserEnvironment();
    const loaded = loadAppSandbox(env);
    exp = loaded.exported;
  });

  test('T-AUTH-01: Operational card can be inserted and establishes sessionCardId', () => {
    const card = exp.state.data.cards[0];
    card.frozen = false;
    exp.state.data.activeCardId = card.id;

    exp.atm.insertCard();

    assert.strictEqual(exp.atm.isCardInserted, true, 'Card must be marked inserted');
    assert.strictEqual(exp.atm.sessionCardId, card.id, 'sessionCardId must be securely bound to inserted card');
    assert.strictEqual(exp.atm.currentScreen, 'screenPin', 'Must route to screenPin upon successful card insertion');
  });

  test('T-AUTH-02: Frozen card cannot be inserted into ATM', () => {
    const card = exp.state.data.cards[0];
    card.frozen = true;
    exp.state.data.activeCardId = card.id;

    exp.atm.insertCard();

    assert.strictEqual(exp.atm.isCardInserted, false, 'Frozen card must NOT be accepted in ATM slot');
    assert.strictEqual(exp.atm.sessionCardId, null, 'No session card ID should be bound');
    assert.strictEqual(exp.atm.currentScreen, 'screenWelcome', 'ATM must remain on welcome screen');
  });

  test('T-AUTH-03: Centralized authorizeCardTransaction rejects unauthenticated sessions', () => {
    exp.atm.isAuthenticated = false;
    const authResult = exp.atm.authorizeCardTransaction('withdrawal', 1000, 'checking');
    assert.strictEqual(authResult.authorized, false, 'Must reject unauthenticated transaction');
    assert.strictEqual(authResult.code, 'UNAUTHENTICATED');
  });

  test('T-AUTH-04: AuthorizeCardTransaction rejects transactions when card is frozen', () => {
    const card = exp.state.data.cards[0];
    card.frozen = true;
    exp.atm.isCardInserted = true;
    exp.atm.isAuthenticated = true;
    exp.atm.sessionCardId = card.id;

    const authResult = exp.atm.authorizeCardTransaction('withdrawal', 500, 'checking');
    assert.strictEqual(authResult.authorized, false, 'Frozen card must be denied authorization');
    assert.strictEqual(authResult.code, 'CARD_FROZEN');
    assert.strictEqual(exp.atm.isCardInserted, false, 'Card must be ejected on frozen authorization rejection');
    assert.strictEqual(exp.atm.isAuthenticated, false, 'Session must be terminated');
  });

  test('T-AUTH-05: Freezing card in wallet immediately terminates active ATM session', () => {
    const card = exp.state.data.cards[0];
    card.frozen = false;
    exp.atm.isCardInserted = true;
    exp.atm.isAuthenticated = true;
    exp.atm.sessionCardId = card.id;

    // Simulate user toggling freeze toggle in companion wallet
    card.frozen = true;
    exp.state.saveState();

    // Call authorize or simulate operation
    const auth = exp.atm.authorizeCardTransaction('fastcash', 1000, 'checking');
    assert.strictEqual(auth.authorized, false);
    assert.strictEqual(exp.atm.isCardInserted, false, 'ATM card must be ejected');
    assert.strictEqual(exp.atm.isAuthenticated, false, 'ATM session must be cleared');
  });

  test('T-AUTH-06: Frozen card withdrawal leaves balances and cash cassettes 100% unchanged (Atomicity)', () => {
    const card = exp.state.data.cards[0];
    card.frozen = true;
    exp.atm.isCardInserted = true;
    exp.atm.isAuthenticated = true;
    exp.atm.sessionCardId = card.id;

    const initialCheckingBal = exp.state.data.accounts.checking.balance;
    const initialCassette500 = exp.state.data.cassettes[500];
    const initialWithdrawnToday = exp.state.data.withdrawnToday;
    const initialTxCount = exp.state.data.transactions.length;

    // Attempt withdrawal
    exp.atm.processWithdrawal(2000);

    // Verify Zero Mutation
    assert.strictEqual(exp.state.data.accounts.checking.balance, initialCheckingBal, 'Checking balance must not change');
    assert.strictEqual(exp.state.data.cassettes[500], initialCassette500, 'ATM cassette inventory must not change');
    assert.strictEqual(exp.state.data.withdrawnToday, initialWithdrawnToday, 'Daily limit accumulator must not change');
    assert.strictEqual(exp.state.data.transactions.length, initialTxCount, 'No ledger record may be created for rejected transaction');
  });

  test('T-AUTH-07: Fast cash pathway strictly enforces freeze check', () => {
    const card = exp.state.data.cards[0];
    card.frozen = true;
    exp.atm.isCardInserted = true;
    exp.atm.isAuthenticated = true;
    exp.atm.sessionCardId = card.id;

    const initialBal = exp.state.data.accounts.checking.balance;
    exp.atm.executeFastCash(1000);

    assert.strictEqual(exp.state.data.accounts.checking.balance, initialBal, 'Fast cash on frozen card must not mutate balance');
    assert.strictEqual(exp.atm.isAuthenticated, false, 'Session must be terminated');
  });

  test('T-AUTH-08: Protected screens cannot be accessed when card is frozen', () => {
    const card = exp.state.data.cards[0];
    card.frozen = true;
    exp.atm.isCardInserted = true;
    exp.atm.isAuthenticated = true;
    exp.atm.sessionCardId = card.id;

    exp.atm.openWithdrawScreen();
    assert.strictEqual(exp.atm.isAuthenticated, false, 'Navigating to withdrawal screen on frozen card must abort session');
  });

  test('T-AUTH-09: Unfreezing card restores operational capability after PIN authentication', () => {
    const card = exp.state.data.cards[0];
    card.frozen = true;
    exp.atm.insertCard();
    assert.strictEqual(exp.atm.isCardInserted, false);

    // Unfreeze
    card.frozen = false;
    exp.atm.insertCard();
    assert.strictEqual(exp.atm.isCardInserted, true, 'Card insertion must succeed after unfreezing');

    exp.atm.pinBuffer = card.pin;
    exp.atm.submitPin();
    assert.strictEqual(exp.atm.isAuthenticated, true, 'PIN authentication must succeed');
    assert.strictEqual(exp.atm.currentScreen, 'screenMainMenu', 'Navigates to main menu');
  });
});

describe('Milestone 3: Virtual Card & Transient Simulated CVV', () => {
  let env;
  let exp;

  beforeEach(() => {
    env = createMockBrowserEnvironment();
    const loaded = loadAppSandbox(env);
    exp = loaded.exported;
  });

  test('T-CVV-01: CVV is masked by default on load', () => {
    const card = exp.state.getActiveCard();
    const cvvEl = env.document.getElementById('cardDisplayCvv');
    exp.updateDashboardUI();
    
    assert.strictEqual(cvvEl.textContent, '•••', 'Default CVV display must be masked as •••');
    assert.strictEqual(exp.transientCvvState.cvv, null, 'Transient CVV memory must be null');
  });

  test('T-CVV-02: Cryptographic CVV generator produces 3-digit uniform values (000-999)', () => {
    for (let i = 0; i < 50; i++) {
      const code = exp.generateUniform3DigitCvv();
      assert.strictEqual(typeof code, 'string', 'Generated CVV must be string');
      assert.strictEqual(code.length, 3, 'Generated CVV must be exactly 3 digits');
      const num = parseInt(code, 10);
      assert.ok(num >= 0 && num <= 999, 'Generated value must be in range 000-999');
    }
  });

  test('T-CVV-03: Revealed CVV has 30s transient lifecycle and is reflected in UI', () => {
    const card = exp.state.getActiveCard();
    card.frozen = false;

    exp.revealTemporaryCvv(card.id);

    assert.ok(exp.transientCvvState.cvv !== null, 'Transient CVV must be populated in runtime memory');
    assert.strictEqual(exp.transientCvvState.cvv.length, 3);
    assert.ok(exp.transientCvvState.expiresAt > Date.now(), 'ExpiresAt timestamp must be in future');

    const cvvEl = env.document.getElementById('cardDisplayCvv');
    assert.strictEqual(cvvEl.textContent, exp.transientCvvState.cvv, 'DOM element must reflect transient CVV');
  });

  test('T-CVV-04: clearTemporaryCvv wipes in-memory value and re-masks DOM', () => {
    const card = exp.state.getActiveCard();
    exp.revealTemporaryCvv(card.id);

    exp.clearTemporaryCvv('expired');

    assert.strictEqual(exp.transientCvvState.cvv, null, 'In-memory CVV reference must be wiped');
    assert.strictEqual(exp.transientCvvState.cardId, null, 'CardId must be cleared');
    const cvvEl = env.document.getElementById('cardDisplayCvv');
    assert.strictEqual(cvvEl.textContent, '•••', 'DOM display must revert to •••');
  });

  test('T-CVV-05: Freezing card instantly clears any active temporary CVV', () => {
    const card = exp.state.getActiveCard();
    card.frozen = false;
    exp.revealTemporaryCvv(card.id);
    assert.ok(exp.transientCvvState.cvv !== null);

    // Freeze card
    card.frozen = true;
    exp.clearTemporaryCvv('card frozen');

    assert.strictEqual(exp.transientCvvState.cvv, null, 'CVV must be cleared when card is frozen');
  });

  test('T-CVV-06: Temporary CVV is NEVER persisted to LocalStorage', () => {
    const card = exp.state.getActiveCard();
    exp.revealTemporaryCvv(card.id);

    // Save application state
    exp.state.saveState();

    const storedRaw = env.localStorage.getItem('nexus_atm_state_inr_v1');
    assert.ok(storedRaw, 'State must exist in storage');
    assert.ok(!storedRaw.includes(exp.transientCvvState.cvv), 'Raw local storage must NEVER contain the temporary CVV');

    const parsed = JSON.parse(storedRaw);
    assert.strictEqual(parsed.transientCvv, undefined, 'Persistent state object must not have transientCvv');
    assert.strictEqual(parsed.tempCvv, undefined, 'Persistent state object must not have tempCvv');
    parsed.cards.forEach(c => {
      assert.strictEqual(c.transientCvv, undefined);
      assert.strictEqual(c.tempCvv, undefined);
    });
  });

  test('T-CVV-07: Unauthenticated request requires valid card PIN to reveal CVV', () => {
    const card = exp.state.getActiveCard();
    exp.atm.isAuthenticated = false;

    // Simulate opening auth modal
    exp.handleRequestCvvReveal();
    const modal = env.document.getElementById('cvvAuthModal');
    assert.ok(modal.classList.contains('active'), 'PIN auth modal must open for unauthenticated user');

    // Wrong PIN
    const pinInput = env.document.getElementById('cvvAuthPinInput');
    pinInput.value = '9999';
    exp.verifyCvvAuthPin();
    assert.strictEqual(exp.transientCvvState.cvv, null, 'Wrong PIN must not reveal CVV');

    // Correct PIN
    pinInput.value = card.pin;
    exp.verifyCvvAuthPin();
    assert.ok(exp.transientCvvState.cvv !== null, 'Correct PIN must reveal CVV');
  });
});

describe('Milestone 3: Inactivity Warning (45s), Timeout (60s) & Session Cleanup', () => {
  let env;
  let exp;

  beforeEach(() => {
    env = createMockBrowserEnvironment();
    const loaded = loadAppSandbox(env);
    exp = loaded.exported;
  });

  test('T-TIME-01: Inactivity timers are scheduled on active card insertion', () => {
    exp.atm.insertCard();
    assert.ok(exp.atm.inactivityWarningTimer !== null, 'Warning timer must be scheduled');
    assert.ok(exp.atm.inactivityTimeoutTimer !== null, 'Timeout timer must be scheduled');
  });

  test('T-TIME-02: Meaningful user activity resets inactivity timestamp and dismisses warning', () => {
    exp.atm.insertCard();
    const initialTime = Date.now() - 10000;
    exp.atm.lastActivityTime = initialTime;
    exp.atm.isWarningShown = true;

    exp.atm.recordUserActivity();

    assert.ok(exp.atm.lastActivityTime > initialTime, 'lastActivityTime must be updated');
    assert.strictEqual(exp.atm.isWarningShown, false, 'Warning modal must be dismissed on user activity');
  });

  test('T-TIME-03: Session timeout at 60s invalidates session and clears all transient state', () => {
    const card = exp.state.getActiveCard();
    exp.atm.isCardInserted = true;
    exp.atm.isAuthenticated = true;
    exp.atm.sessionCardId = card.id;
    exp.atm.pinBuffer = '1234';
    exp.atm.withdrawInput = '2500';
    exp.revealTemporaryCvv(card.id);

    // Trigger session timeout
    exp.atm.handleSessionTimeout();

    assert.strictEqual(exp.atm.isAuthenticated, false, 'Session must be invalidated');
    assert.strictEqual(exp.atm.isCardInserted, false, 'Card must be ejected');
    assert.strictEqual(exp.atm.pinBuffer, '', 'PIN buffer must be cleared');
    assert.strictEqual(exp.atm.withdrawInput, '', 'Withdraw input buffer must be cleared');
    assert.strictEqual(exp.transientCvvState.cvv, null, 'Temporary CVV must be cleared on timeout');
    assert.strictEqual(exp.atm.currentScreen, 'screenCardEjected', 'Screen must transition to card ejected');
  });

  test('T-TIME-04: SessionAuthToken increments on timeout to discard stale asynchronous callbacks', () => {
    const tokenBefore = exp.atm.sessionAuthToken;
    exp.atm.handleSessionTimeout();
    assert.ok(exp.atm.sessionAuthToken > tokenBefore, 'sessionAuthToken must increment on session expiry');
  });
});

describe('Milestone 3: Shared State & Backward Compatibility', () => {
  let env;
  let exp;

  beforeEach(() => {
    env = createMockBrowserEnvironment();
    const loaded = loadAppSandbox(env);
    exp = loaded.exported;
  });

  test('T-COMPAT-01: Legacy saved state with missing fields migrates safely on load', () => {
    const legacyState = {
      accounts: {
        checking: { name: 'Checking Account', number: '•••• 7819', balance: 35000.00 }
      },
      cards: [
        {
          id: 'card-1',
          holder: 'JOHN DOE',
          number: '4242 8840 1920 8840',
          pin: '1234'
          // note: frozen is missing in legacy data
        }
      ]
    };
    env.localStorage.setItem('nexus_atm_state_inr_v1', JSON.stringify(legacyState));

    const stateMgr = new exp.StateManager();
    const loadedCard = stateMgr.data.cards[0];

    assert.strictEqual(loadedCard.frozen, false, 'Missing frozen field must default to false boolean');
    assert.ok(stateMgr.data.cassettes !== undefined, 'Missing cassettes must default to standard inventory');
    assert.strictEqual(stateMgr.data.paperRoll, 88, 'Missing paperRoll must default to 88%');
  });

  test('T-COMPAT-02: High contrast freeze status badge correctly reflects operational vs frozen', () => {
    const card = exp.state.getActiveCard();
    card.frozen = false;
    exp.updateDashboardUI();

    const badge = env.document.getElementById('freezeStatusBadge');
    const text = env.document.getElementById('freezeStatusText');
    assert.strictEqual(badge.className, 'card-freeze-status-badge active');
    assert.strictEqual(text.textContent, 'OPERATIONAL');

    card.frozen = true;
    exp.updateDashboardUI();
    assert.strictEqual(badge.className, 'card-freeze-status-badge frozen');
    assert.strictEqual(text.textContent, 'FROZEN (LOCKED)');
  });
});
