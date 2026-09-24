import React from 'react';

export default function AboutView() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">About Campus Room Availability System</h1>
        <p className="page-description">
          System architecture, room detection logic, and integration specifications.
        </p>
      </div>

      <div className="about-card">
        <h2>Core Detection Logic</h2>
        <p>
          The Campus Room Availability System operates on a strict dual-condition rule to guarantee accurate room availability for students, faculty, and administration:
        </p>
        <pre>
Room is Empty (Status = Available) + Faculty is Not Present (Faculty = Absent)
= AVAILABLE ROOM
        </pre>
        <p>
          If either condition fails (i.e. if students are conducting an unscheduled session or if a faculty member is present for office hours, tutorial, or lecture), the room is categorized as <strong>Occupied</strong>.
        </p>
      </div>

      <div className="about-card">
        <h2>System Architecture & IoT Future Compatibility</h2>
        <p>
          The platform is decoupled to ensure seamless transitions from mock simulation data to real-time hardware sensors, smart cameras, RFID badge readers, and college timetable databases:
        </p>
        <pre>
[Frontend Dashboard (React / Vite)]
              |
              v
[REST API Layer (Express / Node.js)]
              |
              v
[Campus Database & IoT Ingestion Service]
              |
   +----------+----------+
   |                     |
[PIR / Optical Sensors] [Faculty RFID Readers]
        </pre>
        <p>
          In the current phase, mock data accurately simulates 28 campus rooms. Status updates can be triggered via the REST endpoints or interactive simulation controls.
        </p>
      </div>

      <div className="about-card">
        <h2>Data Model & REST API Specification</h2>
        <p>
          Every room is referenced by a unique alphanumeric ID (e.g. <code>A101</code>, <code>B202</code>, <code>D401</code>) and obeys the following JSON schema:
        </p>
        <pre>{`{
  "id": "A101",
  "block": "A",
  "floor": 1,
  "roomType": "Classroom",
  "capacity": 60,
  "status": "Available",
  "facultyPresent": false,
  "facultyName": null,
  "subject": null,
  "facilities": ["Projector", "Whiteboard", "AC"],
  "lastUpdated": "10:42 AM"
}`}</pre>

        <h3>Available REST Endpoints</h3>
        <ul>
          <li><code>GET /api/rooms</code> — Returns all college rooms with optional query parameters (<code>block</code>, <code>floor</code>, <code>status</code>, <code>search</code>).</li>
          <li><code>GET /api/rooms/available</code> — Returns only currently available rooms (empty space with no faculty present).</li>
          <li><code>GET /api/rooms/:id</code> — Returns complete details for a specific alphanumeric room ID.</li>
          <li><code>PUT /api/rooms/:id/status</code> — Updates status and faculty presence payload from campus sensors or admin console.</li>
          <li><code>GET /api/stats</code> — Returns summary metrics (Total, Available, Occupied, Faculty Present, Faculty Absent).</li>
        </ul>
      </div>

      <div className="about-card">
        <h2>Campus Block Directory</h2>
        <ul>
          <li><strong>Block A (Science & Tech)</strong>: Floors 1 to 3 — Lecture halls, smart classrooms, Physics/Chemistry tutorial rooms.</li>
          <li><strong>Block B (Engineering)</strong>: Floors 1 to 3 — Core engineering labs, tutorial batch rooms, Machine Learning workstation labs.</li>
          <li><strong>Block C (Management & Humanities)</strong>: Floors 1 to 3 — Seminar halls, executive conference rooms, group discussion classrooms.</li>
          <li><strong>Block D (Advanced Computing)</strong>: Floors 1 to 4 — Cloud computing labs, robotics testbeds, and top-floor auditorium.</li>
        </ul>
      </div>
    </div>
  );
}
