# Event Booking Frontend (React + Vite)

A minimal frontend for an event seat reservation and booking system. Built with React (Vite + TypeScript) and designed to work with a Node.js + MongoDB backend.

---

## Features

* User signup and login
* List all events
* View event details
* Reserve seats
* Book reserved seats
* JWT-based authentication

---

## Tech Stack

* React (Vite)
* TypeScript
* React Router DOM
* Context API
* Fetch API
* Tailwind CSS (optional)

---

## Project Structure

```
src/
├── api/
│   └── client.ts
├── components/
│   └── Navbar.tsx
├── context/
│   └── AuthContext.tsx
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Events.tsx
│   └── EventDetails.tsx
├── App.tsx
└── main.tsx
```

---

## Setup

### Install dependencies

```
npm install
```

### Environment variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:3000/api
```

### Run development server

```
npm run dev
```

Application runs on:

```
http://localhost:5173
```

---

## API Integration

The frontend expects the backend to expose:

* POST /api/auth/signup
* POST /api/auth/signin
* GET /api/events
* GET /api/events/:id
* POST /api/reserve
* POST /api/bookings
