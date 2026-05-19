# Samrub — Project Notes (for AI reference)

## Project Info
- Course: Gränssnittsutveckling, SYSM9, VT26, Newton
- Grade target: VG (Väl Godkänt)
- Deadline: June 5, 2026 | Presentation: June 4, 2026
- Theme: Thai food restaurant e-commerce
- Solo project, submit via GitHub

## Communication Rules
- Always respond in Thai
- Write all code in English

## Tech Stack
- Frontend: React + Vite + React Router DOM
- State: Context API (StoreContext)
- DB: json-server (port 3000) → will upgrade to Express (port 4000)
- Backend: Node.js + Express (VG requirement)
- Auth: JWT
- Icons: @iconify/react
- Fonts: Roboto Serif (body) + Carattere (logo) via Google Fonts
- Design: Figma (Desktop + Mobile)

## Figma File
https://www.figma.com/design/JobNEImbBdPiuFXbQtgFNf/Samrub

## Color Theme (from Figma)
- --grey: #565756
- --dark-grey: #303030
- --orange: #FFB639 (primary accent)
- --weak-yellow: #FFF3D6
- --dark-green: #162516
- --medium-green: #008E02
- --white: #ffffff
- --black: #1a1a1a
- Navbar/Footer background: rgba(25, 25, 25, 0.7)

## Font Sizes
Desktop: logo 70px, topic 40px, slogan 32px, label 25px, body 24px, button 20px
Mobile: logo 32px, topic 16px, slogan 14px, label 11px, body 10px

## Project Structure
```
Samrub/
├── client/                  (React + Vite)
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx         ✅ done
│   │   ├── App.jsx          ✅ done
│   │   ├── App.css          ✅ done
│   │   ├── index.css        ✅ done (global styles + CSS vars)
│   │   ├── context/
│   │   │   └── StoreContext.jsx  ✅ done
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx    ✅ done
│   │   │   │   └── Navbar.css   ✅ done
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.jsx    ✅ done
│   │   │   │   └── Footer.css   ✅ done
│   │   │   ├── FoodCategory/    ⏳ pending
│   │   │   ├── FoodDisplay/     ⏳ pending
│   │   │   └── FoodItem/        ⏳ pending
│   │   ├── pages/
│   │   │   ├── Home/            ⏳ pending
│   │   │   ├── Menu/            ⏳ pending
│   │   │   ├── Basket/          ⏳ pending
│   │   │   ├── Payment/         ⏳ pending
│   │   │   ├── Confirmation/    ⏳ pending
│   │   │   ├── Favorites/       ⏳ pending
│   │   │   ├── Login/           ⏳ pending
│   │   │   └── Register/        ⏳ pending
│   │   └── assets/
├── server/                  ⏳ pending (Node.js + Express)
│   ├── index.js
│   ├── routes/
│   └── db.json              ✅ done (28 food items)
├── docs/                    ⏳ pending
├── .gitignore               ✅ done
└── README.md                ⏳ pending
```

## StoreContext — Global State
File: client/src/context/StoreContext.jsx
URL: http://localhost:3000 (json-server, will change to 4000)
States: foodList, cartItems {id: qty}, favorites [], token ""
Functions: addToCart, removeFromCart, deleteFromCart, getTotalCartAmount, getTotalCartCount, toggleFavorite, isFavorite, clearCart
localStorage: saves token + favorites

## Navbar Specs (Figma)
- Height: 134px desktop / 80px mobile
- Background: rgba(25,25,25,0.7)
- Logo: font Carattere, 70px desktop / 32px mobile, color orange, position absolute center
- Icons desktop: 50×50px | Icons mobile: 20×20px
- Hamburger desktop: 50×50px | mobile: 30×25px
- Dropdown menu opens on hamburger click (not sidebar)
- Sign In → /login | Sign Out → clears token, goes to /

## Footer Specs (Figma)
- Desktop: 1440×201px, HORIZONTAL layout, gap 180px between sections
- Mobile: 390×158px, VERTICAL layout, gap 3px
- Background: rgba(25,25,25,0.7)
- Section A: "Open Hours" — Mondays-Fridays 11-15 17-21 / Saturdays-Sundays 13-21
  - Desktop: 24px Medium, Mobile: 10px Medium
- Section B: "Follow us:" label + Instagram, Facebook, TikTok icons
  - Desktop label: 24px Medium | Mobile label: 12px Bold
  - Desktop icons: 45×45px container | Mobile: 40×40px
  - TikTok special: orange background + black icon
- Icon gap: 19px

## db.json — Food Data
28 items, categories: Starter(2), MainCourse(14), SingleDish(5), Dessert(3), Set(4)
Fields: id, name, nameThai, description, price, category, image, popular

## VG Requirements Checklist
- [ ] Pages: Home, Product List, Cart, Payment, Confirmation, Login/Register
- [ ] Backend Node.js + Express with API endpoints
- [ ] JWT Authentication
- [ ] Validation + Status codes (200, 400, 404, 500)
- [ ] Login default: username "user" / password "password"
- [ ] Favorites list
- [ ] User registration (optional but app usable without it)
- [ ] Filter by category
- [ ] Cart: add/remove/change quantity
- [ ] Payment form (name, email, mobile) + card/Swish methods
- [ ] Responsive: Desktop + Mobile
- [ ] Figma design: Desktop + Mobile + Wireframes
- [ ] README + Project Analysis (1 A4, personal reflection)

## Teaching Style
- Explain step by step, wait for "ok/next" before continuing
- Explain each file line by line so student understands for oral exam
- Student must understand ALL code to explain during presentation
