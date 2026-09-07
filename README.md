<div align="center">

# 🚀 CodeStudio

> **An AI-powered code editor built for seamless cloud-assisted development.**

</div>

CodeStudio transforms your browser into a development workspace. By combining Next.js, Monaco, WebContainers, Ollama Cloud, and Gemini, it delivers inline code suggestions, live previews, persistent AI chat, and agent-style assistance through each user's encrypted provider configuration.

---

## ✨ Key Features

- **💻 Modern Editing Experience:** Powered by Monaco for a robust, VS Code-like environment in your browser.
- **🧠 Gemini Agent Workflows:** Architect, Debugger, Refactorer, and Sentinel agents for design, fixes, refactoring, and security reviews, with Ollama fallback.
- **⚡ Ollama Inline Suggestions:** Real-time playground coding powered by the user's selected Ollama model.
- **🧠 Persistent Agent Memory:** Chat history is stored per user and durable project context is reused across sessions.
- **🌐 Live Playground Previews:** WebContainer previews adapt to static HTML, Vite, Next.js, TutorialKit, Angular, Express, and other starters.
- **🧩 Starter Templates:** React, Next.js, Express, Angular, Web Platform, Vite React TypeScript, TutorialKit, TypeScript, and JavaScript.
- **🔐 Private Credentials:** API keys are encrypted before they are stored in the database and are never returned to the browser.
- **🛠️ Robust Architecture:** Built on the Next.js App Router with a Prisma-ready backend and agent-style task routing.
- **🔐 Secure Access:** Integrated authentication and personalized dashboard structure.

---

## 🧰 Tech Stack

**Frontend:** Next.js | React | TypeScript | Tailwind CSS 
**Editor:** Monaco Editor  
**AI & Orchestration:** Ollama Cloud | Google Gemini | LangChain & LangGraph  
**Backend & Database:** Prisma | NextAuth  

---

## 🚀 Quick Start

Get your cloud-assisted AI development environment up and running in minutes.

### 1. Configure AI Providers

After signing in, open **Settings** and provide your Ollama Cloud URL, API key, and model for inline suggestions. Add a Google AI Studio Gemini API key and model for Agent workflows. Provider keys are encrypted server-side before being stored. Set `OLLAMA_CONFIG_ENCRYPTION_KEY` to a long random secret; `AUTH_SECRET` is used as a fallback.

### 2. Clone & Install Dependencies

```bash
git clone [https://github.com/dpk45deepak/CodeStudio.git](https://github.com/dpk45deepak/CodeStudio.git)
cd CodeStudio
npm install