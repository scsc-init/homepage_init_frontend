"use client";

import React from "react";
import { useEffect, useState } from "react";
import "./Pagination.css";

interface PaginationProps {
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function BoardPagination({
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pagesPerGroup = 10;

  const [currPage, setCurrPage] = useState(0);
  const [currGroup, setCurrGroup] = useState(0);

  useEffect(() => {
    setCurrPage(1);
    onPageChange(1);
  }, []);

  useEffect(() => {
    setCurrGroup(Math.floor((currPage - 1) / pagesPerGroup));
    onPageChange(currPage);
  }, [currPage]);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) => {
      const start = Math.floor(currGroup) * pagesPerGroup + 1;
      const end = Math.min(start + pagesPerGroup, totalPages + 1);
      return page >= start && page < end;
    }
  );

  return (
    <div className="pagination">
      <button
        onClick={() => {
          if (currGroup > 0) setCurrPage((currGroup - 1) * pagesPerGroup + 1);
        }}
        className="pagination-item"
      >
        &lt;&lt;
      </button>
      <button
        onClick={() => setCurrPage(Math.max(currPage - 1, 1))}
        className="pagination-item"
      >
        &lt;
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={
            page === currPage ? "pagination-item active" : "pagination-item"
          }
          onClick={() => setCurrPage(page)}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => setCurrPage(Math.min(currPage + 1, totalPages))}
        className="pagination-item"
      >
        &gt;
      </button>
      <button
        onClick={() => {
          if (currGroup < Math.floor(totalPages / pagesPerGroup))
            setCurrPage((currGroup + 1) * pagesPerGroup + 1);
        }}
        className="pagination-item"
      >
        &gt;&gt;
      </button>
    </div>
  );
}
