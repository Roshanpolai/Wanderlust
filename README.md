# Wanderlust

Wanderlust is a full-stack web application inspired by Airbnb that allows users to explore, list, and review travel destinations and accommodations.  
The platform provides an interactive and user-friendly experience for travelers and hosts.

---

# Features

- Browse travel destinations and stays
- Add new listings with images and descriptions
- Edit and delete your own listings
- Add reviews and ratings
- User authentication & authorization
- Interactive maps for location visualization
- Fully responsive design

---

# Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript
- EJS (Embedded JavaScript Templates)
- Bootstrap

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Other Tools & Services

- Cloudinary (Image upload & storage)
- Mapbox (Maps & Geolocation)
- Passport.js (Authentication)
- dotenv (Environment variables)

---

# Project Structure

```bash
Wanderlust/
│
├── controllers/          # Route logic & controllers
├── models/               # Mongoose schemas
├── routes/               # Express route definitions
├── views/                # EJS templates
├── public/               # Static assets (CSS, JS)
├── utils/                # Helper utilities
│
├── app.js                # Application entry point
├── cloudConfig.js        # Cloudinary configuration
├── middleware.js         # Custom middleware (auth, errors)
├── schemaValidation.js   # Joi validation schemas
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

# Installation & Setup

## 1️. Clone the Repository

```bash
git clone https://github.com/Roshanpolai/wanderlust.git
cd wanderlust
```

---

## 2️. Install Dependencies

```bash
npm install
```

---

## 3️. Create a `.env` File

Create a `.env` file in the root directory and add the following environment variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
MAPBOX_TOKEN=your_mapbox_token
DB_URL=your_mongodb_url
SECRET=your_session_secret
```

---

## 4️. Run the Application

```bash
npm start
```

Open your browser and visit:

 `http://localhost:8000`

---

# Authentication Flow

Users must log in to:

- Add a listing
- Edit or delete their own listings
- Post reviews

Unauthorized users can only view listings.

---

# Learning Outcomes

This project helped in understanding:

- RESTful Routing
- MVC Architecture
- User Authentication & Authorization
- Database Relationships with MongoDB
- Image Upload & Cloud Storage
- API Integration using Mapbox

---

# Future Enhancements

- Advanced Search & Filters
- Wishlist / Favorites Feature
- Host Dashboard
- Cloud Deployment

---

# Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# License

This project is licensed under the **MIT License**.

---

# Author

Developed by **Roshan Polai**
