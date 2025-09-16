"use client";

import { useState, useEffect, useRef } from "react";
import "./board.css";

export default function SortDropdown({ sortOrder, setSortOrder }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const labelMap = {
    latest: "최신순",
    oldest: "오래된 순",
    title: "제목순",
  };

  return (
    <div className="SigSortDropdown" ref={dropdownRef}>
      <button
        className="SigSortBtn fixed-width"
        onClick={() => setOpen((prev) => !prev)}
      >
        {labelMap[sortOrder]} ▼
      </button>
      {open && (
        <div className="SigSortMenu open fixed-width">
          <button
            onClick={() => {
              setSortOrder("latest");
              setOpen(false);
            }}
          >
            최신순
          </button>
          <button
            onClick={() => {
              setSortOrder("oldest");
              setOpen(false);
            }}
          >
            오래된 순
          </button>
          <button
            onClick={() => {
              setSortOrder("title");
              setOpen(false);
            }}
          >
            제목순
          </button>
        </div>
      )}
    </div>
  );
}
