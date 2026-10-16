/**
 * NEXUS BANK - ATM SIMULATION & DIGITAL BANKING HUB
 * Core Application Engine & State Controller
 */

// =============================================================================
// 1. WEB AUDIO API SYNTHESIZER (REALISTIC ATM SOUND FX ENGINE)
// =============================================================================
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.voiceEnabled = false;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playKeypadBeep(freq = 1200) {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playEnterTone() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      [800, 1200, 1600].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.15, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.1);
      });
    } catch (e) {}
  }

  playErrorTone() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      [350, 250].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.2, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.15);
      });
    } catch (e) {}
  }

  playCardInsertSound() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  playCashMotorSound() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      
      // Motor drone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(220, now + 1.2);
      osc.frequency.linearRampToValueAtTime(120, now + 2.5);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 2.6);

      // Rapid tick flutter for bill counting
      for (let i = 0; i < 18; i++) {
        const tickOsc = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        tickOsc.type = 'square';
        tickOsc.frequency.setValueAtTime(1800 + Math.random() * 400, now + 0.3 + i * 0.09);
        tickGain.gain.setValueAtTime(0.08, now + 0.3 + i * 0.09);
        tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + i * 0.09 + 0.03);
        tickOsc.connect(tickGain);
        tickGain.connect(this.ctx.destination);
        tickOsc.start(now + 0.3 + i * 0.09);
        tickOsc.stop(now + 0.3 + i * 0.09 + 0.03);
      }
    } catch (e) {}
  }

  playReceiptPrinterSound() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      for (let i = 0; i < 12; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2400 + (i % 2) * 300, now + i * 0.06);
        gain.gain.setValueAtTime(0.06, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.04);
      }
    } catch (e) {}
  }

  playCameraShutterSound() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      // Mechanical shutter flip 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(2200, now);
      osc1.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.04);

      // Shutter click 2
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1200, now + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(120, now + 0.12);
      gain2.gain.setValueAtTime(0.25, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.12);
    } catch (e) {}
  }

  playBiometricScanSound() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.linearRampToValueAtTime(1400, now + 0.6);
      osc.frequency.linearRampToValueAtTime(750, now + 1.2);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);
    } catch (e) {}
  }

  playBiometricSuccessSound() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.18, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.25);
      });
    } catch (e) {}
  }

  speak(text) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }
}

const audio = new AudioEngine();

// =============================================================================
// PRE-GENERATED BIOMETRIC KYC AVATARS (SVG DATA URIS)
// =============================================================================
const DEMO_AVATARS = {
  'cyber': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230f172a'/><circle cx='50' cy='38' r='20' fill='%2306b6d4'/><path d='M20,85 C20,62 34,58 50,58 C66,58 80,62 80,85 Z' fill='%233b82f6'/><circle cx='43' cy='36' r='3' fill='%23020617'/><circle cx='57' cy='36' r='3' fill='%23020617'/><path d='M32,32 L68,32' stroke='%2300f0ff' stroke-width='3'/></svg>",
  'vip': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e1b4b'/><circle cx='50' cy='38' r='20' fill='%23fbbf24'/><path d='M20,85 C20,62 34,58 50,58 C66,58 80,62 80,85 Z' fill='%23f59e0b'/><circle cx='43' cy='36' r='3' fill='%23451a03'/><circle cx='57' cy='36' r='3' fill='%23451a03'/><path d='M42,20 L50,12 L58,20 Z' fill='%23d97706'/></svg>",
  'traveler': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23064e3b'/><circle cx='50' cy='38' r='20' fill='%2334d399'/><path d='M20,85 C20,62 34,58 50,58 C66,58 80,62 80,85 Z' fill='%23059669'/><circle cx='43' cy='36' r='3' fill='%23022c22'/><circle cx='57' cy='36' r='3' fill='%23022c22'/></svg>",
  'emerald': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2318181b'/><circle cx='50' cy='38' r='20' fill='%23a1a1aa'/><path d='M20,85 C20,62 34,58 50,58 C66,58 80,62 80,85 Z' fill='%2371717a'/><circle cx='43' cy='36' r='3' fill='%2309090b'/><circle cx='57' cy='36' r='3' fill='%2309090b'/></svg>",
  'john': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230f172a'/><circle cx='50' cy='38' r='22' fill='%2338bdf8'/><path d='M18,85 C18,60 32,56 50,56 C68,56 82,60 82,85 Z' fill='%230284c7'/><circle cx='42' cy='36' r='3' fill='%230c4a6e'/><circle cx='58' cy='36' r='3' fill='%230c4a6e'/></svg>",
  'sarah': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%232e1065'/><circle cx='50' cy='38' r='22' fill='%23ec4899'/><path d='M18,85 C18,60 32,56 50,56 C68,56 82,60 82,85 Z' fill='%23db2777'/><circle cx='42' cy='36' r='3' fill='%23500724'/><circle cx='58' cy='36' r='3' fill='%23500724'/></svg>"
};

// =============================================================================
// 2. STATE REPOSITORY & PERSISTENCE
// =============================================================================
const STORAGE_KEY = 'nexus_atm_state_inr_v1';

const DEFAULT_STATE = {
  accounts: {
    checking: { name: 'Checking Account', number: '•••• 7819', balance: 48500.00 },
    savings: { name: 'High-Yield Savings', number: '•••• 9204', balance: 124200.50 }
  },
  cards: [
    {
      id: 'card-1',
      holder: 'JOHN DOE',
      number: '4242 8840 1920 8840',
      pin: '1234',
      tier: 'obsidian-black',
      tierLabel: 'OBSIDIAN PLATINUM',
      network: 'visa',
      expiry: '09/29',
      cvv: '842',
      frozen: false,
      intl: true,
      contactless: true,
      linkedAccount: 'checking',
      photo: DEMO_AVATARS.john
    },
    {
      id: 'card-2',
      holder: 'SARAH CONNOR',
      number: '5310 9921 4410 7712',
      pin: '4321',
      tier: 'titanium-gold',
      tierLabel: 'TITANIUM GOLD',
      network: 'mastercard',
      expiry: '11/30',
      cvv: '319',
      frozen: false,
      intl: true,
      contactless: true,
      linkedAccount: 'savings',
      photo: DEMO_AVATARS.sarah
    }
  ],
  activeCardId: 'card-1',
  dailyLimit: 25000.00,
  withdrawnToday: 0.00,
  currency: 'INR',
  cassettes: {
    500: 1840,
    200: 1450,
    100: 1920,
    50: 980
  },
  paperRoll: 88,
  rates: {
    INR: { symbol: '₹', rate: 1.0 },
    USD: { symbol: '$', rate: 0.012 },
    EUR: { symbol: '€', rate: 0.011 },
    GBP: { symbol: '£', rate: 0.0095 },
    JPY: { symbol: '¥', rate: 1.86 },
    CAD: { symbol: 'C$', rate: 0.016 }
  },
  transactions: [
    {
      id: 'TX-9012',
      type: 'deposit',
      typeLabel: 'Direct Payroll Deposit',
      amount: 32000.00,
      account: 'checking',
      cardUsed: '4242 •••• •••• 8840',
      timestamp: '2026-08-30 09:15:22',
      ref: 'NX-881920'
    },
    {
      id: 'TX-9011',
      type: 'withdrawal',
      typeLabel: 'ATM Cash Withdrawal',
      amount: 2000.00,
      account: 'checking',
      cardUsed: '4242 •••• •••• 8840',
      timestamp: '2026-08-29 18:40:10',
      ref: 'NX-881919'
    },
    {
      id: 'TX-9010',
      type: 'transfer',
      typeLabel: 'Transfer to Sarah Connor',
      amount: 1500.00,
      account: 'checking',
      cardUsed: '4242 •••• •••• 8840',
      timestamp: '2026-08-28 14:22:05',
      ref: 'NX-881918'
    }
  ]
};

// Accessibility Announcement Helper (Milestone 3)
function announceA11y(message, politeness = 'polite') {
  const el = document.getElementById('globalA11yAnnouncer');
  if (!el) return;
  el.setAttribute('aria-live', politeness);
  el.textContent = '';
  setTimeout(() => {
    el.textContent = message;
  }, 40);
}

class StateManager {
  constructor() {
    this.data = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.cassettes) {
          parsed.cassettes = { 500: 1840, 200: 1450, 100: 1920, 50: 980 };
        }
        if (typeof parsed.paperRoll === 'undefined') {
          parsed.paperRoll = 88;
        }

        // Backward compatibility: ensure accounts exist
        if (!parsed.accounts || !parsed.accounts.checking) {
          parsed.accounts = JSON.parse(JSON.stringify(DEFAULT_STATE.accounts));
        }

        // Backward compatibility: ensure cards array and card.frozen boolean
        if (Array.isArray(parsed.cards)) {
          parsed.cards.forEach(c => {
            c.frozen = !!c.frozen;
            // Never load transient CVV into persistent state
            delete c.transientCvv;
            delete c.tempCvv;
          });
        } else {
          parsed.cards = JSON.parse(JSON.stringify(DEFAULT_STATE.cards));
        }

        if (!parsed.activeCardId && parsed.cards.length > 0) {
          parsed.activeCardId = parsed.cards[0].id;
        }

        if (typeof parsed.dailyLimit === 'undefined') {
          parsed.dailyLimit = DEFAULT_STATE.dailyLimit || 50000;
        }
        if (typeof parsed.withdrawnToday === 'undefined') {
          parsed.withdrawnToday = 0;
        }
        if (!Array.isArray(parsed.transactions)) {
          parsed.transactions = [];
        }

        // Remove any leaked transient variables
        delete parsed.transientCvv;
        delete parsed.tempCvv;
        delete parsed.inactivityTimer;

        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load local storage state:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    try {
      // Ensure transient CVVs, timers, or sensitive tokens are NEVER written to persistent storage
      const clone = JSON.parse(JSON.stringify(this.data));
      if (Array.isArray(clone.cards)) {
        clone.cards.forEach(c => {
          delete c.transientCvv;
          delete c.tempCvv;
        });
      }
      delete clone.transientCvv;
      delete clone.tempCvv;
      delete clone.inactivityTimer;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(clone));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }

  resetState() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
  }

  getActiveCard() {
    return this.data.cards.find(c => c.id === this.data.activeCardId) || this.data.cards[0];
  }

  getAccount(key) {
    return this.data.accounts[key] || this.data.accounts.checking;
  }

  formatMoney(amount, targetCurrency = null) {
    const curr = targetCurrency || this.data.currency;
    const rateObj = this.data.rates[curr] || this.data.rates.INR || { symbol: '₹', rate: 1.0 };
    const converted = amount * rateObj.rate;
    
    // Formatting with currency symbol in Indian Rupee format
    return `${rateObj.symbol}${converted.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  addTransaction(tx) {
    this.data.transactions.unshift(tx);
    this.saveState();
  }
}

const state = new StateManager();


// =============================================================================
// 3. ATM MACHINE CONTROLLER & SCREEN ENGINE
// =============================================================================
class AtmController {
  constructor() {
    this.currentScreen = 'screenWelcome';
    this.isCardInserted = false;
    this.isAuthenticated = false;
    this.sessionCardId = null;
    this.sessionAuthToken = 0;
    this.pinBuffer = '';
    this.pinRetriesLeft = 3;
    this.withdrawInput = '';
    this.selectedWithdrawAccount = 'checking';
    this.selectedDepositType = 'cash';
    this.depositCounts = { 500: 0, 200: 0, 100: 0, 50: 0 };
    this.lastReceiptData = null;

    // Milestone 3: Inactivity Timer Engine (45s warning, 60s timeout)
    this.lastActivityTime = null;
    this.inactivityWarningTimer = null;
    this.inactivityTimeoutTimer = null;
    this.warningCountdownInterval = null;
    this.isWarningShown = false;
    this.ejectScreenTimeout = null;
    this.faceAuthTimeout = null;

    this.initClock();
  }

  initClock() {
    const updateTime = () => {
      const el = document.getElementById('screenClock');
      if (el) {
        const now = new Date();
        el.textContent = now.toLocaleTimeString();
      }
    };
    setInterval(updateTime, 1000);
    updateTime();
  }

  // ===========================================================================
  // CENTRALIZED CARD AUTHORIZATION ENGINE (MILESTONE 3)
  // ===========================================================================
  authorizeCardTransaction(operationName, requiredAmount = 0, accountKey = null) {
    // 1. Session check: user must be authenticated
    if (!this.isAuthenticated) {
      return {
        authorized: false,
        code: 'UNAUTHENTICATED',
        reason: 'Transaction declined. Please insert your card and authenticate with PIN or Face-ID.'
      };
    }

    // 2. Identify the authoritative card associated with this active session
    let card = null;
    if (this.isCardInserted) {
      const cardId = this.sessionCardId || state.data.activeCardId;
      card = state.data.cards.find(c => c.id === cardId);
      if (!card) {
        return {
          authorized: false,
          code: 'INVALID_CARD',
          reason: 'Transaction declined. Card associated with this session is invalid.'
        };
      }

      // Authoritative Card-Freeze check:
      // If card is frozen, immediately terminate ATM session and prevent financial mutation
      if (card.frozen) {
        this.ejectCard('Transaction declined. This card is frozen. Unfreeze the card and authenticate again to continue.');
        return {
          authorized: false,
          code: 'CARD_FROZEN',
          reason: 'Transaction declined. This card is frozen. Unfreeze the card and authenticate again to continue.'
        };
      }
    } else {
      // Cardless session uses active account card for receipt/meta reference
      card = state.getActiveCard();
    }

    // 3. Precondition validation without mutating financial state
    if (requiredAmount > 0) {
      // Limit check for withdrawals/fast-cash
      if (operationName === 'withdrawal' || operationName === 'fastcash') {
        const remainingLimit = state.data.dailyLimit - state.data.withdrawnToday;
        if (requiredAmount > remainingLimit) {
          return {
            authorized: false,
            code: 'LIMIT_EXCEEDED',
            reason: `Daily ATM limit exceeded! Remaining limit: ${state.formatMoney(remainingLimit)}`
          };
        }
      }

      // Account balance check
      if (accountKey) {
        const account = state.getAccount(accountKey);
        if (!account || account.balance < requiredAmount) {
          return {
            authorized: false,
            code: 'INSUFFICIENT_FUNDS',
            reason: `Insufficient funds in ${account ? account.name : 'account'}! Available: ${state.formatMoney(account ? account.balance : 0)}`
          };
        }
      }
    }

    return {
      authorized: true,
      card: card,
      accountKey: accountKey,
      account: accountKey ? state.getAccount(accountKey) : null,
      amount: requiredAmount
    };
  }

  // ===========================================================================
  // INACTIVITY TIMEOUT & SESSION CLEANUP (MILESTONE 3: 45s Warning / 60s Timeout)
  // ===========================================================================
  recordUserActivity() {
    if (!this.isCardInserted && !this.isAuthenticated) return;
    this.lastActivityTime = Date.now();
    if (this.isWarningShown) {
      this.hideInactivityWarning();
    }
    this.scheduleInactivityTimers();
  }

  scheduleInactivityTimers() {
    this.clearInactivityTimers();

    // Active session monitoring (idle only during card-in-slot or authenticated session)
    if ((this.isCardInserted || this.isAuthenticated) && 
        this.currentScreen !== 'screenSuccess' && 
        this.currentScreen !== 'screenWelcome' && 
        this.currentScreen !== 'screenCardEjected') {
      
      const now = Date.now();
      if (!this.lastActivityTime) this.lastActivityTime = now;
      const elapsed = now - this.lastActivityTime;

      const timeToWarning = Math.max(0, 45000 - elapsed);
      const timeToTimeout = Math.max(0, 60000 - elapsed);

      // Warning at 45 seconds of inactivity
      this.inactivityWarningTimer = setTimeout(() => {
        const actualElapsed = Date.now() - this.lastActivityTime;
        if (actualElapsed >= 45000 && !this.isWarningShown && (this.isCardInserted || this.isAuthenticated)) {
          this.showInactivityWarning();
        }
      }, timeToWarning);

      // Timeout at 60 seconds of inactivity
      this.inactivityTimeoutTimer = setTimeout(() => {
        const actualElapsed = Date.now() - this.lastActivityTime;
        if (actualElapsed >= 60000 && (this.isCardInserted || this.isAuthenticated)) {
          this.handleSessionTimeout();
        } else {
          // Re-evaluate if timer fired slightly early due to browser task batching
          this.scheduleInactivityTimers();
        }
      }, timeToTimeout);
    }
  }

  showInactivityWarning() {
    this.isWarningShown = true;
    const modal = document.getElementById('inactivityWarningModal');
    if (modal) modal.classList.add('active');

    const updateCountdown = () => {
      const remainingMs = 60000 - (Date.now() - this.lastActivityTime);
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
      const countEl = document.getElementById('inactivityCountdownSec');
      if (countEl) countEl.textContent = remainingSec;

      if (remainingSec === 5) {
        announceA11y('ATM session expiring in 5 seconds due to inactivity.');
      }

      if (remainingSec <= 0) {
        this.handleSessionTimeout();
      }
    };

    updateCountdown();
    announceA11y('ATM session inactivity warning. 15 seconds remaining. Press any key to continue.');
    audio.playErrorTone();

    if (this.warningCountdownInterval) clearInterval(this.warningCountdownInterval);
    this.warningCountdownInterval = setInterval(updateCountdown, 1000);
  }

  hideInactivityWarning() {
    this.isWarningShown = false;
    const modal = document.getElementById('inactivityWarningModal');
    if (modal) modal.classList.remove('active');
    if (this.warningCountdownInterval) {
      clearInterval(this.warningCountdownInterval);
      this.warningCountdownInterval = null;
    }
  }

  clearInactivityTimers() {
    if (this.inactivityWarningTimer) {
      clearTimeout(this.inactivityWarningTimer);
      this.inactivityWarningTimer = null;
    }
    if (this.inactivityTimeoutTimer) {
      clearTimeout(this.inactivityTimeoutTimer);
      this.inactivityTimeoutTimer = null;
    }
    if (this.warningCountdownInterval) {
      clearInterval(this.warningCountdownInterval);
      this.warningCountdownInterval = null;
    }
    this.hideInactivityWarning();
  }

  resetInactivityTimer() {
    this.recordUserActivity();
  }

  handleSessionTimeout() {
    this.hideInactivityWarning();
    this.sessionAuthToken++;
    
    // Clear all transient transaction and security state
    this.pinBuffer = '';
    this.withdrawInput = '';
    this.depositCounts = { 500: 0, 200: 0, 100: 0, 50: 0 };
    if (typeof clearTemporaryCvv === 'function') {
      clearTemporaryCvv('session timeout');
    }
    this.stopFaceCamera();
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));

    // Eject card and show accessible alert
    this.ejectCard('ATM session timed out due to 60 seconds of inactivity.');
    announceA11y('ATM session timed out due to inactivity. Card safely ejected.', 'assertive');
  }

  switchScreen(screenId, speechPrompt = '') {
    this.currentScreen = screenId;

    // Hide all screens & activate target
    document.querySelectorAll('.atm-screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');

    // Update screen header badge
    const sessionBadge = document.getElementById('sessionBadge');
    const screenHeaderTitle = document.getElementById('screenHeaderTitle');

    if (this.isAuthenticated) {
      sessionBadge.className = 'session-badge active';
      sessionBadge.textContent = 'SESSION ACTIVE';
      screenHeaderTitle.innerHTML = '<img src="assets/nexus-icon-dark.png" class="screen-header-logo-icon" alt=""> <span>NEXUS AUTHENTICATED TERMINAL</span>';
    } else {
      sessionBadge.className = 'session-badge idle';
      sessionBadge.textContent = 'READY';
      screenHeaderTitle.innerHTML = '<img src="assets/nexus-icon-dark.png" class="screen-header-logo-icon" alt=""> <span>NEXUS SECURE TERMINAL</span>';
    }

    // Voice guidance
    if (speechPrompt) {
      audio.speak(speechPrompt);
    }

    // Clear eject countdown timer if moving to another screen
    if (this.ejectScreenTimeout && screenId !== 'screenCardEjected') {
      clearTimeout(this.ejectScreenTimeout);
      this.ejectScreenTimeout = null;
    }

    // Reset inactivity tracking on screen change
    this.resetInactivityTimer();
  }

  insertCard(cardId = null) {
    if (cardId) state.data.activeCardId = cardId;
    const card = state.getActiveCard();

    // Check authoritative freeze state
    if (card.frozen) {
      audio.playErrorTone();
      showToast('Transaction declined. This card is frozen. Unfreeze it in the dashboard to use.', 'error');
      announceA11y('Transaction declined: This card is frozen. Unfreeze it in dashboard to use.', 'assertive');
      return;
    }

    this.sessionCardId = card.id;
    this.sessionAuthToken++;
    this.isCardInserted = true;
    this.isAuthenticated = false;
    this.pinBuffer = '';
    this.pinRetriesLeft = 3;
    this.lastActivityTime = Date.now();
    this.scheduleInactivityTimers();

    // Play sound & slot animations
    audio.playCardInsertSound();

    const graphic = document.getElementById('cardInSlotGraphic');
    if (graphic) graphic.classList.add('inserted');

    const led = document.getElementById('cardLed');
    if (led) led.classList.add('active');

    const statusText = document.getElementById('cardStatusText');
    if (statusText) statusText.textContent = `CARD INSERTED (${card.holder})`;

    // Update PIN screen labels
    document.getElementById('pinCardholderName').textContent = card.holder;
    
    // Only show demo PIN hint for Sarah's demo account; hide for all other accounts
    const pinHintBox = document.getElementById('pinDemoHintBox');
    const isSarahDemo = (card.holder && card.holder.toUpperCase().includes('SARAH')) || card.id === 'card-2';
    if (pinHintBox) {
      if (isSarahDemo) {
        pinHintBox.style.display = 'inline-flex';
        const pinEl = document.getElementById('demoPinHint');
        if (pinEl) pinEl.textContent = card.pin;
      } else {
        pinHintBox.style.display = 'none';
      }
    }
    
    this.renderPinDots();

    this.switchScreen('screenPin', 'Please enter your four digit security PIN.');
    showToast(`Card inserted: ${card.holder} (•••• ${card.number.slice(-4)})`, 'success');
  }

  ejectCard(customReason = '') {
    if (!this.isCardInserted && !this.isAuthenticated && this.currentScreen === 'screenWelcome') {
      return;
    }

    const hadCard = this.isCardInserted;
    this.isCardInserted = false;
    this.isAuthenticated = false;
    this.sessionCardId = null;
    this.sessionAuthToken++;
    this.pinBuffer = '';
    this.withdrawInput = '';

    // Teardown inactivity timers and warning modal
    this.clearInactivityTimers();
    this.stopFaceCamera();
    if (typeof clearTemporaryCvv === 'function') {
      clearTemporaryCvv('session ended');
    }

    audio.playCardInsertSound();

    const graphic = document.getElementById('cardInSlotGraphic');
    if (graphic) graphic.classList.remove('inserted');

    const led = document.getElementById('cardLed');
    if (led) led.classList.remove('active');

    const statusText = document.getElementById('cardStatusText');
    if (statusText) statusText.textContent = 'NO CARD INSERTED';

    if (hadCard) {
      this.switchScreen('screenCardEjected', 'Please take your card, cash, and receipt.');
      if (customReason) showToast(customReason, 'error');
      else showToast('Card safely ejected. Session ended.', 'success');

      // Automatically return to welcome screen after 5 seconds if left unattended
      if (this.ejectScreenTimeout) clearTimeout(this.ejectScreenTimeout);
      this.ejectScreenTimeout = setTimeout(() => {
        if (this.currentScreen === 'screenCardEjected') {
          this.switchScreen('screenWelcome');
        }
      }, 5000);
    } else {
      this.switchScreen('screenWelcome', 'Session ended securely. Thank you for banking with Nexus.');
      if (customReason) showToast(customReason, 'error');
      else showToast('Session ended securely.', 'success');
    }
  }

  // ==========================================
  // BIOMETRIC FACE LOGIN & OPTICAL SCAN ENGINE
  // ==========================================
  startFaceLogin() {
    const card = state.getActiveCard();
    if (card.frozen) {
      audio.playErrorTone();
      showToast('Biometric login unavailable: Card is currently frozen. Unfreeze in dashboard to use.', 'error');
      announceA11y('Biometric login unavailable: Card is frozen.');
      return;
    }

    const currentToken = ++this.sessionAuthToken;
    this.sessionCardId = card.id;

    this.switchScreen('screenFaceAuth', 'Initializing biometric face scanner demonstration. Please look directly into the camera.');
    audio.playBiometricScanSound();

    const videoEl = document.getElementById('atmFaceAuthVideo');
    const statusMsg = document.getElementById('faceAuthStatusMsg');
    const fillBar = document.getElementById('faceAuthProgressFill');
    const stepLabel = document.getElementById('faceAuthStepLabel');
    const percentLabel = document.getElementById('faceAuthPercentLabel');
    const successCard = document.getElementById('faceMatchSuccessCard');
    const sensorBadge = document.getElementById('faceAuthSensorBadge');

    if (successCard) successCard.style.display = 'none';
    if (fillBar) fillBar.style.width = '0%';
    if (percentLabel) percentLabel.textContent = '0%';
    if (stepLabel) stepLabel.textContent = 'Accessing Camera Sensor...';
    if (statusMsg) statusMsg.innerHTML = '<i class="fa-solid fa-expand"></i> POSITION FACE WITHIN TARGET';

    // Clean up any other camera streams holding the webcam device
    if (this.cctvStream) {
      this.cctvStream.getTracks().forEach(t => t.stop());
      this.cctvStream = null;
    }
    if (typeof profileController !== 'undefined' && profileController.officerBioStream) {
      profileController.stopOfficerBiometricScan();
    }

    // Start video stream if available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 } } })
        .then(stream => {
          if (this.sessionAuthToken !== currentToken) {
            stream.getTracks().forEach(t => t.stop());
            return;
          }
          this.atmFaceStream = stream;
          if (videoEl) {
            videoEl.setAttribute('playsinline', '');
            videoEl.setAttribute('autoplay', '');
            videoEl.muted = true;
            videoEl.srcObject = stream;
            videoEl.play().catch(e => console.warn('ATM face video play:', e));
          }
          if (sensorBadge) {
            sensorBadge.className = 'sensor-badge live';
            sensorBadge.innerHTML = '<i class="fa-solid fa-circle" style="color:var(--accent-green)"></i> WEBCAM SENSOR LIVE';
          }
          this.runFaceScanSequence(currentToken);
        })
        .catch(err => {
          console.warn('Webcam permission not granted or device busy, falling back to simulated optical mesh:', err);
          if (sensorBadge) {
            sensorBadge.className = 'sensor-badge live';
            sensorBadge.innerHTML = '<i class="fa-solid fa-circle-nodes" style="color:var(--accent-cyan)"></i> AI SENSOR ACTIVE';
          }
          showToast('Webcam in use or blocked. Running simulated optical AI mesh.', 'info');
          this.runFaceScanSequence(currentToken);
        });
    } else {
      if (sensorBadge) {
        sensorBadge.className = 'sensor-badge live';
        sensorBadge.innerHTML = '<i class="fa-solid fa-circle-nodes" style="color:var(--accent-cyan)"></i> AI SENSOR ACTIVE';
      }
      this.runFaceScanSequence(currentToken);
    }
  }

  runFaceScanSequence(currentToken = null) {
    if (this.faceScanInterval) clearInterval(this.faceScanInterval);

    const token = currentToken || this.sessionAuthToken;
    const fillBar = document.getElementById('faceAuthProgressFill');
    const stepLabel = document.getElementById('faceAuthStepLabel');
    const percentLabel = document.getElementById('faceAuthPercentLabel');
    const statusMsg = document.getElementById('faceAuthStatusMsg');
    const successCard = document.getElementById('faceMatchSuccessCard');

    let progress = 0;
    const interval = setInterval(() => {
      // Abort if session cancelled or changed
      if (this.sessionAuthToken !== token || this.currentScreen !== 'screenFaceAuth') {
        clearInterval(interval);
        return;
      }

      progress += Math.floor(12 + Math.random() * 14);
      if (progress > 100) progress = 100;

      if (fillBar) fillBar.style.width = `${progress}%`;
      if (percentLabel) percentLabel.textContent = `${progress}%`;

      if (progress < 30) {
        if (stepLabel) stepLabel.textContent = 'Simulating facial landmark detection...';
        if (statusMsg) statusMsg.innerHTML = '<i class="fa-solid fa-arrows-to-circle"></i> DETECTING 68 SIMULATED POINTS';
      } else if (progress < 70) {
        if (stepLabel) stepLabel.textContent = 'Comparing demo facial profile pattern...';
        if (statusMsg) statusMsg.innerHTML = '<i class="fa-solid fa-fingerprint"></i> MATCHING DEMO KYC PROFILE';
      } else if (progress < 100) {
        if (stepLabel) stepLabel.textContent = 'Creating transient session token...';
        if (statusMsg) statusMsg.innerHTML = '<i class="fa-solid fa-shield-halved"></i> DEMO CREDENTIAL ISSUED';
      } else {
        clearInterval(interval);
        this.faceScanInterval = null;

        const cardId = this.sessionCardId || state.data.activeCardId;
        const card = state.data.cards.find(c => c.id === cardId) || state.getActiveCard();

        // Validate card freeze before committing authentication
        if (card.frozen) {
          this.cancelFaceLogin();
          showToast('Authentication declined: Card is frozen.', 'error');
          announceA11y('Authentication declined: Card is frozen.');
          return;
        }

        if (successCard) {
          const nameEl = document.getElementById('matchCardholderName');
          const tierEl = document.getElementById('matchTierLabel');
          if (nameEl) nameEl.textContent = card.holder;
          if (tierEl) tierEl.textContent = `${card.tierLabel} • •••• ${card.number.slice(-4)}`;
          successCard.style.display = 'block';
        }

        audio.playBiometricSuccessSound();
        showToast(`Face-ID Verified (Simulated): Welcome back, ${card.holder}!`, 'success');

        if (this.faceAuthTimeout) clearTimeout(this.faceAuthTimeout);
        this.faceAuthTimeout = setTimeout(() => {
          if (this.sessionAuthToken !== token || this.currentScreen !== 'screenFaceAuth') return;
          if (card.frozen) {
            this.cancelFaceLogin();
            showToast('Authentication declined: Card is frozen.', 'error');
            return;
          }

          this.stopFaceCamera();
          this.isAuthenticated = true;
          this.isCardInserted = true;
          this.lastActivityTime = Date.now();
          this.scheduleInactivityTimers();

          const graphic = document.getElementById('cardInSlotGraphic');
          if (graphic) graphic.classList.add('inserted');
          const led = document.getElementById('cardLed');
          if (led) led.classList.add('active');
          const statusText = document.getElementById('cardStatusText');
          if (statusText) statusText.textContent = `FACE-ID LOGGED IN (${card.holder})`;

          document.getElementById('menuUserName').textContent = `${card.holder} (Face-ID)`;
          document.getElementById('menuCardType').textContent = `${card.tierLabel} • Biometric Demo`;

          this.switchScreen('screenMainMenu', `Biometric identity verified. Welcome ${card.holder}.`);
          announceA11y(`Biometric identity verified. Welcome ${card.holder}.`);
        }, 1300);
      }
    }, 180);

    this.faceScanInterval = interval;
  }

  stopFaceCamera() {
    if (this.faceScanInterval) {
      clearInterval(this.faceScanInterval);
      this.faceScanInterval = null;
    }
    if (this.faceAuthTimeout) {
      clearTimeout(this.faceAuthTimeout);
      this.faceAuthTimeout = null;
    }
    if (this.atmFaceStream) {
      this.atmFaceStream.getTracks().forEach(t => t.stop());
      this.atmFaceStream = null;
    }
    const videoEl = document.getElementById('atmFaceAuthVideo');
    if (videoEl) videoEl.srcObject = null;
  }

  cancelFaceLogin() {
    this.sessionAuthToken++;
    this.stopFaceCamera();
    this.switchScreen('screenWelcome', 'Biometric login cancelled. Please insert card or select an option.');
  }

  toggleCctvMonitor(forceState = null) {
    const widget = document.getElementById('cctvMonitorWidget');
    if (!widget) return;

    const isCurrentlyOpen = widget.style.display !== 'none';
    const shouldOpen = forceState !== null ? forceState : !isCurrentlyOpen;

    if (shouldOpen) {
      widget.style.display = 'block';
      audio.playKeypadBeep(1800);
      showToast('CCTV Live Surveillance Stream Active', 'success');

      // Update timecode
      const tc = document.getElementById('cctvTimecode');
      if (tc) tc.textContent = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

      const video = document.getElementById('cctvVideoFeed');
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            this.cctvStream = stream;
            if (video) {
              video.srcObject = stream;
              video.play().catch(() => {});
            }
          })
          .catch(() => {});
      }
    } else {
      widget.style.display = 'none';
      if (this.cctvStream) {
        this.cctvStream.getTracks().forEach(t => t.stop());
        this.cctvStream = null;
      }
      const video = document.getElementById('cctvVideoFeed');
      if (video) video.srcObject = null;
    }
  }

  // Keypad & PIN Processing
  handleKeypadPress(key) {
    audio.playKeypadBeep(key === 'ENTER' ? 1400 : 1000);

    // Visual button press animation on hardware keypad
    const keyEl = document.querySelector(`.key-btn[data-key="${key}"]`);
    if (keyEl) {
      keyEl.classList.add('pressed');
      setTimeout(() => keyEl.classList.remove('pressed'), 120);
    }

    if (this.currentScreen === 'screenPin') {
      if (key >= '0' && key <= '9') {
        if (this.pinBuffer.length < 4) {
          this.pinBuffer += key;
          this.renderPinDots();
        }
      } else if (key === 'CLEAR') {
        this.pinBuffer = '';
        this.renderPinDots();
      } else if (key === 'CANCEL') {
        this.ejectCard('PIN entry cancelled by user.');
      } else if (key === 'ENTER') {
        this.submitPin();
      }
    } else if (this.currentScreen === 'screenMainMenu') {
      if (key === 'CANCEL') {
        this.ejectCard('Session ended by customer.');
      }
    } else if (this.currentScreen === 'screenWithdraw') {
      if (key >= '0' && key <= '9') {
        if (this.withdrawInput.length < 5) {
          this.withdrawInput += key;
          this.updateWithdrawInput();
        }
      } else if (key === '00') {
        if (this.withdrawInput.length > 0 && this.withdrawInput.length <= 3) {
          this.withdrawInput += '00';
          this.updateWithdrawInput();
        }
      } else if (key === 'CLEAR') {
        this.withdrawInput = '';
        this.updateWithdrawInput();
      } else if (key === 'CANCEL') {
        this.switchScreen('screenMainMenu');
      } else if (key === 'ENTER') {
        this.confirmCustomWithdrawal();
      }
    } else if (this.currentScreen === 'screenBalance' || this.currentScreen === 'screenFastCash' || this.currentScreen === 'screenDeposit' || this.currentScreen === 'screenTransfer' || this.currentScreen === 'screenPinChange' || this.currentScreen === 'screenStatement') {
      if (key === 'CANCEL') {
        this.switchScreen('screenMainMenu');
      }
    } else if (this.currentScreen === 'screenCardEjected') {
      if (key === 'ENTER' || key === 'CANCEL' || key === 'CLEAR') {
        this.switchScreen('screenWelcome');
      }
    } else if (this.currentScreen === 'screenWelcome') {
      if (key === 'ENTER') {
        this.insertCard();
      }
    }
  }

  renderPinDots() {
    const dots = document.querySelectorAll('#pinDotsContainer .pin-dot');
    dots.forEach((dot, idx) => {
      if (idx < this.pinBuffer.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }

  submitPin() {
    if (this.pinBuffer.length !== 4) {
      audio.playErrorTone();
      showToast('Please enter all 4 digits of your PIN.', 'error');
      return;
    }

    const cardId = this.sessionCardId || state.data.activeCardId;
    const card = state.data.cards.find(c => c.id === cardId) || state.getActiveCard();

    // Check card freeze status
    if (card.frozen) {
      audio.playErrorTone();
      this.ejectCard('Transaction declined. This card is frozen. Unfreeze to continue.');
      announceA11y('Transaction declined: This card is frozen.', 'assertive');
      return;
    }

    if (this.pinBuffer === card.pin) {
      // Success
      audio.playEnterTone();
      this.sessionCardId = card.id;
      this.isAuthenticated = true;
      this.pinBuffer = '';
      this.lastActivityTime = Date.now();
      this.scheduleInactivityTimers();

      // Populate Main Menu
      document.getElementById('menuUserName').textContent = card.holder;
      document.getElementById('menuCardType').textContent = `${card.tierLabel} • •••• ${card.number.slice(-4)}`;

      this.switchScreen('screenMainMenu', `Welcome ${card.holder}. Please select a transaction.`);
      showToast('PIN verified successfully!', 'success');
      announceA11y(`Welcome ${card.holder}. PIN verified successfully.`);
    } else {
      // Failed PIN attempt
      audio.playErrorTone();
      this.pinRetriesLeft--;
      this.pinBuffer = '';
      this.renderPinDots();

      const dotsContainer = document.getElementById('pinDotsContainer');
      if (dotsContainer) {
        dotsContainer.style.borderColor = 'var(--accent-red)';
        setTimeout(() => dotsContainer.style.borderColor = '', 800);
      }

      if (this.pinRetriesLeft <= 0) {
        card.frozen = true;
        state.saveState();
        updateDashboardUI();
        announceA11y('Card locked due to 3 incorrect PIN attempts.', 'assertive');
        this.ejectCard('Card locked due to 3 incorrect PIN attempts for security.');
      } else {
        showToast(`Incorrect PIN! ${this.pinRetriesLeft} attempts remaining.`, 'error');
        announceA11y(`Incorrect PIN. ${this.pinRetriesLeft} attempts remaining.`);
      }
    }
  }

  // Side Function Keys (F1 - F8) router
  handleSideKey(keyName) {
    this.recordUserActivity();
    audio.playKeypadBeep(1200);

    const keyBtn = document.querySelector(`.side-key[data-key="${keyName}"]`);
    if (keyBtn) {
      keyBtn.classList.add('pressed');
      setTimeout(() => keyBtn.classList.remove('pressed'), 120);
    }

    switch (this.currentScreen) {
      case 'screenWelcome':
        if (keyName === 'F1') this.insertCard();
        if (keyName === 'F2') this.startFaceLogin();
        if (keyName === 'F3') this.openCardlessScreen();
        if (keyName === 'F4') openNewAccountModal();
        break;

      case 'screenFaceAuth':
        if (keyName === 'F4' || keyName === 'F8') this.cancelFaceLogin();
        break;

      case 'screenMainMenu':
        if (!this.isAuthenticated) {
          this.ejectCard('Authentication required.');
          break;
        }
        if (keyName === 'F1') this.openBalanceScreen();
        if (keyName === 'F2') this.openFastCashScreen();
        if (keyName === 'F3') this.openWithdrawScreen();
        if (keyName === 'F4') this.openDepositScreen();
        if (keyName === 'F5') this.openTransferScreen();
        if (keyName === 'F6') this.openStatementScreen();
        if (keyName === 'F7') this.openPinChangeScreen();
        if (keyName === 'F8') this.ejectCard();
        break;

      case 'screenBalance':
        if (keyName === 'F3') this.printBalanceSlip();
        if (keyName === 'F7') this.openWithdrawScreen();
        if (keyName === 'F8') this.switchScreen('screenMainMenu');
        break;

      case 'screenFastCash':
        if (keyName === 'F1') this.executeFastCash(500);
        if (keyName === 'F5') this.executeFastCash(1000);
        if (keyName === 'F2') this.executeFastCash(2000);
        if (keyName === 'F6') this.executeFastCash(5000);
        if (keyName === 'F3') this.executeFastCash(10000);
        if (keyName === 'F7') this.executeFastCash(20000);
        if (keyName === 'F4') this.openWithdrawScreen();
        if (keyName === 'F8') this.switchScreen('screenMainMenu');
        break;

      case 'screenWithdraw':
        if (keyName === 'F4') this.switchScreen('screenMainMenu');
        if (keyName === 'F8') this.confirmCustomWithdrawal();
        break;

      case 'screenDeposit':
        if (keyName === 'F4') this.switchScreen('screenMainMenu');
        if (keyName === 'F8') this.confirmDeposit();
        break;

      case 'screenTransfer':
        if (keyName === 'F4') this.switchScreen('screenMainMenu');
        if (keyName === 'F8') this.confirmTransfer();
        break;

      case 'screenPinChange':
        if (keyName === 'F4') this.switchScreen('screenMainMenu');
        if (keyName === 'F8') this.confirmPinChange();
        break;

      case 'screenStatement':
        if (keyName === 'F3') this.printMiniStatementSlip();
        if (keyName === 'F8') this.switchScreen('screenMainMenu');
        break;

      case 'screenSuccess':
        if (keyName === 'F3') this.printLastTransactionReceipt();
        if (keyName === 'F4') this.switchScreen('screenMainMenu');
        if (keyName === 'F8') this.ejectCard();
        break;

      case 'screenCardless':
        if (keyName === 'F4') this.switchScreen('screenWelcome');
        if (keyName === 'F8') this.authorizeCardlessOtp();
        break;

      case 'screenCardEjected':
        if (keyName === 'F4' || keyName === 'F8') this.switchScreen('screenWelcome');
        break;

      default:
        break;
    }
  }

  // Screens Operations
  openBalanceScreen() {
    const auth = this.authorizeCardTransaction('inquiry');
    if (!auth.authorized) {
      audio.playErrorTone();
      showToast(auth.reason, 'error');
      announceA11y(auth.reason, 'assertive');
      return;
    }
    document.getElementById('screenCheckingAvail').textContent = state.formatMoney(state.data.accounts.checking.balance);
    document.getElementById('screenCheckingLedger').textContent = state.formatMoney(state.data.accounts.checking.balance);
    document.getElementById('screenSavingsAvail').textContent = state.formatMoney(state.data.accounts.savings.balance);
    this.switchScreen('screenBalance', 'Your available balances are displayed on screen.');
  }

  openFastCashScreen() {
    const auth = this.authorizeCardTransaction('inquiry');
    if (!auth.authorized) {
      audio.playErrorTone();
      showToast(auth.reason, 'error');
      announceA11y(auth.reason, 'assertive');
      return;
    }
    this.switchScreen('screenFastCash', 'Select a quick cash amount to dispense.');
  }

  openWithdrawScreen() {
    const auth = this.authorizeCardTransaction('inquiry');
    if (!auth.authorized) {
      audio.playErrorTone();
      showToast(auth.reason, 'error');
      announceA11y(auth.reason, 'assertive');
      return;
    }
    this.withdrawInput = '';
    this.updateWithdrawInput();
    document.getElementById('withdrawCheckBal').textContent = state.data.accounts.checking.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    document.getElementById('withdrawSaveBal').textContent = state.data.accounts.savings.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    const remaining = Math.max(0, state.data.dailyLimit - state.data.withdrawnToday);
    document.getElementById('dailyLimitRemaining').textContent = state.formatMoney(remaining);
    this.switchScreen('screenWithdraw', 'Enter desired withdrawal amount in multiples of one hundred.');
  }

  openDepositScreen() {
    const auth = this.authorizeCardTransaction('inquiry');
    if (!auth.authorized) {
      audio.playErrorTone();
      showToast(auth.reason, 'error');
      announceA11y(auth.reason, 'assertive');
      return;
    }
    this.depositCounts = { 500: 0, 200: 0, 100: 0, 50: 0 };
    this.updateDepositCounterDisplay();
    this.switchScreen('screenDeposit', 'Insert cash notes or enter cheque details.');
  }

  openTransferScreen() {
    const auth = this.authorizeCardTransaction('inquiry');
    if (!auth.authorized) {
      audio.playErrorTone();
      showToast(auth.reason, 'error');
      announceA11y(auth.reason, 'assertive');
      return;
    }
    document.getElementById('transferAmountInput').value = '';
    this.switchScreen('screenTransfer', 'Enter recipient details and transfer amount.');
  }

  openPinChangeScreen() {
    const auth = this.authorizeCardTransaction('inquiry');
    if (!auth.authorized) {
      audio.playErrorTone();
      showToast(auth.reason, 'error');
      announceA11y(auth.reason, 'assertive');
      return;
    }
    document.getElementById('currentPinInput').value = '';
    document.getElementById('newPinInput').value = '';
    document.getElementById('confirmNewPinInput').value = '';
    this.switchScreen('screenPinChange', 'Set a new four digit passcode.');
  }

  openStatementScreen() {
    const auth = this.authorizeCardTransaction('inquiry');
    if (!auth.authorized) {
      audio.playErrorTone();
      showToast(auth.reason, 'error');
      announceA11y(auth.reason, 'assertive');
      return;
    }
    const card = auth.card;
    document.getElementById('statementCardBadge').textContent = `Card •••• ${card.number.slice(-4)}`;
    
    const tbody = document.getElementById('screenStatementBody');
    tbody.innerHTML = '';

    state.data.transactions.slice(0, 5).forEach(tx => {
      const tr = document.createElement('tr');
      const isCredit = tx.type === 'deposit';
      tr.innerHTML = `
        <td>${tx.timestamp.split(' ')[0]}</td>
        <td>${tx.typeLabel}</td>
        <td><span class="account-type-badge">${tx.type.toUpperCase()}</span></td>
        <td class="text-right ${isCredit ? 'text-success' : 'text-danger'}">
          ${isCredit ? '+' : '-'}${state.formatMoney(tx.amount)}
        </td>
      `;
      tbody.appendChild(tr);
    });

    this.switchScreen('screenStatement', 'Here is your recent account activity.');
  }

  // ==========================================
  // CARDLESS CASH & CBDC (DIGITAL RUPEE) ENGINE
  // ==========================================
  openCardlessScreen() {
    this.cardlessQrAmount = 500;
    document.getElementById('cardlessOtpInput').value = '884019';
    this.updateCardlessQrDisplay();
    this.startCardlessQrTimer();
    this.switchScreen('screenCardless', 'Scan dynamic QR code with your UPI or e-Rupee app, or enter OTP.');
  }

  setCardlessQrAmount(amount) {
    this.cardlessQrAmount = amount;
    this.updateCardlessQrDisplay();
    audio.playKeypadBeep(1300);
  }

  updateCardlessQrDisplay() {
    const amt = this.cardlessQrAmount || 500;
    const token = `e₹${amt}`;
    const tokenEl = document.getElementById('qrCenterToken');
    const dispEl = document.getElementById('qrDispenseAmountDisplay');
    const payloadEl = document.getElementById('qrPayloadRef');
    
    if (tokenEl) tokenEl.textContent = token;
    if (dispEl) dispEl.textContent = `₹${amt.toLocaleString('en-IN')}.00`;
    if (payloadEl) payloadEl.textContent = `upi://pay?pa=nexus.atm@rbi&am=${amt}&token=${Math.floor(100000 + Math.random() * 900000)}`;

    document.querySelectorAll('.qr-chip').forEach(c => {
      const chipAmt = parseInt(c.getAttribute('data-qramt'));
      c.classList.toggle('active', chipAmt === amt);
    });
  }

  startCardlessQrTimer() {
    if (this.qrTimerInterval) clearInterval(this.qrTimerInterval);
    let seconds = 60;
    const expEl = document.getElementById('qrExpireSec');
    if (expEl) expEl.textContent = seconds;

    this.qrTimerInterval = setInterval(() => {
      seconds--;
      if (expEl) expEl.textContent = seconds;
      if (seconds <= 0) {
        seconds = 60;
        this.updateCardlessQrDisplay();
      }
    }, 1000);
  }

  simulateAppPay(appName = 'Nexus e-Rupee') {
    audio.playEnterTone();
    const amount = this.cardlessQrAmount || 500;
    const card = state.getActiveCard();
    const account = state.getAccount('checking');

    if (amount > account.balance) {
      audio.playErrorTone();
      showToast(`Payment failed on ${appName}: Insufficient funds!`, 'error');
      return;
    }

    if (this.qrTimerInterval) clearInterval(this.qrTimerInterval);

    showToast(`Payment of ₹${amount.toLocaleString('en-IN')} approved via ${appName}!`, 'success');
    audio.speak(`Payment verified via ${appName}. Dispensing ${amount} rupees cash now.`);

    // Authenticate and process cash withdrawal
    this.isAuthenticated = true;
    this.processWithdrawal(amount, 'checking', 'mixed');
  }

  authorizeCardlessScan() {
    this.simulateAppPay('Nexus Mobile Banking');
  }

  authorizeCardlessOtp() {
    const otp = document.getElementById('cardlessOtpInput').value.trim();
    if (otp.length !== 6 || isNaN(otp)) {
      audio.playErrorTone();
      showToast('Please enter a valid 6-digit OTP code.', 'error');
      return;
    }
    audio.playEnterTone();
    const card = state.getActiveCard();
    this.isAuthenticated = true;
    document.getElementById('menuUserName').textContent = `${card.holder} (OTP)`;
    document.getElementById('menuCardType').textContent = `One-Time Passcode • ${card.tierLabel}`;
    this.switchScreen('screenMainMenu', `OTP authorized. Welcome ${card.holder}.`);
    showToast('6-digit OTP verified successfully!', 'success');
  }

  // ==========================================
  // SMART CHEQUE OCR / MICR SCANNER SIMULATION
  // ==========================================
  simulateChequeOcr() {
    const preview = document.getElementById('chequeScannerPreview');
    if (preview) preview.classList.add('scanning');

    audio.playBiometricScanSound();
    showToast('Optical Scanner reading MICR band and handwriting...', 'info');

    setTimeout(() => {
      if (preview) preview.classList.remove('scanning');
      audio.playEnterTone();

      // Populate form fields automatically
      document.getElementById('chequeNumberInput').value = '408219';
      document.getElementById('chequeBankInput').value = 'HDFC Bank Ltd';
      document.getElementById('chequeAmountInput').value = '15000';

      showToast('Cheque #408219 for ₹15,000.00 scanned and decoded via OCR!', 'success');
      audio.speak('Cheque scanned successfully. Amount: fifteen thousand rupees. Select target account and confirm deposit.');
    }, 1500);
  }

  // Withdraw Logic
  executeFastCash(amount) {
    this.recordUserActivity();
    const cardId = this.sessionCardId || state.data.activeCardId;
    const card = state.data.cards.find(c => c.id === cardId) || state.getActiveCard();
    const accountKey = card.linkedAccount || 'checking';

    const auth = this.authorizeCardTransaction('fastcash', amount, accountKey);
    if (!auth.authorized) {
      audio.playErrorTone();
      showToast(auth.reason, 'error');
      announceA11y(auth.reason, 'assertive');
      return;
    }

    this.processWithdrawal(amount, accountKey, 'mixed');
  }

  updateWithdrawInput() {
    const input = document.getElementById('withdrawAmountInput');
    input.value = this.withdrawInput || '0';
    document.getElementById('withdrawErrorMsg').textContent = '';
  }

  confirmCustomWithdrawal() {
    this.recordUserActivity();
    const amount = parseFloat(this.withdrawInput);
    if (!amount || amount <= 0) {
      audio.playErrorTone();
      document.getElementById('withdrawErrorMsg').textContent = 'Please enter a valid amount.';
      return;
    }

    if (amount % 10 !== 0) {
      audio.playErrorTone();
      document.getElementById('withdrawErrorMsg').textContent = 'Amount must be in multiples of ₹50, ₹100, ₹200, or ₹500.';
      return;
    }

    const auth = this.authorizeCardTransaction('withdrawal', amount, this.selectedWithdrawAccount);
    if (!auth.authorized) {
      audio.playErrorTone();
      document.getElementById('withdrawErrorMsg').textContent = auth.reason;
      showToast(auth.reason, 'error');
      announceA11y(auth.reason, 'assertive');
      return;
    }

    const denomPref = document.querySelector('input[name="denomPref"]:checked')?.value || 'mixed';
    this.processWithdrawal(amount, this.selectedWithdrawAccount, denomPref);
  }

  processWithdrawal(amount, accountKey, denomPref) {
    this.recordUserActivity();

    // 1. Centralized Authorization Precondition Check (Validates freeze, session, limits, balance)
    const auth = this.authorizeCardTransaction('withdrawal', amount, accountKey);
    if (!auth.authorized) {
      audio.playErrorTone();
      showToast(auth.reason, 'error');
      announceA11y(auth.reason, 'assertive');
      return;
    }

    const account = auth.account;
    const card = auth.card;

    // 2. Validate physical banknote cassette capacity before any state changes
    if (!state.data.cassettes) state.data.cassettes = { 500: 1840, 200: 1450, 100: 1920, 50: 980 };
    const totalCassetteCash = (state.data.cassettes[500] * 500) + (state.data.cassettes[200] * 200) + (state.data.cassettes[100] * 100) + (state.data.cassettes[50] * 50);
    if (amount > totalCassetteCash) {
      audio.playErrorTone();
      showToast('Transaction declined: ATM cash inventory insufficient. Please try a smaller amount.', 'error');
      announceA11y('Transaction declined: Insufficient ATM cash inventory.', 'assertive');
      return;
    }

    // 3. Calculate note breakdown
    let notesText = '';
    let n500 = 0, n200 = 0, n100 = 0, n50 = 0;

    if (denomPref === 'large') {
      n500 = Math.floor(amount / 500);
      const rem = amount % 500;
      n100 = Math.floor(rem / 100);
      notesText = `${n500}x ₹500 Note${n500 > 1 ? 's' : ''}` + (rem ? ` + ${n100}x ₹100s` : '');
    } else if (denomPref === 'small') {
      n100 = Math.floor(amount / 100);
      notesText = `${n100}x ₹100 Note${n100 > 1 ? 's' : ''}`;
    } else {
      n500 = Math.floor(amount / 500);
      const rem1 = amount % 500;
      n200 = Math.floor(rem1 / 200);
      const rem2 = rem1 % 200;
      n100 = Math.floor(rem2 / 100);
      const rem3 = rem2 % 100;
      n50 = Math.floor(rem3 / 50);
      const parts = [];
      if (n500) parts.push(`${n500}x ₹500`);
      if (n200) parts.push(`${n200}x ₹200`);
      if (n100) parts.push(`${n100}x ₹100`);
      if (n50) parts.push(`${n50}x ₹50`);
      notesText = parts.join(', ') || `${Math.floor(amount / 50)}x ₹50`;
    }

    // 4. Atomic Commit: Mutate Financial State
    account.balance -= amount;
    state.data.withdrawnToday += amount;
    state.data.cassettes[500] = Math.max(0, state.data.cassettes[500] - n500);
    state.data.cassettes[200] = Math.max(0, state.data.cassettes[200] - n200);
    state.data.cassettes[100] = Math.max(0, state.data.cassettes[100] - n100);
    state.data.cassettes[50] = Math.max(0, state.data.cassettes[50] - n50);
    if (state.data.paperRoll > 0) state.data.paperRoll = Math.max(0, state.data.paperRoll - 1);

    const ref = `NX-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const tx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: 'withdrawal',
      typeLabel: 'ATM Cash Withdrawal',
      amount: amount,
      account: accountKey,
      cardUsed: `${card.number.slice(0, 4)} •••• •••• ${card.number.slice(-4)}`,
      timestamp: timestamp,
      ref: ref
    };

    state.addTransaction(tx);
    updateDashboardUI();
    updateDiagnosticsUI();

    // Prepare Dispensing Screen Animation
    document.getElementById('dispensedAmountText').textContent = state.formatMoney(amount);
    document.getElementById('dispensedNotesText').textContent = notesText;
    
    this.switchScreen('screenDispensing', 'Counting and dispensing your currency now.');
    audio.playCashMotorSound();

    const fill = document.getElementById('dispensingProgressFill');
    fill.style.width = '0%';
    setTimeout(() => fill.style.width = '100%', 50);

    // Dispense animated physical stack
    setTimeout(() => {
      const cashStack = document.getElementById('dispensedCashStack');
      if (cashStack) cashStack.classList.add('active');

      // Dispense paper receipt slip
      this.lastReceiptData = {
        type: 'CASH WITHDRAWAL',
        amount: state.formatMoney(amount),
        availBal: state.formatMoney(account.balance),
        ledgerBal: state.formatMoney(account.balance),
        cardMasked: `${card.number.slice(0, 4)} •••• •••• ${card.number.slice(-4)}`,
        cardholder: card.holder,
        accountType: account.name.toUpperCase(),
        ref: ref,
        timestamp: timestamp
      };
      this.triggerEjectedReceiptSnippet();

      // Switch to Success screen after cash is out
      document.getElementById('successMainTitle').textContent = 'CASH DISPENSED';
      document.getElementById('successSubtitle').textContent = 'Please collect your cash from the slot below.';
      document.getElementById('successRefCode').textContent = ref;
      document.getElementById('successNewBalance').textContent = state.formatMoney(account.balance);
      document.getElementById('successTimestamp').textContent = timestamp;

      this.switchScreen('screenSuccess');
      this.startSuccessCountdown();
    }, 2600);
  }

  // Deposit Logic
  updateDepositCounterDisplay() {
    let total = 0;
    Object.entries(this.depositCounts).forEach(([denom, count]) => {
      const sub = parseInt(denom) * count;
      total += sub;
      const countEl = document.getElementById(`count${denom}`);
      const subEl = document.getElementById(`sub${denom}`);
      if (countEl) countEl.textContent = count;
      if (subEl) subEl.textContent = `₹${sub.toLocaleString('en-IN')}`;
    });

    document.getElementById('depositTotalAmount').textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  }

  confirmDeposit() {
    this.recordUserActivity();
    const auth = this.authorizeCardTransaction('deposit');
    if (!auth.authorized) {
      audio.playErrorTone();
      showToast(auth.reason, 'error');
      announceA11y(auth.reason, 'assertive');
      return;
    }

    const targetAccountKey = document.getElementById('depositTargetAccount').value;
    const account = state.getAccount(targetAccountKey);
    const card = auth.card;
    let amount = 0;
    let typeLabel = '';

    if (this.selectedDepositType === 'cash') {
      amount = Object.entries(this.depositCounts).reduce((sum, [denom, count]) => sum + (parseInt(denom) * count), 0);
      typeLabel = 'ATM Cash Deposit';
      if (amount <= 0) {
        audio.playErrorTone();
        showToast('Please insert/count at least one currency note.', 'error');
        return;
      }
    } else {
      amount = parseFloat(document.getElementById('chequeAmountInput').value);
      const chequeNo = document.getElementById('chequeNumberInput').value;
      const bank = document.getElementById('chequeBankInput').value;

      if (!amount || amount <= 0 || !chequeNo) {
        audio.playErrorTone();
        showToast('Please enter valid cheque number and amount.', 'error');
        return;
      }
      typeLabel = `Cheque Deposit #${chequeNo} (${bank || 'Bank'})`;
    }

    // Atomic Commit: Update Financial State
    account.balance += amount;

    const ref = `NX-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const tx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: 'deposit',
      typeLabel: typeLabel,
      amount: amount,
      account: targetAccountKey,
      cardUsed: `${card.number.slice(0, 4)} •••• •••• ${card.number.slice(-4)}`,
      timestamp: timestamp,
      ref: ref
    };

    state.addTransaction(tx);
    updateDashboardUI();

    // Deposit Shutter Sound & LED
    audio.playCardInsertSound();
    const led = document.getElementById('depositLed');
    if (led) {
      led.style.background = 'var(--accent-green)';
      led.style.boxShadow = '0 0 10px var(--accent-green)';
      setTimeout(() => {
        led.style.background = '';
        led.style.boxShadow = '';
      }, 2000);
    }

    this.lastReceiptData = {
      type: 'FUNDS DEPOSIT',
      amount: state.formatMoney(amount),
      availBal: state.formatMoney(account.balance),
      ledgerBal: state.formatMoney(account.balance),
      cardMasked: `${card.number.slice(0, 4)} •••• •••• ${card.number.slice(-4)}`,
      cardholder: card.holder,
      accountType: account.name.toUpperCase(),
      ref: ref,
      timestamp: timestamp
    };
    this.triggerEjectedReceiptSnippet();

    document.getElementById('successMainTitle').textContent = 'DEPOSIT COMPLETED';
    document.getElementById('successSubtitle').textContent = `${state.formatMoney(amount)} has been credited to your ${account.name}.`;
    document.getElementById('successRefCode').textContent = ref;
    document.getElementById('successNewBalance').textContent = state.formatMoney(account.balance);
    document.getElementById('successTimestamp').textContent = timestamp;

    this.switchScreen('screenSuccess', 'Deposit successful. Your account has been credited.');
    this.startSuccessCountdown();
  }

  // Transfer Logic
  confirmTransfer() {
    this.recordUserActivity();
    const target = document.getElementById('transferTargetInput').value.trim();
    const amount = parseFloat(document.getElementById('transferAmountInput').value);
    const sourceKey = document.getElementById('transferSourceAccount').value;
    const memo = document.getElementById('transferNoteInput').value.trim();

    if (!target) {
      audio.playErrorTone();
      showToast('Please enter recipient account number or UPI ID.', 'error');
      return;
    }

    if (!amount || amount <= 0) {
      audio.playErrorTone();
      showToast('Please enter a valid transfer amount.', 'error');
      return;
    }

    const auth = this.authorizeCardTransaction('transfer', amount, sourceKey);
    if (!auth.authorized) {
      audio.playErrorTone();
      showToast(auth.reason, 'error');
      announceA11y(auth.reason, 'assertive');
      return;
    }

    const account = auth.account;
    const card = auth.card;

    // Atomic Commit: Update Financial State
    account.balance -= amount;

    const ref = `NX-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const tx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: 'transfer',
      typeLabel: `Transfer to ${target}${memo ? ' (' + memo + ')' : ''}`,
      amount: amount,
      account: sourceKey,
      cardUsed: `${card.number.slice(0, 4)} •••• •••• ${card.number.slice(-4)}`,
      timestamp: timestamp,
      ref: ref
    };

    state.addTransaction(tx);
    updateDashboardUI();

    audio.playEnterTone();

    this.lastReceiptData = {
      type: 'FUND TRANSFER',
      amount: state.formatMoney(amount),
      availBal: state.formatMoney(account.balance),
      ledgerBal: state.formatMoney(account.balance),
      cardMasked: `${card.number.slice(0, 4)} •••• •••• ${card.number.slice(-4)}`,
      cardholder: card.holder,
      accountType: account.name.toUpperCase(),
      ref: ref,
      timestamp: timestamp
    };
    this.triggerEjectedReceiptSnippet();

    document.getElementById('successMainTitle').textContent = 'TRANSFER SUCCESSFUL';
    document.getElementById('successSubtitle').textContent = `Transferred ${state.formatMoney(amount)} to ${target}.`;
    document.getElementById('successRefCode').textContent = ref;
    document.getElementById('successNewBalance').textContent = state.formatMoney(account.balance);
    document.getElementById('successTimestamp').textContent = timestamp;

    this.switchScreen('screenSuccess', 'Transfer completed successfully.');
    this.startSuccessCountdown();
  }

  // PIN Change Logic
  confirmPinChange() {
    this.recordUserActivity();
    const auth = this.authorizeCardTransaction('pinchange');
    if (!auth.authorized) {
      audio.playErrorTone();
      showToast(auth.reason, 'error');
      announceA11y(auth.reason, 'assertive');
      return;
    }

    const curPin = document.getElementById('currentPinInput').value;
    const newPin = document.getElementById('newPinInput').value;
    const confirmPin = document.getElementById('confirmNewPinInput').value;
    const card = auth.card;

    if (curPin !== card.pin) {
      audio.playErrorTone();
      showToast('Current PIN is incorrect.', 'error');
      return;
    }

    if (newPin.length !== 4 || isNaN(newPin)) {
      audio.playErrorTone();
      showToast('New PIN must be exactly 4 digits.', 'error');
      return;
    }

    if (newPin !== confirmPin) {
      audio.playErrorTone();
      showToast('New PIN and Confirm PIN do not match.', 'error');
      return;
    }

    card.pin = newPin;
    state.saveState();
    updateDashboardUI();

    audio.playEnterTone();

    const ref = `NX-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const tx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: 'pinchange',
      typeLabel: 'ATM PIN Change Update',
      amount: 0.00,
      account: card.linkedAccount || 'checking',
      cardUsed: `${card.number.slice(0, 4)} •••• •••• ${card.number.slice(-4)}`,
      timestamp: timestamp,
      ref: ref
    };

    state.addTransaction(tx);
    updateDashboardUI();

    document.getElementById('successMainTitle').textContent = 'PIN UPDATED';
    document.getElementById('successSubtitle').textContent = 'Your card PIN has been updated successfully.';
    document.getElementById('successRefCode').textContent = ref;
    document.getElementById('successNewBalance').textContent = 'N/A (Security Action)';
    document.getElementById('successTimestamp').textContent = timestamp;

    this.switchScreen('screenSuccess', 'PIN changed successfully.');
    this.startSuccessCountdown();
  }

  // Receipt Ejection on Machine
  triggerEjectedReceiptSnippet() {
    audio.playReceiptPrinterSound();
    const paper = document.getElementById('ejectedReceiptPaper');
    const snippet = document.getElementById('paperReceiptSnippet');
    const pType = document.getElementById('paperReceiptType');

    if (this.lastReceiptData) {
      pType.textContent = this.lastReceiptData.type;
      snippet.innerHTML = `Amt: ${this.lastReceiptData.amount}<br>Bal: ${this.lastReceiptData.availBal}`;
    }

    if (paper) {
      paper.classList.add('active');
    }
  }

  startSuccessCountdown() {
    let sec = 30;
    const countEl = document.getElementById('successCountdownSec');
    if (this.countdownInterval) clearInterval(this.countdownInterval);

    this.countdownInterval = setInterval(() => {
      sec--;
      if (countEl) countEl.textContent = sec;
      if (sec <= 0) {
        clearInterval(this.countdownInterval);
        this.ejectCard();
      }
    }, 1000);
  }

  printBalanceSlip() {
    const card = state.getActiveCard();
    const acc = state.getAccount(card.linkedAccount || 'checking');
    this.lastReceiptData = {
      type: 'BALANCE INQUIRY',
      amount: '$0.00',
      availBal: state.formatMoney(acc.balance),
      ledgerBal: state.formatMoney(acc.balance),
      cardMasked: `${card.number.slice(0, 4)} •••• •••• ${card.number.slice(-4)}`,
      cardholder: card.holder,
      accountType: acc.name.toUpperCase(),
      ref: `NX-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.triggerEjectedReceiptSnippet();
    this.openThermalReceiptModal(this.lastReceiptData);
  }

  printMiniStatementSlip() {
    const card = state.getActiveCard();
    const acc = state.getAccount(card.linkedAccount || 'checking');
    this.lastReceiptData = {
      type: 'MINI STATEMENT',
      amount: '$0.00',
      availBal: state.formatMoney(acc.balance),
      ledgerBal: state.formatMoney(acc.balance),
      cardMasked: `${card.number.slice(0, 4)} •••• •••• ${card.number.slice(-4)}`,
      cardholder: card.holder,
      accountType: acc.name.toUpperCase(),
      ref: `NX-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.triggerEjectedReceiptSnippet();
    this.openThermalReceiptModal(this.lastReceiptData);
  }

  printLastTransactionReceipt() {
    if (this.lastReceiptData) {
      this.openThermalReceiptModal(this.lastReceiptData);
    }
  }

  openThermalReceiptModal(data) {
    if (!data) return;
    document.getElementById('receiptDateTime').textContent = data.timestamp;
    document.getElementById('receiptTxType').textContent = data.type;
    document.getElementById('receiptCardMasked').textContent = data.cardMasked;
    document.getElementById('receiptCardholder').textContent = data.cardholder;
    document.getElementById('receiptAccountType').textContent = data.accountType;
    document.getElementById('receiptRefNo').textContent = data.ref;
    document.getElementById('receiptAmountVal').textContent = data.amount;
    document.getElementById('receiptAvailBal').textContent = data.availBal;
    document.getElementById('receiptLedgerBal').textContent = data.ledgerBal;
    document.getElementById('receiptBarcodeText').textContent = `*NX8840-${data.ref}*`;

    document.getElementById('thermalReceiptModal').classList.add('active');
  }
}

const atm = new AtmController();


// =============================================================================
// 4. TRANSIENT SIMULATED CVV ENGINE (MILESTONE 3)
// =============================================================================
let transientCvvState = {
  cardId: null,
  cvv: null,
  expiresAt: null,
  timer: null,
  interval: null
};

/**
 * Generate a cryptographically uniform 3-digit simulated CVV (000-999)
 * Uses rejection sampling on 16-bit random integers to eliminate modulo bias.
 */
function generateUniform3DigitCvv() {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const uint16 = new Uint16Array(1);
    // 65000 is the largest multiple of 1000 <= 65536.
    // Numbers >= 65000 are rejected to ensure completely uniform distribution 000..999
    let attempts = 0;
    while (attempts < 100) {
      window.crypto.getRandomValues(uint16);
      if (uint16[0] < 65000) {
        const val = uint16[0] % 1000;
        return String(val).padStart(3, '0');
      }
      attempts++;
    }
  }
  return null;
}

/**
 * Clear temporary CVV and reset DOM elements
 */
function clearTemporaryCvv(reason = '') {
  if (transientCvvState.timer) {
    clearTimeout(transientCvvState.timer);
    transientCvvState.timer = null;
  }
  if (transientCvvState.interval) {
    clearInterval(transientCvvState.interval);
    transientCvvState.interval = null;
  }

  const wasActive = !!transientCvvState.cvv;
  transientCvvState.cardId = null;
  transientCvvState.cvv = null;
  transientCvvState.expiresAt = null;

  const cvvDisplay = document.getElementById('cardDisplayCvv');
  if (cvvDisplay) cvvDisplay.textContent = '•••';

  const miniCountdown = document.getElementById('cardCvvMiniCountdown');
  if (miniCountdown) {
    miniCountdown.style.display = 'none';
    miniCountdown.textContent = '';
  }

  const cvvStatePill = document.getElementById('cvvStatePill');
  if (cvvStatePill) {
    cvvStatePill.className = 'cvv-state-pill masked';
    cvvStatePill.textContent = 'MASKED';
  }

  const cvvTimerDisplay = document.getElementById('cvvTimerDisplay');
  if (cvvTimerDisplay) cvvTimerDisplay.style.display = 'none';

  const btnRevealCvv = document.getElementById('btnRevealCvv');
  if (btnRevealCvv) {
    btnRevealCvv.disabled = false;
    btnRevealCvv.innerHTML = '<i class="fa-solid fa-eye" aria-hidden="true"></i> <span>Reveal Simulated CVV</span>';
  }

  if (wasActive && reason) {
    announceA11y(`Simulated CVV expired and masked.`);
    showToast(`Temporary CVV cleared (${reason}).`, 'info');
  }
}

/**
 * Reveal simulated temporary CVV for 30 seconds
 */
function revealTemporaryCvv(cardId) {
  const card = state.data.cards.find(c => c.id === cardId);
  if (!card) return;

  if (card.frozen) {
    audio.playErrorTone();
    showToast('Cannot generate CVV: Card is frozen. Unfreeze to use.', 'error');
    announceA11y('Cannot generate CVV: Card is frozen.');
    return;
  }

  const newCvv = generateUniform3DigitCvv();
  if (!newCvv) {
    showToast('Secure Web Crypto is unavailable. Cannot generate CVV safely.', 'error');
    return;
  }

  // Clear previous timer if any
  if (transientCvvState.timer) clearTimeout(transientCvvState.timer);
  if (transientCvvState.interval) clearInterval(transientCvvState.interval);

  const durationMs = 30000;
  const expiresAt = Date.now() + durationMs;

  transientCvvState.cardId = card.id;
  transientCvvState.cvv = newCvv;
  transientCvvState.expiresAt = expiresAt;

  updateDashboardUI();

  // Flip card to reveal back face if currently showing front face
  const card3d = document.getElementById('card3d');
  if (card3d && !card3d.classList.contains('flipped')) {
    card3d.classList.add('flipped');
  }

  audio.playEnterTone();
  showToast(`Temporary simulated CVV generated. Valid for 30 seconds.`, 'success');
  announceA11y(`Simulated CVV generated. Active for 30 seconds.`);

  // Set expiration timer
  transientCvvState.timer = setTimeout(() => {
    clearTemporaryCvv('expired');
  }, durationMs);

  // Set interval for live countdown update
  transientCvvState.interval = setInterval(() => {
    const remainingMs = transientCvvState.expiresAt - Date.now();
    const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

    if (remainingSec <= 0) {
      clearTemporaryCvv('expired');
      return;
    }

    const miniCountdown = document.getElementById('cardCvvMiniCountdown');
    if (miniCountdown) miniCountdown.textContent = `${remainingSec}s`;

    const secEl = document.getElementById('cvvSecondsRemaining');
    if (secEl) secEl.textContent = `${remainingSec}s`;

    // Screen reader announcement milestones: 15s and 5s
    if (remainingSec === 15) {
      announceA11y('Simulated CVV expires in 15 seconds.');
    } else if (remainingSec === 5) {
      announceA11y('Simulated CVV expires in 5 seconds.');
    }
  }, 1000);
}

/**
 * Open CVV Authentication PIN modal or reveal directly if already authenticated at ATM
 */
function handleRequestCvvReveal() {
  const card = state.getActiveCard();
  if (!card) return;

  if (card.frozen) {
    audio.playErrorTone();
    showToast('Cannot reveal CVV: This card is frozen. Unfreeze it first.', 'error');
    announceA11y('Cannot reveal CVV: Card is frozen.');
    return;
  }

  // If the ATM session is already authenticated for this card, immediate reveal
  if (atm.isAuthenticated && (atm.sessionCardId === card.id || (!atm.sessionCardId && state.data.activeCardId === card.id))) {
    revealTemporaryCvv(card.id);
    return;
  }

  // Open PIN verification modal
  const modal = document.getElementById('cvvAuthModal');
  const nameEl = document.getElementById('cvvAuthCardholder');
  const pinInput = document.getElementById('cvvAuthPinInput');
  const errEl = document.getElementById('cvvAuthPinError');

  if (nameEl) nameEl.textContent = card.holder;
  if (pinInput) pinInput.value = '';
  if (errEl) {
    errEl.textContent = '';
    errEl.style.display = 'none';
  }

  if (modal) {
    modal.classList.add('active');
    setTimeout(() => pinInput?.focus(), 100);
  }
}

function closeCvvAuthModal() {
  const modal = document.getElementById('cvvAuthModal');
  if (modal) modal.classList.remove('active');
  const pinInput = document.getElementById('cvvAuthPinInput');
  if (pinInput) pinInput.value = '';
}

function verifyCvvAuthPin() {
  const card = state.getActiveCard();
  const pinInput = document.getElementById('cvvAuthPinInput');
  const errEl = document.getElementById('cvvAuthPinError');
  const entered = (pinInput?.value || '').trim();

  if (entered !== card.pin) {
    audio.playErrorTone();
    if (errEl) {
      errEl.textContent = 'Incorrect PIN. Please enter the valid 4-digit card PIN.';
      errEl.style.display = 'block';
    }
    if (pinInput) {
      pinInput.value = '';
      pinInput.focus();
    }
    return;
  }

  closeCvvAuthModal();
  revealTemporaryCvv(card.id);
}


// =============================================================================
// 5. DIGITAL COMPANION & WALLET CONTROLLER
// =============================================================================
function updateDashboardUI() {
  const card = state.getActiveCard();

  // Active Card Preview UI
  const cardFront = document.getElementById('cardFrontFace');
  cardFront.className = `card-face card-front tier-${card.tier}`;
  
  document.getElementById('cardTierBadge').textContent = card.tierLabel;
  document.getElementById('cardDisplayNumber').textContent = `${card.number.slice(0, 4)} •••• •••• ${card.number.slice(-4)}`;
  document.getElementById('cardDisplayHolder').textContent = card.holder;
  document.getElementById('cardDisplayExpiry').textContent = card.expiry;

  // Milestone 3: CVV is masked by default. Only reveal if transient CVV is active for this card
  const cvvDisplay = document.getElementById('cardDisplayCvv');
  const miniCountdown = document.getElementById('cardCvvMiniCountdown');
  const cvvStatePill = document.getElementById('cvvStatePill');
  const cvvTimerDisplay = document.getElementById('cvvTimerDisplay');
  const cvvSecondsRemaining = document.getElementById('cvvSecondsRemaining');
  const btnRevealCvv = document.getElementById('btnRevealCvv');

  if (transientCvvState.cardId === card.id && transientCvvState.cvv && transientCvvState.expiresAt > Date.now()) {
    if (cvvDisplay) cvvDisplay.textContent = transientCvvState.cvv;
    const secLeft = Math.max(1, Math.ceil((transientCvvState.expiresAt - Date.now()) / 1000));
    if (miniCountdown) {
      miniCountdown.style.display = 'inline-block';
      miniCountdown.textContent = `${secLeft}s`;
    }
    if (cvvStatePill) {
      cvvStatePill.className = 'cvv-state-pill active';
      cvvStatePill.textContent = 'ACTIVE';
    }
    if (cvvTimerDisplay) cvvTimerDisplay.style.display = 'inline-flex';
    if (cvvSecondsRemaining) cvvSecondsRemaining.textContent = `${secLeft}s`;
    if (btnRevealCvv) {
      btnRevealCvv.disabled = true;
      btnRevealCvv.innerHTML = '<i class="fa-solid fa-lock" aria-hidden="true"></i> <span>CVV Active</span>';
    }
  } else {
    if (cvvDisplay) cvvDisplay.textContent = '•••';
    if (miniCountdown) miniCountdown.style.display = 'none';
    if (cvvStatePill) {
      cvvStatePill.className = 'cvv-state-pill masked';
      cvvStatePill.textContent = 'MASKED';
    }
    if (cvvTimerDisplay) cvvTimerDisplay.style.display = 'none';
    if (btnRevealCvv) {
      btnRevealCvv.disabled = false;
      btnRevealCvv.innerHTML = '<i class="fa-solid fa-eye" aria-hidden="true"></i> <span>Reveal Simulated CVV</span>';
    }
  }
  
  // Brand logo
  const brandLogo = document.getElementById('cardBrandLogo');
  if (card.network === 'visa') {
    brandLogo.innerHTML = '<i class="fa-brands fa-cc-visa"></i>';
  } else if (card.network === 'mastercard') {
    brandLogo.innerHTML = '<i class="fa-brands fa-cc-mastercard"></i>';
  } else {
    brandLogo.innerHTML = '<strong style="font-size:0.9rem;letter-spacing:1px">RuPay</strong>';
  }

  // Active Card Biometric Avatar / Photo
  const bioImg = document.getElementById('cardBioImg');
  const bioPlaceholder = document.getElementById('cardBioPlaceholder');
  if (card.photo) {
    if (bioImg) {
      bioImg.src = card.photo;
      bioImg.style.display = 'block';
    }
    if (bioPlaceholder) bioPlaceholder.style.display = 'none';
  } else {
    if (bioImg) bioImg.style.display = 'none';
    if (bioPlaceholder) bioPlaceholder.style.display = 'block';
  }

  // Freeze Toggle & Status Badge (Milestone 3 high-contrast, not color-alone)
  const freezeToggle = document.getElementById('freezeCardToggle');
  const freezeBadge = document.getElementById('freezeStatusBadge');
  const freezeText = document.getElementById('freezeStatusText');
  const freezeIcon = document.getElementById('freezeStatusIcon');

  if (freezeToggle) {
    freezeToggle.checked = !!card.frozen;
    freezeToggle.setAttribute('aria-checked', card.frozen ? 'true' : 'false');
  }
  if (freezeBadge && freezeText && freezeIcon) {
    if (card.frozen) {
      freezeBadge.className = 'card-freeze-status-badge frozen';
      freezeIcon.className = 'fa-solid fa-shield-halved';
      freezeText.textContent = 'FROZEN (LOCKED)';
    } else {
      freezeBadge.className = 'card-freeze-status-badge active';
      freezeIcon.className = 'fa-solid fa-shield-check';
      freezeText.textContent = 'OPERATIONAL';
    }
  }

  document.getElementById('intlAccessToggle').checked = !!card.intl;
  document.getElementById('contactlessToggle').checked = !!card.contactless;

  // Quick Card Name on welcome screen
  document.getElementById('quickCardName').textContent = card.holder;

  // Populate Card Selector
  const selector = document.getElementById('userCardSelector');
  selector.innerHTML = '';
  state.data.cards.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.holder} - ${c.tierLabel} (${c.number.slice(-4)})`;
    if (c.id === state.data.activeCardId) opt.selected = true;
    selector.appendChild(opt);
  });

  // Dynamic Account Balances (Supports checking, savings, student, wealth, etc.)
  const accGrid = document.getElementById('accountsSummaryGrid');
  if (accGrid) {
    accGrid.innerHTML = '';
    const accIcons = {
      checking: 'fa-money-check-dollar',
      savings: 'fa-piggy-bank',
      student: 'fa-graduation-cap',
      wealth: 'fa-gem'
    };
    const accBadges = {
      checking: 'checking',
      savings: 'savings',
      student: 'student',
      wealth: 'wealth'
    };

    Object.entries(state.data.accounts).forEach(([type, acc]) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'acc-summary-card';
      const icon = accIcons[type] || 'fa-wallet';
      const badgeClass = accBadges[type] || 'checking';
      const subInfo = type === 'savings' ? '4.85% APY • ' : (type === 'checking' ? '' : 'New • ');
      cardEl.innerHTML = `
        <div class="acc-badge ${badgeClass}"><i class="fa-solid ${icon}"></i> ${acc.name || type.toUpperCase()}</div>
        <div class="acc-bal" id="dash_${type}_bal">${state.formatMoney(acc.balance)}</div>
        <div class="acc-sub">${subInfo}Account ${acc.number}</div>
      `;
      accGrid.appendChild(cardEl);
    });
  }

  // Backward compatibility for static ID queries
  if (document.getElementById('dashCheckingBal') && state.data.accounts.checking) {
    document.getElementById('dashCheckingBal').textContent = state.formatMoney(state.data.accounts.checking.balance);
  }
  if (document.getElementById('dashSavingsBal') && state.data.accounts.savings) {
    document.getElementById('dashSavingsBal').textContent = state.formatMoney(state.data.accounts.savings.balance);
  }

  // Daily Limit Progress
  const percent = Math.min(100, (state.data.withdrawnToday / state.data.dailyLimit) * 100);
  document.getElementById('limitProgressBar').style.width = `${percent}%`;
  document.getElementById('limitUsageText').innerHTML = `<strong>${state.formatMoney(state.data.withdrawnToday)}</strong> / ${state.formatMoney(state.data.dailyLimit)} Used`;

  // Render Transaction History
  renderTransactionLedger('all');

  // Update Profile & Bank Treasury Metrics
  if (typeof profileController !== 'undefined') {
    profileController.applyProfileUI();
  }
}

function renderTransactionLedger(filter = 'all') {
  const container = document.getElementById('historyListWrapper');
  container.innerHTML = '';

  const list = state.data.transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  if (list.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:1.5rem;font-size:0.8rem;color:var(--text-muted)">No transactions found in this category.</div>';
    return;
  }

  list.forEach(tx => {
    const isCredit = tx.type === 'deposit';
    const row = document.createElement('div');
    row.className = 'history-item-row';

    let iconClass = 'fa-arrow-down';
    if (tx.type === 'withdrawal') iconClass = 'fa-arrow-up';
    if (tx.type === 'transfer') iconClass = 'fa-paper-plane';
    if (tx.type === 'pinchange') iconClass = 'fa-key';

    row.innerHTML = `
      <div class="tx-left">
        <div class="tx-icon-circle ${tx.type}">
          <i class="fa-solid ${iconClass}"></i>
        </div>
        <div class="tx-meta">
          <span class="tx-title">${tx.typeLabel}</span>
          <span class="tx-date">${tx.timestamp} • ${tx.ref}</span>
        </div>
      </div>
      <div class="tx-right">
        <span class="tx-amount ${isCredit ? 'credit' : 'debit'}">
          ${isCredit ? '+' : '-'}${state.formatMoney(tx.amount)}
        </span>
        <button class="btn-view-receipt-link" data-id="${tx.id}">Receipt</button>
      </div>
    `;

    row.querySelector('.btn-view-receipt-link').addEventListener('click', () => {
      const card = state.getActiveCard();
      const acc = state.getAccount(tx.account);
      atm.openThermalReceiptModal({
        type: tx.type.toUpperCase(),
        amount: state.formatMoney(tx.amount),
        availBal: state.formatMoney(acc.balance),
        ledgerBal: state.formatMoney(acc.balance),
        cardMasked: tx.cardUsed,
        cardholder: card.holder,
        accountType: acc.name.toUpperCase(),
        ref: tx.ref,
        timestamp: tx.timestamp
      });
    });

    container.appendChild(row);
  });
}


// =============================================================================
// 5. CAMERA KYC & LIVE BIOMETRIC CAPTURE CONTROLLER
// =============================================================================
class CameraKYCController {
  constructor() {
    this.stream = null;
    this.capturedPhoto = null;
    this.selectedPersona = 'cyber';
  }

  init() {
    document.querySelectorAll('.avatar-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.avatar-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedPersona = chip.getAttribute('data-avatar') || 'cyber';
        this.capturedPhoto = null;
        
        const previewLayer = document.getElementById('kycCapturedOverlay');
        if (previewLayer) previewLayer.style.display = 'none';

        const statusText = document.getElementById('kycStatusText');
        if (statusText) statusText.textContent = `Persona: ${chip.getAttribute('title') || 'Biometric ID'}`;

        updateRegCardPreview();
      });
    });

    const startBtn = document.getElementById('startKycCamBtn');
    if (startBtn) startBtn.addEventListener('click', () => this.startCamera());

    const livenessBtn = document.getElementById('runLivenessCheckBtn');
    if (livenessBtn) livenessBtn.addEventListener('click', () => this.runLivenessCheck());

    const captureBtn = document.getElementById('captureKycPhotoBtn');
    if (captureBtn) captureBtn.addEventListener('click', () => this.takeSnapshot());

    const retakeBtn = document.getElementById('retakeKycPhotoBtn');
    if (retakeBtn) retakeBtn.addEventListener('click', () => this.retakeSnapshot());
  }

  startCamera() {
    const video = document.getElementById('kycVideoFeed');
    const startBtn = document.getElementById('startKycCamBtn');
    const livenessBtn = document.getElementById('runLivenessCheckBtn');
    const captureBtn = document.getElementById('captureKycPhotoBtn');
    const retakeBtn = document.getElementById('retakeKycPhotoBtn');
    const statusText = document.getElementById('kycStatusText');
    const dot = document.getElementById('kycCamDot');
    const previewLayer = document.getElementById('kycCapturedOverlay');

    if (previewLayer) previewLayer.style.display = 'none';

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast('Webcam API is not supported in this browser. You can select any pre-verified biometric persona below!', 'error');
      if (statusText) statusText.textContent = 'Camera Unavailable • Persona Active';
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 } } })
      .then(stream => {
        this.stream = stream;
        if (video) {
          video.srcObject = stream;
          video.play().catch(() => {});
        }
        if (startBtn) startBtn.style.display = 'none';
        if (livenessBtn) livenessBtn.style.display = 'inline-flex';
        if (captureBtn) captureBtn.style.display = 'inline-flex';
        if (retakeBtn) retakeBtn.style.display = 'none';
        if (dot) dot.className = 'pulse-dot green';
        if (statusText) statusText.textContent = 'Live Feed Active • Center Face in Frame';
        audio.playKeypadBeep(1400);
        showToast('Webcam connected! Position your face in the oval frame.', 'success');
      })
      .catch(err => {
        console.warn('Camera access error:', err);
        showToast('Camera permission denied or camera unavailable. You can use the instant biometric personas below!', 'error');
        if (statusText) statusText.textContent = 'Permission Denied • Persona Fallback Active';
      });
  }

  runLivenessCheck() {
    const overlay = document.getElementById('kycLivenessPromptOverlay');
    const title = document.getElementById('livenessPromptTitle');
    const step = document.getElementById('livenessPromptStep');
    const livenessBtn = document.getElementById('runLivenessCheckBtn');
    const captureBtn = document.getElementById('captureKycPhotoBtn');

    if (!overlay) return;
    overlay.style.display = 'flex';
    audio.playBiometricScanSound();

    if (livenessBtn) livenessBtn.disabled = true;
    if (captureBtn) captureBtn.disabled = true;

    // Stage 1: Eye-blink check
    if (title) title.textContent = 'Blink Eyes Twice';
    if (step) step.textContent = 'Step 1 of 2: Anti-Spoofing 3D Depth Check';

    setTimeout(() => {
      // Stage 2: Smile / Head tilt
      audio.playBiometricScanSound();
      if (title) title.textContent = 'Slightly Smile / Turn Head';
      if (step) step.textContent = 'Step 2 of 2: Micro-movement Validation';

      setTimeout(() => {
        // Stage 3: Liveness verified
        overlay.style.display = 'none';
        if (livenessBtn) {
          livenessBtn.disabled = false;
          livenessBtn.style.display = 'none';
        }
        if (captureBtn) captureBtn.disabled = false;

        audio.playBiometricSuccessSound();
        showToast('Liveness Verified: 99.8% Genuine Depth Signature (Anti-Spoofing Passed)', 'success');
        audio.speak('Biometric liveness verified. Taking high-resolution KYC snapshot now.');

        this.takeSnapshot();
      }, 1500);
    }, 1500);
  }

  takeSnapshot() {
    const video = document.getElementById('kycVideoFeed');
    const canvas = document.getElementById('kycCanvas');
    const countdownEl = document.getElementById('kycCountdown');
    const flashScreen = document.getElementById('kycFlashScreen');
    const previewLayer = document.getElementById('kycCapturedOverlay');
    const previewImg = document.getElementById('kycCapturedImg');
    const livenessBtn = document.getElementById('runLivenessCheckBtn');
    const captureBtn = document.getElementById('captureKycPhotoBtn');
    const retakeBtn = document.getElementById('retakeKycPhotoBtn');
    const statusText = document.getElementById('kycStatusText');

    if (!video || !canvas) return;

    if (countdownEl) {
      countdownEl.style.display = 'block';
      let count = 3;
      countdownEl.textContent = count;
      audio.playKeypadBeep(1000);

      const countInterval = setInterval(() => {
        count--;
        if (count > 0) {
          countdownEl.textContent = count;
          audio.playKeypadBeep(1000);
        } else {
          clearInterval(countInterval);
          countdownEl.style.display = 'none';

          if (flashScreen) {
            flashScreen.classList.add('flash');
            setTimeout(() => flashScreen.classList.remove('flash'), 250);
          }

          audio.playCameraShutterSound();

          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          try {
            const dataUrl = canvas.toDataURL('image/png');
            this.capturedPhoto = dataUrl;

            if (previewImg) previewImg.src = dataUrl;
            if (previewLayer) previewLayer.style.display = 'block';

            if (livenessBtn) livenessBtn.style.display = 'none';
            if (captureBtn) captureBtn.style.display = 'none';
            if (retakeBtn) retakeBtn.style.display = 'inline-flex';
            if (statusText) statusText.textContent = 'Photo Captured • Biometrics Extracted';

            this.stopCamera();
            updateRegCardPreview();
            showToast('Biometric KYC Selfie captured successfully!', 'success');
          } catch (e) {
            console.warn('Canvas export error:', e);
          }
        }
      }, 700);
    }
  }

  retakeSnapshot() {
    this.capturedPhoto = null;
    const previewLayer = document.getElementById('kycCapturedOverlay');
    if (previewLayer) previewLayer.style.display = 'none';
    this.startCamera();
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    const video = document.getElementById('kycVideoFeed');
    if (video) video.srcObject = null;
  }

  reset() {
    this.stopCamera();
    this.capturedPhoto = null;
    this.selectedPersona = 'cyber';

    const previewLayer = document.getElementById('kycCapturedOverlay');
    if (previewLayer) previewLayer.style.display = 'none';

    const previewImg = document.getElementById('kycCapturedImg');
    if (previewImg) previewImg.src = '';

    const startBtn = document.getElementById('startKycCamBtn');
    if (startBtn) startBtn.style.display = 'inline-flex';

    const livenessBtn = document.getElementById('runLivenessCheckBtn');
    if (livenessBtn) {
      livenessBtn.style.display = 'none';
      livenessBtn.disabled = false;
    }

    const captureBtn = document.getElementById('captureKycPhotoBtn');
    if (captureBtn) {
      captureBtn.style.display = 'none';
      captureBtn.disabled = false;
    }

    const retakeBtn = document.getElementById('retakeKycPhotoBtn');
    if (retakeBtn) retakeBtn.style.display = 'none';

    const dot = document.getElementById('kycCamDot');
    if (dot) dot.className = 'pulse-dot red';

    const statusText = document.getElementById('kycStatusText');
    if (statusText) statusText.textContent = 'Webcam Ready • Click Start';

    const livenessPrompt = document.getElementById('kycLivenessPromptOverlay');
    if (livenessPrompt) livenessPrompt.style.display = 'none';

    const countdownEl = document.getElementById('kycCountdown');
    if (countdownEl) countdownEl.style.display = 'none';

    document.querySelectorAll('.avatar-chip').forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-avatar') === 'cyber');
    });
  }

  getFinalPhoto() {
    if (this.capturedPhoto) return this.capturedPhoto;
    return DEMO_AVATARS[this.selectedPersona] || DEMO_AVATARS.cyber;
  }
}

const kycController = new CameraKYCController();


// =============================================================================
// 6. CARD ACTIVATION & NEW ACCOUNT REGISTRATION WIZARD ENGINE
// =============================================================================
function openActivateModal() {
  document.getElementById('activateCardModal').classList.add('active');
  updateNewCardPreview();
}

function updateNewCardPreview() {
  const name = document.getElementById('newCardHolder').value.trim() || 'YOUR NAME';
  const tier = document.getElementById('newCardTier').value;
  const network = document.getElementById('newCardNetwork').value;

  const preview = document.getElementById('newCardPreview');
  preview.className = `new-card-preview tier-${tier}`;

  const tierMap = {
    'titanium-gold': 'TITANIUM GOLD',
    'obsidian-black': 'OBSIDIAN BLACK',
    'cyber-neon': 'CYBER NEON',
    'emerald-green': 'MINIMALIST EMERALD'
  };

  document.getElementById('previewTierBadge').textContent = tierMap[tier] || 'TITANIUM GOLD';
  document.getElementById('previewHolderName').textContent = name.toUpperCase();

  const brandEl = document.getElementById('previewBrandLogo');
  if (network === 'visa') brandEl.innerHTML = '<i class="fa-brands fa-cc-visa"></i>';
  else if (network === 'mastercard') brandEl.innerHTML = '<i class="fa-brands fa-cc-mastercard"></i>';
  else brandEl.innerHTML = '<strong>RuPay</strong>';
}

function generateLuhnCardNumber(network) {
  let prefix = '4242';
  if (network === 'mastercard') prefix = '5310';
  if (network === 'rupay') prefix = '6080';

  const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
  return `${prefix} ${randomDigits()} ${randomDigits()} ${randomDigits()}`;
}

function handleActivateCardSubmit(e) {
  e.preventDefault();

  const holder = document.getElementById('newCardHolder').value.trim().toUpperCase();
  const tier = document.getElementById('newCardTier').value;
  const network = document.getElementById('newCardNetwork').value;
  const pin = document.getElementById('newCardPin').value;
  const confirmPin = document.getElementById('newCardConfirmPin').value;
  const linkedAccount = document.getElementById('newCardAccount').value;

  if (pin.length !== 4 || isNaN(pin)) {
    audio.playErrorTone();
    showToast('PIN must be exactly 4 digits.', 'error');
    return;
  }

  if (pin !== confirmPin) {
    audio.playErrorTone();
    showToast('PIN confirmation does not match.', 'error');
    return;
  }

  const tierMap = {
    'titanium-gold': 'TITANIUM GOLD',
    'obsidian-black': 'OBSIDIAN BLACK',
    'cyber-neon': 'CYBER NEON',
    'emerald-green': 'MINIMALIST EMERALD'
  };

  const newCard = {
    id: `card-${Date.now()}`,
    holder: holder,
    number: generateLuhnCardNumber(network),
    pin: pin,
    tier: tier,
    tierLabel: tierMap[tier] || 'TITANIUM GOLD',
    network: network,
    expiry: '09/30',
    cvv: Math.floor(100 + Math.random() * 900).toString(),
    frozen: false,
    intl: true,
    contactless: true,
    linkedAccount: linkedAccount,
    photo: DEMO_AVATARS.vip
  };

  state.data.cards.push(newCard);
  state.data.activeCardId = newCard.id;
  state.saveState();

  updateDashboardUI();
  document.getElementById('activateCardModal').classList.remove('active');

  audio.playEnterTone();
  showToast(`Congratulations! New ATM Card activated for ${holder}.`, 'success');
}

// -----------------------------------------------------------------------------
// NEW USER REGISTRATION & AUTO CARD ALLOCATOR
// -----------------------------------------------------------------------------
function openNewAccountModal() {
  const modal = document.getElementById('openAccountModal');
  if (modal) {
    modal.classList.add('active');
    updateRegCardPreview();
  }
}

function updateRegCardPreview() {
  const fullName = document.getElementById('regFullName')?.value.trim().toUpperCase() || 'NEW CARDHOLDER';
  const selectedPrefOption = document.querySelector('.pref-card-option.active') || document.querySelector('.pref-card-option');
  
  if (!selectedPrefOption) return;

  const tier = selectedPrefOption.getAttribute('data-tier') || 'obsidian-black';
  const network = selectedPrefOption.getAttribute('data-network') || 'visa';
  const perk = selectedPrefOption.getAttribute('data-perk') || '0% FX Global Perks';
  const title = selectedPrefOption.getAttribute('data-title') || 'OBSIDIAN PLATINUM';

  const preview = document.getElementById('regCardPreview');
  if (preview) {
    preview.className = `new-card-preview tier-${tier}`;
  }

  const tierBadge = document.getElementById('regTierBadge');
  if (tierBadge) tierBadge.textContent = title;

  const holderName = document.getElementById('regHolderName');
  if (holderName) holderName.textContent = fullName;

  const perkBadge = document.getElementById('regPerkBadge');
  if (perkBadge) perkBadge.innerHTML = `<i class="fa-solid fa-sparkles"></i> ${perk}`;

  const brandEl = document.getElementById('regBrandLogo');
  if (brandEl) {
    if (network === 'visa') brandEl.innerHTML = '<i class="fa-brands fa-cc-visa"></i>';
    else if (network === 'mastercard') brandEl.innerHTML = '<i class="fa-brands fa-cc-mastercard"></i>';
    else brandEl.innerHTML = '<strong>RuPay</strong>';
  }

  // Update Biometric Photo on Registration Card Preview
  const regBioImg = document.getElementById('regCardBioImg');
  const regBioPlaceholder = document.getElementById('regBioPlaceholder');
  const photo = kycController ? kycController.getFinalPhoto() : DEMO_AVATARS.cyber;

  if (regBioImg) {
    regBioImg.src = photo;
    regBioImg.style.display = 'block';
  }
  if (regBioPlaceholder) {
    regBioPlaceholder.style.display = 'none';
  }
}

/**
 * Resets the Open Account Registration Dashboard / Wizard to clean, fresh state
 */
function resetOpenAccountDashboard() {
  // 1. Reset standard form fields
  const form = document.getElementById('openAccountForm');
  if (form) form.reset();

  const fullNameInput = document.getElementById('regFullName');
  if (fullNameInput) fullNameInput.value = '';

  const phoneInput = document.getElementById('regPhone');
  if (phoneInput) phoneInput.value = '';

  const accountTypeSelect = document.getElementById('regAccountType');
  if (accountTypeSelect) accountTypeSelect.value = 'checking';

  const depositInput = document.getElementById('regInitialDeposit');
  if (depositInput) depositInput.value = '5000';

  const pinInput = document.getElementById('regPin');
  if (pinInput) pinInput.value = '';

  const confirmPinInput = document.getElementById('regConfirmPin');
  if (confirmPinInput) confirmPinInput.value = '';

  // 2. Reset banking lifestyle preference cards (default to first option)
  document.querySelectorAll('.pref-card-option').forEach((cardOpt, idx) => {
    const isFirst = idx === 0;
    cardOpt.classList.toggle('active', isFirst);
    const radio = cardOpt.querySelector('input[type="radio"]');
    if (radio) radio.checked = isFirst;
  });

  // 3. Reset live Camera KYC module & persona state
  if (kycController) {
    kycController.reset();
  }

  // 4. Update preview card to fresh default state
  updateRegCardPreview();
}

function handleOpenAccountSubmit(e) {
  e.preventDefault();

  const fullName = document.getElementById('regFullName')?.value.trim().toUpperCase();
  const phone = document.getElementById('regPhone')?.value.trim();
  const accountType = document.getElementById('regAccountType')?.value || 'checking';
  const initialDeposit = parseFloat(document.getElementById('regInitialDeposit')?.value) || 0;
  const pin = document.getElementById('regPin')?.value.trim();
  const confirmPin = document.getElementById('regConfirmPin')?.value.trim();

  if (!fullName) {
    audio.playErrorTone();
    showToast('Please enter your full legal name.', 'error');
    return;
  }

  if (initialDeposit < 500) {
    audio.playErrorTone();
    showToast('Initial opening deposit must be at least ₹500.', 'error');
    return;
  }

  if (pin.length !== 4 || isNaN(pin)) {
    audio.playErrorTone();
    showToast('PIN must be exactly 4 digits.', 'error');
    return;
  }

  if (pin !== confirmPin) {
    audio.playErrorTone();
    showToast('Security PIN confirmation does not match.', 'error');
    return;
  }

  // Get Selected Lifestyle Preference & Photo
  const selectedPrefOption = document.querySelector('.pref-card-option.active');
  const tier = selectedPrefOption ? selectedPrefOption.getAttribute('data-tier') : 'obsidian-black';
  const network = selectedPrefOption ? selectedPrefOption.getAttribute('data-network') : 'visa';
  const tierTitle = selectedPrefOption ? selectedPrefOption.getAttribute('data-title') : 'OBSIDIAN PLATINUM';
  const cardPhoto = kycController ? kycController.getFinalPhoto() : DEMO_AVATARS.cyber;

  // 1. Credit Opening Balance
  if (!state.data.accounts[accountType]) {
    state.data.accounts[accountType] = {
      name: accountType === 'wealth' ? 'Private Wealth Account' : 'Student Account',
      number: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
      balance: initialDeposit
    };
  } else {
    state.data.accounts[accountType].balance += initialDeposit;
  }

  // 2. Issue Personalized Auto-Assigned Card with Biometric Photo
  const newCardNumber = generateLuhnCardNumber(network);
  const newCard = {
    id: `card-${Date.now()}`,
    holder: fullName,
    number: newCardNumber,
    pin: pin,
    tier: tier,
    tierLabel: tierTitle,
    network: network,
    expiry: '09/31',
    cvv: Math.floor(100 + Math.random() * 900).toString(),
    frozen: false,
    intl: true,
    contactless: true,
    linkedAccount: accountType,
    photo: cardPhoto
  };

  state.data.cards.push(newCard);
  state.data.activeCardId = newCard.id;

  // 3. Record Initial Opening Deposit Transaction
  state.data.transactions.unshift({
    id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
    type: 'deposit',
    typeLabel: `Initial Account Opening Deposit (${tierTitle})`,
    amount: initialDeposit,
    account: accountType,
    cardUsed: `${newCardNumber.slice(0, 4)} •••• •••• ${newCardNumber.slice(-4)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    ref: `NX-${Math.floor(100000 + Math.random() * 900000)}`
  });

  // 4. Save & Sync
  state.saveState();
  updateDashboardUI();

  // If an ATM session was active with an old card, eject and reset to welcome screen
  if (atm.isCardInserted) {
    atm.ejectCard('New account activated. Please insert your new card.');
  }

  // 5. Automatically reset the Open Account Dashboard form, preview, and camera
  resetOpenAccountDashboard();

  // Close modal
  document.getElementById('openAccountModal')?.classList.remove('active');

  // Audio & Toast
  audio.playEnterTone();
  showToast(`Account successfully registered! Issued ${tierTitle} card with Biometric KYC to ${fullName}.`, 'success');
  audio.speak(`Welcome to Nexus Bank, ${fullName}. Your account is open and your biometric debit card is ready for ATM use.`);
}


// =============================================================================
// DUAL PROFILE CONTROLLER: CUSTOMER (USER) VS PASSWORD-PROTECTED BANK OFFICIAL
// =============================================================================
class ProfileController {
  constructor() {
    // SECURITY POLICY: Bank Official mode is strictly ephemeral and in-memory.
    // Refreshing the page, closing the tab, or reopening the link ALWAYS resets
    // the system to Customer Profile ('user'), requiring fresh re-authentication.
    this.currentProfile = 'user';
    this.officerBioStream = null;
    this.officerBioInterval = null;
    this.activeAuthTab = 'passcode';

    try {
      localStorage.removeItem('nexus_atm_profile');
      sessionStorage.removeItem('nexus_atm_profile');
    } catch (e) {
      // ignore storage access errors in private browsing modes
    }
    this.officialPasscodes = ['admin1234', 'nexus@admin', '9900', '1234', 'admin'];
    this.failedAttempts = 0;
  }

  isOfficial() {
    return this.currentProfile === 'official';
  }

  setProfile(profile) {
    this.currentProfile = (profile === 'official') ? 'official' : 'user';
    // Ensure storage is strictly wiped so any browser reload immediately reverts to Customer profile
    try {
      localStorage.removeItem('nexus_atm_profile');
      sessionStorage.removeItem('nexus_atm_profile');
    } catch (e) {}
    this.applyProfileUI();
  }

  switchAuthTab(tab) {
    this.activeAuthTab = tab;
    const tabPinBtn = document.getElementById('tabBtnPasscode');
    const tabBioBtn = document.getElementById('tabBtnBiometric');
    const panePin = document.getElementById('officialPasscodeTabPane');
    const paneBio = document.getElementById('officialBiometricTabPane');

    if (tabPinBtn) tabPinBtn.classList.toggle('active', tab === 'passcode');
    if (tabBioBtn) tabBioBtn.classList.toggle('active', tab === 'biometric');
    if (panePin) panePin.style.display = tab === 'passcode' ? 'block' : 'none';
    if (paneBio) paneBio.style.display = tab === 'biometric' ? 'block' : 'none';

    audio.playKeypadBeep(1200);

    if (tab === 'passcode') {
      this.stopOfficerBiometricScan();
      document.getElementById('officialPasswordInput')?.focus();
    } else {
      this.resetOfficerBioUI();
    }
  }

  resetOfficerBioUI() {
    const stepText = document.getElementById('officialBioStepText');
    const pctText = document.getElementById('officialBioPercentText');
    const fill = document.getElementById('officialBioProgressFill');
    const successCard = document.getElementById('officialBioSuccessOverlay');
    const startBtn = document.getElementById('btnStartOfficerBioScan');
    const cancelBtn = document.getElementById('btnCancelOfficerBioScan');

    if (stepText) stepText.innerHTML = '<i class="fa-solid fa-camera"></i> Camera Standby • Click Below to Scan';
    if (pctText) pctText.textContent = '0%';
    if (fill) fill.style.width = '0%';
    if (successCard) successCard.style.display = 'none';
    if (startBtn) startBtn.style.display = 'flex';
    if (cancelBtn) cancelBtn.style.display = 'none';
  }

  startOfficerBiometricScan() {
    // Release any camera streams that might hold the webcam
    if (typeof atm !== 'undefined') {
      atm.stopFaceCamera();
      if (atm.cctvStream) {
        atm.cctvStream.getTracks().forEach(t => t.stop());
        atm.cctvStream = null;
      }
    }

    const videoEl = document.getElementById('officialBioVideo');
    const stepText = document.getElementById('officialBioStepText');
    const pctText = document.getElementById('officialBioPercentText');
    const fill = document.getElementById('officialBioProgressFill');
    const successCard = document.getElementById('officialBioSuccessOverlay');
    const startBtn = document.getElementById('btnStartOfficerBioScan');
    const cancelBtn = document.getElementById('btnCancelOfficerBioScan');
    const statusTag = document.getElementById('officialHudStatusTag');

    if (startBtn) startBtn.style.display = 'none';
    if (cancelBtn) cancelBtn.style.display = 'inline-flex';
    if (successCard) successCard.style.display = 'none';
    if (stepText) stepText.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin"></i> Activating Camera Sensor...';

    audio.playBiometricScanSound();

    const beginScanAnimation = (isLiveWebcam) => {
      let progress = 0;
      if (statusTag) {
        statusTag.innerHTML = isLiveWebcam
          ? '<i class="fa-solid fa-circle" style="color:var(--accent-green)"></i> LIVE SENSOR ACTIVE • 128-PT MESH'
          : '<i class="fa-solid fa-circle-nodes" style="color:var(--accent-cyan)"></i> AI OPTICAL SENSOR • SIMULATION';
      }

      if (this.officerBioInterval) clearInterval(this.officerBioInterval);
      this.officerBioInterval = setInterval(() => {
        progress += Math.floor(10 + Math.random() * 15);
        if (progress > 100) progress = 100;

        if (fill) fill.style.width = `${progress}%`;
        if (pctText) pctText.textContent = `${progress}%`;

        if (progress < 30) {
          if (stepText) stepText.innerHTML = '<i class="fa-solid fa-expand"></i> Positioning face inside optical reticle...';
        } else if (progress < 65) {
          if (stepText) stepText.innerHTML = '<i class="fa-solid fa-fingerprint"></i> Cross-matching Level-4 Custodian Ledger...';
        } else if (progress < 95) {
          if (stepText) stepText.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Validating cryptographic officer certificate...';
        } else {
          clearInterval(this.officerBioInterval);
          this.officerBioInterval = null;

          if (stepText) stepText.innerHTML = '<i class="fa-solid fa-circle-check" style="color:var(--accent-green)"></i> Biometric Match Confirmed!';
          if (successCard) successCard.style.display = 'flex';

          audio.playBiometricSuccessSound();
          showToast('Officer Biometrics Verified: Level-4 Custodian Access Granted.', 'success');

          setTimeout(() => {
            this.stopOfficerBiometricScan();
            this.setProfile('official');
            this.closeAuthModal();
            audio.speak('Officer biometrics recognized. Level-4 Bank Custodian access granted.');
          }, 1200);
        }
      }, 250);
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 } } })
        .then(stream => {
          this.officerBioStream = stream;
          if (videoEl) {
            videoEl.setAttribute('playsinline', '');
            videoEl.setAttribute('autoplay', '');
            videoEl.muted = true;
            videoEl.srcObject = stream;
            videoEl.play().catch(() => {});
          }
          beginScanAnimation(true);
        })
        .catch(err => {
          console.warn('Camera access denied or unavailable for Bank Official, running high-accuracy optical simulation:', err);
          showToast('Webcam not permitted or busy. Running verified AI optical simulation.', 'info');
          beginScanAnimation(false);
        });
    } else {
      beginScanAnimation(false);
    }
  }

  stopOfficerBiometricScan() {
    if (this.officerBioInterval) {
      clearInterval(this.officerBioInterval);
      this.officerBioInterval = null;
    }
    if (this.officerBioStream) {
      this.officerBioStream.getTracks().forEach(t => t.stop());
      this.officerBioStream = null;
    }
    const videoEl = document.getElementById('officialBioVideo');
    if (videoEl) videoEl.srcObject = null;
    this.resetOfficerBioUI();
  }

  openAuthModal() {
    this.switchAuthTab('passcode');
    const modal = document.getElementById('bankOfficialAuthModal');
    const pwdInput = document.getElementById('officialPasswordInput');
    if (pwdInput) {
      pwdInput.value = '';
      pwdInput.type = 'password';
    }
    const icon = document.getElementById('toggleOfficialPwdIcon');
    if (icon) icon.className = 'fa-solid fa-eye';
    if (modal) modal.classList.add('active');
    setTimeout(() => pwdInput?.focus(), 100);
    audio.playKeypadBeep(1200);
  }

  closeAuthModal() {
    this.stopOfficerBiometricScan();
    const modal = document.getElementById('bankOfficialAuthModal');
    if (modal) modal.classList.remove('active');
  }

  authenticate(passcode) {
    if (!passcode) {
      showToast('Please enter Bank Official passcode.', 'error');
      audio.playErrorTone();
      return false;
    }
    const clean = passcode.trim();
    if (this.officialPasscodes.includes(clean)) {
      this.failedAttempts = 0;
      this.setProfile('official');
      this.closeAuthModal();
      audio.playBiometricSuccessSound();
      showToast('Bank Official Profile Activated: Access granted to bank reserves & telemetry.', 'success');
      audio.speak('Bank Official access authorized. Sensitive bank records unlocked.');
      return true;
    } else {
      this.failedAttempts++;
      audio.playErrorTone();
      showToast('Authentication failed: Invalid Bank Official passcode.', 'error');
      return false;
    }
  }

  lockToUser() {
    this.setProfile('user');
    audio.playEnterTone();
    showToast('Switched to Customer Profile. Bank sensitive records locked.', 'info');
    audio.speak('Switched to Customer Profile. Sensitive records locked.');
  }

  calculateMetrics() {
    let totalDeposits = 0;
    let depositCount = 0;
    let totalWithdrawals = 0;
    let withdrawCount = 0;

    const txs = (state && state.data && Array.isArray(state.data.transactions)) ? state.data.transactions : [];
    txs.forEach(tx => {
      if (tx.type === 'deposit') {
        totalDeposits += (parseFloat(tx.amount) || 0);
        depositCount++;
      } else if (tx.type === 'withdrawal') {
        totalWithdrawals += (parseFloat(tx.amount) || 0);
        withdrawCount++;
      }
    });

    const c = (state && state.data && state.data.cassettes) ? state.data.cassettes : { 500: 1840, 200: 1450, 100: 1920, 50: 980 };
    const vaultTotal = (c[500] * 500) + (c[200] * 200) + (c[100] * 100) + (c[50] * 50);
    const netCashFlow = totalDeposits - totalWithdrawals;

    return {
      totalDeposits,
      depositCount,
      totalWithdrawals,
      withdrawCount,
      vaultTotal,
      netCashFlow
    };
  }

  applyProfileUI() {
    try {
      const isOff = this.isOfficial();

    // Toggle button active states
    document.getElementById('profileUserBtn')?.classList.toggle('active', !isOff);
    document.getElementById('profileOfficialBtn')?.classList.toggle('active', isOff);

    // Official active indicator in nav
    const indicator = document.getElementById('officialActiveIndicator');
    if (indicator) indicator.style.display = isOff ? 'inline-flex' : 'none';

    const pillToggle = document.getElementById('profilePillToggle');
    if (pillToggle) pillToggle.style.display = isOff ? 'none' : 'inline-flex';

    // Top status pill badge
    const statusDiagTag = document.getElementById('statusDiagTag');
    if (statusDiagTag) {
      if (isOff) {
        statusDiagTag.innerHTML = '<i class="fa-solid fa-server"></i> Vault Diag';
        statusDiagTag.style.opacity = '1';
        statusDiagTag.style.color = 'var(--accent-green)';
      } else {
        statusDiagTag.innerHTML = '<i class="fa-solid fa-lock"></i> Vault Locked';
        statusDiagTag.style.opacity = '0.7';
        statusDiagTag.style.color = 'var(--text-muted)';
      }
    }

    // Official Treasury Panel
    const treasuryPanel = document.getElementById('officialTreasuryPanel');
    if (treasuryPanel) treasuryPanel.style.display = isOff ? 'block' : 'none';

    // Update treasury values if in Official mode
    if (isOff) {
      const m = this.calculateMetrics();
      const vaultEl = document.getElementById('treasuryVaultLiquidity');
      if (vaultEl) vaultEl.textContent = state.formatMoney(m.vaultTotal);

      const depEl = document.getElementById('treasuryTotalDeposits');
      if (depEl) depEl.textContent = state.formatMoney(m.totalDeposits);
      const depCountEl = document.getElementById('treasuryDepositCount');
      if (depCountEl) depCountEl.textContent = `${m.depositCount} Deposits Processed`;

      const withEl = document.getElementById('treasuryTotalWithdrawals');
      if (withEl) withEl.textContent = state.formatMoney(m.totalWithdrawals);
      const withCountEl = document.getElementById('treasuryWithdrawCount');
      if (withCountEl) withCountEl.textContent = `${m.withdrawCount} Dispenses Completed`;

      const netEl = document.getElementById('treasuryNetCashFlow');
      if (netEl) {
        const sign = m.netCashFlow >= 0 ? '+' : '-';
        netEl.textContent = `${sign}${state.formatMoney(Math.abs(m.netCashFlow))}`;
        netEl.style.color = m.netCashFlow >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
      }
      const flowStatusEl = document.getElementById('treasuryFlowStatus');
      if (flowStatusEl) {
        flowStatusEl.textContent = m.netCashFlow >= 0 ? 'Net Cash Influx' : 'Net Cash Outflow';
      }
    }

    // Bank Audit Ledger vs Locked Shield
    const lockedBanner = document.getElementById('userLedgerLockedBanner');
    const historyListWrapper = document.getElementById('historyListWrapper');
    const historyFilterBtns = document.getElementById('historyFilterBtns');
    const ledgerBoxTitle = document.getElementById('ledgerBoxTitle');

    if (lockedBanner) lockedBanner.style.display = isOff ? 'none' : 'flex';
    if (historyListWrapper) historyListWrapper.style.display = isOff ? 'flex' : 'none';
    if (historyFilterBtns) historyFilterBtns.style.display = isOff ? 'flex' : 'none';
    if (ledgerBoxTitle) {
      ledgerBoxTitle.innerHTML = isOff
        ? '<i class="fa-solid fa-receipt"></i> Bank Master Audit Ledger'
        : '<i class="fa-solid fa-shield-halved"></i> Bank Transaction History';
    }

    // Reset Demo Button (Bank Officials only)
    const resetDemoBtn = document.getElementById('resetDemoStateBtn');
    if (resetDemoBtn) resetDemoBtn.style.display = isOff ? 'inline-flex' : 'none';

    // Customer Security Guide (Shown in User profile, hidden in Official profile)
    const guideBox = document.getElementById('customerSecurityGuideBox');
    if (guideBox) guideBox.style.display = isOff ? 'none' : 'block';
    } catch (err) {
      console.error('Error applying Profile UI:', err);
    }
  }
}

const profileController = new ProfileController();


// =============================================================================
// 6. EVENT LISTENERS & WIRING
// =============================================================================
function initEventListeners() {
  // Keypad Clicks
  document.querySelectorAll('.key-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      if (key) atm.handleKeypadPress(key);
    });
  });

  // Physical Computer Keyboard Listener
  document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT' && document.activeElement.id !== 'withdrawAmountInput') {
      return; // Allow typing in regular modal forms
    }

    if (e.key >= '0' && e.key <= '9') {
      atm.handleKeypadPress(e.key);
    } else if (e.key === 'Enter') {
      atm.handleKeypadPress('ENTER');
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      atm.handleKeypadPress('CLEAR');
    } else if (e.key === 'Escape') {
      atm.handleKeypadPress('CANCEL');
    }
  });

  // Side Function Keys (F1 - F8)
  document.querySelectorAll('.side-key').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      if (key) atm.handleSideKey(key);
    });
  });

  // Welcome Screen Quick Buttons
  document.getElementById('quickInsertDefaultBtn')?.addEventListener('click', () => atm.insertCard());
  document.getElementById('quickFaceAuthBtn')?.addEventListener('click', () => atm.startFaceLogin());
  document.getElementById('quickActivateNewCardBtn')?.addEventListener('click', openActivateModal);
  document.getElementById('quickCardlessBtn')?.addEventListener('click', () => atm.openCardlessScreen());

  // Biometric Face-ID Screen Buttons
  document.getElementById('cancelFaceAuthBtn')?.addEventListener('click', () => atm.cancelFaceLogin());
  document.getElementById('manualTriggerFaceScanBtn')?.addEventListener('click', () => atm.runFaceScanSequence());

  // Interactive ATM CCTV Camera Lens & Picture-in-Picture Monitor
  document.getElementById('atmCameraLensBtn')?.addEventListener('click', () => atm.toggleCctvMonitor());
  document.getElementById('closeCctvBtn')?.addEventListener('click', () => atm.toggleCctvMonitor(false));
  document.getElementById('cctvNightVisionToggle')?.addEventListener('click', () => {
    document.querySelector('.cctv-viewport')?.classList.toggle('night-vision');
    audio.playKeypadBeep(1600);
  });

  // Initialize Camera KYC Controller in New Account Modal
  if (typeof kycController !== 'undefined') {
    kycController.init();
  }

  // Cardless QR & OTP Controls
  document.getElementById('simulateAppScanBtn')?.addEventListener('click', () => atm.authorizeCardlessScan());
  document.getElementById('cardlessOtpSubmitBtn')?.addEventListener('click', () => atm.authorizeCardlessOtp());
  document.getElementById('cardlessBackBtn')?.addEventListener('click', () => atm.switchScreen('screenWelcome'));

  // Main Menu On-Screen Touch Items
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      if (action === 'balance') atm.openBalanceScreen();
      if (action === 'fastcash') atm.openFastCashScreen();
      if (action === 'withdraw') atm.openWithdrawScreen();
      if (action === 'deposit') atm.openDepositScreen();
      if (action === 'transfer') atm.openTransferScreen();
      if (action === 'statement') atm.openStatementScreen();
      if (action === 'pinchange') atm.openPinChangeScreen();
      if (action === 'exit') atm.ejectCard();
    });
  });

  // Balance Screen Buttons
  document.getElementById('printBalanceReceiptBtn')?.addEventListener('click', () => atm.printBalanceSlip());
  document.getElementById('balanceWithdrawBtn')?.addEventListener('click', () => atm.openWithdrawScreen());
  document.getElementById('balanceBackBtn')?.addEventListener('click', () => atm.switchScreen('screenMainMenu'));

  // Fast Cash Buttons
  document.querySelectorAll('.fastcash-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const amt = parseFloat(btn.getAttribute('data-amount'));
      if (amt) atm.executeFastCash(amt);
    });
  });
  document.getElementById('fastCashBackBtn')?.addEventListener('click', () => atm.switchScreen('screenMainMenu'));
  document.getElementById('fastCashCustomBtn')?.addEventListener('click', () => atm.openWithdrawScreen());

  // Custom Withdrawal Screen Controls
  document.querySelectorAll('.acc-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.acc-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      atm.selectedWithdrawAccount = pill.getAttribute('data-account');
    });
  });

  document.querySelectorAll('.chip-add').forEach(chip => {
    chip.addEventListener('click', () => {
      const add = parseInt(chip.getAttribute('data-add'));
      const cur = parseInt(atm.withdrawInput || '0');
      atm.withdrawInput = (cur + add).toString();
      atm.updateWithdrawInput();
      audio.playKeypadBeep(1100);
    });
  });

  document.getElementById('withdrawClearBtn')?.addEventListener('click', () => {
    atm.withdrawInput = '';
    atm.updateWithdrawInput();
    audio.playKeypadBeep(800);
  });

  document.getElementById('withdrawBackBtn')?.addEventListener('click', () => atm.switchScreen('screenMainMenu'));
  document.getElementById('withdrawConfirmBtn')?.addEventListener('click', () => atm.confirmCustomWithdrawal());

  // Deposit Screen Controls
  document.querySelectorAll('.deposit-tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.deposit-tab-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      atm.selectedDepositType = tab.getAttribute('data-deptype');
      
      document.querySelectorAll('.deposit-tab-pane').forEach(p => p.classList.remove('active'));
      if (atm.selectedDepositType === 'cash') {
        document.getElementById('depositCashPane').classList.add('active');
      } else {
        document.getElementById('depositChequePane').classList.add('active');
      }
    });
  });

  document.querySelectorAll('.counter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const denom = btn.getAttribute('data-denom');
      const isPlus = btn.classList.contains('plus');
      if (isPlus) {
        atm.depositCounts[denom]++;
      } else if (atm.depositCounts[denom] > 0) {
        atm.depositCounts[denom]--;
      }
      atm.updateDepositCounterDisplay();
      audio.playKeypadBeep(isPlus ? 1300 : 900);
    });
  });

  document.getElementById('depositBackBtn')?.addEventListener('click', () => atm.switchScreen('screenMainMenu'));
  document.getElementById('depositConfirmBtn')?.addEventListener('click', () => atm.confirmDeposit());

  // Transfer Screen Beneficiaries
  document.querySelectorAll('.ben-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.ben-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const acc = chip.getAttribute('data-acc');
      if (acc) {
        document.getElementById('transferTargetInput').value = acc;
      } else {
        document.getElementById('transferTargetInput').value = '';
        document.getElementById('transferTargetInput').focus();
      }
    });
  });

  document.getElementById('transferBackBtn')?.addEventListener('click', () => atm.switchScreen('screenMainMenu'));
  document.getElementById('transferConfirmBtn')?.addEventListener('click', () => atm.confirmTransfer());

  // PIN Change Screen
  document.getElementById('pinChangeBackBtn')?.addEventListener('click', () => atm.switchScreen('screenMainMenu'));
  document.getElementById('pinChangeConfirmBtn')?.addEventListener('click', () => atm.confirmPinChange());

  // Mini Statement Screen
  document.getElementById('statementPrintBtn')?.addEventListener('click', () => atm.printMiniStatementSlip());
  document.getElementById('statementBackBtn')?.addEventListener('click', () => atm.switchScreen('screenMainMenu'));

  // Success Screen
  document.getElementById('successPrintReceiptBtn')?.addEventListener('click', () => atm.printLastTransactionReceipt());
  document.getElementById('successAnotherTxBtn')?.addEventListener('click', () => atm.switchScreen('screenMainMenu'));
  document.getElementById('successEjectBtn')?.addEventListener('click', () => atm.ejectCard());

  // Ejected Screen
  document.getElementById('ejectedDoneBtn')?.addEventListener('click', () => atm.switchScreen('screenWelcome'));

  // Hardware Collect Cash & Tear Receipt
  document.getElementById('collectCashBtn')?.addEventListener('click', () => {
    const cashStack = document.getElementById('dispensedCashStack');
    if (cashStack) cashStack.classList.remove('active');
    audio.playEnterTone();
    showToast('Cash collected from dispenser slot.', 'success');
  });

  document.getElementById('tearReceiptBtn')?.addEventListener('click', () => {
    const paper = document.getElementById('ejectedReceiptPaper');
    if (paper) paper.classList.remove('active');
    audio.playReceiptPrinterSound();
    if (atm.lastReceiptData) {
      atm.openThermalReceiptModal(atm.lastReceiptData);
    }
  });

  // Companion Card Controls & Milestone 3 Security Wiring
  document.getElementById('insertSelectedCardBtn')?.addEventListener('click', () => atm.insertCard());
  document.getElementById('ejectCardManualBtn')?.addEventListener('click', () => atm.ejectCard());

  // Card Freeze / Lock Toggle with Immediate Session Invalidation
  document.getElementById('freezeCardToggle')?.addEventListener('change', (e) => {
    const card = state.getActiveCard();
    card.frozen = e.target.checked;
    state.saveState();
    updateDashboardUI();

    if (card.frozen) {
      clearTemporaryCvv('card frozen');
      announceA11y(`Card ${card.holder} is now FROZEN. All ATM operations are locked.`, 'assertive');
      showToast('Card FROZEN (Locked). All ATM transactions blocked.', 'error');

      // Immediate Freeze Reaction: Eject and clear session if this card is currently inserted
      if (atm.isCardInserted && (!atm.sessionCardId || atm.sessionCardId === card.id)) {
        atm.ejectCard('Security Alert: Card was frozen from Digital Companion. Session terminated.');
      }
    } else {
      announceA11y(`Card ${card.holder} is now UNFROZEN and operational.`, 'polite');
      showToast('Card UNFROZEN (Active). Ready for ATM transactions.', 'success');
    }
  });

  // Simulated Temporary CVV Controls (Milestone 3)
  document.getElementById('btnRevealCvv')?.addEventListener('click', handleRequestCvvReveal);
  document.getElementById('btnCloseCvvAuthModal')?.addEventListener('click', closeCvvAuthModal);
  document.getElementById('btnCancelCvvAuth')?.addEventListener('click', closeCvvAuthModal);
  document.getElementById('btnConfirmCvvAuth')?.addEventListener('click', verifyCvvAuthPin);
  document.getElementById('cvvAuthPinInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyCvvAuthPin();
    if (e.key === 'Escape') closeCvvAuthModal();
  });

  // Inactivity Warning Modal Actions (Milestone 3)
  document.getElementById('btnContinueSession')?.addEventListener('click', () => {
    atm.recordUserActivity();
  });
  document.getElementById('btnCancelSessionNow')?.addEventListener('click', () => {
    atm.ejectCard('Session ended by customer.');
  });

  // Meaningful user activity tracking on physical and simulated ATM elements
  ['keydown', 'mousedown', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, (e) => {
      const isAtm = e.target.closest('#atmMachineChassis') || 
                    e.target.closest('.atm-screen') || 
                    e.target.closest('.key-btn') || 
                    e.target.closest('.side-key') || 
                    e.target.closest('#inactivityWarningModal');
      if (isAtm) {
        atm.recordUserActivity();
      }
    }, { passive: true });
  });

  document.getElementById('intlAccessToggle')?.addEventListener('change', (e) => {
    const card = state.getActiveCard();
    card.intl = e.target.checked;
    state.saveState();
    showToast(`International ATM access ${card.intl ? 'Enabled' : 'Disabled'}.`, 'success');
  });

  document.getElementById('contactlessToggle')?.addEventListener('change', (e) => {
    const card = state.getActiveCard();
    card.contactless = e.target.checked;
    state.saveState();
    showToast(`Contactless pay ${card.contactless ? 'Enabled' : 'Disabled'}.`, 'success');
  });

  document.getElementById('userCardSelector')?.addEventListener('change', (e) => {
    state.data.activeCardId = e.target.value;
    state.saveState();
    clearTemporaryCvv('active wallet card switched');
    updateDashboardUI();
    if (atm.isCardInserted) {
      atm.ejectCard('Card switched in wallet. Please insert the new card.');
    }
    showToast('Active wallet card updated.', 'success');
  });

  // Reset Demo State (Guarded for Bank Officials Only)
  document.getElementById('resetDemoStateBtn')?.addEventListener('click', () => {
    if (!profileController.isOfficial()) {
      showToast('Restricted: Bank Official authentication required to reset system state.', 'error');
      profileController.openAuthModal();
      return;
    }
    if (confirm('Are you sure you want to reset all account balances, cards, and transaction records to original demo state?')) {
      state.resetState();
      updateDashboardUI();
      if (atm.isCardInserted) atm.ejectCard();
      atm.switchScreen('screenWelcome');
      showToast('Demo data restored successfully.', 'success');
    }
  });

  // Ledger Filter Buttons
  document.querySelectorAll('.filter-btn:not(.icon-only)').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTransactionLedger(btn.getAttribute('data-filter'));
    });
  });

  // Export CSV
  document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
    let csv = 'ID,Date,Type,Description,Amount,Account,Card,Ref\n';
    state.data.transactions.forEach(t => {
      csv += `"${t.id}","${t.timestamp}","${t.type}","${t.typeLabel}","${t.amount}","${t.account}","${t.cardUsed}","${t.ref}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_atm_statement_${Date.now()}.csv`;
    a.click();
    showToast('Transaction statement exported to CSV.', 'success');
  });

  // Currency Selector
  document.getElementById('currencySelect')?.addEventListener('change', (e) => {
    state.data.currency = e.target.value;
    state.saveState();
    updateDashboardUI();
    if (atm.currentScreen === 'screenBalance') atm.openBalanceScreen();
    showToast(`Currency changed to ${e.target.value}.`, 'success');
  });

  // Audio & Voice Toggles
  const soundBtn = document.getElementById('soundToggleBtn');
  soundBtn?.addEventListener('click', () => {
    audio.soundEnabled = !audio.soundEnabled;
    soundBtn.classList.toggle('active', audio.soundEnabled);
    soundBtn.innerHTML = audio.soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
    showToast(`Audio sound FX ${audio.soundEnabled ? 'Enabled' : 'Muted'}.`, 'success');
  });

  const voiceBtn = document.getElementById('voiceToggleBtn');
  voiceBtn?.addEventListener('click', () => {
    audio.voiceEnabled = !audio.voiceEnabled;
    voiceBtn.classList.toggle('active', audio.voiceEnabled);
    showToast(`Voice guidance ${audio.voiceEnabled ? 'Enabled' : 'Disabled'}.`, 'success');
    if (audio.voiceEnabled) audio.speak('Voice guidance enabled.');
  });

  // Theme Switcher
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', theme);
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      localStorage.setItem('nexus_atm_theme', theme);
    });
  });

  // Mobile View Switcher
  document.querySelectorAll('.view-tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.view-tab-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const view = tab.getAttribute('data-view');
      const kiosk = document.getElementById('kioskSection');
      const dash = document.getElementById('dashboardSection');
      if (view === 'kiosk') {
        kiosk.classList.add('view-active');
        dash.classList.remove('view-active');
      } else {
        dash.classList.add('view-active');
        kiosk.classList.remove('view-active');
      }
    });
  });

  // Dedicated Exit Dashboard Button (Digital Companion -> ATM Kiosk)
  document.getElementById('exitDashboardBtn')?.addEventListener('click', () => {
    document.querySelectorAll('.view-tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelector('.view-tab-btn[data-view="kiosk"]')?.classList.add('active');
    const kiosk = document.getElementById('kioskSection');
    const dash = document.getElementById('dashboardSection');
    kiosk?.classList.add('view-active');
    dash?.classList.remove('view-active');
    kiosk?.scrollIntoView({ behavior: 'smooth' });
    audio.playEnterTone();
    showToast('Returned to ATM Terminal.', 'info');
  });

  // Card Activation Modal Controls
  document.getElementById('openActivateCardModalBtn')?.addEventListener('click', openActivateModal);
  document.getElementById('closeActivateCardModalBtn')?.addEventListener('click', () => {
    document.getElementById('activateCardModal').classList.remove('active');
  });
  document.getElementById('cancelActivateCardBtn')?.addEventListener('click', () => {
    document.getElementById('activateCardModal').classList.remove('active');
  });
  document.getElementById('newCardHolder')?.addEventListener('input', updateNewCardPreview);
  document.getElementById('newCardTier')?.addEventListener('change', updateNewCardPreview);
  document.getElementById('newCardNetwork')?.addEventListener('change', updateNewCardPreview);
  document.getElementById('activateCardForm')?.addEventListener('submit', handleActivateCardSubmit);

  // Open New Account Registration Portal Controls (Bottom Left Corner + Welcome Screen)
  document.getElementById('openAccountCornerBtn')?.addEventListener('click', () => {
    openNewAccountModal();
  });
  document.getElementById('quickOpenAccountBtn')?.addEventListener('click', () => {
    openNewAccountModal();
  });
  document.getElementById('closeOpenAccountModalBtn')?.addEventListener('click', () => {
    document.getElementById('openAccountModal').classList.remove('active');
    resetOpenAccountDashboard();
  });
  document.getElementById('cancelOpenAccountBtn')?.addEventListener('click', () => {
    document.getElementById('openAccountModal').classList.remove('active');
    resetOpenAccountDashboard();
  });

  // Dedicated Reset Button for Open Account Dashboard
  document.getElementById('resetOpenAccountBtn')?.addEventListener('click', () => {
    resetOpenAccountDashboard();
    audio.playKeypadBeep(700);
    showToast('Open Account registration dashboard reset to fresh defaults.', 'info');
  });

  document.getElementById('regFullName')?.addEventListener('input', updateRegCardPreview);

  // Preference Card Option Selection
  document.querySelectorAll('.pref-card-option').forEach(cardOpt => {
    cardOpt.addEventListener('click', () => {
      document.querySelectorAll('.pref-card-option').forEach(c => c.classList.remove('active'));
      cardOpt.classList.add('active');
      const radio = cardOpt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      updateRegCardPreview();
    });
  });

  document.getElementById('openAccountForm')?.addEventListener('submit', handleOpenAccountSubmit);

  // Thermal Receipt Modal Controls
  document.getElementById('closeThermalReceiptModalBtn')?.addEventListener('click', () => {
    document.getElementById('thermalReceiptModal').classList.remove('active');
  });
  document.getElementById('printReceiptDirectBtn')?.addEventListener('click', () => {
    window.print();
  });
  document.getElementById('downloadReceiptBtn')?.addEventListener('click', () => {
    if (!atm.lastReceiptData) return;
    const r = atm.lastReceiptData;
    const receiptText = `
========================================
           NEXUS BANK ATM
 TERMINAL #NX-8840 • 750 7TH AVE, NY
 DATE/TIME: ${r.timestamp}
========================================
 TRANSACTION:  ${r.type}
 CARD NUMBER:  ${r.cardMasked}
 CARDHOLDER:   ${r.cardholder}
 ACCOUNT:      ${r.accountType}
 REF NUMBER:   ${r.ref}
----------------------------------------
 AMOUNT:       ${r.amount}
 ATM FEE:      ₹0.00
 AVAILABLE:    ${r.availBal}
 LEDGER BAL:   ${r.ledgerBal}
========================================
 THANK YOU FOR BANKING WITH NEXUS EXPRESS!
 24/7 SUPPORT: 1-800-NEXUS-ATM
========================================
    `;
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${r.ref}.txt`;
    a.click();
    showToast('Receipt saved to text file.', 'success');
  });

  // Card 3D Flip on Click
  document.getElementById('card3dWrapper')?.addEventListener('click', () => {
    document.getElementById('card3d').classList.toggle('flipped');
  });

  // =========================================================================
  // ADVANCED NEW MODULES EVENT LISTENERS
  // =========================================================================

  // 1. Two-Way Voice Command Assistant
  document.getElementById('voiceCommandMicBtn')?.addEventListener('click', () => {
    if (typeof voiceController !== 'undefined') {
      voiceController.toggleListening();
    }
  });

  document.getElementById('closeVoiceHudBtn')?.addEventListener('click', () => {
    if (typeof voiceController !== 'undefined') {
      voiceController.stopListening();
    }
    const hud = document.getElementById('voiceAssistantHud');
    if (hud) hud.style.display = 'none';
  });

  // 2. Optical Cheque OCR Simulator
  document.getElementById('simulateChequeOcrBtn')?.addEventListener('click', () => {
    atm.simulateChequeOcr();
  });

  // 3. Dynamic Cardless QR & CBDC Presets & App Simulators
  document.querySelectorAll('.qr-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const amt = parseInt(chip.getAttribute('data-qramt'));
      if (amt) atm.setCardlessQrAmount(amt);
    });
  });

  document.getElementById('simCbdcPayBtn')?.addEventListener('click', () => atm.simulateAppPay('Nexus e-Rupee (CBDC)'));
  document.getElementById('simGpayBtn')?.addEventListener('click', () => atm.simulateAppPay('Google Pay UPI'));
  document.getElementById('simPhonePeBtn')?.addEventListener('click', () => atm.simulateAppPay('PhonePe UPI'));
  document.getElementById('simPaytmBtn')?.addEventListener('click', () => atm.simulateAppPay('BHIM / Paytm UPI'));

  // 4. ATM Hardware Diagnostics & Cassette Vault Controls (Intercepted for Bank Officials)
  const handleDiagnosticsAccess = () => {
    if (profileController.isOfficial()) {
      openDiagnosticsModal();
    } else {
      showToast('Restricted: Bank Official authorization required to access Vault & Hardware Diagnostics.', 'info');
      profileController.openAuthModal();
    }
  };

  document.getElementById('atmStatusPill')?.addEventListener('click', handleDiagnosticsAccess);
  document.getElementById('navDiagnosticsBtn')?.addEventListener('click', handleDiagnosticsAccess);
  document.getElementById('closeDiagnosticsModalBtn')?.addEventListener('click', () => {
    document.getElementById('atmDiagnosticsModal')?.classList.remove('active');
  });
  document.getElementById('refillVaultBtn')?.addEventListener('click', refillCassettes);
  document.getElementById('refillPaperBtn')?.addEventListener('click', replacePaperRoll);
  document.getElementById('testDispenserMotorBtn')?.addEventListener('click', testDispenserMotor);

  // 5. Two Profiles Switcher & Bank Official Auth Event Listeners
  document.getElementById('profileUserBtn')?.addEventListener('click', () => {
    profileController.lockToUser();
  });

  document.getElementById('profileOfficialBtn')?.addEventListener('click', () => {
    if (profileController.isOfficial()) {
      showToast('Bank Official Profile already active.', 'info');
    } else {
      profileController.openAuthModal();
    }
  });

  document.getElementById('btnLockOfficial')?.addEventListener('click', () => {
    profileController.lockToUser();
  });

  document.getElementById('promptOfficialFromLedgerBtn')?.addEventListener('click', () => {
    profileController.openAuthModal();
  });

  // Bank Official Authentication Modal Controls
  document.getElementById('officialAuthForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pwd = document.getElementById('officialPasswordInput')?.value;
    profileController.authenticate(pwd);
  });

  document.getElementById('cancelOfficialAuthBtn')?.addEventListener('click', () => {
    profileController.closeAuthModal();
  });

  document.getElementById('closeOfficialAuthModalBtn')?.addEventListener('click', () => {
    profileController.closeAuthModal();
  });

  document.getElementById('toggleOfficialPwdVisibilityBtn')?.addEventListener('click', () => {
    const input = document.getElementById('officialPasswordInput');
    const icon = document.getElementById('toggleOfficialPwdIcon');
    if (!input || !icon) return;
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'fa-solid fa-eye-slash';
    } else {
      input.type = 'password';
      icon.className = 'fa-solid fa-eye';
    }
  });

  // Official Auth Mode Tabs & Biometric Controls
  document.getElementById('tabBtnPasscode')?.addEventListener('click', () => {
    profileController.switchAuthTab('passcode');
  });

  document.getElementById('tabBtnBiometric')?.addEventListener('click', () => {
    profileController.switchAuthTab('biometric');
  });

  document.getElementById('btnStartOfficerBioScan')?.addEventListener('click', () => {
    profileController.startOfficerBiometricScan();
  });

  document.getElementById('btnCancelOfficerBioScan')?.addEventListener('click', () => {
    profileController.stopOfficerBiometricScan();
  });

  // Technician shortcut: Ctrl+Alt+D (Prompts auth if not official)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && (e.key === 'd' || e.key === 'D')) {
      e.preventDefault();
      handleDiagnosticsAccess();
    }
  });
}

// =============================================================================
// 7. TWO-WAY INTERACTIVE VOICE COMMAND ASSISTANT CONTROLLER
// =============================================================================
class VoiceCommandController {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-IN';

        this.recognition.onstart = () => {
          this.isListening = true;
          this.updateUiState(true, 'Listening for voice command...');
          audio.playKeypadBeep(1400);
        };

        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase().trim();
          this.handleVoiceCommand(transcript);
        };

        this.recognition.onerror = (e) => {
          console.warn('Speech recognition error/cancelled:', e);
          this.stopListening();
        };

        this.recognition.onend = () => {
          this.stopListening();
        };
      } catch (err) {
        console.warn('Voice recognition initialization error:', err);
      }
    }
  }

  toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  startListening() {
    const hud = document.getElementById('voiceAssistantHud');
    if (hud) hud.style.display = 'flex';

    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        this.simulateVoicePrompt();
      }
    } else {
      this.simulateVoicePrompt();
    }
  }

  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }
    this.updateUiState(false);
  }

  updateUiState(listening, msg = '') {
    const micBtn = document.getElementById('voiceCommandMicBtn');
    if (micBtn) micBtn.classList.toggle('listening', listening);
    const hudTitle = document.getElementById('voiceHudTitle');
    if (hudTitle && msg) {
      hudTitle.innerHTML = `<i class="fa-solid fa-microphone"></i> ${msg}`;
    }
  }

  simulateVoicePrompt() {
    this.updateUiState(true, 'Voice Assistant Ready');
    showToast('Voice Assistant active! Try: "Fast cash 2000", "Check balance", "Deposit", "Eject"', 'info');
    setTimeout(() => {
      this.stopListening();
    }, 6000);
  }

  handleVoiceCommand(text) {
    if (typeof atm !== 'undefined') {
      atm.recordUserActivity();
    }
    showToast(`Voice Command: "${text}"`, 'info');
    const hudTitle = document.getElementById('voiceHudTitle');
    if (hudTitle) hudTitle.innerHTML = `<i class="fa-solid fa-check"></i> Processing: "${text}"`;

    const activeCard = state.getActiveCard();
    const isProtectedCommand = text.includes('fast cash') || text.includes('fastcash') || 
                               text.includes('balance') || text.includes('inquiry') ||
                               text.includes('deposit') || text.includes('withdraw') || 
                               text.includes('statement') || text.includes('pin');

    // 1. Authoritative freeze check for voice pathway
    if (activeCard.frozen && isProtectedCommand) {
      audio.playErrorTone();
      audio.speak('Transaction declined. Your card is frozen. Unfreeze it in the dashboard to proceed.');
      showToast('Voice Command Declined: Card is FROZEN.', 'error');
      announceA11y('Voice command declined: Card is frozen.');
      setTimeout(() => {
        const hud = document.getElementById('voiceAssistantHud');
        if (hud) hud.style.display = 'none';
      }, 2500);
      return;
    }

    // 2. Enforce session authentication before protected transaction execution
    if (text.includes('fast cash') || text.includes('fastcash')) {
      const match = text.match(/\d+/);
      const amt = match ? parseInt(match[0]) : 2000;
      if (!atm.isAuthenticated) {
        if (!atm.isCardInserted) atm.insertCard();
        audio.speak('Please authenticate with your PIN on the keypad first.');
        showToast('Please enter your 4-digit PIN to authorize fast cash.', 'info');
      } else {
        atm.executeFastCash(amt);
      }
    } else if (text.includes('balance') || text.includes('how much money') || text.includes('inquiry')) {
      if (!atm.isAuthenticated) {
        if (!atm.isCardInserted) atm.insertCard();
        audio.speak('Please authenticate with your PIN on the keypad first.');
        showToast('Please enter your 4-digit PIN to view balances.', 'info');
      } else {
        atm.openBalanceScreen();
        const bal = state.data.accounts.checking.balance;
        audio.speak(`Your checking account available balance is ${bal} rupees.`);
      }
    } else if (text.includes('deposit')) {
      if (!atm.isAuthenticated) {
        if (!atm.isCardInserted) atm.insertCard();
        audio.speak('Please authenticate with your PIN to make a deposit.');
        showToast('Please enter your 4-digit PIN to access deposits.', 'info');
      } else {
        atm.openDepositScreen();
      }
    } else if (text.includes('withdraw')) {
      if (!atm.isAuthenticated) {
        if (!atm.isCardInserted) atm.insertCard();
        audio.speak('Please authenticate with your PIN to withdraw cash.');
        showToast('Please enter your 4-digit PIN to withdraw cash.', 'info');
      } else {
        atm.openWithdrawScreen();
      }
    } else if (text.includes('statement') || text.includes('recent')) {
      if (!atm.isAuthenticated) {
        if (!atm.isCardInserted) atm.insertCard();
        audio.speak('Please authenticate with your PIN to view your mini statement.');
        showToast('Please enter your 4-digit PIN to view your statement.', 'info');
      } else {
        atm.openStatementScreen();
      }
    } else if (text.includes('eject') || text.includes('exit') || text.includes('cancel')) {
      atm.ejectCard('Voice Command: Session ended by customer.');
    } else if (text.includes('face') || text.includes('biometric') || text.includes('scan')) {
      atm.startFaceLogin();
    } else if (text.includes('cardless') || text.includes('qr') || text.includes('digital rupee')) {
      atm.openCardlessScreen();
    } else if (text.includes('account') || text.includes('register') || text.includes('open')) {
      openNewAccountModal();
    } else if (text.includes('cctv') || text.includes('camera')) {
      atm.toggleCctvMonitor();
    } else if (text.includes('pin') || text.includes('change')) {
      if (!atm.isAuthenticated) {
        if (!atm.isCardInserted) atm.insertCard();
        audio.speak('Please authenticate with your current PIN first.');
        showToast('Please enter your 4-digit PIN first.', 'info');
      } else {
        atm.openPinChangeScreen();
      }
    } else if (text.includes('receipt') || text.includes('print')) {
      atm.printLastTransactionReceipt();
    } else if (text.includes('vault') || text.includes('diagnostic')) {
      openDiagnosticsModal();
    } else {
      audio.speak('Command not recognized. Showing ATM menu.');
    }

    setTimeout(() => {
      const hud = document.getElementById('voiceAssistantHud');
      if (hud) hud.style.display = 'none';
    }, 2500);
  }
}

const voiceController = new VoiceCommandController();

// =============================================================================
// 8. ATM HARDWARE DIAGNOSTICS & CASSETTE VAULT CONTROLLER
// =============================================================================
function updateDiagnosticsUI() {
  if (!state.data.cassettes) {
    state.data.cassettes = { 500: 1840, 200: 1450, 100: 1920, 50: 980 };
  }
  const c = state.data.cassettes;
  const totalVal = (c[500] * 500) + (c[200] * 200) + (c[100] * 100) + (c[50] * 50);

  const liqEl = document.getElementById('vaultTotalLiquidity');
  if (liqEl) liqEl.textContent = `₹${totalVal.toLocaleString('en-IN')}.00`;

  // Cassette 1
  const pct500 = ((c[500] / 2000) * 100).toFixed(1);
  const fill500 = document.getElementById('c500Fill');
  if (fill500) fill500.style.width = `${pct500}%`;
  const badge500 = document.getElementById('c500NotesBadge');
  if (badge500) badge500.textContent = `${c[500].toLocaleString('en-IN')} / 2,000`;
  const val500 = document.getElementById('c500Value');
  if (val500) val500.textContent = `₹${(c[500] * 500).toLocaleString('en-IN')}`;
  const st500 = document.getElementById('c500Status');
  if (st500) st500.textContent = `${pct500 > 20 ? 'Optimal' : 'Low'} (${pct500}%)`;

  // Cassette 2
  const pct200 = ((c[200] / 2000) * 100).toFixed(1);
  const fill200 = document.getElementById('c200Fill');
  if (fill200) fill200.style.width = `${pct200}%`;
  const badge200 = document.getElementById('c200NotesBadge');
  if (badge200) badge200.textContent = `${c[200].toLocaleString('en-IN')} / 2,000`;
  const val200 = document.getElementById('c200Value');
  if (val200) val200.textContent = `₹${(c[200] * 200).toLocaleString('en-IN')}`;
  const st200 = document.getElementById('c200Status');
  if (st200) st200.textContent = `${pct200 > 20 ? 'Optimal' : 'Low'} (${pct200}%)`;

  // Cassette 3
  const pct100 = ((c[100] / 2000) * 100).toFixed(1);
  const fill100 = document.getElementById('c100Fill');
  if (fill100) fill100.style.width = `${pct100}%`;
  const badge100 = document.getElementById('c100NotesBadge');
  if (badge100) badge100.textContent = `${c[100].toLocaleString('en-IN')} / 2,000`;
  const val100 = document.getElementById('c100Value');
  if (val100) val100.textContent = `₹${(c[100] * 100).toLocaleString('en-IN')}`;
  const st100 = document.getElementById('c100Status');
  if (st100) st100.textContent = `${pct100 > 20 ? 'Optimal' : 'Low'} (${pct100}%)`;

  // Cassette 4
  const pct50 = ((c[50] / 1000) * 100).toFixed(1);
  const fill50 = document.getElementById('c50Fill');
  if (fill50) fill50.style.width = `${pct50}%`;
  const badge50 = document.getElementById('c50NotesBadge');
  if (badge50) badge50.textContent = `${c[50].toLocaleString('en-IN')} / 1,000`;
  const val50 = document.getElementById('c50Value');
  if (val50) val50.textContent = `₹${(c[50] * 50).toLocaleString('en-IN')}`;
  const st50 = document.getElementById('c50Status');
  if (st50) st50.textContent = `${pct50 > 20 ? 'Optimal' : 'Low'} (${pct50}%)`;

  // Paper roll
  const paper = state.data.paperRoll || 88;
  const paperEl = document.getElementById('telemetryPaperRoll');
  if (paperEl) paperEl.textContent = `${paper}% (~${Math.round(paper * 4.8)} Receipts Left)`;
}

function openDiagnosticsModal() {
  updateDiagnosticsUI();
  document.getElementById('atmDiagnosticsModal')?.classList.add('active');
  audio.playKeypadBeep(1600);
}

function refillCassettes() {
  state.data.cassettes = { 500: 2000, 200: 2000, 100: 2000, 50: 1000 };
  state.saveState();
  updateDiagnosticsUI();
  audio.playEnterTone();
  showToast('Vault Cassettes replenished to 100% capacity (₹20,50,000.00)', 'success');
}

function replacePaperRoll() {
  state.data.paperRoll = 100;
  state.saveState();
  updateDiagnosticsUI();
  audio.playReceiptPrinterSound();
  showToast('Thermal Receipt Paper roll replaced with fresh 100% roll.', 'success');
}

function testDispenserMotor() {
  audio.playCashMotorSound();
  showToast('Dispenser stepper motor test routine executed successfully.', 'info');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info');
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}


// =============================================================================
// 9. BOOTSTRAP APPLICATION
// =============================================================================
function bootstrapApplication() {
  try {
    // Load saved theme if any
    const savedTheme = localStorage.getItem('nexus_atm_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === savedTheme);
    });

    // Init currency in select
    const currSelect = document.getElementById('currencySelect');
    if (currSelect && state && state.data) currSelect.value = state.data.currency;

    // Initialize UI & Event Listeners
    updateDashboardUI();
    updateDiagnosticsUI();
    initEventListeners();
    if (typeof profileController !== 'undefined') {
      profileController.setProfile('user');
    }
  } catch (err) {
    console.error('Error during Nexus ATM bootstrap:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApplication);
} else {
  bootstrapApplication();
}

