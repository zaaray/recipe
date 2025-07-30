# 🧑‍🍳 Cookbook

A minimalist recipe aggregator that lets users paste in any recipe URL and instantly view a clean, distraction-free version of the recipe — no ads, no fluff. Logged-in users can save their favorite recipes into customizable collections. Built as a learning project using the MERN stack.

---

## 🚀 Features (MVP)

- ✅ Paste a recipe URL to extract the **clean recipe text**
- ✅ Extracts title, ingredients, instructions, yield, and image (if available)
- ✅ Clean parsing from structured JSON-LD metadata
- ✅ Google OAuth sign-in
- ✅ Save recipes into **collections** (like Pinterest boards)
- ✅ Default "Favorites" collection
- ✅ View all saved recipes (deduplicated)

---

## 🛠️ Tech Stack

- **Frontend**: React (TBD)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Parsing**: axios + cheerio for HTML scraping
- **Auth**: Google OAuth 2.0
- **Deployment**: TBD

---

## 🧩 Folder Structure (WIP)

/backend
├── models/ # Mongoose schemas
├── utils/ # Parsing logic (parser.js)
├── config/ # DB connection
├── server.js # Express app entry point
/frontend (TBD)

## 📦 Installation (WIP)

```bash
git clone https://github.com/yourusername/cookbook.git
cd cookbook
npm install
npm run dev

