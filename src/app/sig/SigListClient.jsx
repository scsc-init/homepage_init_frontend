'use client';

import SortDropdown from '@/components/board/SortDropdown';
import {
  filterSigPigItemsByTags,
  SigPigTagFilter,
  SigPigTagList,
} from '@/components/board/SigPigTags';
import { SEMESTER_MAP } from '@/util/constants';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './sig.module.css';
import { useMe } from '@/util/hooks/useMe';

export default function SigListClient({ sigs, initialFilterTags = [] }) {
  const { me } = useMe();
  const myId = me?.id ? String(me.id) : '';
  const [sortOrder, setSortOrder] = useState('latest');
  const [selectedTags, setSelectedTags] = useState(
    Array.isArray(initialFilterTags) ? initialFilterTags.filter(Boolean) : [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filteredSigs = useMemo(() => {
    return filterSigPigItemsByTags(sigs, selectedTags);
  }, [sigs, selectedTags]);

  const sortedSigs = [...filteredSigs].sort((a, b) => {
    if (sortOrder === 'latest') return b.id - a.id;
    if (sortOrder === 'oldest') return a.id - b.id;
    if (sortOrder === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const myOwnedSigIds = new Set(
    sigs.filter((sig) => sig?.owner && String(sig.owner) === myId).map((sig) => String(sig.id)),
  );

  const updateUrlTags = (nextTags) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tag');
    nextTags.forEach((tag) => params.append('tag', tag));
    const next = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(next, { scroll: false });
  };

  const handleTagFilterChange = (nextTags) => {
    setSelectedTags(nextTags);
    updateUrlTags(nextTags);
  };

  return (
    <>
      <div className={styles.SigHeader}>
        <h1 className="text-3xl font-bold">SIG 게시판</h1>
        <div className={styles.SigHeaderActions}>
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <button
            className={styles.SigCreateBtn}
            onClick={() => {
              setIsLoading(true);
              router.push('/sig/create');
            }}
            disabled={isLoading}
          >
            SIG 만들기
          </button>
        </div>
      </div>

      <SigPigTagFilter
        items={sigs}
        selectedTags={selectedTags}
        onChange={handleTagFilterChange}
        classNames={{
          section: styles.SigFilterSection,
          header: styles.SigFilterHeader,
          title: styles.SigFilterTitle,
          clearButton: styles.SigFilterClearButton,
          list: styles.SigTagFilterList,
          chip: styles.SigTagFilterChip,
          active: styles.active,
          major: styles.major,
        }}
      />

      <div className={styles.SigListSummary}>
        {selectedTags.length > 0 ? (
          <>
            선택된 태그 <strong>{selectedTags.map((tag) => `#${tag}`).join(', ')}</strong> 를
            모두 가진 SIG <strong>{sortedSigs.length}</strong>개
          </>
        ) : (
          <>
            전체 SIG <strong>{sortedSigs.length}</strong>개
          </>
        )}
      </div>

      <div className={styles.SigList}>
        {sortedSigs.map((sig) => {
          const sid = String(sig.id);
          const isMine = myOwnedSigIds.has(sid);

          return (
            <Link key={sig.id} href={`/sig/${sig.id}`} className={styles.sigLink}>
              <div className={`${styles.sigCard} ${isMine ? styles.isMine : ''}`}>
                <div className={styles.sigTopbar}>
                  <span className={styles.sigTitle}>{sig.title}</span>
                  <span className={styles.sigUserCount}>
                    {sig.year}년 {SEMESTER_MAP[sig.semester]}학기
                  </span>
                </div>
                <div className={styles.sigDescription}>{sig.description}</div>
                <SigPigTagList
                  tags={sig?.tags}
                  itemId={sig.id}
                  listClassName={styles.sigTagList}
                  tagClassName={styles.sigTagText}
                  majorClassName={styles.major}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
