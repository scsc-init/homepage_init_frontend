import Link from 'next/link';
import Image from 'next/image';
import { SEMESTER_MAP } from '@/util/constants';

export default function HeaderLeft({ year, semester }) {
  return (
    <div id="HeaderLeft">
      <Link className='unset' href={'/'}>
        <Image
          src="/vectors/logo.svg"
          alt="SCSC Logo"
          width={100}
          height={40}
          className="logo"
        />
      </Link>
      {year && semester && (
        <div className="toAdminPageButton">
          {year} - {SEMESTER_MAP[semester]}학기
        </div>
      )}
    </div>
  );
}
