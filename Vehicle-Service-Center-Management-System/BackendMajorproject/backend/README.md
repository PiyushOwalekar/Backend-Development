# Vehicle Service Center Management System - Backend

## 1. Install
```bash
cd backend
npm install
```

## 2. Environment
Create `.env` from `.env.example` and put your MongoDB Atlas URI and JWT secret.

## 3. Run
```bash
npm run dev
```

Server: http://localhost:5000

## API
### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### Vehicles
- POST `/api/vehicles`
- GET `/api/vehicles`
- GET `/api/vehicles/:id`
- PUT `/api/vehicles/:id`
- DELETE `/api/vehicles/:id`
- GET `/api/vehicles/:id/history`

### Service Bookings
- POST `/api/service-bookings`
- GET `/api/service-bookings`
- GET `/api/service-bookings/:id`
- PUT `/api/service-bookings/:id`
- DELETE `/api/service-bookings/:id`
- PATCH `/api/service-bookings/:id/status` (mechanic only)

Authorization:
`Authorization: Bearer YOUR_JWT_TOKEN`

## Important
For a classroom/demo project, registration allows selecting `customer` or `mechanic`. In a real application, mechanic accounts should be created by an administrator instead of allowing public role selection.
