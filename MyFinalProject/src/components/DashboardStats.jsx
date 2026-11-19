import React from 'react';

export default function DashboardStats({ stats, onStatClick }) {
  if (!stats) return null;

  return (
    <div className="stats-grid">
      <div 
        className="stat-card" 
        onClick={() => onStatClick && onStatClick('ALL')}
        style={{ cursor: onStatClick ? 'pointer' : 'default' }}
      >
        <div className="stat-header">
          <span className="stat-label">Total Rooms</span>
        </div>
        <div className="stat-value">{stats.totalRooms}</div>
        <div className="stat-footer">Across Blocks A, B, C, D</div>
      </div>

      <div 
        className="stat-card stat-available"
        onClick={() => onStatClick && onStatClick('AVAILABLE')}
        style={{ cursor: onStatClick ? 'pointer' : 'default' }}
      >
        <div className="stat-header">
          <span className="stat-label">Available Rooms</span>
          <span className="badge badge-available">Ready</span>
        </div>
        <div className="stat-value">{stats.availableRooms}</div>
        <div className="stat-footer">Empty and No Faculty</div>
      </div>

      <div 
        className="stat-card stat-occupied"
        onClick={() => onStatClick && onStatClick('OCCUPIED')}
        style={{ cursor: onStatClick ? 'pointer' : 'default' }}
      >
        <div className="stat-header">
          <span className="stat-label">Occupied Rooms</span>
          <span className="badge badge-occupied">In Use</span>
        </div>
        <div className="stat-value">{stats.occupiedRooms}</div>
        <div className="stat-footer">Lectures or Sessions</div>
      </div>

      <div 
        className="stat-card stat-faculty-present"
        onClick={() => onStatClick && onStatClick('FACULTY_PRESENT')}
        style={{ cursor: onStatClick ? 'pointer' : 'default' }}
      >
        <div className="stat-header">
          <span className="stat-label">Faculty Present</span>
          <span className="badge badge-faculty-present">Active</span>
        </div>
        <div className="stat-value">{stats.facultyPresent}</div>
        <div className="stat-footer">Conducting Classes/Labs</div>
      </div>

      <div 
        className="stat-card stat-faculty-absent"
        onClick={() => onStatClick && onStatClick('FACULTY_ABSENT')}
        style={{ cursor: onStatClick ? 'pointer' : 'default' }}
      >
        <div className="stat-header">
          <span className="stat-label">Faculty Absent</span>
          <span className="badge badge-faculty-absent">Free</span>
        </div>
        <div className="stat-value">{stats.facultyAbsent}</div>
        <div className="stat-footer">No Instructor Assigned</div>
      </div>
    </div>
  );
}
