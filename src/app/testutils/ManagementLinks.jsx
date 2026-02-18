'use client';

import Link from 'next/link';

const MANAGEMENT_SECTIONS = [
  { title: '유저 관리 페이지', href: '/executive/user' },
  { title: '임원진 구성 관리', href: '/executive/user#leadership' },
  { title: 'SCSC 상태 관리', href: '/executive' },
  { title: 'KV 편집', href: '/executive/kv' },
];

export default function ManagementLinks() {
  return (
    <>
      {MANAGEMENT_SECTIONS.map(({ title, href }) => (
        <section key={href} className="adm-section">
          <div className="adm-actions">
            <Link href={href} className="adm-button outline">
              {title}
            </Link>
          </div>
        </section>
      ))}
    </>
  );
}
