# Vehicle Service Center Management System

A complete beginner-friendly MERN project based on the given assignment.

## Included
- Express.js REST API
- MongoDB + Mongoose
- Customer, Vehicle and ServiceBooking collections
- JWT authentication
- Role-based mechanic authorization
- Ownership-based service-history authorization
- CRUD for vehicles and service bookings
- Mechanic status workflow
- Booking validation
- React frontend
- Basic login/register, vehicle dashboard, booking form, history and mechanic panel
- MongoDB Atlas `.env` configuration
- Postman-ready REST endpoints

## Folder structure
```
Vehicle-Service-Center-Management-System/
├── backend/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── .env.example
└── README.md
```

## Run backend
```
cd backend
npm install
cp .env.example .env
npm run dev
```

Put your MongoDB Atlas URI in `.env`.

## Run frontend
Open another terminal:
```
cd frontend
npm install
cp .env.example .env
npm run dev
```

Then open the Vite URL shown in the terminal.

## Demo flow
1. Register a customer.
2. Add a vehicle.
3. Book a service appointment.
4. Open My Bookings.
5. Register/login as a mechanic for the classroom demo.
6. Mechanic can see all jobs and change status.
7. Customer can open only their own vehicle history.

## Viva points
- Mongoose references connect Customer -> Vehicle -> ServiceBooking.
- JWT identifies the logged-in user.
- `protect` middleware checks JWT.
- `mechanicOnly` prevents customers from changing job status.
- Vehicle ownership is checked before booking/history access.
- Mongoose validators reject invalid data before it is saved.
