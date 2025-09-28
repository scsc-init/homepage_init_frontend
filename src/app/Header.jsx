'use client';

import { useEffect, useState } from 'react';
import HeaderLeft from '@/components/header/HeaderLeft';
import HeaderCenter from '@/components/header/HeaderCenter';
import HeaderRight from '@/components/header/HeaderRight';
import MobileMenuList from '@/components/header/MobileMenuList';
import './header.css';

export default function Header({ year, semester }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/user/profile`);
      setUser(res.ok ? await res.json() : null);
    };
    fetchUser();
  }, []);

  return (
    <>
      <div id="HeaderContainer">
        <div id="Header">
          <HeaderLeft year={year} semester={semester} />

          <HeaderCenter />

          <HeaderRight setMobileMenuOpen={setMobileMenuOpen} user={user} />
        </div>

        <MobileMenuList mobileMenuOpen={mobileMenuOpen} user={user} />
      </div>

      <div id="HeaderSpacer" />
    </>
  );
}
