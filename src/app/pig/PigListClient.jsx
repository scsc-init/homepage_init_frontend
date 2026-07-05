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
import { useMe } from '@/util/hooks/useMe';

export default function PigListClient({ pigs, initialFilterTags = [] }) {
  const { me } = useMe();
  const myId = me?.id ? String(me.id) : '';
  const [sortOrder, setSortOrder] = useState('latest');
  const [selectedTags, setSelectedTags] = useState(
    Array.isArray(initialFilterTags) ? initialFilterTags.filter(Boolean) : [],
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filteredPigs = useMemo(() => {
    return filterSigPigItemsByTags(pigs, selectedTags);
  }, [pigs, selectedTags]);

  const sortedPigs = [...filteredPigs].sort((a, b) => {
    if (sortOrder === 'latest') return b.id - a.id;
    if (sortOrder === 'oldest') return a.id - b.id;
    if (sortOrder === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const myOwnedPigIds = new Set(
    pigs.filter((pig) => pig?.owner && String(pig.owner) === myId).map((pig) => String(pig.id)),
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
      <div className="PigHeader">
        <h1 className="text-3xl font-bold">PIG 게시판</h1>
        <div className="PigHeaderActions">
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <Link href="/pig/create" id="PigCreateButton">
            <button className="PigCreateBtn">PIG 만들기</button>
          </Link>
        </div>
      </div>

      <SigPigTagFilter
        items={pigs}
        selectedTags={selectedTags}
        onChange={handleTagFilterChange}
        classNames={{
          section: 'PigFilterSection',
          header: 'PigFilterHeader',
          title: 'PigFilterTitle',
          clearButton: 'PigFilterClearButton',
          list: 'PigTagFilterList',
          chip: 'PigTagFilterChip',
          active: 'active',
          major: 'major',
        }}
      />

      <div className="PigListSummary">
        {selectedTags.length > 0 ? (
          <>
            선택된 태그 <strong>{selectedTags.map((tag) => `#${tag}`).join(', ')}</strong> 를
            모두 가진 PIG <strong>{sortedPigs.length}</strong>개
          </>
        ) : (
          <>
            전체 PIG <strong>{sortedPigs.length}</strong>개
          </>
        )}
      </div>

      <div id="PigList">
        {sortedPigs.map((pig) => {
          const pid = String(pig.id);
          const isMine = myOwnedPigIds.has(pid);
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
                <SigPigTagList
                  tags={pig?.tags}
                  itemId={pig.id}
                  listClassName="pigTagList"
                  tagClassName="pigTagText"
                  majorClassName="major"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
