# 🌌 Organic Nebula Heart

A mesmerizing animated canvas visualization featuring a pulsating nebula core with dynamic color transitions, shockwave effects, and organic noise-driven shapes.

![Organic Nebula Animation](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite) ![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

---

## ✨ Features

- **Heartbeat Animation** - Rhythmic pulsation with customizable beat power
- **Dynamic Color Themes** - Cycles through Pink → Purple → Violet → Blue
- **Rare Emerald Theme** - 5% chance on each pulse
- **Shockwave Effects** - Expanding contour rings on beats
- **Organic Shapes** - 3D Perlin noise-driven boundaries
- **Layered Rendering** - Gas layers, dust particles, soft highlights

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI component framework |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Canvas API** | 2D rendering engine |
| **Perlin Noise** | Procedural organic shapes |

---

## 📁 Project Structure

```
Nebula heart/
├── src/
│   ├── components/
│   │   └── LivingHeart.jsx   # Main animated canvas component
│   ├── utils/
│   │   └── noise.js          # 3D Perlin noise implementation
│   ├── constants/
│   │   └── themes.js         # Color themes & configuration
│   ├── App.jsx               # Application entry point
│   ├── main.jsx              # React root mount
│   └── index.css             # Tailwind imports & global styles
├── index.html                # HTML entry with Google Fonts
├── vite.config.js            # Vite + Tailwind plugin config
├── package.json              # Dependencies & scripts
└── .gitignore                # Excludes node_modules, dist
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Dev server runs at **http://localhost:5173/**

---

## ⚙️ Configuration

Edit `src/constants/themes.js` to customize:

```javascript
export const CONFIG = {
  POINTS: 140,           // Shape resolution
  BASE_RADIUS: 130,      // Core size (px)
  BEAT_POWER: 12,        // Pulse intensity
  BEAT_SPEED: 3.5,       // Heartbeat rate
  RARE_THEME_CHANCE: 0.05 // Emerald probability
};
```

---

## 📜 License

MIT
