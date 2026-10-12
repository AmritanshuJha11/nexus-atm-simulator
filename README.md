# NexusBank ATM & Digital Banking Simulator

A hyper-realistic, interactive ATM Kiosk and Digital Banking web application built with modern web technologies, AI Biometrics, and synthesized Web Audio API acoustics.

---

## 🌟 Key Features

### 1. Photorealistic ATM Machine Kiosk
- **Official NexusBank Brand Identity**: Integrated authentic glowing emerald-to-cyan 3D squircle emblem and modern gradient wordmark across browser favicon, navigation header, ATM marquee, interactive welcome screen, 3D debit cards, and thermal receipts.
- **Physical ATM Chassis**: Brushed metallic finish, chamfered bevels, glowing status LEDs, interactive security camera lens, and EMV Level 2 certification badges.
- **Interactive Security Camera & CCTV Feed**: Click the top security camera lens to launch a live Picture-in-Picture CCTV surveillance feed with scanlines, timestamp overlay, night-vision phosphor toggle, and 30 FPS indicator.
- **Dynamic Display Screen**: Multi-screen interactive state engine with scanline overlays, high-contrast typography, and live terminal clock.
- **Tactile Metallic Keypad**: 3D extruded buttons with realistic button press animations, audio feedback, and full computer keyboard support (`0-9`, `Enter`, `Backspace`/`Delete`, `Escape`).
- **Side Function Keys (F1–F8)**: 8 physical screen-aligned buttons dynamically mapped to every on-screen menu option.
- **Motorized Card Reader**: Animated EMV chip card insertion and auto-ejection with LED status indicator.
- **Motorized Cash Dispenser**: Animated bills fanning out with denomination breakdown and an interactive "Collect Cash" action.
- **Thermal Receipt Printer**: Animated paper slip feeding out of the slot with one-click "Tear Receipt" and direct printable modal.
- **Deposit Slot**: Accepts cash bundles and cheques with live denomination counter and optical scanner.

### 2. Advanced Biometrics, AI & Accessibility
- **✨ Biometric Face-ID Authentication (Cardless Face Login)**:
  - 1-click **"Biometric Face-ID Login"** on the ATM welcome screen or side key F2.
  - Live optical scanner HUD with oval target guide, 68-point facial landmark mesh tracking, and real-time ledger cross-referencing.
  - Automatically verifies cardholder identity and authenticates straight into the main banking menu without a PIN.
- **✨ Two-Way Interactive Voice Command Assistant (Speech-to-Text)**:
  - Click the **Microphone icon** in the top navigation or use voice assistance to speak hands-free commands.
  - Natural speech comprehension for: *"Fast cash 2000"*, *"Check balance"*, *"Deposit funds"*, *"Withdraw cash"*, *"Mini statement"*, *"Change PIN"*, *"Cardless cash"*, *"Eject card"*, *"CCTV feed"*, etc.
  - Visual floating waveform HUD with real-time speech feedback.
- **✨ Active Liveness & Anti-Spoofing Verification (ISO/IEC 30107-3)**:
  - 3-step interactive liveness test (Eye blink detection, micro-movement / head tilt verification, 99.8% depth signature check) preventing 2D photo spoofing attacks.

### 3. Core ATM Banking Operations
- **Balance Inquiry**: Live breakdown of Available Balance vs. Ledger Balance across Checking and High-Yield Savings accounts with instant currency conversion (INR ₹, USD $, EUR €, GBP £, JPY ¥, CAD C$).
- **Fast Cash**: One-click quick dispensing for ₹500, ₹1,000, ₹2,000, ₹5,000, ₹10,000, and ₹20,000.
- **Custom Withdrawal**: Custom amount entry in multiples of ₹50/₹100/₹200/₹500 with denomination preference selector (Mixed notes, Large ₹500s only, Small ₹100s only).
- **Daily Withdrawal Limit Safeguard**: Real-time daily limit tracker (₹25,000/day default).
- **Cash Counting & Motor Sound Simulation**: Pure Web Audio synthesizer creates authentic note counter clicking and motor hum.
- **Cash Deposit**: Interactive bill counter for ₹500, ₹200, ₹100, and ₹50 notes with instant balance crediting.
- **✨ Smart Cheque Optical OCR & MICR Scanner**:
  - Interactive laser optical scanning simulation with MICR band decoding (`⑆408219⑆ 110002014⑆ 000234⑈ 10`).
  - Auto-extracts cheque number, issuing bank, and amount into deposit fields.
- **✨ CBDC (Digital Rupee e₹) & Dynamic UPI 2.0 QR Withdrawal**:
  - Dynamic QR withdrawal with preset chips (₹500, ₹1,000, ₹2,000, ₹5,000) and live 60-second refreshing token timer.
  - Instant mobile payment simulation with Nexus e-Rupee CBDC, Google Pay, PhonePe, and BHIM/Paytm UPI apps.
- **Fund Transfer / Fast Pay**: Immediate transfer to beneficiary accounts or UPI IDs with transfer memos and reference numbers.
- **PIN Management**: Update your 4-digit card PIN with validation.
- **Mini-Statement**: Recent transactions table in on-screen thermal tape format with print capability.

### 4. ATM Hardware Diagnostics & Cassette Vault Monitoring
- **✨ Technician Vault Telemetry Modal (`Ctrl+Alt+D` or click top ATM status pill)**:
  - **Cassette 1 (₹500 Notes)**: Live note inventory (e.g. 1,840 / 2,000 notes) & capacity bar.
  - **Cassette 2 (₹200 Notes)**: Live note inventory (e.g. 1,450 / 2,000 notes) & capacity bar.
  - **Cassette 3 (₹100 Notes)**: Live note inventory (e.g. 1,920 / 2,000 notes) & capacity bar.
  - **Cassette 4 (₹50 Notes)**: Live note inventory (e.g. 980 / 1,000 notes) & capacity bar.
  - **Dynamic Dispenser Sync**: Every cash withdrawal decrements the exact physical notes from the cassettes in real time.
  - **Thermal Printer Paper Level**: Real-time remaining percentage and receipt counter.
  - **Hardware Health Sensors**: Anti-skimming jam sensor, vault lock, operating temperature, and encrypted host network latency.
  - **Technician Actions**: "Replenish All Cassettes (100%)", "Replace Thermal Paper Roll", and "Test Dispenser Motor".

### 5. Digital Banking Companion & Virtual Card Studio
- **3D Flipping Debit Card**: Interactive 3D card with EMV chip, contactless antenna, magnetic stripe, **biometric KYC photo portrait**, and customizable CVV.
- **✨ New Customer Registration & Live Webcam Photo KYC**:
  - **Live Photo KYC / Video Selfie**: Real-time webcam integration with oval target alignment, 3-2-1 countdown, mechanical camera shutter flash, and biometric photo stamping.
  - Fallback instant verified biometric security personas (Cyber Nomad, VIP Executive, Global Citizen, Everyday Saver).
  - Smart lifestyle & preference auto-allocation engine:
    - ✈️ *Global Jetsetter / Traveler*: Auto-assigns **Obsidian Platinum Card** (0% FX fee, ₹50,000 daily limit).
    - 👑 *VIP Wealth & High Spender*: Auto-assigns **Titanium Gold Card** (Airport Lounge access, ₹1,00,000 daily limit).
    - ⚡ *Tech & Cyber Enthusiast*: Auto-assigns **Cyber Neon Card** (Instant Virtual WebPay & Crypto rewards).
    - 🐷 *Everyday Saver & Cashback*: Auto-assigns **Minimalist Emerald Card** (5% cash back rewards).
- **Card Security Controls**: Instant Freeze/Unfreeze toggle, International ATM access toggle, and Contactless pay toggle.
- **Live Transaction Ledger**: Complete history with categorized badges (Withdrawal, Deposit, Transfer, PIN Change), receipt viewer, filter tabs, and CSV export.
- **Audio Synthesizer Engine**: Zero external audio dependencies—pure Web Audio API synthesizing realistic key beeps, cash motor whirs, card clicks, camera shutter clicks, biometric radar sweeps, and thermal printing sounds.
- **Multi-Currency Support**: Real-time conversion between INR (₹), USD ($), EUR (€), GBP (£), JPY (¥), and CAD (C$).
- **Multi-Theme Engine**: Cyber Dark (Default), Neon Blue, Clean Light, and Retro Green CRT ATM.

---

## ⌨️ Keypad & Keyboard Shortcuts

| Key | ATM Action |
|---|---|
| `0` – `9`, `00` | Input numbers into PIN or custom withdrawal fields |
| `Enter` / `Return` | Confirm PIN / Submit Transaction / Enter |
| `Backspace` / `Delete` | Clear PIN / Amount buffer |
| `Escape` | Cancel transaction and return to previous screen |
| `F1` – `F8` | Physical side keys mapped directly to corresponding on-screen options |
| `Ctrl + Alt + D` | Open ATM Hardware Diagnostics & Cassette Vault modal |

---

## 🚀 How to Run Locally

1. Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari).
2. Or serve it via any static web server:
   ```bash
   python -m http.server 3000
   ```
3. Visit `http://localhost:3000` to experience the full ATM simulation!ash
   npx serve .
   ```
3. Enjoy the full ATM and banking simulation experience!
