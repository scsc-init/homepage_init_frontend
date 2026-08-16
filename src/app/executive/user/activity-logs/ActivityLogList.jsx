'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchBackendClientJson } from '@/util/fetch/client';

const LIMIT = 50;

const ACTIVITY_LABELS = {
  SIGNED_UP: '가입했음',
  REGISTERED: '등록했음',
  SIG_JOINED: '시그 가입했음',
  SIG_LEFT: '시그 탈퇴했음',
  SIG_LEADER_APPOINTED: '시그장이 됨',
};

function formatDate(value) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('ko-KR');
}

function getActivityLabel(activityType) {
  return ACTIVITY_LABELS[activityType] ?? activityType;
}

function getShortId(id) {
  if (!id) return '-';
  return id.length > 12 ? `${id.slice(0, 12)}...` : id;
}

function getUserLabel(id, userNameById) {
  if (!id) return '-';

  const name = userNameById.get(id);
  if (!name) return getShortId(id);

  return `${name} (${getShortId(id)})`;
}

export default function ActivityLogList({ users = [] }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  const observerTargetRef = useRef(null);
  const nextIdRef = useRef(null);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const userNameById = useMemo(() => {
    return new Map(users.map((user) => [user.id, user.name]));
  }, [users]);

  const loadLogs = useCallback(async () => {
    if (isLoadingRef.current || !hasMoreRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    setError('');

    const params = new URLSearchParams();
    params.set('limit', String(LIMIT));

    if (nextIdRef.current !== null) {
      params.set('next_id', String(nextIdRef.current));
    }

    try {
      const query = Object.fromEntries(params.entries());

      const data = await fetchBackendClientJson('GET', '/api/executive/users/activity-logs', {
        query,
      });

      const nextLogs = Array.isArray(data) ? data : [];

      setLogs((prev) => {
        const existingIds = new Set(prev.map((log) => log.id));
        const uniqueLogs = nextLogs.filter((log) => !existingIds.has(log.id));
        return [...prev, ...uniqueLogs];
      });

      if (nextLogs.length < LIMIT) {
        hasMoreRef.current = false;
        setHasMore(false);
      }

      if (nextLogs.length > 0) {
        nextIdRef.current = nextLogs[nextLogs.length - 1].id;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '활동 기록을 불러오지 못했습니다.');
      hasMoreRef.current = false;
      setHasMore(false);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    setError('');
    hasMoreRef.current = true;
    setHasMore(true);
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadLogs();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [loadLogs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr>
              <th style={headerStyle}>ID</th>
              <th style={{ ...headerStyle, minWidth: '8rem' }}>활동</th>
              <th style={headerStyle}>유저</th>
              <th style={headerStyle}>처리자</th>
              <th style={headerStyle}>상세</th>
              <th style={headerStyle}>생성 시각</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td style={cellStyle}>{log.id}</td>
                <td style={{ ...cellStyle, minWidth: '8rem', whiteSpace: 'nowrap' }}>
                  {getActivityLabel(log.activity_type)}
                </td>
                <td style={cellStyle}>{getUserLabel(log.user_id, userNameById)}</td>
                <td style={cellStyle}>{getUserLabel(log.created_by, userNameById)}</td>
                <td style={cellStyle}>{log.detail || '-'}</td>
                <td style={cellStyle}>{formatDate(log.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && !isLoading && !error && (
        <p style={{ color: '#767676' }}>아직 유저 활동 기록이 없습니다.</p>
      )}

      {error && (
        <div>
          <p style={{ color: '#d33' }}>{error}</p>
          <button type="button" onClick={handleRetry}>
            다시 시도
          </button>
        </div>
      )}

      <div ref={observerTargetRef} style={{ minHeight: '1px' }} />

      {isLoading && <p style={{ color: '#767676' }}>불러오는 중...</p>}
      {!hasMore && logs.length > 0 && (
        <p style={{ color: '#767676' }}>마지막 활동 기록입니다.</p>
      )}
    </div>
  );
}

const headerStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const cellStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #eee',
  verticalAlign: 'top',
  wordBreak: 'break-all',
};
