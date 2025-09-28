'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { headerMenuData, minExecutiveLevel } from '@/util/constants';

function MobileExecutiveButton({ user, onNavigate }) {
  const isExecutive = user?.role >= minExecutiveLevel;

  if (user === undefined || !user) return null;

  if (isExecutive) {
    return (
      <button
        className="unset toAdminPageButton"
        onClick={() => onNavigate('/executive')}
        style={{
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}
      >
        운영진 페이지
      </button>
    );
  }
  
  return null;
}

export default function MobileMenuList({ mobileMenuOpen, user }) {
  const router = useRouter();
  const [openedMenuIndex, setOpenedMenuIndex] = useState(null);

  return (
    <div className={`MobileMenuWrapper ${mobileMenuOpen ? 'open' : ''}`}>
      <div className="MobileMenu">
        <ul className="MobileMenuList">
          {headerMenuData.map((menu, index) => (
            <li className="MobileMenuItem" key={menu.title}>
              <button
                className="MobileMenuTrigger"
                onClick={() => setOpenedMenuIndex((prev) => (prev === index ? null : index))}
              >
                {menu.title}
              </button>
              <div className={`MobileSubMenu ${openedMenuIndex === index ? 'open' : ''}`}>
                <ul>
                  {menu.items.map((item) => (
                    <li key={item.label}>
                      <button onClick={() => router.push(item.url)}>
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <MobileExecutiveButton user={user} onNavigate={(url) => router.push(url)} />
      </div>
    </div>
  );
}
