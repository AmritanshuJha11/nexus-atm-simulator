/**
 * NEXUS BANK ATM & DIGITAL BANKING SIMULATOR
 * Milestone 4: Comprehensive Edge-Case, Corruption & Hardening Test Suite (AT-14 to AT-41)
 */

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createTestEnv({ withSpeech = true, quotaLimitOnSet = false } = {}) {
  const elements = new Map();
  const storage = new Map();
  let audioResumeCalls = 0;
  let oscillatorCount = 0;

  function createMockElement(id = '', tagName = 'div') {
    return {
      id,
      tagName: tagName.toUpperCase(),
      style: {},
      className: '',
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
      remove() { if (id) elements.delete(id); },
      focus() { },
      blur() { },
      click() { },
      addEventListener() { },
      removeEventListener() { },
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
      closest() { return null; }
    };
  }

  function getElementById(id) {
    if (!elements.has(id)) elements.set(id, createMockElement(id));
    return elements.get(id);
  }

  const localStorage = {
    throwQuota: quotaLimitOnSet,
    getItem(k) { return storage.has(k) ? storage.get(k) : null; },
    setItem(k, v) {
      if (this.throwQuota) {
        const err = new Error('QuotaExceededError');
        err.name = 'QuotaExceededError';
        err.code = 22;
        throw err;
      }
      storage.set(k, String(v));
    },
    removeItem(k) { storage.delete(k); },
    clear() { storage.clear(); },
    _storage: storage
  };

  const document = {
    readyState: 'complete',
    documentElement: createMockElement('html'),
    activeElement: createMockElement('body'),
    getElementById,
    querySelector(sel) {
      if (sel.startsWith('#')) return getElementById(sel.slice(1));
      if (sel === '.modal-overlay.active') return null;
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
    addEventListener() { },
    removeEventListener() { }
  };

  class MockAudioContext {
    constructor() {
      this.state = 'suspended';
      this.currentTime = 0;
      this.destination = {};
    }
    resume() {
      audioResumeCalls++;
      this.state = 'running';
      return Promise.resolve();
    }
    createOscillator() {
      oscillatorCount++;
      return {
        type: 'sine',
        frequency: { setValueAtTime() { }, linearRampToValueAtTime() { }, exponentialRampToValueAtTime() { } },
        connect() { },
        start() { },
        stop() { }
      };
    }
    createGain() {
      return {
        gain: { setValueAtTime() { }, linearRampToValueAtTime() { }, exponentialRampToValueAtTime() { } },
        connect() { }
      };
    }
  }

  const window = {
    AudioContext: MockAudioContext,
    webkitAudioContext: MockAudioContext,
    crypto: globalThis.crypto,
    ...(withSpeech ? {
      speechSynthesis: {
        getVoices() { return []; },
        speak() { },
        cancel() { }
      },
      SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } }
    } : {}),
    navigator: { mediaDevices: { getUserMedia() { return Promise.resolve({}); } } },
    addEventListener() { },
    removeEventListener() { },
    document,
    localStorage,
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
    setInterval: globalThis.setInterval,
    clearInterval: globalThis.clearInterval
  };

  return {
    window,
    document,
    localStorage,
    elements,
    storage,
    getAudioStats: () => ({ audioResumeCalls, oscillatorCount })
  };
}

function loadApp(env) {
  const code = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const sandbox = {
    window: env.window,
    document: env.document,
    localStorage: env.localStorage,
    AudioContext: env.window.AudioContext,
    webkitAudioContext: env.window.webkitAudioContext,
    SpeechSynthesisUtterance: env.window.SpeechSynthesisUtterance,
    navigator: env.window.navigator,
    console: { log: () => { }, warn: () => { }, error: () => { }, info: () => { } },
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
  return vm.runInContext('({ state, atm, audio, InputValidators, StateManager, buildCsvExportPayload, generateUniform3DigitCvv, showToast, STORAGE_KEY })', sandbox);
}

function loginSession(exp, cardIndex = 0) {
  const card = exp.state.data.cards[cardIndex];
  card.frozen = false;
  card.pinRetriesLeft = 3;
  exp.atm.insertCard(card.id);
  exp.atm.pinBuffer = card.pin;
  exp.atm.submitPin();
  assert.strictEqual(exp.atm.isAuthenticated, true);
  return card;
}

describe('Milestone 4 Phase A/B: Central Input Validators & Invalid Inputs (AT-14 to AT-24)', () => {
  let env, exp;
  beforeEach(() => {
    env = createTestEnv();
    exp = loadApp(env);
  });

  test('AT-14..AT-17: Withdrawal rejects 0, negative, decimals, 999999999, non-100 multiples (150/250), empty, text, and 1e5', () => {
    loginSession(exp);
    exp.atm.openWithdrawScreen();
    const initialBal = exp.state.data.accounts.checking.balance;

    for (const bad of ['', '0', '-500', '500.50', '999999999', '150', '250', 'abc', '1e5']) {
      exp.atm.withdrawInput = bad;
      exp.atm.confirmCustomWithdrawal();
      assert.strictEqual(exp.state.data.accounts.checking.balance, initialBal, `Input "${bad}" must not mutate balance`);
    }
    const check100 = exp.InputValidators.validateWithdrawalAmount('500', 100);
    assert.strictEqual(check100.valid, true);
    assert.strictEqual(check100.value, 500);
  });

  test('AT-18..AT-20: Transfer rejects invalid targets, self-transfer, >balance, and safely sanitizes memo', () => {
    loginSession(exp);
    exp.atm.openTransferScreen();
    const initialBal = exp.state.data.accounts.checking.balance;

    // Invalid target
    env.document.getElementById('transferTargetInput').value = '@@@';
    env.document.getElementById('transferAmountInput').value = '500';
    env.document.getElementById('transferSourceAccount').value = 'checking';
    exp.atm.confirmTransfer();
    assert.strictEqual(exp.state.data.accounts.checking.balance, initialBal);

    // Self-transfer by own checking number
    env.document.getElementById('transferTargetInput').value = '00007819';
    exp.atm.confirmTransfer();
    assert.strictEqual(exp.InputValidators.validateTransferTarget('7819', exp.state.data.accounts).valid, false);
    assert.strictEqual(exp.state.data.accounts.checking.balance, initialBal);

    // Above balance
    env.document.getElementById('transferTargetInput').value = '992100412@upi';
    env.document.getElementById('transferAmountInput').value = '999999';
    exp.atm.confirmTransfer();
    assert.strictEqual(exp.state.data.accounts.checking.balance, initialBal);

    // Long/multiline/special memo sanitized & capped at 80 chars, balance debited cleanly once
    const longMemo = 'Rent "2026", food\nline2 & <b>test</b> ' + 'x'.repeat(120);
    env.document.getElementById('transferAmountInput').value = '500';
    env.document.getElementById('transferNoteInput').value = longMemo;
    exp.atm.confirmTransfer();
    assert.strictEqual(exp.state.data.accounts.checking.balance, initialBal - 500);
    assert.ok(exp.state.data.transactions[0].typeLabel.length < 130);
    assert.strictEqual(exp.state.data.transactions[0].typeLabel.includes('\n'), false);
  });

  test('AT-21..AT-22: Deposit validates negative/huge note counts and cheque 6-digit number + >0 amount', () => {
    loginSession(exp);
    exp.atm.openDepositScreen();
    const initialBal = exp.state.data.accounts.checking.balance;
    env.document.getElementById('depositTargetAccount').value = 'checking';

    // Negative note count
    exp.atm.selectedDepositType = 'cash';
    exp.atm.depositCounts = { 500: -1, 200: 0, 100: 0, 50: 0 };
    exp.atm.confirmDeposit();
    assert.strictEqual(exp.state.data.accounts.checking.balance, initialBal);

    // Huge note count
    exp.atm.depositCounts = { 500: 999999, 200: 0, 100: 0, 50: 0 };
    exp.atm.confirmDeposit();
    assert.strictEqual(exp.state.data.accounts.checking.balance, initialBal);

    // Cheque missing / 5-digit / zero amount
    exp.atm.selectedDepositType = 'cheque';
    env.document.getElementById('chequeNumberInput').value = '';
    env.document.getElementById('chequeAmountInput').value = '5000';
    exp.atm.confirmDeposit();
    assert.strictEqual(exp.state.data.accounts.checking.balance, initialBal);

    env.document.getElementById('chequeNumberInput').value = '12345';
    exp.atm.confirmDeposit();
    assert.strictEqual(exp.state.data.accounts.checking.balance, initialBal);

    env.document.getElementById('chequeNumberInput').value = '408219';
    env.document.getElementById('chequeAmountInput').value = '0';
    exp.atm.confirmDeposit();
    assert.strictEqual(exp.state.data.accounts.checking.balance, initialBal);
  });

  test('AT-23..AT-24: PIN change rejects old PIN, 1111, 1234, non-digits, wrong current, mismatch', () => {
    const card = loginSession(exp);
    exp.atm.openPinChangeScreen();
    const originalPin = card.pin;

    const badAttempts = [
      { cur: '9999', next: '5820', conf: '5820' }, // wrong current
      { cur: '1234', next: '1234', conf: '1234' }, // same as old & weak
      { cur: '1234', next: '1111', conf: '1111' }, // weak
      { cur: '1234', next: 'ab12', conf: 'ab12' }, // non-digits
      { cur: '1234', next: '5820', conf: '5821' }  // mismatch
    ];

    for (const a of badAttempts) {
      env.document.getElementById('currentPinInput').value = a.cur;
      env.document.getElementById('newPinInput').value = a.next;
      env.document.getElementById('confirmNewPinInput').value = a.conf;
      exp.atm.confirmPinChange();
      assert.strictEqual(card.pin, originalPin);
    }

    // Valid strong PIN
    env.document.getElementById('currentPinInput').value = '1234';
    env.document.getElementById('newPinInput').value = '7492';
    env.document.getElementById('confirmNewPinInput').value = '7492';
    exp.atm.confirmPinChange();
    assert.strictEqual(card.pin, '7492');
  });
});

describe('Milestone 4 Phase A/B: Security, Session Persistence & Concurrency (AT-25 to AT-29)', () => {
  test('AT-25: 3 wrong PIN attempts lock card and lockout + partial retries survive reload', () => {
    const env = createTestEnv();
    let exp = loadApp(env);

    exp.atm.insertCard('card-1');
    exp.atm.pinBuffer = '9999';
    exp.atm.submitPin(); // 2 left
    exp.atm.pinBuffer = '9999';
    exp.atm.submitPin(); // 1 left

    // Simulate browser page reload
    exp = loadApp(env);
    assert.strictEqual(exp.state.data.cards[0].pinRetriesLeft, 1);

    // 3rd wrong attempt after refresh locks & freezes card persistently
    exp.atm.insertCard('card-1');
    exp.atm.pinBuffer = '9999';
    exp.atm.submitPin();
    assert.strictEqual(exp.state.data.cards[0].frozen, true);
    assert.strictEqual(exp.state.data.cards[0].pinRetriesLeft, 0);

    // Reload again: still locked
    exp = loadApp(env);
    assert.strictEqual(exp.state.data.cards[0].frozen, true);
    exp.atm.insertCard('card-1');
    assert.strictEqual(exp.atm.isCardInserted, false);
  });

  test('AT-26: Mid-transaction timeout clears timers & leaves zero debit', () => {
    const env = createTestEnv();
    const exp = loadApp(env);
    loginSession(exp);
    const balBefore = exp.state.data.accounts.checking.balance;

    exp.atm.openWithdrawScreen();
    exp.atm.withdrawInput = '2000';
    exp.atm.handleSessionTimeout();

    assert.strictEqual(exp.atm.isAuthenticated, false);
    assert.strictEqual(exp.atm.isCardInserted, false);
    assert.strictEqual(exp.atm.withdrawInput, '');
    assert.strictEqual(exp.state.data.accounts.checking.balance, balBefore);
  });

  test('AT-27: Rapid repeat submit / duplicate idempotency key posts only once and locks confirm buttons during dispense', () => {
    const env = createTestEnv();
    const exp = loadApp(env);
    loginSession(exp);
    const balBefore = exp.state.data.accounts.checking.balance;
    const txBefore = exp.state.data.transactions.length;

    exp.atm.openWithdrawScreen();
    exp.atm.withdrawInput = '1000';
    exp.atm.confirmCustomWithdrawal(); // locks mutex & transitions cleanly to screenDispensing
    assert.strictEqual(exp.atm.isProcessing, true);
    assert.strictEqual(env.document.getElementById('withdrawConfirmBtn').disabled, true);
    exp.atm.confirmCustomWithdrawal(); // rapid 2nd click blocked cleanly

    assert.strictEqual(exp.state.data.accounts.checking.balance, balBefore - 1000);
    assert.strictEqual(exp.state.data.transactions.length, txBefore + 1);

    // Simulate dispenser animation completion & confirm explicit idempotencyKey guard
    exp.atm.setTransactionBusy(false);
    assert.strictEqual(env.document.getElementById('withdrawConfirmBtn').disabled, false);
    exp.atm.processWithdrawal(500, 'checking', 'mixed', { idempotencyKey: 'KEY-123' });
    exp.atm.setTransactionBusy(false);
    exp.atm.processWithdrawal(500, 'checking', 'mixed', { idempotencyKey: 'KEY-123' });
    assert.strictEqual(exp.state.data.accounts.checking.balance, balBefore - 1500);
    assert.strictEqual(exp.state.data.transactions.length, txBefore + 2);
  });

  test('AT-28: Daily limit boundary exact match, +1 over, and persistence across reload', () => {
    const env = createTestEnv();
    let exp = loadApp(env);
    loginSession(exp);

    exp.atm.processWithdrawal(25000, 'checking', 'mixed');
    assert.strictEqual(exp.state.data.withdrawnToday, 25000);

    const overAuth = exp.atm.authorizeCardTransaction('withdrawal', 1, 'checking');
    assert.strictEqual(overAuth.authorized, false);
    assert.strictEqual(overAuth.code, 'LIMIT_EXCEEDED');

    // Reload and try ₹100
    exp = loadApp(env);
    loginSession(exp);
    const afterReloadAuth = exp.atm.authorizeCardTransaction('withdrawal', 100, 'checking');
    assert.strictEqual(afterReloadAuth.authorized, false);
    assert.strictEqual(afterReloadAuth.code, 'LIMIT_EXCEEDED');
  });

  test('AT-29: International & Contactless toggles block respective operations', () => {
    const env = createTestEnv();
    const exp = loadApp(env);
    const card = loginSession(exp);

    card.intl = false;
    exp.state.data.currency = 'USD';
    const intlCheck = exp.atm.authorizeCardTransaction('withdrawal', 500, 'checking');
    assert.strictEqual(intlCheck.authorized, false);
    assert.strictEqual(intlCheck.code, 'INTL_DISABLED');

    card.contactless = false;
    const tapCheck = exp.atm.authorizeCardTransaction('cardless', 500, 'checking');
    assert.strictEqual(tapCheck.authorized, false);
    assert.strictEqual(tapCheck.code, 'CONTACTLESS_DISABLED');
  });
});

describe('Milestone 4 Phase A/B: LocalStorage Corruption & Safe Recovery (AT-30 to AT-36)', () => {
  test('AT-30..AT-34: Handles invalid JSON, missing keys, wrong types, negative/NaN balance, missing transactions', () => {
    const payloads = [
      '{broken_json',
      '[]',
      JSON.stringify({ accounts: {} }),
      JSON.stringify({ cards: 'not-array', withdrawnToday: 'abc', cassettes: null }),
      JSON.stringify({
        accounts: { checking: { name: 'Current', balance: -500 }, savings: { name: 'Savings', balance: 'NaN' } },
        transactions: 'bad'
      })
    ];

    for (const raw of payloads) {
      const env = createTestEnv();
      env.localStorage.setItem('nexus_atm_state_inr_v1', raw);
      const exp = loadApp(env);
      assert.ok(exp.state.recoveryWarning.length > 0, 'Must surface recovery warning for corrupted payload');
      assert.ok(exp.state.data.accounts.checking.balance >= 0 && Number.isFinite(exp.state.data.accounts.checking.balance));
      assert.ok(exp.state.data.accounts.savings.balance >= 0 && Number.isFinite(exp.state.data.accounts.savings.balance));
      assert.ok(Array.isArray(exp.state.data.cards) && exp.state.data.cards.length > 0);
      assert.ok(Array.isArray(exp.state.data.transactions));
    }
  });

  test('AT-35: QuotaExceededError rolls back atomic withdrawal cleanly with no partial mutation', () => {
    const env = createTestEnv();
    const exp = loadApp(env);
    loginSession(exp);
    const balBefore = exp.state.data.accounts.checking.balance;
    const txBefore = exp.state.data.transactions.length;
    const cas500Before = exp.state.data.cassettes[500];

    env.localStorage.throwQuota = true;
    exp.atm.processWithdrawal(1000, 'checking', 'mixed');

    assert.strictEqual(exp.state.data.accounts.checking.balance, balBefore, 'Balance must roll back on storage quota failure');
    assert.strictEqual(exp.state.data.transactions.length, txBefore, 'Transaction must roll back on storage quota failure');
    assert.strictEqual(exp.state.data.cassettes[500], cas500Before, 'Cassette inventory must roll back cleanly');
  });

  test('AT-36: Detects balance vs empty ledger tamper mismatch', () => {
    const env = createTestEnv();
    env.localStorage.setItem('nexus_atm_state_inr_v1', JSON.stringify({
      accounts: { checking: { name: 'Checking Account', number: '•••• 7819', balance: 999999 } },
      transactions: []
    }));
    const exp = loadApp(env);
    assert.ok(exp.state.recoveryWarning.length > 0);
  });
});

describe('Milestone 4 Phase A/C: Audio, Speech Fallback & CSV Export (AT-37 to AT-41)', () => {
  test('AT-37..AT-38: AudioContext resumes from suspended, mute works, rapid keypress does not stack oscillators', () => {
    const env = createTestEnv();
    const exp = loadApp(env);

    for (let i = 0; i < 15; i++) {
      exp.audio.playKeypadBeep(1000);
    }
    const stats = env.getAudioStats();
    assert.ok(stats.audioResumeCalls >= 1, 'Suspended AudioContext must call resume()');
    assert.strictEqual(stats.oscillatorCount, 1, 'Rapid keypresses within 25ms must debounce to prevent stacking');

    exp.audio.playCashMotorSound();
    const afterMotorCount = env.getAudioStats().oscillatorCount;
    assert.ok(afterMotorCount > 1, 'Cash dispenser motor + flutter + ready chime should synthesize cleanly');

    exp.audio.playReceiptPrinterSound();
    const afterPrinterCount = env.getAudioStats().oscillatorCount;
    assert.ok(afterPrinterCount > afterMotorCount, 'Receipt printer stepper + cutter snip should synthesize cleanly');

    exp.audio.soundEnabled = false;
    exp.audio.playEnterTone();
    exp.audio.playCashMotorSound();
    exp.audio.playReceiptPrinterSound();
    assert.strictEqual(env.getAudioStats().oscillatorCount, afterPrinterCount, 'Mute must block sound synthesis');
  });

  test('AT-39: Unavailable speechSynthesis degrades cleanly without crashing', () => {
    const env = createTestEnv({ withSpeech: false });
    const exp = loadApp(env);
    exp.audio.voiceEnabled = true;
    assert.doesNotThrow(() => exp.audio.speak('Testing fallback when speechSynthesis is absent.'));
  });

  test('AT-40..AT-41: CSV export adds UTF-8 BOM, 7-column schema, RFC-4180 + formula sanitization, and blocks empty ledger', () => {
    const env = createTestEnv();
    const exp = loadApp(env);

    const emptyRes = exp.buildCsvExportPayload([]);
    assert.strictEqual(emptyRes.empty, true);

    const payload = exp.buildCsvExportPayload([
      {
        id: 'TX-1',
        timestamp: '2026-11-12 19:00:00',
        type: 'transfer',
        typeLabel: '=SUM(A1) Rent ₹1500, "Apt 4B"\nNote',
        amount: 1500.5,
        account: 'checking',
        ref: 'NX-112233',
        status: 'Completed',
        balanceAfter: 46999.5
      }
    ], new Date(2026, 10, 12));

    assert.strictEqual(payload.empty, false);
    assert.strictEqual(payload.filename, 'nexusbank_statement_2026-11-12.csv');
    assert.ok(payload.content.startsWith('\uFEFF'), 'CSV must start with UTF-8 BOM');
    assert.ok(payload.content.includes('"Timestamp","Reference_ID","Type","Account","Amount_INR","Status","Balance_After"'));
    assert.ok(payload.content.includes(`"'=SUM(A1) Rent ₹1500, ""Apt 4B"" Note"`), 'Formula prefix + quotes/commas/newlines + ₹ must be safely sanitized');
    assert.ok(payload.content.includes('"2026-11-12 19:00:00","NX-112233"'));
    assert.ok(payload.content.includes('"Checking (7819)","1500.50","Completed","46999.50"'));
  });

  test('AT-42..AT-44: Ring buffer cap (500), schemaVersion, crypto fallback, alert a11y, and UI/CSS safeguards', () => {
    const env = createTestEnv();
    const exp = loadApp(env);

    assert.strictEqual(exp.state.data.schemaVersion, 1);

    // Push 520 transactions and verify bounded 500-entry ring buffer
    for (let i = 0; i < 520; i++) {
      exp.state.data.transactions.unshift({
        id: `TX-B${i}`,
        type: 'withdrawal',
        typeLabel: 'ATM Cash Withdrawal',
        amount: 100,
        account: 'checking',
        timestamp: '2026-11-12 12:00:00',
        ref: `NX-${100000 + i}`,
        status: 'Completed',
        balanceAfter: 48500
      });
    }
    exp.state.addTransaction({
      id: 'TX-LATEST',
      type: 'withdrawal',
      typeLabel: 'ATM Cash Withdrawal',
      amount: 100,
      account: 'checking',
      timestamp: '2026-11-12 12:01:00',
      ref: 'NX-999999',
      status: 'Completed',
      balanceAfter: 48400
    });
    assert.strictEqual(exp.state.data.transactions.length, 500);
    assert.strictEqual(exp.state.data.transactions[0].id, 'TX-LATEST');

    // Crypto exception handled gracefully
    env.window.crypto = { getRandomValues() { throw new Error('Entropy unavailable'); } };
    assert.strictEqual(exp.generateUniform3DigitCvv(), null);

    // Error toast sets ARIA alert role & assertive live region
    const toastContainer = env.document.getElementById('toastContainer');
    exp.showToast('Sample alert', 'error');
    const lastToast = toastContainer.children[toastContainer.children.length - 1];
    assert.strictEqual(lastToast.getAttribute('role'), 'alert');
    assert.strictEqual(lastToast.getAttribute('aria-live'), 'assertive');

    // Verify HTML & CSS hardening rules
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const css = fs.readFileSync(path.join(__dirname, '..', 'style.css'), 'utf8');
    assert.ok(html.includes('id="statementExportCsvBtn"'));
    assert.ok(html.includes('id="withdrawErrorMsg" class="text-danger" role="alert" aria-live="assertive"'));
    assert.ok(css.includes('100dvh'));
    assert.ok(css.includes('-webkit-backdrop-filter'));
    assert.ok(css.includes('-webkit-perspective'));
    assert.ok(css.includes('-webkit-transform-style: preserve-3d'));
    assert.ok(css.includes('scrollbar-width: thin'));
    assert.ok(css.includes('@media (hover: none)'));
    assert.ok(css.includes('min-height: 44px'));
  });
});

