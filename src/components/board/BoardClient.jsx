'use client';

import { useState } from 'react';
import SortDropdown from './SortDropdown';
import ArticlesView from './ArticlesView';
import styles from './board.module.css';

export default function BoardClient({ board }) {
  const [sortOrder, setSortOrder] = useState('latest');

  return (
    <>
      {/* 상단 버튼 영역 */}
      <div className={styles.boardActions}>
        <div className={styles.leftAction}>
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </div>
        <div className={styles.rightAction}>
          <a href={`/board/${board.id}/create`} id="BoardCreateButton">
            <button className={styles.boardCreateBtn}>글 작성</button>
          </a>
        </div>
      </div>

      {/* 글 목록 */}
      <ArticlesView board={board} sortOrder={sortOrder} />
    </>
  );
}
