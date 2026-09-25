# 🌻 NeuroConnect DK

> **A sensory-friendly multilingual community platform for immigrant parents of children with autism and special needs in Denmark.**

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38b2ac.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange.svg?logo=firebase)](https://firebase.google.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Interactive%20Maps-green.svg?logo=leaflet)](https://leafletjs.com/)

---

## 🌟 Why NeuroConnect DK?

Navigating the Danish social and pedagogical system (*PPR, VISO, Barnets Lov, Folkeskolen*) is complex—and even harder when Danish is not your native language.

**NeuroConnect DK** bridges this gap by providing:
- 🇩🇰 **Local Kommune Connection**: Filter discussions, advice, and local events across all 98 Danish municipalities (*København, Aarhus, Albertslund, Odense, etc.*).
- 🌐 **1-Click Multilingual Translation**: Read and write posts in your native language (*English, Dansk, العربية, Українська, Türkçe, Soomaali, Polski, فارسی, and more*).
- 🌻 **Sunflower Lanyard (Solsikkesnoren) Map**: An interactive map pinpointing sensory-friendly locations, quiet museum hours, low-noise playgrounds, and parent support circles.
- 📚 **Danish System Glossary (Knowledge Hub)**: Clear, accessible explanations of Danish municipal terminology with copyable phrases ready to send to your case worker (*sagsbehandler*).
- 🧠 **Sensory-Friendly Design**: Muted sage-and-neutral tones, zero jarring animations, and a dedicated **Calm Mode** toggle.

---

## 🚀 Features

### 1. Community Discussion Channels (Forums)
- Categorized discussions:
  - **PPR & VISO Navigation** (assessments, appeals, timelines)
  - **School & Education** (*specialklasser*, resource hours, school inclusion)
  - **Sensory-Friendly Places** (fenced parks, quiet playgrounds)
  - **Local Meetups** (parent circles, coffee catch-ups)
- Instant translation toggle preserving key Danish administrative terms.
- Threaded replies, reactions, and municipality tags.

### 2. Interactive Events & Places Map
- Powered by Leaflet & CartoDB Positron (clean, low-sensory, no API keys required).
- Filter by Kommune and toggle **Sunflower Lanyard Recognized 🌻** venues.
- Synchronized side-by-side list view with one-click map centering.
- "Add Event" modal to share parent-organized meetups.

### 3. Danish System Knowledge Hub (Glossary)
- In-depth, plain-language guides on:
  - **PPR** (*Pædagogisk Psykologisk Rådgivning*)
  - **VISO** (*Den Nationale Videns- og Specialrådgivningsorganisation*)
  - **Børnefaglig undersøgelse** (*Barnets Lov § 20*)
  - **Dækning af merudgifter** (*Barnets Lov § 86*)
  - **Tabt arbejdsfortjeneste** (*Barnets Lov § 87*)
  - **Aflastning** (*Barnets Lov § 84*)
  - **Tolk** (Statutory right to free professional interpreter)
  - **Bisidder** (Statutory right to bring a support person to meetings)
- Includes phonetic pronunciation tips and copy-paste Danish phrases.

### 4. User Profiles & Authentication
- Google Sign-In and Email/Password authentication.
- Instant Guest Mode for frictionless exploration.
- Customizable profile: Danish Kommune selection and preferred language.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React icons
- **Database & Auth**: Google Firebase (Firestore & Firebase Authentication)
- **Maps**: Leaflet with OpenStreetMap / CartoDB tiles (zero API keys required)
- **Design Principles**: Low-sensory UI, WCAG AA contrast compliance, responsive mobile layout

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/neuroconnect-dk.git
cd neuroconnect-dk
```

### 2. Install dependencies
```bash
npm install
```

### 3. Firebase Configuration
Create a file named `firebase-applet-config.json` in the root folder (or rename from `.env`):
```json
{
  "projectId": "your-firebase-project-id",
  "appId": "your-firebase-app-id",
  "apiKey": "your-firebase-web-api-key",
  "authDomain": "your-project.firebaseapp.com",
  "firestoreDatabaseId": "(default)",
  "storageBucket": "your-project.firebasestorage.app",
  "messagingSenderId": "your-sender-id"
}
```

> **Note**: If you don't configure Firebase immediately, the application includes automatic fallback to offline seed data and guest demo mode so you can test the UI right away!

### 4. Start the development server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 5. Build for production
```bash
npm run build
```
This generates the optimized production build in the `dist/` directory.

---

## 🌐 Free Deployment Options

You can host this entire application for **$0/month**:

### Option A: GitHub Pages (Free)
1. In `vite.config.ts`, set `base: '/neuroconnect-dk/'` (replace with your repo name).
2. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```
3. Add deployment scripts in `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Run:
   ```bash
   npm run deploy
   ```

### Option B: Vercel (Free & Recommended)
1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset: **Vite**.
5. Click **Deploy**. Vercel provides a free global CDN, automatic deployments on push, and free SSL!

### Option C: Firebase Hosting (Free)
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login and initialize:
   ```bash
   firebase login
   firebase init hosting
   ```
   - Public directory: `dist`
   - Single-page app: `Yes`
3. Build and deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

## 🔒 Firestore Security Rules

Deploy the included hardened security rules:
```bash
firebase deploy --only firestore:rules
```
The project includes pre-configured attribute-based access control (ABAC) rules in `firestore.rules`.

---

## 🤝 Contributing

Contributions from parents, special education professionals, and developers are warmly welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/sensory-improvement`).
3. Commit your Changes (`git commit -m 'Add translation support for Somali'`).
4. Push to the Branch (`git push origin feature/sensory-improvement`).
5. Open a Pull Request.

---

## 📜 Disclaimer & Legal Note

NeuroConnect DK is a peer-led community initiative. Information provided in the Danish System Glossary is for educational and peer-support purposes only and does not constitute formal legal counsel. Always consult your municipal case worker (*sagsbehandler*), PPR office, or an authorized attorney for binding decisions.

---

## 📄 License

Distributed under the Apache-2.0 License. See `LICENSE` for details.
