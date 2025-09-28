import Link from 'next/link';
import { minExecutiveLevel } from '@/util/constants';

export default function HeaderRight({ user }) {
  const isExecutive = user?.role >= minExecutiveLevel;

  return (
    <div>
      {user === undefined && <div className="HeaderRight__loading" />}

      {user === null && (
        <div className="HeaderRight__login">
          <Link href={'/us/login'}>
            <button id="HeaderUserLogin" className="unset">
              로그인
            </button>
          </Link>
        </div>
      )}

      {user && (
        <div className="HeaderRight__main">
          {isExecutive && (
            <Link href={'/executive'}>
              <button className="unset toAdminPageButton HeaderRight__executive">
                운영진 페이지
              </button>
            </Link>
          )}

          <Link href={'/about/my-page'} style={{ textDecoration: 'none' }}>
            <button id="HeaderUser" className="unset HeaderRight__user">
              <img
                src={user.profile_picture || '/main/default-pfp.png'}
                alt="Profile"
                className="user-profile-picture"
              />
              <span id="HeaderUserName">{user.name}</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
