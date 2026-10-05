import React from 'react';
import { isRoomAvailable } from '../services/roomApi';

export default function RoomTable({ rooms, onSelectRoom }) {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">No Rooms Found</div>
        <div className="empty-state-text">Try adjusting your filters or search criteria.</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="room-table">
        <thead>
          <tr>
            <th>Room ID</th>
            <th>Block</th>
            <th>Floor</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Faculty</th>
            <th>Subject</th>
            <th>Last Updated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => {
            const available = isRoomAvailable(room);
            return (
              <tr key={room.id} onClick={() => onSelectRoom(room)}>
                <td className="table-id">{room.id}</td>
                <td>Block {room.block}</td>
                <td>Floor {room.floor}</td>
                <td>{room.roomType}</td>
                <td>{room.capacity} seats</td>
                <td>
                  <span className={`badge ${available ? 'badge-available' : 'badge-occupied'}`}>
                    {available ? 'Available' : 'Occupied'}
                  </span>
                </td>
                <td>
                  {room.facultyPresent ? (
                    <span className="badge badge-faculty-present">
                      {room.facultyName || 'Present'}
                    </span>
                  ) : (
                    <span className="badge badge-faculty-absent">Absent</span>
                  )}
                </td>
                <td>{room.subject || '—'}</td>
                <td style={{ color: 'var(--text-muted)' }}>{room.lastUpdated}</td>
                <td>
                  <button
                    type="button"
                    className="btn-action btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRoom(room);
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
