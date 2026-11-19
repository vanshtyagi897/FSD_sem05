import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import RoomList from './components/RoomList';
import RoomTable from './components/RoomTable';
import RoomDetailsModal from './components/RoomDetailsModal';
import AddRoomModal from './components/AddRoomModal';
import AboutView from './components/AboutView';
import { roomApi, isRoomAvailable } from './services/roomApi';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('ALL');
  const [selectedFloor, setSelectedFloor] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedFaculty, setSelectedFaculty] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load rooms and statistics
  const loadData = useCallback(async () => {
    try {
      const [allRooms, currentStats] = await Promise.all([
        roomApi.getRooms(),
        roomApi.getDashboardStats(),
      ]);
      setRooms(allRooms);
      setStats(currentStats);
    } catch (err) {
      console.error('Failed to load room data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBlock('ALL');
    setSelectedFloor('ALL');
    setSelectedStatus('ALL');
    setSelectedFaculty('ALL');
  };

  const hasActiveFilters = Boolean(
    searchTerm.trim() !== '' ||
    selectedBlock !== 'ALL' ||
    selectedFloor !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    selectedFaculty !== 'ALL'
  );

  // Filtered rooms calculation
  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    if (searchTerm.trim() !== '') {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter((r) => {
        const matchId = r.id.toLowerCase().includes(q);
        const matchBlock = `block ${r.block.toLowerCase()}`.includes(q) || r.block.toLowerCase() === q;
        const matchSubject = r.subject ? r.subject.toLowerCase().includes(q) : false;
        const matchFaculty = r.facultyName ? r.facultyName.toLowerCase().includes(q) : false;
        const matchType = r.roomType ? r.roomType.toLowerCase().includes(q) : false;
        return matchId || matchBlock || matchSubject || matchFaculty || matchType;
      });
    }

    if (selectedBlock !== 'ALL') {
      result = result.filter((r) => r.block === selectedBlock);
    }

    if (selectedFloor !== 'ALL') {
      result = result.filter((r) => r.floor === Number(selectedFloor));
    }

    if (selectedStatus !== 'ALL') {
      if (selectedStatus === 'AVAILABLE') {
        result = result.filter((r) => isRoomAvailable(r));
      } else if (selectedStatus === 'OCCUPIED') {
        result = result.filter((r) => !isRoomAvailable(r));
      }
    }

    if (selectedFaculty !== 'ALL') {
      if (selectedFaculty === 'PRESENT') {
        result = result.filter((r) => r.facultyPresent);
      } else if (selectedFaculty === 'ABSENT') {
        result = result.filter((r) => !r.facultyPresent);
      }
    }

    return result;
  }, [rooms, searchTerm, selectedBlock, selectedFloor, selectedStatus, selectedFaculty]);

  // Available rooms calculation (Empty + Faculty Absent)
  const availableRooms = useMemo(() => {
    return rooms.filter((r) => isRoomAvailable(r));
  }, [rooms]);

  // Quick stat card click filter handler
  const handleStatClick = (filterType) => {
    handleResetFilters();
    if (filterType === 'AVAILABLE') {
      setActiveTab('available');
    } else if (filterType === 'OCCUPIED') {
      setActiveTab('rooms');
      setSelectedStatus('OCCUPIED');
    } else if (filterType === 'FACULTY_PRESENT') {
      setActiveTab('rooms');
      setSelectedFaculty('PRESENT');
    } else if (filterType === 'FACULTY_ABSENT') {
      setActiveTab('rooms');
      setSelectedFaculty('ABSENT');
    } else {
      setActiveTab('rooms');
    }
  };

  // Add new room handler
  const handleAddRoom = async (newRoomData) => {
    try {
      const created = await roomApi.createRoom(newRoomData);
      setRooms((prev) => [created, ...prev]);
      const newStats = await roomApi.getDashboardStats();
      setStats(newStats);
      showToast(`Room ${created.id} registered successfully.`);
    } catch (err) {
      showToast(err.message || 'Failed to add room.', 'error');
      throw err;
    }
  };

  // Update room handler
  const handleUpdateRoom = async (id, updates) => {
    try {
      const updated = await roomApi.updateRoom(id, updates);
      setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)));
      if (selectedRoom && selectedRoom.id === id) {
        setSelectedRoom(updated);
      }
      const newStats = await roomApi.getDashboardStats();
      setStats(newStats);
      showToast(`Room ${updated.id} details updated.`);
    } catch (err) {
      showToast(err.message || 'Failed to update room.', 'error');
      throw err;
    }
  };

  // Delete room handler
  const handleDeleteRoom = async (id) => {
    try {
      await roomApi.deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
      if (selectedRoom && selectedRoom.id === id) {
        setSelectedRoom(null);
      }
      const newStats = await roomApi.getDashboardStats();
      setStats(newStats);
      showToast(`Room ${id} deleted successfully.`);
    } catch (err) {
      showToast(err.message || 'Failed to delete room.', 'error');
    }
  };

  // Sensor simulation trigger
  const handleSimulateSensor = async () => {
    try {
      const updated = await roomApi.simulateSensorEvent();
      if (!updated) return;
      await loadData();
      if (selectedRoom && selectedRoom.id === updated.id) {
        setSelectedRoom(updated);
      }
      showToast(`Sensor Event: Room ${updated.id} is now ${updated.status}.`);
    } catch (err) {
      console.error('Sensor simulation failed', err);
    }
  };

  // Reset to default mock data
  const handleResetData = async () => {
    if (window.confirm('Reset all rooms to default factory mock dataset?')) {
      await roomApi.resetToDefaults();
      await loadData();
      showToast('System data reset to default 28 campus rooms.');
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddRoom={() => setIsAddModalOpen(true)}
      />

      {toastMessage && (
        <div className="toast-container">
          <div className={`toast ${toastMessage.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      <main className="main-content">
        {isLoading ? (
          <div className="empty-state">
            <div className="empty-state-title">Loading Campus Room Data...</div>
            <div className="empty-state-text">Fetching current availability from system service.</div>
          </div>
        ) : (
          <>
            {/* VIEW 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div>
                <div className="page-header">
                  <div>
                    <h1 className="page-title">Campus Room Availability</h1>
                    <p className="page-description">
                      Find currently empty classrooms with no faculty present across college blocks.
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn-action btn-primary"
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      Add New Room
                    </button>
                  </div>
                </div>

                {/* Dashboard Summary Stats */}
                <DashboardStats stats={stats} onStatClick={handleStatClick} />

                {/* Search & Filter Controls */}
                <div className="controls-panel">
                  <div className="controls-row">
                    <SearchBar
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                    />
                    <Filters
                      selectedBlock={selectedBlock}
                      onBlockChange={setSelectedBlock}
                      selectedFloor={selectedFloor}
                      onFloorChange={setSelectedFloor}
                      selectedStatus={selectedStatus}
                      onStatusChange={setSelectedStatus}
                      selectedFaculty={selectedFaculty}
                      onFacultyChange={setSelectedFaculty}
                      onResetFilters={handleResetFilters}
                      hasActiveFilters={hasActiveFilters}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                    />
                  </div>
                </div>

                {/* Sensor Simulation & Data Management Action Bar */}
                <div className="sim-panel">
                  <div className="sim-info">
                    <strong>Detection Simulator:</strong> Test real-time IoT updates or simulated campus sensor events.
                  </div>
                  <div className="sim-actions">
                    <button
                      type="button"
                      className="btn-action btn-secondary btn-sm"
                      onClick={handleSimulateSensor}
                    >
                      Simulate Sensor Event
                    </button>
                    <button
                      type="button"
                      className="btn-action btn-secondary btn-sm"
                      onClick={handleResetData}
                    >
                      Reset Data
                    </button>
                  </div>
                </div>

                {/* Available Rooms Section Highlight */}
                {!hasActiveFilters && (
                  <div style={{ marginBottom: '28px' }}>
                    <div className="section-header">
                      <div className="section-title">Currently Available Rooms</div>
                      <div className="section-counter">
                        {availableRooms.length} of {rooms.length} Rooms Ready
                      </div>
                    </div>

                    <RoomList
                      rooms={availableRooms.slice(0, 6)}
                      onSelectRoom={setSelectedRoom}
                      emptyMessage="No rooms are currently available."
                    />

                    {availableRooms.length > 6 && (
                      <div style={{ textAlign: 'center', marginTop: '-12px', marginBottom: '24px' }}>
                        <button
                          type="button"
                          className="btn-action btn-secondary"
                          onClick={() => setActiveTab('available')}
                        >
                          View All {availableRooms.length} Available Rooms
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* All Rooms Section */}
                <div>
                  <div className="section-header">
                    <div className="section-title">
                      {hasActiveFilters ? 'Filtered Room Results' : 'All Campus Rooms'}
                    </div>
                    <div className="section-counter">
                      Showing {filteredRooms.length} of {rooms.length} Rooms
                    </div>
                  </div>

                  {viewMode === 'cards' ? (
                    <RoomList
                      rooms={filteredRooms}
                      onSelectRoom={setSelectedRoom}
                      emptyMessage="No rooms match your search or filter criteria."
                    />
                  ) : (
                    <RoomTable
                      rooms={filteredRooms}
                      onSelectRoom={setSelectedRoom}
                    />
                  )}
                </div>
              </div>
            )}

            {/* VIEW 2: ALL ROOMS */}
            {activeTab === 'rooms' && (
              <div>
                <div className="page-header">
                  <div>
                    <h1 className="page-title">All College Rooms</h1>
                    <p className="page-description">
                      Complete directory of lecture halls, laboratories, and classrooms.
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn-action btn-primary"
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      Add New Room
                    </button>
                  </div>
                </div>

                <div className="controls-panel">
                  <div className="controls-row">
                    <SearchBar
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                    />
                    <Filters
                      selectedBlock={selectedBlock}
                      onBlockChange={setSelectedBlock}
                      selectedFloor={selectedFloor}
                      onFloorChange={setSelectedFloor}
                      selectedStatus={selectedStatus}
                      onStatusChange={setSelectedStatus}
                      selectedFaculty={selectedFaculty}
                      onFacultyChange={setSelectedFaculty}
                      onResetFilters={handleResetFilters}
                      hasActiveFilters={hasActiveFilters}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                    />
                  </div>
                </div>

                <div className="section-header">
                  <div className="section-title">Room Directory</div>
                  <div className="section-counter">
                    {filteredRooms.length} Rooms Found
                  </div>
                </div>

                {viewMode === 'cards' ? (
                  <RoomList
                    rooms={filteredRooms}
                    onSelectRoom={setSelectedRoom}
                    emptyMessage="No rooms match the selected filters."
                  />
                ) : (
                  <RoomTable
                    rooms={filteredRooms}
                    onSelectRoom={setSelectedRoom}
                  />
                )}
              </div>
            )}

            {/* VIEW 3: AVAILABLE ROOMS */}
            {activeTab === 'available' && (
              <div>
                <div className="page-header">
                  <div>
                    <h1 className="page-title">Available Rooms Only</h1>
                    <p className="page-description">
                      Classrooms and lecture halls that are empty with no faculty present (Ready for study or allocation).
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn-action btn-primary"
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      Add New Room
                    </button>
                  </div>
                </div>

                <div className="controls-panel">
                  <div className="controls-row">
                    <SearchBar
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                    />
                    <Filters
                      selectedBlock={selectedBlock}
                      onBlockChange={setSelectedBlock}
                      selectedFloor={selectedFloor}
                      onFloorChange={setSelectedFloor}
                      selectedStatus="AVAILABLE"
                      onStatusChange={() => {}}
                      selectedFaculty="ABSENT"
                      onFacultyChange={() => {}}
                      onResetFilters={handleResetFilters}
                      hasActiveFilters={selectedBlock !== 'ALL' || selectedFloor !== 'ALL' || searchTerm.trim() !== ''}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                      showStatusFilter={false}
                    />
                  </div>
                </div>

                <div className="section-header">
                  <div className="section-title">Ready Rooms</div>
                  <div className="section-counter">
                    {filteredRooms.filter((r) => isRoomAvailable(r)).length} Available Rooms
                  </div>
                </div>

                {viewMode === 'cards' ? (
                  <RoomList
                    rooms={filteredRooms.filter((r) => isRoomAvailable(r))}
                    onSelectRoom={setSelectedRoom}
                    emptyMessage="No available rooms match your search/block filter."
                  />
                ) : (
                  <RoomTable
                    rooms={filteredRooms.filter((r) => isRoomAvailable(r))}
                    onSelectRoom={setSelectedRoom}
                  />
                )}
              </div>
            )}

            {/* VIEW 4: ABOUT & ARCHITECTURE */}
            {activeTab === 'about' && <AboutView />}
          </>
        )}
      </main>

      {/* Add Room Modal */}
      {isAddModalOpen && (
        <AddRoomModal
          onClose={() => setIsAddModalOpen(false)}
          onAddRoom={handleAddRoom}
        />
      )}

      {/* Room Details & Edit Modal */}
      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onUpdateRoom={handleUpdateRoom}
          onDeleteRoom={handleDeleteRoom}
        />
      )}

      <footer className="footer">
        <div>Campus Room Availability System · College Campus Operations</div>
      </footer>
    </div>
  );
}
