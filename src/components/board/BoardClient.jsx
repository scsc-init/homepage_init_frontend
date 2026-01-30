'use client';

import { useMemo, useState } from 'react';
import SortDropdown from './SortDropdown';
import ArticlesView from './ArticlesView';
import GalleryView from './GalleryView';
import styles from './board.module.css';
import { ALBUM_BOARD_ID } from '@/util/constants';

export default function BoardClient({ board }) {
  const [sortOrder, setSortOrder] = useState('latest');
  const isAlbum = useMemo(() => String(board?.id) === String(ALBUM_BOARD_ID), [board?.id]);

  return (
    <>
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

      {isAlbum ? (
        <GalleryView board={board} sortOrder={sortOrder} />
      ) : (
        <ArticlesView board={board} sortOrder={sortOrder} />
      )}
    </>
  );
}
