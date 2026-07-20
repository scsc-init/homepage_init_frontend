'use client';

import { useMemo, useState } from 'react';
import SortDropdown from './SortDropdown';
import ArticlesView from './ArticlesView';
import GalleryView from './GalleryView';
import FileBoardView from './FileBoardView';
import styles from './board.module.css';
import { ALBUM_BOARD_ID } from '@/util/constants';

export default function BoardClient({ board }) {
  const [sortOrder, setSortOrder] = useState('latest');
  const isAlbum = useMemo(() => String(board?.id) === String(ALBUM_BOARD_ID), [board?.id]);
  const isFileBoard = useMemo(() => board?.board_type === 'FILE', [board?.board_type]);
  const createType = isAlbum ? 'image' : isFileBoard ? 'file' : 'text';

  return (
    <>
      <div className={styles.actions}>
        <div className={styles.leftAction}>
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </div>
        <div className={styles.rightAction}>
          <a
            href={`/board/${board.id}/create?t=${createType}`}
            className={styles.boardCreateBtn}
          >
            글 작성
          </a>
        </div>
      </div>

      {isAlbum ? (
        <GalleryView board={board} sortOrder={sortOrder} />
      ) : isFileBoard ? (
        <FileBoardView board={board} sortOrder={sortOrder} />
      ) : (
        <ArticlesView board={board} sortOrder={sortOrder} />
      )}
    </>
  );
}
