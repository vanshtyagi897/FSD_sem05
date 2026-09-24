import React, { useState } from 'react';
import { isRoomAvailable } from '../services/roomApi';

const COMMON_FACILITIES = [
  'Projector',
  'Whiteboard',
  'Smart Board',
  'Air Conditioning',
  'Audio System',
  'LAN Ports',
  'Workstations',
  'Video Conferencing',
];

export default function RoomDetailsModal({ room, onClose, onUpdateRoom, onDeleteRoom }) {
  if (!room) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(room.id);
  const [editBlock, setEditBlock] = useState(room.block);
  const [editFloor, setEditFloor] = useState(room.floor);
  const [editRoomType, setEditRoomType] = useState(room.roomType || 'Classroom');
  const [editCapacity, setEditCapacity] = useState(room.capacity || 60);
  const [editStatus, setEditStatus] = useState(room.status);
  const [editFacultyPresent, setEditFacultyPresent] = useState(room.facultyPresent);
  const [editFacultyName, setEditFacultyName] = useState(room.facultyName || '');
  const [editSubject, setEditSubject] = useState(room.subject || '');
  const [editFacilities, setEditFacilities] = useState(room.facilities || ['Projector', 'Whiteboard', 'AC']);
  const [editNotes, setEditNotes] = useState(room.notes || '');
  const [error, setError] = useState('');

  const available = isRoomAvailable(room);

  const handleFacilityToggle = (fac) => {
    setEditFacilities((prev) =>
      prev.includes(fac) ? prev.filter((f) => f !== fac) : [...prev, fac]
    );
  };

  const handleSave = () => {
    setError('');

    if (editFacultyPresent && !editFacultyName.trim()) {
      setError('Please provide the faculty name.');
      return;
    }

    if (editStatus === 'Occupied' && !editSubject.trim()) {
      setError('Please provide the current subject/activity for occupied room.');
      return;
    }

    try {
      onUpdateRoom(room.id, {
        id: editId.trim().toUpperCase(),
        block: editBlock.trim().toUpperCase(),
        floor: Number(editFloor),
        roomType: editRoomType,
        capacity: Number(editCapacity),
        status: editStatus,
        facultyPresent: editStatus === 'Available' ? false : editFacultyPresent,
        facultyName: editFacultyPresent ? editFacultyName.trim() : null,
        subject: editStatus === 'Occupied' ? editSubject.trim() : null,
        facilities: editFacilities,
        notes: editNotes.trim(),
      });
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update room.');
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete Room ${room.id}? This action cannot be undone.`)) {
      onDeleteRoom(room.id);
      onClose();
    }
  };

  const handleQuickToggle = () => {
    if (available) {
      // Make Occupied
      onUpdateRoom(room.id, {
        status: 'Occupied',
        facultyPresent: true,
        facultyName: 'Dr. Sharma',
        subject: 'Data Structures Lecture',
      });
    } else {
      // Make Available
      onUpdateRoom(room.id, {
        status: 'Available',
        facultyPresent: false,
        facultyName: null,
        subject: null,
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-content-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-room-title"
      >
        <div className="modal-header">
          <div>
            <div className="modal-title" id="modal-room-title">
              Room {room.id} {isEditing ? '— Edit Details' : 'Details'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Block {room.block} · Floor {room.floor} · Last updated {room.lastUpdated}
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {error && (
            <div className="form-alert-error" role="alert">
              {error}
            </div>
          )}

          {!isEditing ? (
            <>
              <div className="modal-grid">
                <div className="modal-field">
                  <span className="modal-field-label">Current Status</span>
                  <div className="modal-field-value">
                    <span className={`badge ${available ? 'badge-available' : 'badge-occupied'}`}>
                      {available ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                </div>

                <div className="modal-field">
                  <span className="modal-field-label">Faculty Status</span>
                  <div className="modal-field-value">
                    {room.facultyPresent ? (
                      <span className="badge badge-faculty-present">
                        {room.facultyName || 'Faculty Present'}
                      </span>
                    ) : (
                      <span className="badge badge-faculty-absent">None (Absent)</span>
                    )}
                  </div>
                </div>

                <div className="modal-field">
                  <span className="modal-field-label">Building / Block</span>
                  <div className="modal-field-value">Block {room.block}</div>
                </div>

                <div className="modal-field">
                  <span className="modal-field-label">Floor Number</span>
                  <div className="modal-field-value">Floor {room.floor}</div>
                </div>

                <div className="modal-field">
                  <span className="modal-field-label">Room Type</span>
                  <div className="modal-field-value">{room.roomType}</div>
                </div>

                <div className="modal-field">
                  <span className="modal-field-label">Seating Capacity</span>
                  <div className="modal-field-value">{room.capacity} Students</div>
                </div>

                <div className="modal-field modal-field-full">
                  <span className="modal-field-label">Current Class / Subject</span>
                  <div className="modal-field-value">
                    {room.subject ? room.subject : 'None (Room Empty)'}
                  </div>
                </div>

                <div className="modal-field modal-field-full">
                  <span className="modal-field-label">Last Updated Time</span>
                  <div className="modal-field-value" style={{ fontFamily: 'var(--font-mono)' }}>
                    {room.lastUpdated}
                  </div>
                </div>
              </div>

              {room.facilities && room.facilities.length > 0 && (
                <div>
                  <div className="modal-section-title">Room Facilities</div>
                  <div className="tag-list">
                    {room.facilities.map((fac, idx) => (
                      <span key={idx} className="tag-item">
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {room.notes && (
                <div>
                  <div className="modal-section-title">Schedule Notes & Information</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {room.notes}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-section-label">Basic Room Information</div>
              <div className="modal-grid">
                <div className="modal-field">
                  <label className="modal-field-label">Room ID</label>
                  <input
                    type="text"
                    className="search-input"
                    value={editId}
                    onChange={(e) => setEditId(e.target.value)}
                  />
                </div>

                <div className="modal-field">
                  <label className="modal-field-label">Block / Building</label>
                  <input
                    type="text"
                    className="search-input"
                    value={editBlock}
                    onChange={(e) => setEditBlock(e.target.value)}
                  />
                </div>

                <div className="modal-field">
                  <label className="modal-field-label">Floor</label>
                  <select
                    className="filter-select"
                    value={editFloor}
                    onChange={(e) => setEditFloor(e.target.value)}
                  >
                    <option value="1">Floor 1</option>
                    <option value="2">Floor 2</option>
                    <option value="3">Floor 3</option>
                    <option value="4">Floor 4</option>
                    <option value="5">Floor 5</option>
                  </select>
                </div>

                <div className="modal-field">
                  <label className="modal-field-label">Room Type</label>
                  <select
                    className="filter-select"
                    value={editRoomType}
                    onChange={(e) => setEditRoomType(e.target.value)}
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Lecture Hall">Lecture Hall</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Seminar Hall">Seminar Hall</option>
                    <option value="Tutorial Room">Tutorial Room</option>
                    <option value="Conference Room">Conference Room</option>
                    <option value="Research Lab">Research Lab</option>
                  </select>
                </div>

                <div className="modal-field">
                  <label className="modal-field-label">Capacity (Seats)</label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    className="search-input"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-section-label">Availability & Faculty Details</div>
              <div className="modal-grid">
                <div className="modal-field">
                  <label className="modal-field-label">Room Status</label>
                  <select
                    className="filter-select"
                    value={editStatus}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setEditStatus(newStatus);
                      if (newStatus === 'Available') {
                        setEditFacultyPresent(false);
                        setEditFacultyName('');
                        setEditSubject('');
                      }
                    }}
                  >
                    <option value="Available">Available (Empty)</option>
                    <option value="Occupied">Occupied (In Session)</option>
                  </select>
                </div>

                <div className="modal-field">
                  <label className="modal-field-label">Faculty Presence</label>
                  <select
                    className="filter-select"
                    value={editFacultyPresent ? 'true' : 'false'}
                    disabled={editStatus === 'Available'}
                    onChange={(e) => setEditFacultyPresent(e.target.value === 'true')}
                  >
                    <option value="false">Faculty Absent</option>
                    <option value="true">Faculty Present</option>
                  </select>
                </div>

                {editFacultyPresent && (
                  <div className="modal-field modal-field-full">
                    <label className="modal-field-label">Faculty Name</label>
                    <input
                      type="text"
                      className="search-input"
                      value={editFacultyName}
                      placeholder="e.g. Dr. Sharma"
                      onChange={(e) => setEditFacultyName(e.target.value)}
                    />
                  </div>
                )}

                {editStatus === 'Occupied' && (
                  <div className="modal-field modal-field-full">
                    <label className="modal-field-label">Current Subject / Class</label>
                    <input
                      type="text"
                      className="search-input"
                      value={editSubject}
                      placeholder="e.g. Data Structures"
                      onChange={(e) => setEditSubject(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="form-section-label">Facilities</div>
              <div className="facilities-checkbox-grid">
                {COMMON_FACILITIES.map((fac) => (
                  <label key={fac} className="facility-checkbox-label">
                    <input
                      type="checkbox"
                      checked={editFacilities.includes(fac)}
                      onChange={() => handleFacilityToggle(fac)}
                    />
                    <span>{fac}</span>
                  </label>
                ))}
              </div>

              <div className="form-section-label" style={{ marginTop: '10px' }}>
                Schedule Notes
              </div>
              <div className="modal-field modal-field-full">
                <textarea
                  className="search-input"
                  style={{ minHeight: '60px', resize: 'vertical' }}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div>
            {!isEditing ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-action btn-secondary btn-sm"
                  onClick={handleQuickToggle}
                  title="Simulate quick status toggle"
                >
                  {available ? 'Simulate Occupied' : 'Simulate Vacated'}
                </button>
                {onDeleteRoom && (
                  <button
                    type="button"
                    className="btn-action btn-danger btn-sm"
                    onClick={handleDelete}
                  >
                    Delete Room
                  </button>
                )}
              </div>
            ) : null}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {!isEditing ? (
              <>
                <button
                  type="button"
                  className="btn-action btn-secondary btn-sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  className="btn-action btn-primary btn-sm"
                  onClick={onClose}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-action btn-secondary btn-sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-action btn-primary btn-sm"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
