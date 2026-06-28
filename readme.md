# 🚀 FinTech Ledger & Core Wallet Management System

A production-ready, high-integrity corporate backend system engineered with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**. This architecture focuses on strict financial transaction auditing, automated ledger aggregation, advanced authorization flows, robust middleware layers, and failsafe structural models.

---

## 🏗️ System Architecture & Engineering Highlights

This backend adheres strictly to the **"Fat Models, Skinny Controllers"** architectural philosophy, ensuring enterprise-grade isolation between business rules, intercepting middlewares, and the HTTP routing layer.

### Core Architecture Components:
* **Custom Middleware Stack:** Intercepts incoming network payloads for security auditing, authentication parsing, and automated validation rules before hitting the controller lifecycle.
* **Strict Schema Integrity:** Leveraging pre-save hooks (e.g., automated hashing, state locks) to enforce atomic execution layers.
* **Dual-Layer Email Notifications:** Fully dynamic authentication pipeline equipped with highly stylized responsive HTML & fall-back plain-text layout dispatchers (SMTP/OAuth2 integrated).
* **Token-Based Cookie Authentication:** Stateless authorization sequence utilizing signed JSON Web Tokens (JWT) bound securely via server-side `HttpOnly` configurations to mitigate XSS exposure.
* **Ledger Mutation Safeguards:** Custom algorithmic checks (`preventLedgerModification`) attached to data pipelines preventing historical double-entry tampering.

---

## 🛠️ Technology Stack & Specifications

* **Runtime Core:** Node.js v24+
* **Application Framework:** Express.js (RESTful Blueprint)
* **Database Management:** MongoDB via Mongoose ODM
* **Security & Authentication:** Cryptographic bcryptjs, JSON Web Tokens (JWT)
* **Utility Engines:** dotenv, cookie-parser, nodemailer

---

## ⚙️ Directory Structure

```text
├── src/
│   ├── config/          # Environment bindings & database connections
│   ├── controllers/     # Slim HTTP request-response pipeline handlers
│   ├── middlewares/     # Request interception, auth guarding, & data validation
│   ├── models/          # Extended Mongoose Blueprints (hooks, methods & schemas)
│   ├── routes/          # Decoupled interface routing layers
│   └── utils/           # Shared components (Email templates, helper utilities)
├── .env                 # Application secrets (Excluded via .gitignore)
├── .gitignore           # Global suppression manifests
├── server.js            # Monolithic bootstrap runtime entry point
└── package.json         # Dependencies and lifecycle scripts