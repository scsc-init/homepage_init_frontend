'use client';

import { useEffect, useRef, useState } from 'react';
import {
  minExecutiveLevel,
  presidentEmails,
  vicePresidentEmails,
  excludedExecutiveEmails,
  DEFAULT_EXECUTIVE_PFP,
} from '@/util/constants';
import { resolveProfileImage } from '@/util/profileImage';

function roleDisplay(user, leadershipIds) {
  if (!user) return '임원';
  const { presidentId, vicePresidentId } = leadershipIds || {};
  const userId = String(user.id ?? '').trim();
  const presidentKey = String(presidentId ?? '').trim();
  const vicePresidentKey = String(vicePresidentId ?? '').trim();
  if (presidentKey && userId === presidentKey) return '회장';
  if (vicePresidentKey && userId === vicePresidentKey) return '부회장';
  return '임원';
}

function normUser(u) {
  const email = u?.email || '';
  const name = u?.name || email || '';
  const id = u?.id || email || name;
  const level = Number.isFinite(Number(u?.role)) ? Number(u.role) : 0;
  const image = resolveProfileImage(u, DEFAULT_EXECUTIVE_PFP);
  return { id, name, email, level, image };
}

export default function ExecutivesClient() {
  const [people, setPeople] = useState([]);
  const [centerIndex, setCenterIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const autoRef = useRef();

  useEffect(() => {
    const load = async () => {
      try {
        const [execRes, prezRes, leadersRes] = await Promise.all([
          fetch('/api/users?user_role=executive', {
            credentials: 'include',
            cache: 'no-store',
          }),
          fetch('/api/users?user_role=president', {
            credentials: 'include',
            cache: 'no-store',
          }),
          fetch('/api/leadership', {
            cache: 'no-store',
          }),
        ]);

        if (!execRes.ok && !prezRes.ok) throw new Error('failed');

        const [execJson, prezJson, leadersJson] = await Promise.all([
          execRes.ok ? execRes.json() : [],
          prezRes.ok ? prezRes.json() : [],
          leadersRes.ok ? leadersRes.json() : null,
        ]);

        if (!execRes.ok || !prezRes.ok) {
          console.warn('Partial executive data load', {
            execOk: execRes.ok,
            prezOk: prezRes.ok,
          });
        }

        const leadership = {
          presidentId:
            leadersJson && typeof leadersJson.president_id === 'string'
              ? leadersJson.president_id
              : null,
          vicePresidentId:
            leadersJson && typeof leadersJson.vice_president_id === 'string'
              ? leadersJson.vice_president_id
              : null,
        };

        const raw = [
          ...(Array.isArray(execJson) ? execJson : []),
          ...(Array.isArray(prezJson) ? prezJson : []),
        ];
        const excludedSet = new Set(
          excludedExecutiveEmails.map((x) => String(x).toLowerCase()),
        );
        const normalized = raw
          .map(normUser)
          .filter((u) => !excludedSet.has(String(u.email || '').toLowerCase()))
          .filter((u) => u.level >= minExecutiveLevel);

        const dedup = [];
        const seen = new Set();
        for (const u of normalized) {
          const key = u.id || u.email;
          if (!seen.has(key)) {
            seen.add(key);
            dedup.push(u);
          }
        }

        const mapped = dedup.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          roleNum: u.level,
          role: roleDisplay(u, leadership),
          image: u.image || DEFAULT_EXECUTIVE_PFP,
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
    if (!hovered && people.length > 1) {
      autoRef.current = setInterval(() => setCenterIndex((p) => (p + 1) % people.length), 4000);
    }
    return () => clearInterval(autoRef.current);
  }, [hovered, people.length]);

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

  return (
    <>
      <div
        className="ExecutiveCarouselWrapper"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="ExecutiveCarouselCentered">
          {people.map((person, idx) => (
            <div
              className={`ExecutiveCard ${positionClass(idx)}`}
              key={person.id || idx}
              style={{ transition: 'transform 0.6s ease, opacity 0.6s ease' }}
            >
              <div className="ExecutiveImageWrapper">
                <img
                  src={person.image || DEFAULT_EXECUTIVE_PFP}
                  alt={person.name}
                  loading="lazy"
                  decoding="async"
                  className="ExecutiveImage"
                  referrerPolicy="no-referrer"
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

      <div className="ExecutiveMasonry">
        {people.map((person, i) => (
          <div className="ExecutiveCard" key={person.id || i}>
            <div className="ExecutiveImageWrapper">
              <img
                src={person.image || DEFAULT_EXECUTIVE_PFP}
                alt={person.name}
                loading="lazy"
                decoding="async"
                className="ExecutiveImage"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3>{person.name}</h3>
            <p className="ExecutiveRole">{person.role}</p>
          </div>
        ))}
      </div>
    </>
  );
}
