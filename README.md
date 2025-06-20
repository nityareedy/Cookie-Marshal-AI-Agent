# Cookie Marshal AI Agent

> **An autonomous browser extension that detects and rejects cookie consent banners using pattern recognition and Q-learning — all locally, without compromising performance or privacy.**

---

## 🚀 Overview

Cookie Marshal is a browser-based AI agent built to automatically decline cookie banners across websites, prioritizing **speed**, **privacy**, and **practical AI** over heavy general-purpose models.

This project is a case study in applying **narrow AI** techniques for highly specialized tasks — specifically, intelligently managing cookie consent prompts using a mix of pattern matching, DOM scanning, and reinforcement learning.

---

## 🧠 Key AI Features

### ✔️ Domain-Specific Intelligence

- **Q-Learning Agent**: Learns and adapts optimal rejection strategies over time.
- **Multi-Signal Detection**: CSS selector matching, keyword analysis, and DOM structure awareness.
- **Language-Aware Text Classification**: Recognizes reject/accept buttons in 8+ languages.
- **Complexity-Based Flow Control**: Chooses between rule-based and AI-based logic based on banner complexity.

### ✔️ Why Not LLMs?

| Criteria       | Cookie Marshal AI | LLM-based Solutions |
|----------------|-------------------|----------------------|
| Processing     | Sub-200ms         | 1–5s (API latency)   |
| Privacy        | 100% local        | API calls, tracking  |
| Reliability    | Deterministic     | Variable             |
| Resources      | < 50MB            | GBs (local) / costly (API) |
| Offline Access | Yes               | No                   |

Cookie Marshal avoids LLMs intentionally — not due to limitation, but to **optimize for speed, privacy, and task relevance**.

---

## 🔧 How It Works

### 1. **Detection Phase**

- Identifies cookie banners using:
  - 40+ CSS selectors
  - Text patterns in 8 languages
  - Framework-specific signatures (OneTrust, CookieBot, etc.)
  - Shadow DOM and iframe scanning
  - Delayed content tracking (AJAX)

### 2. **Analysis Phase**

- Evaluates banner complexity:
  - **Simple (0–30%)**: Rule-based logic
  - **Moderate (30–70%)**: Rule + AI with confidence comparison
  - **Advanced (70%+)**: AI-first with rule fallback

- Performs:
  - Contextual button classification
  - DOM structure scoring
  - Q-learning for feedback-based optimization

### 3. **Action Phase**

- Executes strategy based on structure:
  - One-click “Reject All”
  - Navigates multi-step preferences
  - Automatically deselects non-essential cookies
  - Submits consent decisions

### 4. **Learning Phase**

- Stores successful patterns (locally)
- Updates Q-values based on outcomes
- Optimizes strategy selection for known domains

### 5. **Privacy & Security**

- No data transmission
- No analytics, telemetry, or tracking
- Functions offline, no API keys
- Secure permissions and sandboxed code

---

## 🧪 Example Flow (Real Use)

1. Detects banner → OneTrust style
2. Classifies as complex (75%)
3. Enters preference panel → disables all optional cookies
4. Saves preferences
5. Learns pattern for future visits

Total time: ~2–4 seconds

---

## 📊 Expected Performance

| Category                  | Success Rate |
|---------------------------|--------------|
| Simple Banners            | 70–85%       |
| OneTrust / CookieBot      | 85–95%       |
| Multi-Step Preferences    | 85–95%       |
| Multi-Language Detection  | 65–80%       |
| Complex Sites             | 50–70%       |
| False Positives           | < 5%         |

---

## 🌍 Language Support

Supports cookie keywords in:

English, German, French, Spanish, Italian, Dutch, Polish, Portuguese  
(+ automatic fallback to English patterns when needed)

---

## 🛠️ Manual Installation

### For Chrome / Edge

1. Download or clone this repo.
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the project folder

### For Firefox

1. Open `about:debugging`
2. Click **This Firefox**
3. Click **Load Temporary Add-on**
4. Choose `manifest.json` from this folder

---

## 🔐 Browser Compatibility

| Browser   | Supported | Notes                        |
|-----------|-----------|------------------------------|
| Chrome    | ✅         | Full feature support         |
| Firefox   | ✅         | Full feature support         |
| Edge      | ✅         | Chromium-based               |
| Safari    | 🟡         | Limited extension support    |
| Opera     | ✅         | Chromium-based               |
| Brave     | ✅         | Fully supported              |

---

## 🎓 Project Motivation

Inspired by real-world demand for automatic cookie rejection, this project explores how **purpose-built AI** can outperform overengineered LLM systems when constraints like speed, privacy, and UX matter most.

---

## ⚖️ License & Disclaimer

- **MIT License**
- No guarantees provided
- Use at your own risk
- Educational project, not a commercial product
- Compliant with GDPR and CCPA guidelines (by design)
- Always review laws in your jurisdiction before use
