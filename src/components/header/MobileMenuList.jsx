'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchUserClient } from '@/util/fetchClientData';
import { headerMenuData, minExecutiveLevel } from '@/util/constants';

function MobileExecutiveButton() {
  const [user, setUser] = useState(undefined);
  const [isExecutive, setIsExecutive] = useState(false);

  useEffect(() => {
    fetchUserClient().then(setUser);
  }, [])

  useEffect(() => {
    setIsExecutive(user?.role >= minExecutiveLevel);
  }, [user])

  if (user === undefined || !user) return null;

  if (isExecutive) {
    return (
      <Link
        href={'/executive'}
        className="unset toAdminPageButton"
        style={{
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          textDecoration: 'none',
        }}
      >
        운영진 페이지
      </Link>
    );
  }

  return null;
}

export default function MobileMenuList({ user }) {
  const [openedMenuIndex, setOpenedMenuIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      <button className="HamburgerButton" onClick={() => setMobileMenuOpen((prev) => !prev)}>
        ☰
      </button>
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
                        <Link href={item.url}>{item.label}</Link>
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
    </div>
  );
}
