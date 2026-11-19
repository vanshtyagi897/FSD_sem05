import React from 'react';

export default function SearchBar({ searchTerm, onSearchChange, onClearSearch }) {
  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search room ID (e.g. A101, B201), subject, or faculty..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
