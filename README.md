# 🚀 Xiteb Jobs Practical Task

## 📄 Overview
This project was developed as part of the Xiteb job practical assignment. It focuses on functionality, form validation, and proper data submission via API, using a modern frontend/backend stack.

---

## ⏱️ Time Taken
> 🕒 Approximately ** 15 hours** including development, validation, bug fixing, and testing.

---

## 🖥️ Frontend (React + Vite)

- ✅ Hosted on GitHub Pages  
  🔗 **Live URL:** [https://rashenthemiya.github.io/xitebtest/](https://rashenthemiya.github.io/xitebtest/)

### 🔧 Setup Instructions (Local)

```bash
git clone <your-frontend-repo-url>
cd <frontend-folder>
npm install

# Create a .env file with the following:
VITE_API_BASE_URL=https://api.rashen.me/

npm run dev
````

---

## 🛠️ Backend (Laravel 10 + MySQL)

* ✅ Hosted on AWS EC2 (Free Tier)
* 🔐 API is protected with JWT-based auth
* 🔗 Base URL: `https://api.rashen.me/`

### 📦 Run Backend Locally (optional for testing)

1. **Unzip the backend source if zipped**
2. Then run:

```bash
cd <backend-folder>
composer install

# Setup environment variables
cp .env.example .env

# Update .env with your DB, JWT secret, etc.
php artisan key:generate
php artisan migrate

php artisan serve
```

Then update your frontend `.env` to:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## ✅ Key Features Implemented

* 📦 **Add Prescription Form**

  * Delivery address (required)
  * Delivery date & time (required)
  * Notes (optional)
  * Upload multiple prescription images

* 🛡️ **Validations**

  * All required fields must be filled before submission
  * Minimum **one image** required
  * Each image must be **under 50KB**
  * Displays error messages before API is called
  * Shows success alert on successful submission

* 🔐 Auth protected using JWT tokens

* ✅ Confirmation modal before submitting

---

## 🔁 Example Test Flow

1. Fill all fields
2. Upload images < 50KB each (JPG/PNG)
3. Confirm submission in modal
4. View success message or relevant errors

---

## 🧪 Testing Tools (Optional)

* Postman Collection Available (on request)
* Demo credentials / auth token (can be shared privately if needed)

---

## 📂 Folder Structure

---

## 🙋 Notes

* Backend is currently deployed on an **AWS EC2 free-tier instance** for demo/testing only.
* Feel free to unzip and run locally to verify validations and functionality.

---

## 📬 Contact


📧 **[rashenrashen4@gmail.com](mailto:rashenrashen4@gmail.com)**

```

---


