'use client';

import SortDropdown, { type SortOrder } from '@/components/common/SortDropdown';
import Button from '@/components/common/Button';
import { sortSigPigTags, type SigPigTag } from '@/app/(ig)/utils/sigPigTags';
import type { IgDetail } from '@/app/(ig)/components/detail/types';
import type { IgListItem } from './types';
import { SEMESTER_MAP } from '@/util/constants';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { LuCrown } from 'react-icons/lu';
import { useMe } from '@/util/hooks/useMe';
import styles from './IgList.module.css';

export default function IgListClient({
  items,
  initialFilterTags = [],
  kindLabel,
  basePath,
  createHref,
}: {
  items: IgListItem[];
  initialFilterTags?: string[];
  kindLabel: string;
  basePath: string;
  createHref: string;
}) {
  const { me } = useMe();
  const myId = me?.id ? String(me.id) : '';
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
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

  const myJoinedIds = new Set(
    items
      .filter(
        (item) =>
          myId &&
          Array.isArray(item?.members) &&
          item.members.some(
            (member) => String(member?.user_id ?? member?.user?.id ?? '') === myId,
          ),
      )
      .map((item) => String(item.id)),
  );

  const myOwnedIds = new Set(
    items
      .filter((item) => item?.owner && String(item.owner) === myId)
      .map((item) => String(item.id)),
  );

  const updateUrlTags = (nextTags: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tag');
    nextTags.forEach((tag) => params.append('tag', tag));
    const next = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(next, { scroll: false });
  };

  const handleTagFilterChange = (nextTags: string[]) => {
    setSelectedTags(nextTags);
    updateUrlTags(nextTags);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className="text-3xl font-bold">{kindLabel} 게시판</h1>
        <div className={styles.headerActions}>
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <Button
            onClick={() => {
              setIsLoading(true);
              router.push(createHref);
            }}
            disabled={isLoading}
          >
            {kindLabel} 만들기
          </Button>
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
          const isJoined = myJoinedIds.has(itemKey);
          const isMine = myOwnedIds.has(itemKey);
          return (
            <Link
              key={item.id}
              href={`${basePath}/${item.id}`}
              prefetch={false}
              className={styles.link}
            >
              <div
                className={`${styles.card} ${isJoined ? styles.isJoined : ''} ${
                  isMine ? styles.isMine : ''
                }`}
              >
                <div className={styles.topbar}>
                  <span className={styles.titleGroup}>
                    {isMine ? (
                      <span
                        className={styles.ownerCrown}
                        title={`내가 ${kindLabel}장인 ${kindLabel}`}
                        aria-label={`내가 ${kindLabel}장인 ${kindLabel}`}
                        role="img"
                      >
                        <LuCrown aria-hidden="true" />
                      </span>
                    ) : null}
                    <span className={styles.title}>{item.title}</span>
                  </span>
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

function cx(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

function getSigPigAvailableTags(items: IgListItem[] | null | undefined) {
  const tagByText = new Map<string, SigPigTag>();

  (Array.isArray(items) ? items : []).forEach((item) => {
    sortSigPigTags(item?.tags).forEach((tag) => {
      if (!tagByText.has(tag.text)) tagByText.set(tag.text, tag);
    });
  });

  return sortSigPigTags([...tagByText.values()]);
}

function filterSigPigItemsByTags(
  items: IgListItem[] | null | undefined,
  selectedTags: string[] | null | undefined,
): IgListItem[] {
  const safeItems = Array.isArray(items) ? items : [];
  const safeSelectedTags = Array.isArray(selectedTags) ? selectedTags.filter(Boolean) : [];
  if (safeSelectedTags.length === 0) return safeItems;

  return safeItems.filter((item) => {
    const itemTagTexts = new Set(sortSigPigTags(item?.tags).map((tag) => tag.text));
    return safeSelectedTags.every((tagText) => itemTagTexts.has(tagText));
  });
}

function SigPigTagList({
  tags,
  itemId,
  listClassName,
  tagClassName,
  majorClassName,
}: {
  tags: IgDetail['tags'];
  itemId?: number;
  listClassName?: string;
  tagClassName?: string;
  majorClassName?: string;
}) {
  const sortedTags = sortSigPigTags(tags);
  if (sortedTags.length === 0) return null;

  return (
    <div className={listClassName}>
      {sortedTags.map((tag) => (
        <span
          key={`${itemId ?? 'sig-pig'}-${tag.id ?? tag.text}`}
          className={cx(tagClassName, tag.is_major ? majorClassName : '')}
        >
          #{tag.text}
        </span>
      ))}
    </div>
  );
}

function SigPigTagFilter({
  items,
  selectedTags,
  onChange,
  classNames,
}: {
  items: IgListItem[];
  selectedTags: string[];
  onChange?: (tags: string[]) => void;
  classNames: Record<
    'section' | 'header' | 'title' | 'clearButton' | 'list' | 'chip' | 'active' | 'major',
    string
  >;
}) {
  const safeSelectedTags = Array.isArray(selectedTags) ? selectedTags : [];
  const availableTags = getSigPigAvailableTags(items);

  const updateSelectedTags = (nextTags: string[]) => {
    onChange?.(nextTags);
  };

  const toggleTagFilter = (tagText: string) => {
    const exists = safeSelectedTags.includes(tagText);
    const nextTags = exists
      ? safeSelectedTags.filter((tag) => tag !== tagText)
      : [...safeSelectedTags, tagText];

    updateSelectedTags(nextTags);
  };

  const clearTagFilter = () => {
    updateSelectedTags([]);
  };

  return (
    <div className={classNames.section}>
      <div className={classNames.header}>
        <span className={classNames.title}>태그 필터</span>
        {safeSelectedTags.length > 0 ? (
          <button type="button" className={classNames.clearButton} onClick={clearTagFilter}>
            초기화
          </button>
        ) : null}
      </div>

      <div className={classNames.list}>
        <button
          type="button"
          className={cx(
            classNames.chip,
            safeSelectedTags.length === 0 ? classNames.active : '',
          )}
          onClick={clearTagFilter}
        >
          #전체
        </button>
        {availableTags.map((tag) => (
          <button
            key={tag.id ?? tag.text}
            type="button"
            className={cx(
              classNames.chip,
              safeSelectedTags.includes(tag.text) ? classNames.active : '',
              tag.is_major ? classNames.major : '',
            )}
            onClick={() => toggleTagFilter(tag.text)}
          >
            #{tag.text}
          </button>
        ))}
      </div>
    </div>
  );
}
