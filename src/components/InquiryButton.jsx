'use client';

import { useEffect, useState } from 'react';
import { getKvClient } from '@/util/fetch/client-util';

export default function InquiryButton({ label = '💬' }) {
  const [href, setHref] = useState('');

  useEffect(() => {
    const fetchLink = async () => {
      const value = await getKvClient('TEXT_DISCORD_INVITE_LINK');
      if (value) setHref(value);
    };
    fetchLink();
  }, []);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="InquiryButton">
      {label}
    </a>
  );
}
