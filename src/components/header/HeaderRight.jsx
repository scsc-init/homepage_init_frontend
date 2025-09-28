import { minExecutiveLevel } from '@/util/constants';

export default function HeaderRight({ setMobileMenuOpen, user }) {
  const isExecutive = user?.role >= minExecutiveLevel;

  return (
    <div id="HeaderRight">
      {user === undefined && <div className="HeaderRight__loading" />}

      {user === null && (
        <div className="HeaderRight__login">
          <button
            id="HeaderUserLogin"
            className="unset"
            onClick={() => (window.location.href = '/us/login')}
          >
            로그인
          </button>
        </div>
      )}

      {user && (
        <>
          {isExecutive && (
            <button
              className="unset toAdminPageButton HeaderRight__executive"
              onClick={() => (window.location.href = '/executive')}
            >
              운영진 페이지
            </button>
          )}

          <button
            id="HeaderUser"
            className="unset HeaderRight__user"
            onClick={() => (window.location.href = '/about/my-page')}
          >
            <img
              src={user.profile_picture || '/main/default-pfp.png'}
              alt="Profile"
              className="user-profile-picture"
            />
            <span id="HeaderUserName">{user.name}</span>
          </button>

          <button
            className="HamburgerButton"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            ☰
          </button>
        </>
      )}
    </div>
  );
}
