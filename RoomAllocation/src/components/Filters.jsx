import React from 'react';

export default function Filters({
  selectedBlock,
  onBlockChange,
  selectedFloor,
  onFloorChange,
  selectedStatus,
  onStatusChange,
  selectedFaculty,
  onFacultyChange,
  onResetFilters,
  hasActiveFilters,
  viewMode,
  onViewModeChange,
  showStatusFilter = true
}) {
  return (
    <div className="filter-group">
      <select
        className="filter-select"
        value={selectedBlock}
        onChange={(e) => onBlockChange(e.target.value)}
        aria-label="Filter by Building or Block"
      >
        <option value="ALL">All Blocks</option>
        <option value="A">Block A (Science & Tech)</option>
        <option value="B">Block B (Engineering)</option>
        <option value="C">Block C (Management)</option>
        <option value="D">Block D (Computing)</option>
      </select>

      <select
        className="filter-select"
        value={selectedFloor}
        onChange={(e) => onFloorChange(e.target.value)}
        aria-label="Filter by Floor"
      >
        <option value="ALL">All Floors</option>
        <option value="1">Floor 1</option>
        <option value="2">Floor 2</option>
        <option value="3">Floor 3</option>
        <option value="4">Floor 4</option>
      </select>

      {showStatusFilter && (
        <select
          className="filter-select"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by Availability Status"
        >
          <option value="ALL">All Statuses</option>
          <option value="AVAILABLE">Available Only</option>
          <option value="OCCUPIED">Occupied Only</option>
        </select>
      )}

      <select
        className="filter-select"
        value={selectedFaculty}
        onChange={(e) => onFacultyChange(e.target.value)}
        aria-label="Filter by Faculty Presence"
      >
        <option value="ALL">All Faculty States</option>
        <option value="PRESENT">Faculty Present</option>
        <option value="ABSENT">Faculty Absent</option>
      </select>

      {hasActiveFilters && (
        <button
          type="button"
          className="btn-action btn-secondary"
          onClick={onResetFilters}
        >
          Reset Filters
        </button>
      )}

      {viewMode && onViewModeChange && (
        <div className="view-toggle">
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
          >
            Cards
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => onViewModeChange('table')}
          >
            Table
          </button>
        </div>
      )}
    </div>
  );
}
