'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { headerMenuData } from '@/util/constants';

export default function HeaderCenter() {
  const [user, setUser] = useState(undefined);
  const [openedMenuIndex, setOpenedMenuIndex] = useState(null);
  const timeoutRef = useRef();

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/user/profile');
      if (res.ok) setUser(await res.json());
      else setUser(null);
    }
    fetchUser();
  }, [])

  const handleMouseEnter = (index) => {
    clearTimeout(timeoutRef.current);
    setOpenedMenuIndex(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenedMenuIndex(null), 300);
  };

  return (
    <div id="HeaderCenter">
      <ul id="HeaderMenuList">
        {headerMenuData.map((menu, index) => (
          <li
            className="HeaderMenuItem"
            key={menu.title}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="HeaderMenuTrigger">{menu.title}</button>
            <div className={`HeaderMenuContent ${openedMenuIndex === index ? 'open' : ''}`}>
              <ul>
                {menu.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.url === '/us/login' && user ? '/about/welcome' : item.url}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
