'use client';

import { useState, useEffect, useRef, useId } from 'react';
import Button from './Button';
import styles from './SortDropdown.module.css';

const options = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된 순' },
  { value: 'title', label: '제목순' },
];

export default function SortDropdown({ sortOrder, setSortOrder }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const menuId = useId();
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === sortOrder),
  );

  useEffect(() => {
    if (!open) return;
    optionRefs.current[selectedIndex]?.focus();
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [open, selectedIndex]);

  const closeAndFocus = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleMenuKeyDown = (event) => {
    if (event.key === 'Tab') {
      // Start native Tab navigation from the trigger before unmounting the menu.
      closeAndFocus();
      return;
    }
    const index = optionRefs.current.indexOf(document.activeElement);
    let nextIndex;
    if (event.key === 'ArrowDown') nextIndex = (index + 1) % options.length;
    if (event.key === 'ArrowUp') nextIndex = (index - 1 + options.length) % options.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = options.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      optionRefs.current[nextIndex]?.focus();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeAndFocus();
    }
  };

  return (
    <div
      className={styles.sortDropdown}
      ref={dropdownRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <Button
        ref={triggerRef}
        className={styles.sortBtn}
        aria-label={`정렬: ${options[selectedIndex].label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {options[selectedIndex].label}
        <span aria-hidden="true">▾</span>
      </Button>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="정렬 기준"
          className={styles.sortMenu}
          onKeyDown={handleMenuKeyDown}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="menuitemradio"
              aria-checked={sortOrder === option.value}
              tabIndex={-1}
              className={styles.sortOption}
              onClick={() => {
                setSortOrder(option.value);
                closeAndFocus();
              }}
            >
              {option.label}
              <span aria-hidden="true">{sortOrder === option.value ? '✓' : ''}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
