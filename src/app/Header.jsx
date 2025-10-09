import { unstable_noStore as noStore } from 'next/cache';
import HeaderLeft from '@/components/header/HeaderLeft';
import HeaderCenter from '@/components/header/HeaderCenter';
import HeaderRight from '@/components/header/HeaderRight';
import MobileMenuList from '@/components/header/MobileMenuList';
import { fetchSCSCGlobalStatus } from '@/util/fetchAPIData';
import './header.css';

export default async function Header() {
  noStore();
  const scscGlobalStatus = await fetchSCSCGlobalStatus();

  return (
    <div>
      <div id="HeaderContainer">
        <div id="Header">
          <HeaderLeft
            year={scscGlobalStatus ? scscGlobalStatus.year : null}
            semester={scscGlobalStatus ? scscGlobalStatus.semester : null}
          />

          <HeaderCenter />

          <div id="HeaderRight">
            <HeaderRight />
            <MobileMenuList />
          </div>
        </div>
      </div>

      <div id="HeaderSpacer" />
    </div>
  );
}
