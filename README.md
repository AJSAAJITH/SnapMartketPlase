# 🛒 SnapMarket - Real-Time Multi-Vendor Marketplace

SnapMarket is a modern, high-performance Multi-Vendor Marketplace application built with **Laravel** on the backend and **React** on the frontend, seamlessly tied together using **Inertia.js** to deliver a blazing-fast Single Page Application (SPA) experience.

The core highlight of this platform is its robust, real-time messaging system powered natively by **Laravel Reverb (WebSockets)**, allowing instant communication between buyers and sellers with live badge counts and active inbox updates.

---

## ✨ Key Features

* **Real-Time Messaging System:** Instant delivery of messages, dynamic sidebar unread counts, and real-time inbox card updates without requiring a page refresh.
* **Inertia.js SPA Architecture:** Combines the fluid user experience of React with the robust security, routing, and controller layer of Laravel.
* **Secure Authentication:** Powered by Laravel Fortify with native support for passwordless authentication via Passkeys.
* **Modern & Responsive UI:** Crafted beautifully using Tailwind CSS v4, Radix UI primitives, and Lucide React icons, ensuring a flawless experience across all mobile and desktop devices.
* **Instant Toasts:** Implements global, elegant live notifications via Sonner.

---

## 🛠️ Tech Stack & Architecture

This application leverages the latest cutting-edge tools in modern web development:

### Backend (PHP 8.3+)
* **Laravel 13.x** - Core MVC Framework.
* **Laravel Reverb** - High-speed, first-party WebSockets server for real-time capabilities.
* **Inertia Laravel (v3.0)** - Server-side adapter to render React components directly from controllers.
* **Laravel Fortify** - Front-end agnostic authentication backend.

### Frontend (TypeScript)
* **React 19 & TypeScript** - UI declaration and type-safe components.
* **@inertiajs/react (v3.0)** - Client-side state and SPA routing.
* **Laravel Echo & Pusher-JS** - Client-side abstraction layer (`@laravel/echo-react`) utilized to listen to structural WebSocket channels.
* **Tailwind CSS v4** - Next-generation utility-first CSS framework for styles.
* **Radix UI / Headless UI** - Unstyled, accessible primitives for components like Dropdowns, Dialogs, and Select menus.

---

## 🚀 Local Installation Guide

Follow these straightforward steps to set up and run this project on your local development machine:

### Prerequisites
Ensure you have the following installed:
* PHP 8.3 or higher (via Laragon, XAMPP, or native)
* Composer
* Node.js & NPM
* MySQL or PostgreSQL Database

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/snap-market.git](https://github.com/your-username/snap-market.git)
cd snap-market