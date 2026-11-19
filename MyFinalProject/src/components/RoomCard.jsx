import React from 'react';
import { isRoomAvailable } from '../services/roomApi';

export default function RoomCard({ room, onSelectRoom }) {
  const available = isRoomAvailable(room);

  return (
    <div
      className={`room-card ${available ? 'card-available' : 'card-occupied'}`}
      onClick={() => onSelectRoom(room)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectRoom(room);
        }
      }}
    >
      <div className="room-card-top">
        <div>
          <div className="room-id">{room.id}</div>
          <div className="room-meta">
            Block {room.block} · Floor {room.floor} · {room.roomType}
          </div>
        </div>
        <div>
          <span className={`badge ${available ? 'badge-available' : 'badge-occupied'}`}>
            {available ? 'Available' : 'Occupied'}
          </span>
        </div>
      </div>

      <div className="room-card-body">
        <div className="room-info-row">
          <span className="room-info-label">Faculty</span>
          <span className="room-info-value">
            {room.facultyPresent ? (
              <span style={{ color: '#93c5fd' }}>{room.facultyName || 'Faculty Present'}</span>
            ) : (
              <span style={{ color: '#94a3b8' }}>None (Absent)</span>
            )}
          </span>
        </div>

        <div className="room-info-row">
          <span className="room-info-label">Current Subject</span>
          <span className="room-info-value" title={room.subject || 'None'}>
            {room.subject || 'None (Free Period)'}
          </span>
        </div>

        <div className="room-info-row">
          <span className="room-info-label">Seating Capacity</span>
          <span className="room-info-value">{room.capacity} Seats</span>
        </div>
      </div>

      <div className="room-card-footer">
        <span>Updated: {room.lastUpdated}</span>
        <span className="card-action-text">View Details</span>
      </div>
    </div>
  );
}
