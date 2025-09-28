import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SEMESTER_MAP } from '@/util/constants';

export default function HeaderLeft({ year, semester }) {
  const router = useRouter();
  return (
    <div id="HeaderLeft">
      <button className="unset" onClick={() => router.push('/')}>
        <Image
          src="/vectors/logo.svg"
          alt="SCSC Logo"
          width={100}
          height={40}
          className="logo"
        />
      </button>
      {year && semester && (
        <div className="toAdminPageButton">
          {year} - {SEMESTER_MAP[semester]}학기
        </div>
      )}
    </div>
  );
}
