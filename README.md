# 🌊 HabitHero: AI-Powered Personal Data Science Platform

![React 18](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Gemini 2.5](https://img.shields.io/badge/Gemini_2.5-8E75B2?style=for-the-badge&logo=google-bard&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

> **A smart wellness engine that combines Client-Side Data Science with Generative AI to predict burnout and correlate daily habits with mood.**

---

## ⚡ The Concept
Most habit trackers are just digital checklists. **HabitHero** is a "Smart Mirror" for your productivity.

Instead of just storing data, it processes it locally using **mathematical correlation engines** and **AI Agents** to answer questions like:
> *"Does coding late at night actually lower my mood the next day?"*

## 🏗 Architecture & Tech Stack
This project utilizes a **Serverless SPA architecture**. The Python `backend/` is optional; the core application runs entirely in the browser, connecting directly to AI and Database services.

| Layer | Technology | Key Responsibility |
| :--- | :--- | :--- |
| **Frontend** | **React 18 + TypeScript + Vite** | High-performance UI, Hooks, Context API |
| **Styling** | **Tailwind CSS** | "Dreamy/Kawaii" Design System, Dark Mode |
| **Intelligence** | **Client-Side ML** | Custom Pearson Correlation & Burnout Algorithms (No external libs) |
| **AI Agent** | **Google Gemini 2.5** | Daily Coaching, Voice Parsing & Generative Avatars |
| **Data** | **Supabase / LocalStorage** | Hybrid architecture: Syncs to Cloud if configured, falls back to Local for privacy/offline |

---

## 🚀 Key Features

### 🧠 1. The "Brain" (Data Science Engine)
* **Burnout Predictor:** A custom regression engine runs in the browser to calculate a `Risk Score (0-10)` based on weighted factors (Sleep duration vs. Deep Work hours).
* **Correlation Engine:** Implements the **Pearson Correlation Coefficient** to mathematically prove relationships between your habits (e.g., `Coffee` ∝ `Anxiety`).

### 🤖 2. Gemini AI Coach
* **Daily Advice:** Analyzes your stats (Sleep, Mood, Coding) and gives personalized, empathetic advice.
* **Offline Mode:** Gracefully degrades to a rule-based system if the API is unavailable.

### 🎮 3. Gamification Profile
* **Generative Avatars:** Users describe a persona (e.g., *"A cyberpunk cat writing code"*), and Gemini Image Gen creates a unique vector-style sticker.
* **Activity Heatmap:** Visualizes consistency using a GitHub-style contribution graph.

---

## 🛠️ Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/liqi-05/habit-tracker.git
cd habit-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the root directory:
```bash
touch .env
```
Add your keys (Request a key from [Google AI Studio](https://aistudiocdn.com/apikey)):
```env
# Required for AI Features
VITE_API_KEY=your_gemini_api_key_here

# Optional: For Cloud Sync (Supabase)
# Leave empty to use LocalStorage mode
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.
