'use client';

import SortDropdown from '@/components/board/SortDropdown';
import { SEMESTER_MAP } from '@/util/constants';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function SigListClient({ sigs, myId, availableTags, sigTagsBySigId }) {
  const [sortOrder, setSortOrder] = useState('latest');
  const [selectedTagId, setSelectedTagId] = useState('');

  const tagMap = useMemo(() => {
    const map = {};
    (Array.isArray(availableTags) ? availableTags : []).forEach((tag) => {
      if (tag?.id != null) {
        map[String(tag.id)] = tag;
      }
    });
    return map;
  }, [availableTags]);

  const sortedSigs = useMemo(() => {
    const list = [...(Array.isArray(sigs) ? sigs : [])];
    list.sort((a, b) => {
      if (sortOrder === 'latest') return b.id - a.id;
      if (sortOrder === 'oldest') return a.id - b.id;
      if (sortOrder === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
    return list;
  }, [sigs, sortOrder]);

  const filteredSigs = useMemo(() => {
    if (!selectedTagId) return sortedSigs;
    return sortedSigs.filter((sig) =>
      (sigTagsBySigId?.[String(sig.id)] ?? []).some(
        (sigTag) => String(sigTag?.tag_id ?? '') === String(selectedTagId),
      ),
    );
  }, [selectedTagId, sigTagsBySigId, sortedSigs]);

  const myOwnedSigIds = new Set(
    (Array.isArray(sigs) ? sigs : [])
      .filter((sig) => sig?.owner && String(sig.owner) === myId)
      .map((sig) => String(sig.id)),
  );

  return (
    <>
      <div className="SigHeader">
        <h1 className="text-3xl font-bold">SIG 게시판</h1>
        <div className="SigHeaderActions">
          <select
            value={selectedTagId}
            onChange={(e) => setSelectedTagId(e.target.value)}
            aria-label="태그별 검색"
          >
            <option value="">태그 전체</option>
            {(Array.isArray(availableTags) ? availableTags : []).map((tag) => (
              <option key={tag.id} value={String(tag.id)}>
                {tag.text}
              </option>
            ))}
          </select>
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <Link href="/sig/create" id="SigCreateButton">
            <button className="SigCreateBtn">SIG 만들기</button>
          </Link>
        </div>
      </div>

      <div id="SigList">
        {filteredSigs.map((sig) => {
          const sid = String(sig.id);
          const isMine = myOwnedSigIds.has(sid);
          const tags = (sigTagsBySigId?.[sid] ?? [])
            .map((sigTag) => tagMap[String(sigTag?.tag_id ?? '')])
            .filter(Boolean);

          return (
            <Link key={sig.id} href={`/sig/${sig.id}`} className="sigLink">
              <div className={`sigCard ${isMine ? 'isMine' : ''}`}>
                <div className="sigTopbar">
                  <span className="sigTitle">{sig.title}</span>
                  <span className="sigUserCount">
                    {sig.year}년 {SEMESTER_MAP[sig.semester]}학기
                  </span>
                </div>
                <div className="sigDescription">{sig.description}</div>
                {tags.length > 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: '12px',
                    }}
                  >
                    {tags.map((tag) => (
                      <span
                        key={`${sig.id}-${tag.id}`}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          fontSize: '0.85rem',
                        }}
                      >
                        {tag.text}
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
