<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
 -->

# 🚐 Epic Journey Rentals

Epic Journey Rentals is a full-stack web platform where users can rent touring gear, vehicles, and accommodations. Built as a **Final Year Project**, the system includes real-time chat, booking management, a secure payment system, notifications, and AI-powered validation and pricing.


## 🔥 Features

- 🏕️ Rent gear, vehicles, and rooms
- 📅 Real-time booking with availability
- 💬 In-app chat between renters and owners
- 🔔 Notification system (booking, chat, etc.)
- 👤 Role-based authentication (renter, owner, admin)
- 📸 Image upload with Cloudinary
- ✅ AI-based **image validation** (TensorFlow MobileNet)
- 💰 AI-based **dynamic pricing** (Coming soon)
- 🧠 Separate AI module structure for FYP demo
- 💳 Integrated payment gateway (Planned)
- 🧾 Admin dashboard for monitoring platform activity


## 🧠 AI Modules

### 1. Image Validation (TensorFlow + MobileNet)
- Ensures uploaded items match their selected category
- Detects unsafe or inappropriate items
- Auto-categorizes listings based on image content
- Alerts users if the item is flagged

         



## 🚀 Getting Started

### 1. Clone the repo


git clone https://github.com/your-username/epic-journey-rentals.git
cd epic-journey-rentals


### 2. Backend Setup


cd server
npm install
touch .env
# Add Mongo URI, JWT_SECRET, CLOUDINARY_API details
npm run dev

### 3. Frontend Setup


cd client
npm install
npm run dev







## 🧑‍💻 Author

**Syed Sami Abbas**
BS IT25
email:abbasdanish804@gmail.com
LinkedIn: https://www.linkedin.com/in/sami-abbas-8a9a41268/


## 🤝 Contributing

This is a personal FYP project, but feel free to fork and build on it.


## 📸 Screenshots

> Add screenshots here showing:

* Home page
* Booking form
* Chat system
* Notification dropdown
* AI model demo

