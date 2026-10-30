# Full-Stack E-Commerce & Community Blog Application

[![Node.js](https://img.shields.io/badge/Node.js-v18.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-v4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![Render](https://img.shields.io/badge/Hosted%20on-Render-blue.svg)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A lightweight, high-performance full-stack web application combining an online store with a developer community blog platform. Built with vanilla ES6+ JavaScript on the client side and an Express/MongoDB architecture on the backend.

## 🚀 Live Demo & Repository

- **Live Application:** [https://complete-full-stack-ecommerce-and-blog.onrender.com/](https://complete-full-stack-ecommerce-and-blog.onrender.com/)
- **GitHub Repository:** [https://github.com/ShabbarTemkar/complete-full-stack-ecommerce-and-blog-application](https://github.com/ShabbarTemkar/complete-full-stack-ecommerce-and-blog-application)

## ✨ Core Features

- **Storefront & Product Catalog:** Real-time search, category filtering, and product grids.
- **In-Memory Cart & Modal Checkout:** Slide-over cart drawer with dynamic price totals and order placement.
- **Community Blog Platform:** Article submission form with validation and live technical feed.
- **Single-Page Application (SPA) UX:** Instant tab switching between Shop and Blog without full page reloads.
- **Persistent Cloud Database:** Mongo Atlas collections for `products`, `orders`, and `posts`.

## 📁 Repository Structure

```text
complete-full-stack-ecommerce-and-blog-application/
├── models/
│   ├── Order.js       # Order schema with embedded line item snapshots
│   ├── Post.js        # Blog post schema with length validations
│   └── Product.js     # Product catalog schema
├── public/
│   ├── css/
│   │   └── style.css  # Responsive Flexbox/Grid layouts & overlay modal styles
│   ├── js/
│   │   └── app.js     # DOM handlers, fetch API clients, and cart state
│   └── index.html     # SPA HTML structure with shop & blog sections
├── routes/
│   ├── orders.js      # Order creation & retrieval endpoints
│   ├── posts.js       # Blog publishing endpoints
│   └── products.js    # Product retrieval & search endpoints
├── .env.example       # Environment variables template
├── package.json       # Project dependencies & scripts
└── server.js          # Express app entry point & static file routing
