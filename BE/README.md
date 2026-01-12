# Student Management System - Backend API

RESTful API for Student Management System using Express.js, TypeScript, and MySQL.

## 🎯 Features

- **User Management**: Authentication for admins, students, and teachers
- **Student Management**: Complete CRUD operations for students
- **Teacher Management**: Teacher profile and information management  
- **Subject Management**: Course and subject catalog
- **Score Management**: Student grades and GPA tracking
- **Test Management**: Test results and history
- **Tuition Management**: Fee tracking and payment processing
- **Feedback System**: Student-teacher communication
- **Schedule Management**: Class timetables and schedules

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MySQL 8.0+
- **Driver**: mysql2 (connection pooling)
- **Authentication**: bcryptjs for password hashing
- **UUID**: uuid for primary keys

## 📋 Prerequisites

- Node.js >= 18.x
- MySQL >= 8.0
- npm or yarn

## 🚀 Installation

### 1. Install Dependencies

```bash
cd BE
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
PORT=3000

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_management
```

### 3. Setup Database

```bash
# Create database and tables
mysql -u root -p < database/schema.sql

# Insert sample data
mysql -u root -p < database/sample_data.sql
```

### 4. Start Server

```bash
npm run dev
```

API available at `http://localhost:3000`

## 📁 Project Structure

```
BE/
├── src/
│   ├── config/
│   │   └── database.ts          # MySQL connection pool
│   ├── models/                  # TypeScript entities & DTOs
│   │   ├── user.model.ts
│   │   ├── student.model.ts
│   │   ├── teacher.model.ts
│   │   └── ...
│   ├── repositories/            # Data access layer
│   │   ├── base.repository.ts   # Base CRUD operations
│   │   ├── user.repository.ts
│   │   ├── student.repository.ts
│   │   └── ...
│   ├── services/                # Business logic
│   ├── controllers/             # HTTP handlers
│   ├── middleware/              # Error handling, validation
│   ├── routes/                  # API routes
│   └── index.ts                 # Entry point
├── database/
│   ├── schema.sql               # Database schema
│   ├── sample_data.sql          # Sample data
│   └── README.md                # Database docs
└── package.json
```

## 🗄️ Database Design

**3-Table Normalized Design:**

- **users** - Authentication (username, password, role)
- **students** - Student data (student_code, year_level, etc.)
- **teachers** - Teacher data (teacher_code, department, etc.)

Plus: subjects, scores, tests, tuition, feedbacks, schedules

See [database/README.md](database/README.md) for details.

## 🔧 Development Scripts

```bash
npm run dev      # Development mode with hot reload
npm run build    # Build TypeScript
npm start        # Production server
```

## 🏗️ Architecture

```
Controllers → Services → Repositories → MySQL
```

Repository pattern with base CRUD operations extended by specific repositories.

## 📊 Sample Data

- 8 users (1 admin, 3 teachers, 4 students)
- 4 students across 3 year levels
- 3 teachers from different departments
- Scores, tests, tuition records, feedbacks

## 📝 License

ISC

---

**Group 2** - University of Technology and Management
