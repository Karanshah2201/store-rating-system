# Raxilor - Store Rating Platform

A modern, full-stack store rating and review management system built with React, Node.js, Express, and MySQL. Features role-based access control for Admins, Store Owners, and Users with a premium "Coastal Azure" design system.

## 🌟 Features

### For Users
- Browse and search stores with real-time filtering
- Rate stores on a 5-star scale
- View platform-wide average ratings
- Sort stores by rating, name, or other criteria
- Beautiful, responsive UI with smooth animations

### For Store Owners
- Self-service store registration
- Real-time dashboard with business metrics
- View all customer reviews and ratings
- Track average rating and reviewer engagement
- Sortable review management

### For Admins
- Complete user and store management
- Add new users with role assignment
- Create and manage store listings
- View platform-wide statistics
- Comprehensive admin dashboard

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS v4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Sequelize** - ORM for MySQL
- **MySQL** - Relational database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
TASK raxilor/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   └── index.css      # Global styles & design system
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Sequelize models
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions (seeding)
│   │   └── app.js        # Express app entry point
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "TASK raxilor"
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure Database**
   
   Create a `.env` file in the `server` directory:
   ```env
   DB_NAME=raxilor_db
   DB_USER=root
   DB_PASS=your_password
   DB_PORT=3306
   DB_HOST=localhost
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

4. **Initialize Database**
   ```bash
   # The database and tables will be created automatically
   # To seed initial data (Admin, Store Owner, User):
   npm run seed
   ```

5. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

6. **Start Development Servers**
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 👥 Default Accounts (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@raxilor.com | Admin@123 |
| Store Owner | owner@raxilor.com | Admin@123 |
| User | user@raxilor.com | Admin@123 |

## 🎨 Design System

The application uses a custom "Coastal Azure" design system with:
- Primary color: `#0891b2` (Cyan-600)
- Accent color: `#d64045` (Red for key elements)
- Premium glassmorphism effects
- Smooth micro-animations
- Responsive layouts
- Modern typography

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `PUT /api/auth/update-password` - Update password

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard stats
- `POST /api/admin/user` - Create new user
- `POST /api/admin/store` - Create new store

### User Routes
- `GET /api/user/stores` - Get all stores with ratings
- `POST /api/user/rate` - Submit store rating

### Owner Routes
- `GET /api/owner/dashboard` - Owner dashboard metrics
- `POST /api/owner/store` - Register new store (self-service)


## 🗄️ Database Schema

### Users Table
- id (UUID, Primary Key)
- name (String, 3-60 chars)
- email (String, Unique)
- password (String, Hashed)
- address (String, 0-400 chars)
- role (ENUM: Admin, User, StoreOwner)

### Stores Table
- id (UUID, Primary Key)
- name (String, 3-60 chars)
- email (String, Unique)
- address (String, 0-400 chars)
- ownerId (UUID, Foreign Key → Users)

### Ratings Table
- id (UUID, Primary Key)
- rating (Integer, 1-5)
- userId (UUID, Foreign Key → Users)
- storeId (UUID, Foreign Key → Stores)
- timestamps (createdAt, updatedAt)

## ✅ Requirements Implemented

- [x] Role-based access (Admin, User, Store Owner)
- [x] Admin: CRUD users/stores, Dashboard stats, Sorting/Filtering
- [x] User: Search stores, Rate/Modify ratings (1-5)
- [x] Store Owner: View store stats and reviewers, Self-service registration
- [x] Form Validations (Name length, Email format, Password strength)
- [x] Password Update for all roles
- [x] Premium visual design with glassmorphism and modern UI
- [x] Responsive layouts for all screen sizes
- [x] Real-time data updates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React, Node.js, and MySQL**
