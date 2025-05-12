'use client';

import React from 'react';
import { useState } from 'react';
import './Dropdown.css';

interface DropdownProps {
  subject: string;
  items: string[];
  onSelect: (item: string) => void;
}

export default function BoardDropdown({
  subject,
  items,
  onSelect,
}: DropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="dropdown">
      <button onClick={toggleDropdown} className="dropdown-button">
        <div style={{ fontSize: '12px' }}>
          {subject + ': ' + items[selectedItemIndex]}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="0.75em"
          height="0.6em"
          viewBox="0 0 24 24"
          style={{
            transform: `${isDropdownOpen ? 'rotate(180deg)' : ''}`,
            transformOrigin: 'center',
            position: 'relative',
            top: '2px',
            left: '3px',
          }}
        >
          <path fill="currentColor" d="M1 21h22L12 2" />
        </svg>
      </button>
      {isDropdownOpen && (
        <div className="dropdown-list">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => {
                onSelect(item);
                toggleDropdown();
                setSelectedItemIndex(items.indexOf(item));
              }}
              className={
                'dropdown-item ' +
                (items.indexOf(item) === selectedItemIndex ? 'active' : '')
              }
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
