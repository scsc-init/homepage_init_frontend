'use client';

import { useEffect, useState } from 'react';

export default function InquiryButton({ label = '💬' }) {
  const [href, setHref] = useState('');

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const res = await fetch(`/api/kv/TEXT_DISCORD_INVITE_LINK`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) return;
        const body = await res.json();
        if (typeof body?.value === 'string') setHref(body.value);
      } catch {
        /* noop */
      }
    };
    fetchLink();
  }, []);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="InquiryButton">
      {label}
    </a>
  );
}
