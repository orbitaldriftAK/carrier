# Carrier 
A sleek, multi-theme, keyboard-friendly note-taking app with custom StarCraft-inspired aesthetics.

##  Overview

**Carrier** is a web-based note management tool featuring dynamic theme switching, keyboard-based navigation, and full CRUD functionality backed by a local server. Built with a sci-fi aesthetic in mind, Carrier isn't just another notes app — it's designed to feel like a command terminal inside a Protoss capital ship.

Carrier is:
- Fast, responsive, and fully styled with custom UI/UX polish
- Designed with multi-mode support: **Carrier (Protoss), Templar (Dark Templar), Orbital (Terran)**
- Built using vanilla JavaScript, HTML, CSS and a lightweight Node.js backend

---

##  Features

-  Create, edit, delete, and pin notes
-  Persistent storage via local server
-  Real-time search filter
-  Theme toggle with animated transitions
-  Styled with immersive, game-inspired textures and colors
-  Responsive keyboard handling for power users

---

##  Visual Themes

Each mode immerses the user in a sci-fi-inspired environment:


| **Blue** Protoss Carrier - Psionic plating and crystalline glow 
| **Purple** Dark Templar Cloak - Shimmering stealth texture with deep shadows 
| **Orange-Gray** Terran Orbital Command - Battle-worn plating with glowing orange seams 

---

##  Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **Backend**: Node.js with Express.js
- **Storage**: In-memory (via backend), fallback to `localStorage`
- **Design**: Custom themes with CSS transitions, overlays, and textures

---

##  Folder Structure

```
carrier/
│
├── index.html             # Main interface
├── styles.css             # Themed styles and layout
├── app.js                 # Frontend logic & interactivity
├── server.js              # Backend API (Node + Express)
├── notes.json             # Optional backup storage file
├── /textures              # Custom background images
│   ├── carrier-theme.jpg
│   ├── dark-templar.jpg
│   └── orange-terran.png
└── /public                # (Optional) Public assets
```

---

##  How to Run Locally

1. **Clone this repo**  
   ```bash
   git clone https://github.com/orbitaldriftAK/carrier.git
   cd carrier
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Start the server**  
   ```bash
   node server.js
   ```

4. **Open the app**  
   Navigate to `http://localhost:3000` in your browser.

---

##  Status

 **Completed**  
Carrier is fully functional and portfolio-ready. Future enhancements may include:
- Authentication and user accounts
- Export to PDF or markdown
- Syncing across devices

---



