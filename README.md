# 🌊 HabitFlow: AI-Powered Personal Data Science Platform

![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Gemini 2.5](https://img.shields.io/badge/Gemini_2.5-8E75B2?style=for-the-badge&logo=google-bard&logoColor=white)
![Client-Side ML](https://img.shields.io/badge/Client--Side_ML-FF6F61?style=for-the-badge)

> **A zero-backend wellness engine that combines Client-Side Linear Regression with Generative AI to predict burnout and correlate daily habits with mood.**

---

## ⚡ The Concept
Most habit trackers are just digital checklists. **HabitFlow** is a "Smart Mirror" for your productivity.

Instead of just storing data, it processes it locally using **mathematical correlation engines** and **AI Agents** to answer questions like:
> *"Does coding late at night actually lower my mood the next day?"*

## 🏗 Architecture & Tech Stack
This project utilizes a **Serverless SPA architecture**. All data science and AI inference happen in the browser or via stateless API calls, demonstrating a cost-effective, scalable design.

| Layer | Technology | Key Responsibility |
| :--- | :--- | :--- |
| **Frontend** | **React 19 + TypeScript** | UI State, Hooks, Context API |
| **Styling** | **Tailwind CSS** | "Mochi/Kawaii" Design System, Dark Mode |
| **Intelligence** | **Client-Side ML** | Custom Linear Regression & Pearson Correlation (No external libs) |
| **AI Agent** | **Google Gemini 2.5** | Voice Parsing (Speech-to-JSON) & Qualitative Coaching |
| **Persistence** | **LocalStorage / JSON** | Zero-Backend privacy-first storage with Export/Import |

---

## 🚀 Key Features

### 🧠 1. The "Brain" (Client-Side Data Science)
* **Burnout Predictor:** A custom regression engine runs in the browser to calculate a `Risk Score (0-10)` based on weighted factors (Sleep duration vs. Deep Work hours).
* **Correlation Engine:** Implements the **Pearson Correlation Coefficient** to mathematically prove relationships between your habits (e.g., `Coffee` ∝ `Anxiety`).

### 🗣️ 2. Voice-to-JSON Pipeline
* Users can speak naturally: *"I drank 3 coffees and coded for 5 hours."*
* The app uses **Gemini 2.5 Flash** to parse this unstructured audio transcript into strictly typed JSON data to update the charts automatically.

### 🎮 3. Gamification Profile
* **Generative Avatars:** Users describe a persona (e.g., *"A cyberpunk cat writing code"*), and Gemini Image Gen creates a unique vector-style sticker.
* **GitHub-Style Heatmap:** Visualizes consistency using a contribution graph.

---

## 🛠️ Installation & Local Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/liqi-05/habit-flow.git](https://github.com/liqi-05/habit-flow.git)
   cd habit-flow