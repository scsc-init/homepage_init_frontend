import { useRef, useState } from 'react';
import { headerMenuData } from '@/util/constants';

export default function HeaderCenter() {
  const [openedMenuIndex, setOpenedMenuIndex] = useState(null);
  const timeoutRef = useRef();

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
    </div>
  );
}
