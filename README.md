# 🛒 ShareWell - Membership-Based E-Commerce and OMS
A full-stack order management system with XP tiers, equity rewards and admin tooling.

##Overview
Sharewell is a full-stack e-commerce platform modeled after Costco-style membership stores but enhanced with gamified progression, XP-based tiers, and fractional equity rewards.
It features:
  * Customer shopping experience (browse → view → cart → checkout)
  * XP accumulation + tier logic (Fresh → Market → Family → Reserve)
  * Admin dashboard for order + inventory management
  * Secure login for both customers and admin users
  * Real-time cart and order creation flow
  * Order history & receipt tracking
  * A full backend API (Node + Express + PostgreSQL)
  * A React/Vite frontend with contexts for Auth + Cart

This README serves as the technical report for the project, describing architecture, flows, roadblocks, and data models.

##Architecture Overview
###Frontend
  * React and Vite
  * Context for Authentication and Cart
  * Pages for entire user and admin flow
  * Components for navigation, product cards and layout
###Backend
  * Node.js and Express
  * REST API
  * Modular controllers and services
  * Logic (XP calculations, Tier logic, Equity accumulation)
###Database
  * PostgreSQL (on Supabase)
  * Tables include:
       * Customers
       * Products
       * Orders
       * Order_Items
       * XP_Transactions
       * Equity_Records
       * Admin_Users

##Project Structure
```
sharewell/
  client/
    public/
      favicon.png
    src/
      assets/
        icons/
        logo/
        products/
        productImages.js
      components/
        Layout.jsx
        NavBar.jsx
        ProductCard.jsx
      context/
        AuthContext.jsx
        CartContext.jsx
      pages/
        AdminDashboardPage.jsx
        CartCheckoutPage.jsx
        HomePage.jsx
        LoginPage.jsx
        OrderHistoryPage.jsx
        ProductDetailPage.jsx
        ProductsPage.jsx
      styles/
        admin.css
        auth.css
        cart.css
        fonts.css
        globals.css
        home.css
        orders.css
        products.css
      App.jsx
      Main.jsx
    .env
    index.html
    package.json
        
  server/
    src/
      app.js
      server.js
      db/
        index.js
      controllers/
        adminController.js
        customersController.js
        ordersController.js
        productsController.js
      routes/
        admin.js
        customers.js
        orders.js
        products.js
      services/
        xpService.js
        equityService.js
```

###Roadblocks
| Issues | Solutions |
|---|---|---|
| Cart and order logic required linking many tables | Implemented modular controllers and a unified checkout service | 
| XP & tier progression required dynamic recalculation | Created xpService.js to compute XP and tier in one call | 
| React image imports failing | Created a productImages.js registry that maps names to imports |


###How to Run Locally
  * Install dependencies
    ```
    cd server && npm install
    cd ../client && npm install
    ```
  * Environment variables (.env)
    ```
    DATABASE_URL=postgres://...
    VITE_API_URL=http://localhost:3000
    ```
  * Run Backend (or skip)
    ```
    cd server
    npm run dev
    ```
  * Run Frontend (runs both front and backend)
    ```
    cd client
    npm run dev
    ```

Server runs at  ` http://localhost:3000 `
Client runs at ` http://localhost:5173 `

###Conclusion
Sharewell demonstrates a full-stack e-commerce system with a complete Order Management System, real XP & equity reward logic, admin management capabilities, and clean React/Express/Postgres architecture.

In future could include:
  * Full inventory management system
  * Invite-based referrals for bonus XP
  * Email receipts + notifications
  * Stripe payment integration

