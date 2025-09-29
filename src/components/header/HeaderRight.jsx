import Link from 'next/link';
import Image from 'next/image';
import { minExecutiveLevel } from '@/util/constants';

export default function HeaderRight({ user }) {
  const isExecutive = user?.role >= minExecutiveLevel;

  return (
    <div>
      {user === undefined && <div className="HeaderRight__loading" />}

      {user === null && (
        <div className="HeaderRight__login">
          <Link href={'/us/login'} id="HeaderUserLogin" className="unset">로그인</Link>
        </div>
      )}

      {user && (
        <div className="HeaderRight__main">
          {isExecutive && (
            <Link href={'/executive'} className="unset toAdminPageButton HeaderRight__executive">운영진 페이지</Link>
          )}

          <Link href={'/about/my-page'} style={{ textDecoration: 'none' }} id="HeaderUser" className="unset HeaderRight__user">
              <Image
                src={user.profile_picture || '/main/default-pfp.png'}
                alt="Profile"
                className="user-profile-picture"
                width={24}
                height={24}
              />
              <span id="HeaderUserName">{user.name}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
