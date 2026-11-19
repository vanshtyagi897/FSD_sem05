import { INITIAL_ROOMS_DATA } from '../data/mockRooms';

const STORAGE_KEY = 'campus_room_availability_data_v1';

/**
 * Helper to initialize or load rooms from local storage
 */
function loadRoomsData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // localStorage fallback
  }
  return [...INITIAL_ROOMS_DATA];
}

/**
 * Helper to save rooms to local storage
 */
function saveRoomsData(rooms) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  } catch {
    // ignore storage error
  }
}

/**
 * Determines if a room is truly "Available".
 * Core Rule: Room is empty (status === 'Available') AND Faculty is not present (!facultyPresent).
 */
export function isRoomAvailable(room) {
  return room.status === 'Available' && !room.facultyPresent;
}

/**
 * Room API Client Service
 * Supports Full CRUD operations with local storage persistence
 */
export const roomApi = {
  /**
   * Fetch all rooms with optional filtering
   */
  async getRooms(filters = {}) {
    let rooms = loadRoomsData();

    // Apply search filter (by room ID, subject, or faculty name)
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.trim().toLowerCase();
      rooms = rooms.filter((r) => {
        const matchId = r.id.toLowerCase().includes(q);
        const matchBlock = `block ${r.block.toLowerCase()}`.includes(q) || r.block.toLowerCase() === q;
        const matchSubject = r.subject ? r.subject.toLowerCase().includes(q) : false;
        const matchFaculty = r.facultyName ? r.facultyName.toLowerCase().includes(q) : false;
        const matchType = r.roomType ? r.roomType.toLowerCase().includes(q) : false;
        return matchId || matchBlock || matchSubject || matchFaculty || matchType;
      });
    }

    // Apply Block filter
    if (filters.block && filters.block !== 'ALL') {
      rooms = rooms.filter((r) => r.block === filters.block);
    }

    // Apply Floor filter
    if (filters.floor && filters.floor !== 'ALL') {
      rooms = rooms.filter((r) => r.floor === Number(filters.floor));
    }

    // Apply Status / Availability filter
    if (filters.status && filters.status !== 'ALL') {
      if (filters.status === 'AVAILABLE') {
        rooms = rooms.filter((r) => isRoomAvailable(r));
      } else if (filters.status === 'OCCUPIED') {
        rooms = rooms.filter((r) => !isRoomAvailable(r));
      }
    }

    // Apply Faculty presence filter
    if (filters.faculty && filters.faculty !== 'ALL') {
      if (filters.faculty === 'PRESENT') {
        rooms = rooms.filter((r) => r.facultyPresent);
      } else if (filters.faculty === 'ABSENT') {
        rooms = rooms.filter((r) => !r.facultyPresent);
      }
    }

    return rooms;
  },

  /**
   * Fetch only currently available rooms
   */
  async getAvailableRooms(filters = {}) {
    const all = await this.getRooms(filters);
    return all.filter((r) => isRoomAvailable(r));
  },

  /**
   * Fetch a single room by alphanumeric ID
   */
  async getRoomById(id) {
    const rooms = loadRoomsData();
    const found = rooms.find((r) => r.id.toUpperCase() === id.toUpperCase());
    return found || null;
  },

  /**
   * Compute dashboard summary statistics
   */
  async getDashboardStats() {
    const rooms = loadRoomsData();
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((r) => isRoomAvailable(r)).length;
    const occupiedRooms = totalRooms - availableRooms;
    const facultyPresent = rooms.filter((r) => r.facultyPresent).length;
    const facultyAbsent = totalRooms - facultyPresent;

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      facultyPresent,
      facultyAbsent,
      lastSyncTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  },

  /**
   * Create a new room with user-entered details
   */
  async createRoom(roomData) {
    const rooms = loadRoomsData();
    const cleanId = roomData.id.trim().toUpperCase();

    // Check for duplicate ID
    if (rooms.some((r) => r.id.toUpperCase() === cleanId)) {
      throw new Error(`Room ID "${cleanId}" already exists. Please use a unique Room ID.`);
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
      notes: roomData.notes?.trim() || 'Newly registered room.',
    };

    rooms.unshift(newRoom);
    saveRoomsData(rooms);
    return newRoom;
  },

  /**
   * Update full details of an existing room
   */
  async updateRoom(id, updates) {
    const rooms = loadRoomsData();
    const index = rooms.findIndex((r) => r.id.toUpperCase() === id.toUpperCase());
    if (index === -1) {
      throw new Error(`Room ${id} not found`);
    }

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

    saveRoomsData(rooms);
    return rooms[index];
  },

  /**
   * Delete a room by ID
   */
  async deleteRoom(id) {
    let rooms = loadRoomsData();
    const initialLength = rooms.length;
    rooms = rooms.filter((r) => r.id.toUpperCase() !== id.toUpperCase());

    if (rooms.length === initialLength) {
      throw new Error(`Room ${id} not found`);
    }

    saveRoomsData(rooms);
    return { success: true, id };
  },

  /**
   * Reset data to default factory mock dataset
   */
  async resetToDefaults() {
    saveRoomsData([...INITIAL_ROOMS_DATA]);
    return [...INITIAL_ROOMS_DATA];
  },

  /**
   * Simulate random sensor update
   */
  async simulateSensorEvent() {
    const rooms = loadRoomsData();
    if (rooms.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * rooms.length);
    const targetRoom = rooms[randomIndex];

    const isCurrentlyAvail = isRoomAvailable(targetRoom);
    const newStatus = isCurrentlyAvail ? 'Occupied' : 'Available';
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let updatedRoom;
    if (newStatus === 'Occupied') {
      const sampleSubjects = [
        'Advanced Algorithms',
        'Machine Learning Workshop',
        'Database Practicals',
        'Computer Architecture',
        'Microprocessor Lab',
        'Peer Discussion Group'
      ];
      const sampleFaculty = [
        'Dr. Sharma',
        'Prof. Verma',
        'Dr. Ananya Iyer',
        'Prof. Rajesh Patel',
        'Dr. Priya Nair',
        null
      ];
      const fName = sampleFaculty[Math.floor(Math.random() * sampleFaculty.length)];
      const sub = sampleSubjects[Math.floor(Math.random() * sampleSubjects.length)];

      updatedRoom = {
        ...targetRoom,
        status: 'Occupied',
        facultyPresent: !!fName,
        facultyName: fName,
        subject: sub,
        lastUpdated: now,
        notes: fName ? `Class ongoing under ${fName}.` : 'Occupied for student session.'
      };
    } else {
      updatedRoom = {
        ...targetRoom,
        status: 'Available',
        facultyPresent: false,
        facultyName: null,
        subject: null,
        lastUpdated: now,
        notes: 'Room vacated. Sensor detected empty space.'
      };
    }

    rooms[randomIndex] = updatedRoom;
    saveRoomsData(rooms);
    return updatedRoom;
  }
};
