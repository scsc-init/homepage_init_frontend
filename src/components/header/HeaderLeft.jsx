import Link from 'next/link';
import Image from 'next/image';
import { SEMESTER_MAP } from '@/util/constants';
import styles from '@/app/Header.module.css';

export default function HeaderLeft({ year, semester }) {
  return (
    <>
      <Link href="/" className="unset">
        <Image
          src="/vectors/logo.svg"
          alt="SCSC Logo"
          className="logo"
          width={100}
          height={40}
          priority={true}
        />
      </Link>
      {year && semester && (
        <div className={styles.executiveLink}>
          {year} - {SEMESTER_MAP[semester]}학기
        </div>
      )}
    </>
  );
}
