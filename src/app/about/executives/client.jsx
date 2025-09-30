'use client';

import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';
import { useEffect, useRef, useState } from 'react';
import {
  minExecutiveLevel,
  presidentEmails,
  vicePresidentEmails,
  excludedExecutiveEmails,
} from '@/util/constants';

function upgradeGoogleAvatar(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (!host.includes('googleusercontent.com')) return url;
    let s = url;
    s = s.replace(/([?&]sz=)(\d+)/i, '$1' + 512);
    s = s.replace(/=s\d+(?:-c)?(?=$|[?#])/i, '=s512-c');
    if (!/[?&]sz=\d+/i.test(s) && !/=s\d+(?:-c)?/i.test(s))
      s += (s.includes('?') ? '&' : '?') + 'sz=512';
    return s;
  } catch {
    return url;
  }
}

function pickProfileSrc(val) {
  const raw = String(val || '').trim();
  if (!raw) return '/opengraph.png';
  if (/^https?:\/\//i.test(raw)) return upgradeGoogleAvatar(raw);
  return raw.startsWith('/') ? raw : `/${raw}`;
}

function roleDisplayByEmail(email) {
  const e = String(email || '').toLowerCase();
  if (presidentEmails.map((x) => x.toLowerCase()).includes(e)) return '회장';
  if (vicePresidentEmails.map((x) => x.toLowerCase()).includes(e)) return '부회장';
  return '임원';
}

function toNumberOrNull(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function extractLevel(u) {
  const candidates = [u?.role_level, u?.roleLevel, u?.level, u?.role?.level, u?.role];
  for (const c of candidates) {
    const n = toNumberOrNull(c);
    if (n !== null) return n;
  }
  const names = [
    String(u?.role_name || '').toLowerCase(),
    String(u?.role?.name || '').toLowerCase(),
    String(u?.user_role || '').toLowerCase(),
  ];
  if (names.some((s) => s === 'president')) return 1000;
  if (names.some((s) => s === 'vice_president' || s === 'vice-president')) return 900;
  if (names.some((s) => s === 'executive' || s === 'admin' || s === 'manager'))
    return minExecutiveLevel;
  return 0;
}

function normalizeUsers(data) {
  const arr = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.users)
        ? data.users
        : [];
  return arr.map((u) => {
    const email = u?.email || u?.mail || u?.user_email || '';
    const name = u?.name || u?.username || u?.display_name || u?.full_name || email || '';
    const id = u?.id || u?.user_id || u?.uid || email || name;
    const pic = u?.profile_picture ?? u?.profileImage ?? u?.photo_url ?? u?.avatar_url ?? null;
    const level = extractLevel(u);
    return { id, name, email, level, raw: u, image: pickProfileSrc(pic) };
  });
}

export default function ExecutivesClient() {
  const [people, setPeople] = useState([]);
  const [centerIndex, setCenterIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const autoRef = useRef();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/users', { credentials: 'include', cache: 'no-store' });
        if (!res.ok) throw new Error('failed');
        const json = await res.json();

        const excludedSet = new Set(
          excludedExecutiveEmails.map((x) => String(x).toLowerCase()),
        );
        const base = normalizeUsers(json).filter(
          (u) => !excludedSet.has(String(u.email || '').toLowerCase()),
        );

        const filtered = base.filter((u) => u.level >= minExecutiveLevel);

        const mapped = filtered.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          roleNum: u.level,
          role: roleDisplayByEmail(u.email),
          image: u.image,
        }));

        const prez = mapped.filter((p) => p.role === '회장');
        const vprez = mapped.filter((p) => p.role === '부회장');
        const others = mapped
          .filter((p) => p.role === '임원')
          .sort((a, b) => a.name.localeCompare(b.name, 'ko'));

        setPeople([...prez, ...vprez, ...others]);
        setCenterIndex(0);
      } catch {
        setPeople([]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!hovered && !isMobile && people.length > 1) {
      autoRef.current = setInterval(() => setCenterIndex((p) => (p + 1) % people.length), 4000);
    }
    return () => clearInterval(autoRef.current);
  }, [hovered, isMobile, people.length]);

  const handlers = useSwipeable({
    onSwipedLeft: () => setCenterIndex((p) => (people.length ? (p + 1) % people.length : 0)),
    onSwipedRight: () =>
      setCenterIndex((p) => (people.length ? (p - 1 + people.length) % people.length : 0)),
    trackMouse: true,
  });

  const total = people.length;
  const positionClass = (idx) => {
    if (!total) return 'hidden';
    const offset = (idx - centerIndex + total) % total;
    if (offset === 0) return 'center';
    if (offset === 1 || offset === -total + 1) return 'right-1';
    if (offset === 2 || offset === -total + 2) return 'right-2';
    if (offset === total - 1) return 'left-1';
    if (offset === total - 2) return 'left-2';
    return 'hidden';
  };

  if (isMobile) {
    return (
      <div className="ExecutiveMasonry">
        {people.map((person, i) => (
          <div className="ExecutiveCard" key={person.id || i}>
            <div className="ExecutiveImageWrapper">
              <Image
                src={person.image}
                alt={person.name}
                fill
                className="ExecutiveImage"
                sizes="(max-width: 768px) 160px, 200px"
                quality={90}
              />
            </div>
            <h3>{person.name}</h3>
            <p className="ExecutiveRole">{person.role}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="ExecutiveCarouselWrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...handlers}
    >
      <div className="ExecutiveCarouselCentered">
        {people.map((person, idx) => (
          <div
            className={`ExecutiveCard ${positionClass(idx)}`}
            key={person.id || idx}
            style={{ transition: 'transform 0.6s ease, opacity 0.6s ease' }}
          >
            <div className="ExecutiveImageWrapper">
              <Image
                src={person.image}
                alt={person.name}
                fill
                className="ExecutiveImage"
                sizes="(max-width: 768px) 160px, 200px"
                quality={90}
              />
            </div>
            <h3>{person.name}</h3>
            <p className="ExecutiveRole">{person.role}</p>
          </div>
        ))}
      </div>
      <div className="ExecutiveDots">
        {people.map((_, i) => (
          <div
            key={i}
            className={`ExecutiveDot ${i === centerIndex ? 'active' : ''}`}
            onClick={() => setCenterIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
