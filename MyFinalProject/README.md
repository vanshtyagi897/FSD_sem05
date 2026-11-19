# Campus Room Availability System

A full-stack web application designed for college campuses to help students and faculty identify classrooms and lecture halls that are currently empty and where no faculty member is present.

## Core Detection Principle

```text
Room is Empty (Status = Available) + Faculty is Not Present (Faculty = Absent)
= AVAILABLE ROOM
```

If a room has an active class/session or if a faculty member is present, the room is marked as **Occupied**.

---

## Features

- **Dashboard Summary**: Real-time counter cards showing Total Rooms, Available Rooms, Occupied Rooms, Faculty Present, and Faculty Absent.
- **Search & Filters**:
  - Alphanumeric Room ID search (e.g., `A101`, `B201`, `C301`, `D402`).
  - Search by Subject or Faculty Name.
  - Multi-parameter filter dropdowns by Building/Block (A, B, C, D) and Floor (1 to 4).
  - Filter by Availability (Available / Occupied) and Faculty Presence (Present / Absent).
- **Views**:
  - **Dashboard**: High-level overview with quick Available Rooms carousel and All Rooms tabular list.
  - **Rooms**: Full directory with view toggle between Cards and Table mode.
  - **Available Rooms**: Focused view displaying only rooms ready for immediate occupancy.
  - **About**: System architecture, REST API documentation, and IoT sensor integration notes.
- **Room Details Modal**: Complete room metadata (capacity, room type, facilities, schedule notes, and last updated time).
- **Sensor Simulation & API Integration**: Built-in interactive simulator to test real-time occupancy updates and mock sensor webhooks.
- **Aesthetics & Design**:
  - Professional dark navy/slate theme (`#0a0e17`, `#111827`, `#1e293b`).
  - Strict compliance with UI requirements: zero emojis, zero neon colors, clean typography, responsive layout across mobile, tablet, and desktop.

---

## Project Structure

```text
RoomAllocation/
├── package.json
├── vite.config.js
├── index.html
├── server/
│   └── server.js               # Express REST API server
├── src/
│   ├── main.jsx                # Application entry point
│   ├── App.jsx                 # Main stateful application component
│   ├── index.css               # Clean dark navy/slate design system
│   ├── data/
│   │   └── mockRooms.js        # 28 realistic campus classrooms & labs
│   ├── services/
│   │   └── roomApi.js          # REST client & state persistence service
│   └── components/
│       ├── Navbar.jsx          # Header navigation bar
│       ├── DashboardStats.jsx  # Summary metrics cards
│       ├── SearchBar.jsx       # Alphanumeric room search
│       ├── Filters.jsx         # Block, floor, status, faculty filters
│       ├── RoomCard.jsx        # Individual room display card
│       ├── RoomList.jsx        # Room cards grid & empty states
│       ├── RoomTable.jsx       # Tabular room directory
│       ├── RoomDetailsModal.jsx# Comprehensive room details & simulation
│       └── AboutView.jsx       # Architecture & API documentation
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Navigate to the project directory:
   ```bash
   cd RoomAllocation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

- **Frontend Development Server (Vite)**:
  ```bash
  npm run dev
  ```
  Open `http://localhost:5173/` or `http://localhost:5174/` in your browser.

- **Backend Express API Server (Optional)**:
  ```bash
  npm run server
  ```
  Runs on `http://localhost:5000/api`.

- **Production Build**:
  ```bash
  npm run build
  npm run preview
  ```

---

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/rooms` | List all rooms (supports `?search=`, `?block=`, `?floor=`, `?status=`, `?faculty=`) |
| `GET` | `/api/rooms/available` | List only currently available rooms |
| `GET` | `/api/rooms/:id` | Get details for a specific room ID (e.g. `A101`) |
| `PUT` | `/api/rooms/:id/status` | Update room status and faculty presence |
| `GET` | `/api/stats` | Get dashboard statistical counters |
| `POST` | `/api/reset` | Reset dataset to initial 28 mock rooms |

---

## Room Data Schema

```json
{
  "id": "A101",
  "block": "A",
  "floor": 1,
  "roomType": "Classroom",
  "capacity": 60,
  "status": "Available",
  "facultyPresent": false,
  "facultyName": null,
  "subject": null,
  "facilities": ["Projector", "Whiteboard", "Audio System", "AC"],
  "lastUpdated": "10:42 AM",
  "notes": "Vacant after morning Physics lecture. Available for self-study."
}
```
