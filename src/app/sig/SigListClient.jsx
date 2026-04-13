'use client';

import SortDropdown from '@/components/board/SortDropdown';
import { SEMESTER_MAP } from '@/util/constants';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './sig.module.css';

export default function SigListClient({ sigs, myId, initialFilterTags = [] }) {
  const [sortOrder, setSortOrder] = useState('latest');
  const [selectedTags, setSelectedTags] = useState(
    Array.isArray(initialFilterTags) ? initialFilterTags.filter(Boolean) : [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const availableTags = useMemo(() => {
    const map = new Map();

    sigs.forEach((sig) => {
      const tags = Array.isArray(sig?.tags) ? sig.tags : [];
      tags.forEach((tag) => {
        if (!tag?.text) return;
        if (!map.has(tag.text)) {
          map.set(tag.text, tag);
        }
      });
    });

    return [...map.values()].sort((a, b) => {
      if (a.is_major !== b.is_major) return a.is_major ? -1 : 1;
      return a.text.localeCompare(b.text);
    });
  }, [sigs]);

  const filteredSigs = useMemo(() => {
    if (selectedTags.length === 0) return sigs;

    return sigs.filter((sig) => {
      const sigTagTexts = new Set(
        (Array.isArray(sig?.tags) ? sig.tags : []).map((tag) => tag?.text).filter(Boolean),
      );

      return selectedTags.every((tagText) => sigTagTexts.has(tagText));
    });
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

  const toggleTagFilter = (tagText) => {
    const exists = selectedTags.includes(tagText);
    const nextTags = exists
      ? selectedTags.filter((tag) => tag !== tagText)
      : [...selectedTags, tagText];

    setSelectedTags(nextTags);
    updateUrlTags(nextTags);
  };

  const clearTagFilter = () => {
    setSelectedTags([]);
    updateUrlTags([]);
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

      <div className={styles.SigFilterSection}>
        <div className={styles.SigFilterHeader}>
          <span className={styles.SigFilterTitle}>태그 필터</span>
          {selectedTags.length > 0 ? (
            <button
              type="button"
              className={styles.SigFilterClearButton}
              onClick={clearTagFilter}
            >
              초기화
            </button>
          ) : null}
        </div>

        <div className={styles.SigTagFilterList}>
          <button
            type="button"
            className={`${styles.SigTagFilterChip} ${selectedTags.length === 0 ? styles.active : ''}`}
            onClick={clearTagFilter}
          >
            #전체
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={`${styles.SigTagFilterChip} ${selectedTags.includes(tag.text) ? styles.active : ''} ${
                tag.is_major ? styles.major : ''
              }`}
              onClick={() => toggleTagFilter(tag.text)}
            >
              #{tag.text}
            </button>
          ))}
        </div>
      </div>

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
          const tags = Array.isArray(sig?.tags) ? sig.tags : [];

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
                {tags.length > 0 ? (
                  <div className={styles.sigTagList}>
                    {tags.map((tag) => (
                      <span
                        key={`${sig.id}-${tag.id}`}
                        className={`${styles.sigTagText} ${tag.is_major ? styles.major : ''}`}
                      >
                        #{tag.text}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
