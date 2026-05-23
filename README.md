# BEXA Studio | Premium Multilingual Creative Agency & Profile Ecosystem

Welcome to BEXA Studio—a state-of-the-art digital agency website and advanced profile management platform. The application is styled to mirror top-tier international SaaS interfaces (like Apple, Linear, and Vercel), featuring fluid micro-animations, glassmorphism overlays, and fully localized routes.

---

## 🚀 Architectural & Technological Highlights

This platform is engineered using next-generation frontend frameworks and robust server-rendered schemas:
*   **Next.js 16.2.6 (Turbopack):** Standard static-site generation (SSG) combined with dynamic server rendering (SSR) for high page Speeds.
*   **Tailwind CSS v4 (Custom Class-based Dark Mode):** Handled via a custom `@custom-variant dark` utility, guaranteeing complete dark/light theme synchronization with `next-themes` and eliminating browser contrast washed-out states.
*   **Framer Motion 11:** Fluid layout transitions, organic floating elements, scroll-animations, and elastic modal springs.
*   **Next i18n Routing:** Dynamic segment translations (`/en`, `/ru`, `/uz`) loaded instantly without hydration delays.
*   **Local Database Fallback:** Built on Prisma schema models coupled with a secure local JSON database cache (`data/db.json`) for auditing user settings, security logs, and portfolio indices.

---

## 🛠️ Visual & Functional Batch Enhancements

We have completed five key batch visual and functional upgrades:

### 1. Unified Dark Mode Default (Anti-Flicker Engineering)
*   **The Challenge:** React hydration on route transitions unmounts and remounts layouts. If `:root` styles default to light mode, the screen flashes bright white before `next-themes` applies the dark class.
*   **Our Solution:** 
    1. Adjusted `globals.css` so `:root` variables contain **Cinematic Cyber-Navy Dark Mode by default** (background `#020617`).
    2. Scoped light mode Slate-Silver variables to `.light`.
    3. Disabled transition flashes on mounts using `disableTransitionOnChange={true}` in the localized layout `ThemeProvider`.
*   **Result:** Absolutely fluid route shifting with zero bright white flashes!

### 2. About Story Timeline & Expanded Portfolio
*   **2026 Timeline:** Extended BEXA Studio's story timeline in `about/page.tsx` from 2018 up to the **2026 AI-Agentic Mastery milestone**. Added corresponding translation tokens to all dictionary files (`en`, `ru`, `uz`).
*   **Creative Portfolio Grid:** Expanded `data/mockData.ts` to feature **8 high-fidelity, high-contrast creative works** (Aura, Apex, Zenith Edge, Helios Corp, Lumina OS) using functional Unsplash graphic assets that render flawlessly on the frontend.

### 3. Dynamic News Pagination & Data Expansion
*   **Content Expansion:** Populated `mockData.ts` with **10 detailed and creative news items** mapping modern design trends, Tailwind CSS v4 variables, and Edge Server-Rendering.
*   **Dynamic Slicing Logic:** Refactored `news/page.tsx` to dynamically slice news elements (6 articles per page) and generate exact page indicator buttons dynamically from computed total pages.
*   **Auto-Reset Integration:** Added a React hook to automatically reset the active page index to `1` whenever search queries or category filters are updated.

### 4. Simplified & Responsive Contact Yandex Map
*   **Responsive Aspect Ratio:** Replaced the static `aspect-[21/9]` class. The map now scales from a tall, readable aspect ratio (**`aspect-[4/3]`**) on mobile screens to a sleek, expansive aspect ratio (**`aspect-[21/9]`**) on widescreen tablets and desktops.
*   **Marker Clean-Up:** Removed user location pins, loading states, and simulated manual tracking buttons, simplifying the Yandex Map widget parameter to show **one single corporate office pin** for BEXA Studio (Uzinfocom).

### 5. Floating AI Chatbot linked to Telegram Bot API
*   **Interactive FAB Trigger:** Designed and coded a holographic squircle FAB button (`components/AIChatbot.tsx`) that morphs on hover (`rounded-[20px] hover:rounded-[15px]`), layered with dynamic rotating `Bot` vectors and a pulsing outer glowing neon halo.
*   **Responsive Boundaries:** Chat panel uses responsive viewport-aware boundaries (`w-[calc(100vw-32px)] sm:w-[400px] max-h-[calc(85vh-80px)]`) so it adapts on mobile screens.
*   **Telegram Server Dispatch:** Wire up user inquiries directly to the backend Server Action `sendTelegramMessageAction` in `actions/adminActions.ts` to dispatch messages to the Telegram Bot via the secure REST endpoint.
*   **Local AI Simulator:** Instantly answers client questions in the active locale (English, Russian, or Uzbek) with localized studio guidelines.

---

## ⚙️ Environment Configurations (`.env.local`)

To activate standard secure features, duplicate `.env.example` into `.env.local` and define the following variables:

```env
# Database connection string
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/uportfolio?schema=public"

# Auth JWT Secret key
AUTH_SECRET="secure-random-auth-jwt-secret-key-bexa-studio-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Social Authentication - Google
GOOGLE_CLIENT_ID="google-oauth-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="google-oauth-client-secret-key"

# Social Authentication - GitHub
GITHUB_CLIENT_ID="github-oauth-client-id"
GITHUB_CLIENT_SECRET="github-oauth-client-secret-key"

# Real-time WebSockets - Pusher
PUSHER_APP_ID="pusher-app-id"
PUSHER_KEY="pusher-key-value"
PUSHER_SECRET="pusher-secret-value"
PUSHER_CLUSTER="ap2"

# Notification relays - SMTP
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=2525
SMTP_USER="smtp-username"
SMTP_PASSWORD="smtp-password"

# Telegram Bot Configurations
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
TELEGRAM_CHAT_ID="your-telegram-chat-id"
```

---

## 🛠️ Step-by-Step Command Playbook

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm.cmd run dev
# dev server starts on http://localhost:3000
```

### 3. Build & Compile Production Bundles
```bash
npm.cmd run build
```

This compiles static site generation routes (SSG) and dynamic server pathways, compiling all 76 localized layout paths flawlessly.

### 4. Run Production Server
```bash
npm.cmd start
```

---

## 🚀 GitLab Deployment Guidelines

To push the codebase to your remote GitLab repository, run the following command sequence in your terminal:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add GitLab remote origin (replace with your repository url)
git remote add origin https://gitlab.com/Rakhmatovdev/uportfolio.git

# 3. Stage all upgrades and visual assets
git add .

# 4. Commit changes with a detailed log
git commit -m "feat: premium UI/UX redesign, dynamic news pagination, responsive contact map, and floating AI chatbot with Telegram integration"

# 5. Push to main master branch
git push -u origin main
```
