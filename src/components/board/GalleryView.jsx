'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './board.module.css';

const UUID_REGEX =
  /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
const API_IMG_ID_REGEX = new RegExp(
  String.raw`\/api\/file\/image\/download\/(${UUID_REGEX.source})(?=[^\w-]|$)`,
  'i',
);

const MD_IMG_REGEX = /!\[[^\]]*?\]\(([^)]+)\)/g;
const HTML_IMG_REGEX = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i;

function sortArticles(items, sortOrder) {
  const arr = items.slice();
  if (sortOrder === 'oldest') {
    arr.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return arr;
  }
  if (sortOrder === 'title') {
    arr.sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'ko'));
    return arr;
  }
  arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return arr;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' });
  } catch {
    return '';
  }
}

function pickArticleId(a) {
  return a?.id == null ? '' : String(a.id);
}

function normalizeUrl(u) {
  let s = String(u || '').trim();
  if (!s) return '';
  if (
    (s.startsWith('<') && s.endsWith('>')) ||
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function extractFirstImageUrlFromText(text) {
  const s = String(text || '');
  const html = s.match(HTML_IMG_REGEX);
  if (html?.[1]) return normalizeUrl(html[1]);

  MD_IMG_REGEX.lastIndex = 0;
  const md = MD_IMG_REGEX.exec(s);
  if (md?.[1]) return normalizeUrl(md[1]);

  const api = s.match(API_IMG_ID_REGEX);
  if (api?.[1]) return `/api/file/image/download/${api[1]}`;

  return '';
}

function toThumbSrc(rawUrl) {
  let u = normalizeUrl(rawUrl);
  if (!u) return '';

  const m = u.match(API_IMG_ID_REGEX);
  if (m?.[1]) return `/api/file/image/download/${encodeURIComponent(m[1])}`;

  if (u.startsWith('/api/file/image/download/')) {
    const mm = u.match(new RegExp(String.raw`(${UUID_REGEX.source})`, 'i'));
    if (mm?.[1]) return `/api/file/image/download/${encodeURIComponent(mm[1])}`;
    return u;
  }

  if (u.startsWith('//')) u = `https:${u}`;
  return u;
}

function isLocalThumbSrc(src) {
  const s = String(src || '');
  if (!s) return false;
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('//')) return false;
  return s.startsWith('/');
}

async function pLimitMap(items, limit, fn) {
  const ret = new Array(items.length);
  let i = 0;

  async function worker() {
    while (i < items.length) {
      const cur = i++;
      ret[cur] = await fn(items[cur], cur);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return ret;
}

export default function GalleryView({ board, sortOrder }) {
  const boardId = board?.id;
  const [items, setItems] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });
  const fetchedDetailRef = useRef(new Set());

  const listUrl = useMemo(() => `/api/articles/${boardId}`, [boardId]);

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!boardId) return;

      setState({ loading: true, error: '' });
      fetchedDetailRef.current = new Set();

      try {
        const res = await fetch(listUrl, { credentials: 'include', cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];

        const mapped = arr
          .map((a) => {
            const articleId = pickArticleId(a);
            const title = String(a?.title || a?.name || '');
            const created_at = a?.created_at || a?.createdAt || '';

            const raw =
              extractFirstImageUrlFromText(a?.content || a?.body || a?.html || '') ||
              extractFirstImageUrlFromText(a?.preview || a?.summary || '');

            const thumbSrc = toThumbSrc(raw);

            return { articleId, title, created_at, thumbSrc };
          })
          .filter((x) => x.articleId);

        if (!alive) return;
        setItems(mapped);
        setState({ loading: false, error: '' });
      } catch (e) {
        if (!alive) return;
        setItems([]);
        setState({ loading: false, error: e?.message ? String(e.message) : '불러오기 실패' });
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [boardId, listUrl]);

  useEffect(() => {
    let alive = true;

    async function hydrateMissingThumbs() {
      const targets = items.filter(
        (x) => !x.thumbSrc && x.articleId && !fetchedDetailRef.current.has(x.articleId),
      );
      if (!targets.length) return;

      targets.forEach((t) => fetchedDetailRef.current.add(t.articleId));

      const results = await pLimitMap(targets, 6, async (t) => {
        try {
          const res = await fetch(`/api/article/${encodeURIComponent(t.articleId)}`, {
            credentials: 'include',
            cache: 'no-store',
          });
          if (!res.ok) return { articleId: t.articleId, thumbSrc: '' };

          const data = await res.json();
          const raw = extractFirstImageUrlFromText(
            data?.content || data?.body || data?.html || '',
          );
          const thumbSrc = toThumbSrc(raw);
          return { articleId: t.articleId, thumbSrc };
        } catch {
          return { articleId: t.articleId, thumbSrc: '' };
        }
      });

      if (!alive) return;

      const patch = new Map(
        results.filter((r) => r.thumbSrc).map((r) => [r.articleId, r.thumbSrc]),
      );
      if (!patch.size) return;

      setItems((prev) =>
        prev.map((p) => {
          const v = patch.get(p.articleId);
          return v ? { ...p, thumbSrc: v } : p;
        }),
      );
    }

    hydrateMissingThumbs();
    return () => {
      alive = false;
    };
  }, [items]);

  const sorted = useMemo(() => sortArticles(items, sortOrder), [items, sortOrder]);

  if (state.loading) {
    return (
      <div className={styles.galleryGrid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`${styles.galleryCard} ${styles.gallerySkeleton}`} />
        ))}
      </div>
    );
  }

  if (state.error) {
    return (
      <div className={styles.galleryError}>갤러리를 불러올 수 없습니다: {state.error}</div>
    );
  }

  if (!sorted.length) {
    return <div className={styles.galleryEmpty}>아직 게시글이 없습니다.</div>;
  }

  return (
    <div className={styles.galleryGrid}>
      {sorted.map((it) => {
        const href = `/article/${encodeURIComponent(it.articleId)}`;
        const date = formatDate(it.created_at);

        return (
          <a key={it.articleId} className={styles.galleryLink} href={href}>
            <div className={styles.galleryCard}>
              {it.thumbSrc ? (
                isLocalThumbSrc(it.thumbSrc) ? (
                  <Image
                    className={styles.galleryImg}
                    src={it.thumbSrc}
                    alt={it.title || 'image'}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <img
                    className={styles.galleryImg}
                    src={it.thumbSrc}
                    alt={it.title || 'image'}
                    loading="lazy"
                    decoding="async"
                  />
                )
              ) : (
                <div className={styles.galleryNoImg} />
              )}

              <div className={styles.galleryOverlay}>
                <div className={styles.galleryTitle} title={it.title}>
                  {it.title || '(제목 없음)'}
                </div>
                {date ? <div className={styles.galleryMeta}>{date}</div> : null}
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
