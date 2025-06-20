# Cookie Marshal AI Agent — Privacy Policy


Cookie Marshal is designed to block cookie banners without compromising your privacy. Every part of the AI logic runs entirely in your browser — no data is collected, stored, or transmitted. This is a fully local, offline AI agent.

---

## ✅ What Cookie Marshal Does

- Blocks cookie banners using intelligent local AI
- Learns banner patterns with Q-learning (locally)
- Stores temporary detection patterns for performance
- Operates 100% within your browser
- Requires no internet connection or account

---

## ❌ What Cookie Marshal Does Not Do

- Does not collect personal data (emails, location, IPs)
- Does not track your browsing behavior or activity
- Does not send any data to external servers
- Does not use cloud-based AI services
- Does not include third-party analytics or scripts

---

## 🔍 Local-Only AI Processing

### What’s Processed:
- DOM scanning to identify banners
- Text classification for button intent
- Complexity analysis to determine strategy
- Reinforcement learning (Q-learning) to optimize decisions

### How It Works:
- All computations are local (JavaScript in-browser)
- No calls to external AI providers
- Patterns cached per domain for 24 hours max
- All storage is in Chrome/Firefox localStorage only

---

## 🧠 Example Local Storage (Simplified)

```json
{
  "patterns_example.com": {
    "buttons": ["reject all", "decline"],
    "selectors": [".cookie-banner"],
    "timestamp": 1700000000000
  },
  "qlearning_data": {
    "ruleBased": 0.91,
    "aiPrimary": 0.95,
    "hybrid": 0.93
  }
}
