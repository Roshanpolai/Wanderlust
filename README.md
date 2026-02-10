# 🌍 Wanderlust

Wanderlust is a full-stack web application inspired by Airbnb that allows users to explore, list, and review travel destinations and accommodations. 
The platform provides an interactive and user-friendly experience for travelers and hosts.

---

## 🚀 Features

- 🏡 Browse travel destinations and stays  
- ➕ Add new listings with images and descriptions  
- ✏️ Edit and delete your own listings  
- ⭐ Add reviews and ratings  
- 🔐 User authentication & authorization  
- 📍 Interactive maps for location visualization  
- 📱 Fully responsive design  

---

## 🛠️ Tech Stack

### Frontend
- HTML5  
- CSS3  
- JavaScript  
- EJS (Embedded JavaScript Templates)  
- Bootstrap  

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB  
- Mongoose  

### Other Tools & Services
- Cloudinary (Image upload & storage)  
- Mapbox (Maps & Geolocation)  
- Passport.js (Authentication)  
- dotenv (Environment variables)  

---

## 📂 Project Structure
```
Wanderlust/
│
├── controllers/ # Route logic & controllers
├── models/ # Mongoose schemas
├── routes/ # Express route definitions
├── views/ # EJS templates
├── public/ # Static assets (CSS, JS)
├── utils/ # Helper utilities
│
├── app.js # Application entry point
├── cloudConfig.js # Cloudinary configuration
├── middleware.js # Custom middleware (auth, errors)
├── schemaValidation.js # Joi validation schemas
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Roshanpolai/wanderlust.git
   cd wanderlust

2. Install dependencies
```npm install
```

3.  Create a .env file
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
MAPBOX_TOKEN=your_mapbox_token
DB_URL=your_mongodb_url
SECRET=your_session_secret
```

5.  Run the application
```
npm start
Open your browser and visit
👉 http://localhost:8000
```

🔐 Authentication Flow
```
Users must log in to
Add a listing
Edit or delete their own listings
Post reviews
Unauthorized users can only view listings.
```
🧠 Learning Outcomes
```
RESTful routing
MVC architecture
User authentication & authorization
Database relationships with MongoDB
Image upload & cloud storage
API integration (Mapbox)
```

🌟 Future Enhancements:
```
🔍 Advanced search & filters
❤️ Wishlist / favorites feature
💳 Payment gateway integration
🧑‍💼 Host dashboard
🌐 Deployment on cloud platforms
```

👨‍💻 Author
```
Roshan Polai
```
📄 License
```
This project is licensed under the MIT License.
```
