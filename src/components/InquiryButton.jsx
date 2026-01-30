'use client';

import { DISCORD_INVITE_LINK } from '@/util/constants';

export default function InquiryButton({ label = '💬' }) {
  return (
    <a
      href={DISCORD_INVITE_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="InquiryButton"
    >
      {label}
    </a>
  );
}
