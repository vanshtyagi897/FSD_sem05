import React from 'react';
import RoomCard from './RoomCard';

export default function RoomList({ rooms, onSelectRoom, emptyMessage = 'No matching rooms found.' }) {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">No Rooms Found</div>
        <div className="empty-state-text">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="room-grid">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onSelectRoom={onSelectRoom} />
      ))}
    </div>
  );
}
