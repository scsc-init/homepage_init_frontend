'use client';

import SortDropdown from '@/components/board/SortDropdown';
import { SEMESTER_MAP } from '@/util/constants';
import Link from 'next/link';
import { useState } from 'react';

export default function PigListClient({ pigs, myId }) {
  const [sortOrder, setSortOrder] = useState('latest');

  const sortedPigs = [...pigs].sort((a, b) => {
    if (sortOrder === 'latest') return b.id - a.id;
    if (sortOrder === 'oldest') return a.id - b.id;
    if (sortOrder === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const myOwnedPigIds = new Set(
    pigs.filter((pig) => pig?.owner && String(pig.owner) === myId).map((pig) => String(pig.id)),
  );

  return (
    <>
      <div className="PigHeader">
        <h1 className="text-3xl font-bold">PIG 게시판</h1>
        <div className="PigHeaderActions">
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <Link href="/pig/create" id="PigCreateButton">
            <button className="PigCreateBtn">PIG 만들기</button>
          </Link>
        </div>
      </div>

      <div id="PigList">
        {sortedPigs.map((pig) => {
          const sid = String(pig.id);
          const isMine = myOwnedPigIds.has(sid);
          return (
            <Link key={pig.id} href={`/pig/${pig.id}`} className="pigLink">
              <div className={`pigCard ${isMine ? 'isMine' : ''}`}>
                <div className="pigTopbar">
                  <span className="pigTitle">{pig.title}</span>
                  <span className="pigUserCount">
                    {pig.year}년 {SEMESTER_MAP[pig.semester]}학기
                  </span>
                </div>
                <div className="pigDescription">{pig.description}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
