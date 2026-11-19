import React, { useState } from 'react';

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

export default function AddRoomModal({ onClose, onAddRoom }) {
  const [roomId, setRoomId] = useState('');
  const [block, setBlock] = useState('A');
  const [customBlock, setCustomBlock] = useState('');
  const [floor, setFloor] = useState('1');
  const [roomType, setRoomType] = useState('Classroom');
  const [capacity, setCapacity] = useState('60');
  const [status, setStatus] = useState('Available');
  const [facultyPresent, setFacultyPresent] = useState(false);
  const [facultyName, setFacultyName] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState(['Projector', 'Whiteboard', 'Air Conditioning']);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleFacilityToggle = (facility) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanId = roomId.trim().toUpperCase();
    if (!cleanId) {
      setError('Please provide a Room ID (e.g. A104, B205, E101).');
      return;
    }

    const finalBlock = block === 'CUSTOM' ? customBlock.trim().toUpperCase() : block;
    if (!finalBlock) {
      setError('Please specify a valid Building/Block identifier.');
      return;
    }

    const parsedCapacity = Number(capacity);
    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      setError('Please enter a valid seating capacity greater than zero.');
      return;
    }

    if (facultyPresent && !facultyName.trim()) {
      setError('Please specify the name of the present faculty member.');
      return;
    }

    if (status === 'Occupied' && !subject.trim()) {
      setError('Please specify the current class, subject, or ongoing activity.');
      return;
    }

    try {
      onAddRoom({
        id: cleanId,
        block: finalBlock,
        floor: Number(floor),
        roomType,
        capacity: parsedCapacity,
        status,
        facultyPresent: status === 'Available' ? false : facultyPresent,
        facultyName: facultyPresent ? facultyName.trim() : null,
        subject: status === 'Occupied' ? subject.trim() : null,
        facilities: selectedFacilities,
        notes: notes.trim() || 'Custom room registered by user.',
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create room.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-content-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-add-title"
      >
        <div className="modal-header">
          <div>
            <div className="modal-title" id="modal-add-title">
              Add New Room & Faculty Details
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Register a new classroom, lecture hall, or lab in the campus database
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {error && (
              <div className="form-alert-error" role="alert">
                {error}
              </div>
            )}

            <div className="form-section-label">Room Information</div>
            <div className="modal-grid">
              <div className="modal-field">
                <label className="modal-field-label" htmlFor="room-id-input">
                  Room ID (Alphanumeric) *
                </label>
                <input
                  id="room-id-input"
                  type="text"
                  className="search-input"
                  placeholder="e.g. A104, B205, D303"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  required
                />
              </div>

              <div className="modal-field">
                <label className="modal-field-label" htmlFor="block-select">
                  Building / Block *
                </label>
                <select
                  id="block-select"
                  className="filter-select"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                >
                  <option value="A">Block A (Science & Tech)</option>
                  <option value="B">Block B (Engineering)</option>
                  <option value="C">Block C (Management)</option>
                  <option value="D">Block D (Computing)</option>
                  <option value="E">Block E (Humanities)</option>
                  <option value="CUSTOM">Custom Block...</option>
                </select>
              </div>

              {block === 'CUSTOM' && (
                <div className="modal-field">
                  <label className="modal-field-label" htmlFor="custom-block-input">
                    Custom Block Identifier *
                  </label>
                  <input
                    id="custom-block-input"
                    type="text"
                    className="search-input"
                    placeholder="e.g. F, Main, Admin"
                    value={customBlock}
                    onChange={(e) => setCustomBlock(e.target.value)}
                  />
                </div>
              )}

              <div className="modal-field">
                <label className="modal-field-label" htmlFor="floor-select">
                  Floor Number *
                </label>
                <select
                  id="floor-select"
                  className="filter-select"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                >
                  <option value="1">Floor 1</option>
                  <option value="2">Floor 2</option>
                  <option value="3">Floor 3</option>
                  <option value="4">Floor 4</option>
                  <option value="5">Floor 5</option>
                </select>
              </div>

              <div className="modal-field">
                <label className="modal-field-label" htmlFor="type-select">
                  Room Type *
                </label>
                <select
                  id="type-select"
                  className="filter-select"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
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
                <label className="modal-field-label" htmlFor="capacity-input">
                  Seating Capacity (Students) *
                </label>
                <input
                  id="capacity-input"
                  type="number"
                  min="5"
                  max="500"
                  className="search-input"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-section-label">Availability & Faculty Status</div>
            <div className="modal-grid">
              <div className="modal-field">
                <label className="modal-field-label" htmlFor="status-select">
                  Current Room Status *
                </label>
                <select
                  id="status-select"
                  className="filter-select"
                  value={status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setStatus(newStatus);
                    if (newStatus === 'Available') {
                      setFacultyPresent(false);
                      setFacultyName('');
                      setSubject('');
                    }
                  }}
                >
                  <option value="Available">Available (Empty)</option>
                  <option value="Occupied">Occupied (In Session)</option>
                </select>
              </div>

              <div className="modal-field">
                <label className="modal-field-label" htmlFor="faculty-select">
                  Faculty Presence *
                </label>
                <select
                  id="faculty-select"
                  className="filter-select"
                  value={facultyPresent ? 'true' : 'false'}
                  disabled={status === 'Available'}
                  onChange={(e) => setFacultyPresent(e.target.value === 'true')}
                >
                  <option value="false">Faculty Absent</option>
                  <option value="true">Faculty Present</option>
                </select>
              </div>

              {facultyPresent && (
                <div className="modal-field modal-field-full">
                  <label className="modal-field-label" htmlFor="faculty-name-input">
                    Faculty Name *
                  </label>
                  <input
                    id="faculty-name-input"
                    type="text"
                    className="search-input"
                    placeholder="e.g. Dr. A. Sharma, Prof. R. Verma"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    required={facultyPresent}
                  />
                </div>
              )}

              {status === 'Occupied' && (
                <div className="modal-field modal-field-full">
                  <label className="modal-field-label" htmlFor="subject-input">
                    Current Class / Course / Subject *
                  </label>
                  <input
                    id="subject-input"
                    type="text"
                    className="search-input"
                    placeholder="e.g. Data Structures, Operating Systems, Peer Study"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required={status === 'Occupied'}
                  />
                </div>
              )}
            </div>

            <div className="form-section-label">Room Facilities</div>
            <div className="facilities-checkbox-grid">
              {COMMON_FACILITIES.map((facility) => (
                <label key={facility} className="facility-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedFacilities.includes(facility)}
                    onChange={() => handleFacilityToggle(facility)}
                  />
                  <span>{facility}</span>
                </label>
              ))}
            </div>

            <div className="form-section-label" style={{ marginTop: '16px' }}>
              Schedule & Operational Notes
            </div>
            <div className="modal-field modal-field-full">
              <textarea
                className="search-input"
                style={{ minHeight: '60px', resize: 'vertical' }}
                placeholder="Optional notes regarding room schedule, booking conditions, or equipment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-action btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-action btn-primary"
            >
              Save & Register Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
