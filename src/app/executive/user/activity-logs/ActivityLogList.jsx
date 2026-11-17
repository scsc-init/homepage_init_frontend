'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchBackendClientJson } from '@/util/fetch/client';

const LIMIT = 50;

const ACTIVITY_LABELS = {
  SIGNED_UP: 'activitySignedUp',
  REGISTERED: 'activityRegistered',
  SIG_JOINED: 'activitySigJoined',
  SIG_LEFT: 'activitySigLeft',
  SIG_LEADER_APPOINTED: 'activitySigLeader',
};

function formatDate(value, locale) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString(locale);
}

function getActivityLabel(activityType, t) {
  return ACTIVITY_LABELS[activityType] ? t(ACTIVITY_LABELS[activityType]) : activityType;
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
  const t = useTranslations('Executive');
  const locale = useLocale();
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
      const query = params.toString();

      const data = await fetchBackendClientJson(
        query
          ? `/api/executive/users/activity-logs?${query}`
          : '/api/executive/users/activity-logs',
      );

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
      setError(err instanceof Error ? err.message : t('activityLogsLoadFailed'));
      hasMoreRef.current = false;
      setHasMore(false);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [t]);

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
              <th style={{ ...headerStyle, minWidth: '8rem' }}>{t('activity')}</th>
              <th style={headerStyle}>{t('user')}</th>
              <th style={headerStyle}>{t('processedBy')}</th>
              <th style={headerStyle}>{t('detail')}</th>
              <th style={headerStyle}>{t('creationTime')}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td style={cellStyle}>{log.id}</td>
                <td style={{ ...cellStyle, minWidth: '8rem', whiteSpace: 'nowrap' }}>
                  {getActivityLabel(log.activity_type, t)}
                </td>
                <td style={cellStyle}>{getUserLabel(log.user_id, userNameById)}</td>
                <td style={cellStyle}>{getUserLabel(log.created_by, userNameById)}</td>
                <td style={cellStyle}>{log.detail || '-'}</td>
                <td style={cellStyle}>{formatDate(log.created_at, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && !isLoading && !error && (
        <p style={{ color: '#767676' }}>{t('noActivityLogs')}</p>
      )}

      {error && (
        <div>
          <p style={{ color: '#d33' }}>{error}</p>
          <button type="button" onClick={handleRetry}>
            {t('retry')}
          </button>
        </div>
      )}

      <div ref={observerTargetRef} style={{ minHeight: '1px' }} />

      {isLoading && <p style={{ color: '#767676' }}>{t('loading')}</p>}
      {!hasMore && logs.length > 0 && (
        <p style={{ color: '#767676' }}>{t('lastActivityLog')}</p>
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
