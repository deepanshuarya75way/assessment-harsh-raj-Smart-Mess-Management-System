# 🍽️ Smart Mess Management & Waste Reduction System

A full-stack web application designed to help hostels and mess
facilities manage **daily meal attendance, food preparation, leftover
meals, and NGO donation coordination** through role-based portals.

The system connects three primary users:

-   **Student** -- marks attendance for breakfast, lunch, and dinner.
-   **Mess Admin** -- views attendance information and creates
    leftover-food donation tickets.
-   **NGO** -- views available donation tickets and pickup information.

> **Project Type:** Full-Stack Web Application\
> **Frontend:** HTML, CSS, JavaScript\
> **Backend:** Node.js, Express.js\
> **Database:** MongoDB / Mongoose\
> **Authentication:** JWT + bcryptjs\
> **API Style:** REST API

------------------------------------------------------------------------

## 📌 Problem Statement

Mess facilities often prepare food based on estimated attendance. When
fewer students attend a meal, excess food can remain unused.

This project provides a simple digital workflow:

**Student attendance → Mess planning/monitoring → Leftover
identification → Donation ticket → NGO pickup**

The goal is to reduce unnecessary food waste while making the process
easier to manage.

------------------------------------------------------------------------

## ✨ Key Features

### 👨‍🎓 Student Portal

-   Student registration and login.
-   Role-based access for students.
-   Breakfast, lunch, and dinner attendance selection.
-   Attendance can be marked as:
    -   `attending`
    -   `skipped`
-   Attendance is saved against the current date.
-   Weekly menu is displayed.
-   Student profile information is loaded from the backend.

### 👨‍💼 Mess Admin Portal

-   Admin-only access using JWT role authorization.
-   Today's attendance summary.
-   Enter:
    -   Hostel/Mess name
    -   Meals prepared
    -   Meals served
    -   Pickup time
-   Automatically calculates approximate leftover meals.
-   Creates a donation ticket for NGOs.

### 🤝 NGO Portal

-   NGO-only access.
-   Displays recent leftover-food donation tickets.
-   Shows:
    -   Hostel
    -   Available meals
    -   Pickup time
    -   Ticket status

### 📊 Public Dashboard

The landing page can display: - Total meal records - Confirmed meals -
Skipped meals - Extra meals - Mess load percentage - Recent NGO donation
tickets

If the backend is unavailable, the frontend falls back to demo data.

------------------------------------------------------------------------

# 🏗️ System Architecture

``` text
                    ┌──────────────────────┐
                    │      Frontend        │
                    │ HTML + CSS + JS      │
                    └──────────┬───────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │     Node.js API      │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌────────────────┐          ┌─────────────────┐
        │ JWT Middleware │          │ Route Handlers  │
        │ Role Checking  │          │ Auth/Student/   │
        └────────────────┘          │ Admin/NGO/etc.  │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │     Mongoose    │
                                    │ Models/Schemas  │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │     MongoDB     │
                                    │ smart_mess_     │
                                    │ system         │
                                    └─────────────────┘
```

------------------------------------------------------------------------

# 📂 Project Structure

``` text
Smart-Mess-Management-System/
│
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Attendance.js
│   │   ├── Leftover.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── ngoRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       └── app.js
│   │
│   ├── index.html
│   ├── auth.html
│   ├── student.html
│   ├── admin.html
│   ├── ngo.html
│   ├── package.json
│   └── package-lock.json
│
├── README.md
├── README.txt
└── day 2 whiteboard.pdf
```

------------------------------------------------------------------------

# 🧩 How the Code Works

## 1. Backend Server

`backend/server.js` is the entry point of the backend.

It:

1.  Loads environment variables using `dotenv`.
2.  Creates an Express application.
3.  Enables CORS.
4.  Enables JSON request parsing.
5.  Enables Morgan request logging.
6.  Connects to MongoDB using Mongoose.
7.  Registers all API routes.
8.  Starts the server on the configured port.

Main route groups:

``` text
/api/auth
/api/student
/api/admin
/api/ngo
/api/dashboard
```

The backend runs on:

``` text
http://localhost:5000
```

------------------------------------------------------------------------

# 🔐 2. Authentication Flow

The authentication system uses **JWT (JSON Web Token)**.

### Signup

Frontend sends:

``` http
POST /api/auth/signup
```

with:

``` json
{
  "name": "Student Name",
  "email": "student@example.com",
  "password": "password",
  "role": "student"
}
```

The backend:

1.  Checks required fields.
2.  Checks whether the email already exists.
3.  Creates a `User`.
4.  The User model hashes the password using bcryptjs before saving.
5.  Returns a successful signup response.

### Login

Frontend sends:

``` http
POST /api/auth/login
```

The backend:

1.  Finds the user by email.
2.  Compares the entered password with the bcrypt hash.
3.  Creates a JWT containing:
    -   user ID
    -   role
    -   name
4.  Returns the token and user information.

The frontend stores the token in:

``` text
localStorage
```

under:

``` text
smartmess_token
```

------------------------------------------------------------------------

# 🛡️ 3. JWT Authorization

The file:

``` text
backend/middleware/authMiddleware.js
```

protects private routes.

The frontend sends:

``` http
Authorization: Bearer <JWT_TOKEN>
```

The middleware:

1.  Reads the Authorization header.
2.  Extracts the Bearer token.
3.  Verifies the token using `JWT_SECRET`.
4.  Adds decoded user information to:

``` javascript
req.user
```

5.  Checks whether the user's role is allowed.

Example:

``` javascript
auth(["admin"])
```

means only an admin can access that route.

Similarly:

``` javascript
auth(["student"])
```

allows only students.

------------------------------------------------------------------------

# 👤 4. User Model

`backend/models/User.js` stores user accounts.

Important fields:

``` text
name
email
password
role
```

Allowed roles:

``` text
student
admin
ngo
```

The email is unique and converted to lowercase.

Passwords are hashed using:

``` text
bcryptjs
```

The model also provides:

``` javascript
comparePassword()
```

which is used during login.

------------------------------------------------------------------------

# 🍽️ 5. Student Attendance Flow

The student opens:

``` text
student.html
```

The frontend creates three attendance cards:

``` text
Breakfast
Lunch
Dinner
```

Clicking a card toggles between:

``` text
Attending
Skip
```

When the student clicks **Save Attendance**, the frontend creates:

``` json
{
  "date": "YYYY-MM-DD",
  "meals": [
    {
      "mealType": "breakfast",
      "status": "attending"
    },
    {
      "mealType": "lunch",
      "status": "skipped"
    },
    {
      "mealType": "dinner",
      "status": "attending"
    }
  ]
}
```

and sends it to:

``` http
POST /api/student/attendance
```

The backend stores it in MongoDB.

The database prevents duplicate attendance documents for the same user
and date using:

``` text
unique index: user + date
```

------------------------------------------------------------------------

# 🧑‍💼 6. Admin Attendance Overview

Admin accesses:

``` http
GET /api/admin/overview
```

The backend:

1.  Gets today's date.
2.  Finds today's attendance documents.
3.  Loops through all meal records.
4.  Counts total recorded meals.
5.  Counts meals whose status is `attending`.

The response contains values such as:

``` json
{
  "total": 120,
  "confirmed": 85,
  "text": "Today there are 85 confirmed meals out of 120 recorded (all meals combined)."
}
```

### Important implementation detail

The current implementation counts **meal records**, not unique students.

So the overview should be understood as:

> confirmed meals out of recorded meal entries

rather than:

> confirmed students out of total students.

------------------------------------------------------------------------

# ♻️ 7. Leftover Food / Donation Flow

The admin enters:

``` text
Hostel
Meals Prepared
Meals Served
Pickup Time
```

Frontend sends:

``` http
POST /api/admin/leftover
```

Example:

``` json
{
  "hostel": "Hostel A",
  "preparedMeals": 100,
  "servedMeals": 75,
  "pickupTime": "21:30"
}
```

Backend calculates:

``` text
leftover = preparedMeals - servedMeals
```

with a minimum value of zero.

### Current status rules

``` text
leftover = 0
        → Assigned

leftover > 0 and <= 20
        → Available

leftover > 20
        → Expiring
```

A `Leftover` document is then saved to MongoDB.

------------------------------------------------------------------------

# 🤝 8. NGO Flow

The NGO portal calls:

``` http
GET /api/ngo/dashboard
```

The route is protected using:

``` javascript
auth(["ngo"])
```

The backend fetches recent leftover tickets and converts them into a
simpler response:

``` json
{
  "tickets": [
    {
      "id": "...",
      "hostel": "Hostel A",
      "meals": 25,
      "pickupTime": "21:30",
      "status": "Available"
    }
  ]
}
```

The frontend displays these tickets in a table.

------------------------------------------------------------------------

# 📊 9. Landing Page Dashboard

The landing page first loads demo data so that the UI can still display
meaningful content.

Then it attempts:

``` http
GET /api/dashboard/home
```

If the backend responds successfully, the frontend replaces the demo
values with live database-derived values.

The public dashboard calculates:

``` text
Total recorded meals
Confirmed meals
Skipped meals
Extra meals
Mess load percentage
Recent NGO tickets
```

This creates a useful fallback mechanism:

``` text
Backend available
       ↓
Show live data

Backend unavailable
       ↓
Show demo data
```

------------------------------------------------------------------------

# 🔄 Complete End-to-End Flow

``` text
                    USER OPENS WEBSITE
                            │
                            ▼
                       index.html
                            │
                            ▼
                    Login / Signup
                            │
                            ▼
                  POST /api/auth/login
                            │
                            ▼
                       JWT Token
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
            STUDENT      ADMIN         NGO
                │           │           │
                ▼           ▼           ▼
          Mark Meals    View Daily   View Donation
          Attendance    Overview       Tickets
                │           │           ▲
                ▼           ▼           │
       POST /attendance  POST /leftover ┘
                │           │
                ▼           ▼
            MongoDB      MongoDB
                │           │
                └─────┬─────┘
                      ▼
                Dashboard API
                      │
                      ▼
                Public Landing
```

------------------------------------------------------------------------

# 🔌 API Reference

## Authentication

  Method   Endpoint             Access   Purpose
  -------- -------------------- -------- -----------------------
  POST     `/api/auth/signup`   Public   Create account
  POST     `/api/auth/login`    Public   Login and receive JWT

## Student

  ---------------------------------------------------------------------------------
  Method            Endpoint                    Access            Purpose
  ----------------- --------------------------- ----------------- -----------------
  GET               `/api/student/dashboard`    Student           Get student
                                                                  details and
                                                                  weekly menu

  POST              `/api/student/attendance`   Student           Save daily
                                                                  attendance
  ---------------------------------------------------------------------------------

## Admin

  -----------------------------------------------------------------------------
  Method            Endpoint                Access            Purpose
  ----------------- ----------------------- ----------------- -----------------
  GET               `/api/admin/overview`   Admin             Get today's
                                                              attendance
                                                              summary

  POST              `/api/admin/leftover`   Admin             Create
                                                              leftover-food
                                                              donation ticket
  -----------------------------------------------------------------------------

## NGO

  Method   Endpoint               Access   Purpose
  -------- ---------------------- -------- -----------------------------
  GET      `/api/ngo/dashboard`   NGO      Get recent donation tickets

## Public Dashboard

  -----------------------------------------------------------------------------
  Method            Endpoint                Access            Purpose
  ----------------- ----------------------- ----------------- -----------------
  GET               `/api/dashboard/home`   Public            Get landing-page
                                                              summary and
                                                              recent NGO
                                                              tickets

  -----------------------------------------------------------------------------

------------------------------------------------------------------------

# 🗄️ Database Design

## User

``` text
User
├── name
├── email
├── password
└── role
```

Roles:

``` text
student | admin | ngo
```

## Attendance

``` text
Attendance
├── user
├── date
└── meals[]
    ├── mealType
    └── status
```

Meal types:

``` text
breakfast | lunch | dinner
```

Statuses:

``` text
attending | skipped
```

## Leftover

``` text
Leftover
├── hostel
├── preparedMeals
├── servedMeals
├── pickupTime
└── status
```

Statuses:

``` text
Available | Assigned | Expiring
```

------------------------------------------------------------------------

# 🎨 Frontend Structure

The frontend is implemented with plain:

-   HTML
-   CSS
-   JavaScript

No frontend framework is required.

### `index.html`

Public landing page and dashboard.

### `auth.html`

Contains:

-   Login
-   Signup
-   Role selection

### `student.html`

Student dashboard containing:

-   Student information
-   Meal attendance
-   Weekly menu
-   Save attendance
-   Logout

### `admin.html`

Admin dashboard containing:

-   Attendance overview
-   Prepared meals
-   Served meals
-   Pickup time
-   Donation ticket creation

### `ngo.html`

NGO dashboard containing:

-   Available donation tickets
-   Meal quantities
-   Pickup times
-   Status

### `assets/js/app.js`

Central frontend JavaScript file responsible for:

-   API communication
-   JWT storage
-   Authentication
-   Page initialization
-   Student attendance
-   Admin actions
-   NGO ticket display
-   Demo fallback data

### `assets/css/style.css`

Contains the complete visual design including:

-   Dark theme
-   Cards
-   Buttons
-   Forms
-   Tables
-   Progress bars
-   Responsive layouts
-   Authentication pages
-   Portal layouts

------------------------------------------------------------------------

# ⚙️ Environment Variables

Create:

``` text
backend/.env
```

Example:

``` env
MONGO_URI=mongodb://127.0.0.1:27017/smart_mess_system
JWT_SECRET=your_secure_secret
PORT=5000
```

Do **not** commit real secrets to a public repository.

------------------------------------------------------------------------

# 🚀 Installation & Setup

## Prerequisites

Install:

-   Node.js
-   MongoDB
-   Git
-   VS Code (recommended)

------------------------------------------------------------------------

## 1. Clone Repository

``` bash
git clone https://github.com/Pnpdm/Smart-Mess-Management-System.git
cd Smart-Mess-Management-System
```

------------------------------------------------------------------------

## 2. Start MongoDB

Make sure your local MongoDB server is running.

The default database configured by the project is:

``` text
smart_mess_system
```

------------------------------------------------------------------------

## 3. Install Backend Dependencies

``` bash
cd backend
npm install
```

Create `.env`:

``` env
MONGO_URI=mongodb://127.0.0.1:27017/smart_mess_system
JWT_SECRET=your_secure_secret
PORT=5000
```

Start backend:

``` bash
npm start
```

Backend:

``` text
http://localhost:5000
```

------------------------------------------------------------------------

## 4. Start Frontend

Open:

``` text
frontend/index.html
```

You can use:

-   VS Code Live Server, or
-   any local static web server.

The frontend API base URL is:

``` text
http://localhost:5000/api
```

------------------------------------------------------------------------

# 🧪 Recommended Testing Flow

### Step 1 --- Create Student

Go to:

``` text
frontend/auth.html
```

Signup with:

``` text
Role = student
```

Login.

You should be redirected to:

``` text
student.html
```

### Step 2 --- Mark Attendance

Select:

``` text
Breakfast
Lunch
Dinner
```

as required.

Click:

``` text
Save Attendance
```

### Step 3 --- Create Admin Account

Signup with:

``` text
Role = admin
```

Login.

Open:

``` text
admin.html
```

Check today's overview.

### Step 4 --- Create Donation Ticket

Enter:

``` text
Hostel
Meals Prepared
Meals Served
Pickup Time
```

Click:

``` text
Create Donation Ticket
```

### Step 5 --- Create NGO Account

Signup with:

``` text
Role = ngo
```

Login.

Open:

``` text
ngo.html
```

The recently created donation ticket should be displayed.

### Step 6 --- Check Landing Page

Open:

``` text
index.html
```

The public dashboard attempts to load live backend data.

------------------------------------------------------------------------

# 🔒 Security Notes

The project includes several useful security mechanisms:

-   Password hashing with bcryptjs.
-   JWT-based authentication.
-   Role-based authorization.
-   Protected student/admin/NGO endpoints.
-   Environment variables for database and JWT configuration.
-   Unique email constraint for users.
-   Unique `(user, date)` attendance index.

### Important before public submission

Make sure the repository does **not** expose a real `.env` file or
production secrets.

If a secret has already been pushed to a public GitHub repository,
replace/rotate it and remove the secret from the repository history
where appropriate.

For production, also consider:

-   Strong random JWT secret.
-   HTTPS.
-   Restricted CORS.
-   Server-side role-management instead of letting anyone self-register
    as `admin` or `ngo`.
-   Input validation and rate limiting.
-   Better error handling.
-   Proper timezone handling for attendance dates.

------------------------------------------------------------------------

# ⚠️ Current Project Limitations

The current implementation is a functional demo/academic full-stack
system. Some parts are intentionally simple:

1.  **Weekly menu is static** in the student route.
2.  **Demo fallback data** is used when the backend is unavailable.
3.  The frontend uses plain HTML/CSS/JavaScript rather than React or
    another frontend framework.
4.  The current admin overview counts meal records rather than unique
    students.
5.  The donation workflow creates and displays tickets but does not
    implement a full NGO acceptance/assignment transaction.
6.  Role selection is exposed during signup, so production systems
    should restrict creation of privileged roles.
7.  The project currently uses a local MongoDB connection by default.

------------------------------------------------------------------------

# 🌱 Future Enhancements

Possible production-level improvements:

-   React/Next.js frontend.
-   Admin-created student/NGO accounts.
-   Separate meal menu management.
-   Monthly attendance analytics.
-   Meal prediction based on historical attendance.
-   Automated leftover estimation.
-   NGO ticket acceptance and assignment.
-   Pickup confirmation.
-   Email/SMS/WhatsApp notifications.
-   Charts and analytics dashboard.
-   QR-based mess attendance.
-   Cloud MongoDB deployment.
-   Docker deployment.
-   Automated testing.
-   CI/CD pipeline.
-   Stronger validation and security controls.

------------------------------------------------------------------------

# 🧠 What This Project Demonstrates

This project demonstrates practical understanding of:

-   Full-stack application architecture
-   REST API development
-   Node.js and Express.js
-   MongoDB and Mongoose
-   CRUD-style database operations
-   JWT authentication
-   Role-based authorization
-   Password hashing
-   Frontend-to-backend API integration
-   Local storage
-   Form handling
-   Responsive UI design
-   Error handling
-   Environment configuration
-   Multi-role application design

------------------------------------------------------------------------

# 👨‍💻 Developer

**Harsh Raj**

GitHub:\
https://github.com/Pnpdm

Repository:\
https://github.com/Pnpdm/Smart-Mess-Management-System

------------------------------------------------------------------------

## ⭐ Project Summary

**Smart Mess Management & Waste Reduction System** is a full-stack
application that connects **students, mess administrators, and NGOs** to
manage meal attendance and coordinate leftover-food donations.

The core workflow is:

> **Track attendance → Understand meal demand → Identify leftovers →
> Create donation ticket → Connect with NGO**

This makes the project a strong demonstration of backend API
development, database management, authentication, authorization, and
frontend integration.
