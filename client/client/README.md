<<<<<<< HEAD
# Hospital Booking System - Frontend

A modern web application for booking doctor appointments in hospitals.

## Features

- User authentication (login/register)
- Doctor profiles and listings
- Appointment scheduling
- Dashboard for patients
- Responsive design

## Technologies Used

- React.js
- Redux for state management
- React Router for navigation
- Axios for HTTP requests
- Font Awesome for icons
- React Toastify for notifications

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Start the development server: `npm start`

## Environment Variables
<!-- 
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_NAME`: Application name
- `REACT_APP_ENV`: Environment (development/production) -->

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm run lint`: Runs ESLint
- `npm run format`: Formats code with Prettier

## Folder Structure
=======
# HealthCare-Appointment-Booking_system


#### cd client && npm install
####cd client && npm start

#### filestructure

healthcare-booking/
├── client/ (React Frontend)
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── images/
│   │       ├── default-avatar.png          
│   │       ├── default-doctor.jpg          
│   │       ├── healthcare-hero.jpg         
│   │       └── logo.png                    
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── DoctorSearch.jsx
│   │   │   ├── DoctorDetail.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   ├── MyAppointments.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles/
│   │       └── global.css
│   ├── package.json
│   └── README.md
├── server/ (Node.js Backend)
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── doctors.js
│   │   ├── appointments.js
│   │   └── notifications.js
│   ├── .env
│   ├── app.js
│   ├── package.json
│   └── README.md
└── README.md
>>>>>>> 1ae0c78cf467e332e2dc3d35d90eeca56016458a
