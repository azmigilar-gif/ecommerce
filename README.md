# 🛒 E-Commerce Shopping Cart System

A modern, full-featured e-commerce shopping cart application built with **Laravel**, **React**, and **Tailwind CSS**.

## ✨ Features

### 🛍️ Buyer Features

-   Browse products with real-time stock information
-   Add items to cart with quantity controls
-   Update cart items on the fly
-   One-click checkout with automatic stock deduction
-   Order confirmation page with detailed summary
-   Real-time cart count indicator

### 📧 Email Notifications

-   **Low Stock Alerts** - Automatic email when product stock ≤ 10
-   **Daily Sales Reports** - Email with comprehensive sales summary
-   **HTML Email Templates** - Professional, easy-to-read formats
-   **Log-based System** - All emails logged to `storage/logs/laravel.log`

### 🎛️ Admin Dashboard

-   View today's sales stats
-   View total revenue and order count
-   **One-click button** to send daily report (perfect for video demo!)
-   No need to wait for 23:59 scheduler

### 📦 Admin Product Management

-   View all products with current stock levels
-   Add new products to the store
-   Edit existing products (name, price, stock, description)
-   Delete products from the catalog
-   Real-time inventory management

---

## 🚀 Quick Start (5 minutes)

### 1️⃣ Setup Database

```bash
php artisan migrate
php artisan db:seed
```

### 2️⃣ Start Services (4 terminals)

**Terminal 1: Laravel Server**

```bash
php artisan serve
# Open: http://localhost:8000
```

**Terminal 2: Vite Dev Server**

```bash
npm run dev
```

**Terminal 3: Queue Worker (IMPORTANT!)**

```bash
php artisan queue:work database
```

**Terminal 4: Optional - Scheduler**

```bash
php artisan schedule:work
```

---

## 👤 Test Accounts

| Email                  | Password | Role  |
| ---------------------- | -------- | ----- |
| `test@example.com`     | password | Buyer |
| `admin@ecommerce.test` | password | Admin |

---

## 📋 How It Works

### Add to Cart → Checkout Flow

```
1. Browse products
2. Add to cart (quantity check)
3. Update quantities or remove items
4. Checkout
5. Stock decreases automatically
6. If stock ≤ 10 → Low stock notification sent
7. Order confirmation displayed
```

### Daily Sales Report (Manual)

```
1. Login as admin (admin@ecommerce.test)
2. Click "Admin" in navbar
3. Click "Send Report Now" button
4. Email generated and logged
5. View in Terminal 3 or storage/logs/laravel.log
```

---

## 📧 Email System

All emails are logged to **`storage/logs/laravel.log`**

**View emails:**

```bash
tail -f storage/logs/laravel.log | grep -i "mailing"
```

**Types of emails:**

1. **Low Stock Notification** - Sent when stock ≤ 10
2. **Daily Sales Report** - Sent manually or at 23:59

---

## 📁 Project Structure

```
app/Http/Controllers/
├── CartController.php              # Cart management
├── CheckoutController.php          # Order processing
├── ProductController.php           # Product listing
├── DashboardController.php         # User dashboard
├── AdminDashboardController.php    # Admin dashboard & reports
├── AdminProductController.php      # Admin product management
├── ProfileController.php           # User profile management

app/Jobs/
├── SendLowStockNotification.php    # Low stock job
├── SendDailySalesReport.php        # Sales report job

app/Mail/
├── LowStockNotification.php
├── DailySalesReport.php

resources/js/Pages/
├── Products/Index.jsx              # Product listing
├── Cart/Index.jsx                  # Shopping cart
├── Orders/Success.jsx              # Order confirmation
├── Admin/Dashboard.jsx             # Admin sales dashboard
├── Admin/Products.jsx              # Admin product management
├── Dashboard.jsx                   # User dashboard
├── Profile/                        # User profile pages

routes/web.php                       # All endpoints
```

---

## 🎯 Key Endpoints

| Method | Path                        | Purpose                  |
| ------ | --------------------------- | ------------------------ |
| GET    | `/products`                 | List all products        |
| GET    | `/products/{id}`            | View product details     |
| POST   | `/cart`                     | Add to cart              |
| PUT    | `/cart/{id}`                | Update quantity          |
| DELETE | `/cart/{id}`                | Remove item              |
| GET    | `/cart/count`               | Get cart total           |
| POST   | `/checkout`                 | Place order              |
| GET    | `/admin/dashboard`          | Admin sales dashboard    |
| POST   | `/admin/send-daily-report`  | Trigger report           |
| GET    | `/admin/products`           | Admin product list       |
| POST   | `/admin/products`           | Create product           |
| PUT    | `/admin/products/{id}`      | Update product           |
| DELETE | `/admin/products/{id}`      | Delete product           |

---

## 🎬 Perfect for Video Demo

✅ **Complete workflow** - Browse → Add → Checkout → Report  
✅ **Admin features** - Manage products and view sales in real-time  
✅ **No waiting for scheduler** - Click button instead  
✅ **See jobs process** - Terminal shows real-time updates  
✅ **Emails in logs** - Visible immediately in log file  
✅ **Professional UI** - Tailwind CSS styling

---

## 📊 Tech Stack

-   **Backend:** Laravel 11
-   **Frontend:** React 19 + Inertia.js
-   **Database:** MySQL
-   **Queue:** Database Driver
-   **Mail:** Log Driver
-   **Styling:** Tailwind CSS 3
-   **Icons:** Lucide React
-   **Build:** Vite + Breeze

---

## 📖 Documentation

-   **`QUICK_START.md`** - Setup in 5 minutes
-   **`SETUP_GUIDE.md`** - Detailed configuration
-   **`TESTING_GUIDE.md`** - Feature testing guide
-   **`DEVELOPMENT_CHECKLIST.md`** - Technical reference

---

## ✅ Status

**Status:** Production Ready ✅  
**Last Updated:** December 29, 2025  
**All Features:** Complete and Tested

---

**Ready to test? Start with Terminal 1!** 🚀

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

-   [Simple, fast routing engine](https://laravel.com/docs/routing).
-   [Powerful dependency injection container](https://laravel.com/docs/container).
-   Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
-   Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
-   Database agnostic [schema migrations](https://laravel.com/docs/migrations).
-   [Robust background job processing](https://laravel.com/docs/queues).
-   [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

-   **[Vehikl](https://vehikl.com)**
-   **[Tighten Co.](https://tighten.co)**
-   **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
-   **[64 Robots](https://64robots.com)**
-   **[Curotec](https://www.curotec.com/services/technologies/laravel)**
-   **[DevSquad](https://devsquad.com/hire-laravel-developers)**
-   **[Redberry](https://redberry.international/laravel-development)**
-   **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
