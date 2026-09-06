'use client';

import SortDropdown from '@/components/common/SortDropdown';
import {
  filterSigPigItemsByTags,
  SigPigTagFilter,
  SigPigTagList,
} from '@/app/(ig)/components/SigPigTags';
import { SEMESTER_MAP } from '@/util/constants';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useMe } from '@/util/hooks/useMe';
import styles from './IgList.module.css';

export default function IgListClient({
  items,
  initialFilterTags = [],
  kindLabel,
  basePath,
  createHref,
}) {
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

  const filteredItems = useMemo(
    () => filterSigPigItemsByTags(items, selectedTags),
    [items, selectedTags],
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === 'latest') return b.id - a.id;
    if (sortOrder === 'oldest') return a.id - b.id;
    if (sortOrder === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const myOwnedIds = new Set(
    items
      .filter((item) => item?.owner && String(item.owner) === myId)
      .map((item) => String(item.id)),
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className="text-3xl font-bold">{kindLabel} 게시판</h1>
        <div className={styles.headerActions}>
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <button
            type="button"
            className={styles.createButton}
            onClick={() => {
              setIsLoading(true);
              router.push(createHref);
            }}
            disabled={isLoading}
          >
            {kindLabel} 만들기
          </button>
        </div>
      </div>

      <SigPigTagFilter
        items={items}
        selectedTags={selectedTags}
        onChange={handleTagFilterChange}
        classNames={{
          section: styles.filterSection,
          header: styles.filterHeader,
          title: styles.filterTitle,
          clearButton: styles.filterClearButton,
          list: styles.tagFilterList,
          chip: styles.tagFilterChip,
          active: styles.active,
          major: styles.major,
        }}
      />

      <div className={styles.listSummary}>
        {selectedTags.length > 0 ? (
          <>
            선택된 태그 <strong>{selectedTags.map((tag) => `#${tag}`).join(', ')}</strong> 를
            모두 가진 {kindLabel} <strong>{sortedItems.length}</strong>개
          </>
        ) : (
          <>
            전체 {kindLabel} <strong>{sortedItems.length}</strong>개
          </>
        )}
      </div>

      <div className={styles.list}>
        {sortedItems.map((item) => {
          const itemKey = String(item.id);
          const isMine = myOwnedIds.has(itemKey);
          return (
            <Link
              key={item.id}
              href={`${basePath}/${item.id}`}
              prefetch={false}
              className={styles.link}
            >
              <div className={`${styles.card} ${isMine ? styles.isMine : ''}`}>
                <div className={styles.topbar}>
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.userCount}>
                    {item.year}년 {SEMESTER_MAP[item.semester]}학기
                  </span>
                </div>
                <div className={styles.description}>{item.description}</div>
                <SigPigTagList
                  tags={item?.tags}
                  itemId={item.id}
                  listClassName={styles.tagList}
                  tagClassName={styles.tagText}
                  majorClassName={styles.major}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
