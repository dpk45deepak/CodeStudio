<div align="center">

# 🚀 CodeStudio

> **An AI-powered code editor built for seamless cloud-assisted development.**

</div>

CodeStudio transforms your browser into a powerful development workspace. By combining Next.js, Monaco, and Ollama Cloud, it delivers intelligent code suggestions, interactive AI chat, and agent-style assistance through each user's configured cloud model.

---

## ✨ Key Features

- **💻 Modern Editing Experience:** Powered by Monaco for a robust, VS Code-like environment in your browser.
- **🧠 Ollama Cloud Chat:** Prompt enhancement and intelligent conversational assistance routed through your Ollama Cloud account.
- **⚡ Smart Code Suggestions:** Real-time playground coding powered by the model selected in Settings.
- **🔐 Private Credentials:** API keys are encrypted before they are stored in the database and are never returned to the browser.
- **🛠️ Robust Architecture:** Built on the Next.js App Router with a Prisma-ready backend and agent-style task routing.
- **🔐 Secure Access:** Integrated authentication and personalized dashboard structure.

---

## 🧰 Tech Stack

**Frontend:** Next.js | React | TypeScript | Tailwind CSS 
**Editor:** Monaco Editor  
**AI & Orchestration:** Ollama Cloud | LangChain & LangGraph  
**Backend & Database:** Prisma | NextAuth  

---

## 🚀 Quick Start

Get your cloud-assisted AI development environment up and running in minutes.

### 1. Configure Ollama Cloud

After signing in, open **Settings** and provide your Ollama Cloud API URL, API key, and model. The API key is encrypted server-side before being stored for future requests. Set `OLLAMA_CONFIG_ENCRYPTION_KEY` in your environment to a long random secret; `AUTH_SECRET` is used as a fallback.

### 2. Clone & Install Dependencies

```bash
git clone [https://github.com/dpk45deepak/CodeStudio.git](https://github.com/dpk45deepak/CodeStudio.git)
cd CodeStudio
npm install