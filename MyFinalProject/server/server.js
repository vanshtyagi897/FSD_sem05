import express from 'express';
import cors from 'cors';
import { INITIAL_ROOMS_DATA } from '../src/data/mockRooms.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory rooms state for server
let rooms = [...INITIAL_ROOMS_DATA];

function isRoomAvailable(room) {
  return room.status === 'Available' && !room.facultyPresent;
}

// GET all rooms with query filtering
app.get('/api/rooms', (req, res) => {
  let result = [...rooms];
  const { search, block, floor, status, faculty } = req.query;

  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.block.toLowerCase().includes(q) ||
        (r.subject && r.subject.toLowerCase().includes(q)) ||
        (r.facultyName && r.facultyName.toLowerCase().includes(q)) ||
        (r.roomType && r.roomType.toLowerCase().includes(q))
    );
  }

  if (block && block !== 'ALL') {
    result = result.filter((r) => r.block === block);
  }

  if (floor && floor !== 'ALL') {
    result = result.filter((r) => r.floor === Number(floor));
  }

  if (status && status !== 'ALL') {
    if (status === 'AVAILABLE') {
      result = result.filter((r) => isRoomAvailable(r));
    } else if (status === 'OCCUPIED') {
      result = result.filter((r) => !isRoomAvailable(r));
    }
  }

  if (faculty && faculty !== 'ALL') {
    if (faculty === 'PRESENT') {
      result = result.filter((r) => r.facultyPresent);
    } else if (faculty === 'ABSENT') {
      result = result.filter((r) => !r.facultyPresent);
    }
  }

  res.json(result);
});

// GET available rooms only
app.get('/api/rooms/available', (req, res) => {
  const available = rooms.filter((r) => isRoomAvailable(r));
  res.json(available);
});

// GET stats summary
app.get('/api/stats', (req, res) => {
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => isRoomAvailable(r)).length;
  const occupiedRooms = totalRooms - availableRooms;
  const facultyPresent = rooms.filter((r) => r.facultyPresent).length;
  const facultyAbsent = totalRooms - facultyPresent;

  res.json({
    totalRooms,
    availableRooms,
    occupiedRooms,
    facultyPresent,
    facultyAbsent,
    lastSyncTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
});

// GET single room
app.get('/api/rooms/:id', (req, res) => {
  const { id } = req.params;
  const room = rooms.find((r) => r.id.toUpperCase() === id.toUpperCase());
  if (!room) {
    return res.status(404).json({ error: `Room ${id} not found` });
  }
  res.json(room);
});

// POST create new room
app.post('/api/rooms', (req, res) => {
  const roomData = req.body;
  if (!roomData.id || !roomData.block) {
    return res.status(400).json({ error: 'Room ID and Block are required' });
  }

  const cleanId = roomData.id.trim().toUpperCase();
  if (rooms.some((r) => r.id.toUpperCase() === cleanId)) {
    return res.status(400).json({ error: `Room ID ${cleanId} already exists` });
  }

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isAvailable = roomData.status === 'Available';

  const newRoom = {
    id: cleanId,
    block: roomData.block.trim().toUpperCase(),
    floor: Number(roomData.floor) || 1,
    roomType: roomData.roomType || 'Classroom',
    capacity: Number(roomData.capacity) || 50,
    status: roomData.status || 'Available',
    facultyPresent: Boolean(roomData.facultyPresent),
    facultyName: roomData.facultyPresent ? (roomData.facultyName?.trim() || 'Assigned Faculty') : null,
    subject: !isAvailable ? (roomData.subject?.trim() || null) : null,
    facilities: Array.isArray(roomData.facilities) ? roomData.facilities : ['Projector', 'Whiteboard', 'AC'],
    lastUpdated: now,
    notes: roomData.notes?.trim() || 'Newly created room.',
  };

  rooms.unshift(newRoom);
  res.status(201).json(newRoom);
});

// PUT update room
app.put('/api/rooms/:id', (req, res) => {
  const { id } = req.params;
  const index = rooms.findIndex((r) => r.id.toUpperCase() === id.toUpperCase());
  if (index === -1) {
    return res.status(404).json({ error: `Room ${id} not found` });
  }

  const updates = req.body;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let finalFacultyPresent = updates.facultyPresent !== undefined ? updates.facultyPresent : rooms[index].facultyPresent;
  let finalFacultyName = updates.facultyName !== undefined ? updates.facultyName : rooms[index].facultyName;
  let finalSubject = updates.subject !== undefined ? updates.subject : rooms[index].subject;
  let finalStatus = updates.status !== undefined ? updates.status : rooms[index].status;

  if (finalStatus === 'Available' && updates.facultyPresent === undefined) {
    finalFacultyPresent = false;
    finalFacultyName = null;
    finalSubject = null;
  }

  rooms[index] = {
    ...rooms[index],
    ...updates,
    id: updates.id ? updates.id.trim().toUpperCase() : rooms[index].id,
    block: updates.block ? updates.block.trim().toUpperCase() : rooms[index].block,
    floor: updates.floor !== undefined ? Number(updates.floor) : rooms[index].floor,
    capacity: updates.capacity !== undefined ? Number(updates.capacity) : rooms[index].capacity,
    roomType: updates.roomType || rooms[index].roomType,
    status: finalStatus,
    facultyPresent: finalFacultyPresent,
    facultyName: finalFacultyPresent ? (finalFacultyName?.trim() || 'Assigned Faculty') : null,
    subject: finalStatus === 'Occupied' ? (finalSubject?.trim() || null) : null,
    facilities: updates.facilities !== undefined ? updates.facilities : rooms[index].facilities,
    notes: updates.notes !== undefined ? updates.notes : rooms[index].notes,
    lastUpdated: now,
  };

  res.json(rooms[index]);
});

// PUT update room status (IoT sensor / Admin API)
app.put('/api/rooms/:id/status', (req, res) => {
  const { id } = req.params;
  const index = rooms.findIndex((r) => r.id.toUpperCase() === id.toUpperCase());
  if (index === -1) {
    return res.status(404).json({ error: `Room ${id} not found` });
  }

  const updates = req.body;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let finalFacultyPresent = updates.facultyPresent !== undefined ? updates.facultyPresent : rooms[index].facultyPresent;
  let finalFacultyName = updates.facultyName !== undefined ? updates.facultyName : rooms[index].facultyName;
  let finalSubject = updates.subject !== undefined ? updates.subject : rooms[index].subject;

  if (updates.status === 'Available' && updates.facultyPresent === undefined) {
    finalFacultyPresent = false;
    finalFacultyName = null;
    finalSubject = null;
  }

  rooms[index] = {
    ...rooms[index],
    ...updates,
    facultyPresent: finalFacultyPresent,
    facultyName: finalFacultyPresent ? finalFacultyName : null,
    subject: updates.status === 'Occupied' ? finalSubject : null,
    lastUpdated: now,
  };

  res.json(rooms[index]);
});

// DELETE room
app.delete('/api/rooms/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = rooms.length;
  rooms = rooms.filter((r) => r.id.toUpperCase() !== id.toUpperCase());

  if (rooms.length === initialLength) {
    return res.status(404).json({ error: `Room ${id} not found` });
  }

  res.json({ message: `Room ${id} deleted successfully` });
});

// POST reset to defaults
app.post('/api/reset', (req, res) => {
  rooms = [...INITIAL_ROOMS_DATA];
  res.json({ message: 'Reset to default dataset successful', count: rooms.length });
});

app.listen(PORT, () => {
  console.log(`Campus Room Availability API Server running on port ${PORT}`);
});
