import React from 'react';

export default function Navbar({ activeTab, setActiveTab, onOpenAddRoom }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="brand-badge">CRAS</span>
          <span className="brand-title">Campus Room Availability</span>
          <span className="brand-subtitle">Find empty classrooms</span>
        </div>

        <nav className="navbar-nav">
          <button
            type="button"
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            Rooms
          </button>
          <button
            type="button"
            className={`nav-link ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Rooms
          </button>
          <button
            type="button"
            className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
        </nav>

        <div className="navbar-actions">
          <button
            type="button"
            className="btn-action btn-primary btn-sm"
            onClick={onOpenAddRoom}
          >
            Add Room
          </button>
          <div className="btn-status-pulse">
            <span className="status-dot"></span>
            <span>Live System</span>
          </div>
        </div>
      </div>
    </header>
  );
}
