'use client';

import { useState } from 'react';
import { headerMenuData, minExecutiveLevel } from '@/util/constants';

function MobileExecutiveButton({ user }) {
  const isExecutive = user?.role >= minExecutiveLevel;

  if (user === undefined || !user) return null;

  if (isExecutive) {
    return (
      <button
        className="unset toAdminPageButton"
        onClick={() => (window.location.href = '/executive')}
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
}

export default function MobileMenuList({ mobileMenuOpen, user }) {
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
                      <button onClick={() => (window.location.href = item.url)}>
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <MobileExecutiveButton user={user} />
      </div>
    </div>
  );
}
