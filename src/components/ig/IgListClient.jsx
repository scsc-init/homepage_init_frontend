'use client';

import SortDropdown from '@/components/board/SortDropdown';
import {
  filterSigPigItemsByTags,
  SigPigTagFilter,
  SigPigTagList,
} from '@/components/board/SigPigTags';
import { SEMESTER_MAP } from '@/util/constants';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useMe } from '@/util/hooks/useMe';

export default function IgListClient({
  items,
  initialFilterTags = [],
  kindLabel,
  basePath,
  createHref,
  classNames,
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

  const listProps = {};
  if (classNames.listId) listProps.id = classNames.listId;
  if (classNames.listClassName) listProps.className = classNames.listClassName;

  return (
    <>
      <div className={classNames.header}>
        <h1 className="text-3xl font-bold">{kindLabel} ê²ìí</h1>
        <div className={classNames.headerActions}>
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <button
            type="button"
            className={classNames.createButton}
            onClick={() => {
              setIsLoading(true);
              router.push(createHref);
            }}
            disabled={isLoading}
          >
            {kindLabel} ë§ë¤ê¸°
          </button>
        </div>
      </div>

      <SigPigTagFilter
        items={items}
        selectedTags={selectedTags}
        onChange={handleTagFilterChange}
        classNames={{
          section: classNames.filterSection,
          header: classNames.filterHeader,
          title: classNames.filterTitle,
          clearButton: classNames.filterClearButton,
          list: classNames.tagFilterList,
          chip: classNames.tagFilterChip,
          active: classNames.active,
          major: classNames.major,
        }}
      />

      <div className={classNames.listSummary}>
        {selectedTags.length > 0 ? (
          <>
            ì íë íê·¸ <strong>{selectedTags.map((tag) => `#${tag}`).join(', ')}</strong> ë¥¼
            ëª¨ë ê°ì§ {kindLabel} <strong>{sortedItems.length}</strong>ê°
          </>
        ) : (
          <>
            ì ì²´ {kindLabel} <strong>{sortedItems.length}</strong>ê°
          </>
        )}
      </div>

      <div {...listProps}>
        {sortedItems.map((item) => {
          const itemKey = String(item.id);
          const isMine = myOwnedIds.has(itemKey);
          return (
            <Link key={item.id} href={`${basePath}/${item.id}`} className={classNames.link}>
              <div className={`${classNames.card} ${isMine ? classNames.isMine : ''}`}>
                <div className={classNames.topbar}>
                  <span className={classNames.title}>{item.title}</span>
                  <span className={classNames.userCount}>
                    {item.year}ë {SEMESTER_MAP[item.semester]}íê¸°
                  </span>
                </div>
                <div className={classNames.description}>{item.description}</div>
                <SigPigTagList
                  tags={item?.tags}
                  itemId={item.id}
                  listClassName={classNames.tagList}
                  tagClassName={classNames.tagText}
                  majorClassName={classNames.major}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
