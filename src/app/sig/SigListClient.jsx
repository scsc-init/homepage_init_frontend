'use client';

import SortDropdown from '@/components/board/SortDropdown'; // 기존 재사용
import { SEMESTER_MAP } from '@/util/constants';
import Link from 'next/link';
import { useState } from 'react';

export default function SigListClient({ sigs }) {
  const [sortOrder, setSortOrder] = useState('latest');

  const sortedSigs = [...sigs].sort((a, b) => {
    if (sortOrder === 'latest') return b.id - a.id;
    if (sortOrder === 'oldest') return a.id - b.id;
    if (sortOrder === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <>
      <div className="SigHeader">
        <h1 className="text-3xl font-bold">SIG 게시판</h1>
        <div className="SigHeaderActions">
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <Link href="/sig/create" id="SigCreateButton">
            <button className="SigCreateBtn">SIG 만들기</button>
          </Link>
        </div>
      </div>

      <div id="SigList">
        {sortedSigs.map((sig) => (
          <Link key={sig.id} href={`/sig/${sig.id}`} className="sigLink">
            <div className="sigCard">
              <div className="sigTopbar">
                <span className="sigTitle">{sig.title}</span>
                <span className="sigUserCount">
                  {sig.year}년 {SEMESTER_MAP[sig.semester]}학기
                </span>
              </div>
              <div className="sigDescription">{sig.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
