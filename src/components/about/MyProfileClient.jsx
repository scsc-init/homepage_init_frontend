'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { fetchMeClient } from '@/util/fetchClientData';
import { DISCORD_INVITE_LINK, KAKAO_INVITE_LINK } from '@/util/constants';
import './myProfile.css';
import { MainLogoImage } from '@/components/common/MainLogoImage';

const USER_STATUS_MAP = {
  active: '활동 중(입금 확인 완료)',
  pending: '회비 미납부',
  standby: '회비 입금 확인 중',
  banned: '제명됨',
};

const USER_ROLE_MAP = {
  0: '최저권한',
  100: '휴회원',
  200: '준회원',
  300: '정회원',
  400: '졸업생',
  500: '운영진',
  1000: '회장',
};

async function onAuthFail() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {}
  try {
    await signOut({ redirect: false });
  } catch {}
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3C6.477 3 2 6.555 2 10.94c0 2.87 2.06 5.372 5.133 6.744L6.51 21.5c-.104.331.27.6.556.41l3.86-2.58c.34.03.683.047 1.074.047 5.523 0 10-3.555 10-7.94C22 6.555 17.523 3 12 3z"
        fill="currentColor"
      />
    </svg>
  );
}
function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.317 4.369A18.06 18.06 0 0 0 15.89 3l-.21.41a16.3 16.3 0 0 1 3.23 1.12c-3.05-1.41-6.43-1.41-9.48 0 .53-.25 1.07-.46 1.62-.64L10.842 3a18.06 18.06 0 0 0-4.428 1.37C3.41 8.09 2.71 11.64 3 15.14a18.43 18.43 0 0 0 5.57 2.83l.42-.69c-.77-.29-1.5-.66-2.19-1.09.84.4 1.72.72 2.63.96 1.76.44 3.58.44 5.34 0 .91-.24 1.79-.56 2.63-.96-.69.43-1.42.8-2.19 1.09l.42.69a18.43 18.43 0 0 0 5.57-2.83c.36-4.22-.44-7.74-1.94-10.68zM9.7 13.5c-.66 0-1.2-.74-1.2-1.65 0-.9.53-1.64 1.2-1.64s1.2.74 1.2 1.64c0 .91-.54 1.65-1.2 1.65zm4.6 0c-.66 0-1.2-.74-1.2-1.65 0-.9.54-1.64 1.2-1.64.67 0 1.2.74 1.2 1.64 0 .91-.53 1.65-1.2 1.65z"
        fill="currentColor"
      />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v2h4.586L6 17.586 7.414 19 18 8.414V13h2V5z" fill="currentColor" />
    </svg>
  );
}

export default function MyProfileClient() {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        await onAuthFail();
        router.replace('/us/login');
        return;
      }

      try {
        let data;
        const me = await fetchMeClient();
        if (me) {
          data = me;
        } else if (session?.user?.email && session?.hashToken) {
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email: session.user.email, hashToken: session.hashToken }),
          });
          if (loginRes.ok) {
            const loginData = await loginRes.json();
            if (loginData.jwt) await update({ backendJwt: loginData.jwt });
            data = await fetchMeClient();
          } else {
            await onAuthFail();
            router.replace('/us/login');
          }
        } else {
          await onAuthFail();
          router.replace('/us/login');
        }
        if (!data || !data.email) {
          await onAuthFail();
          router.replace('/us/login');
          return;
        }
        setUser(data);
      } catch {
        await onAuthFail();
        router.replace('/us/login');
      }
    };
    load();
  }, [router, session, status, update]);

  const handleLogout = async () => {
    await onAuthFail();
    window.location.href = '/';
  };

  return (
    <div>
      <div className="main-logo-wrapper__mypage">
        <p className="main-logo-description">My Page</p>
        <MainLogoImage
          className="main-logo__mypage logo"
          width={1976}
          height={670}
          loading="eager"
        />
      </div>

      <div className="user-profile-wrapper">
        {user ? (
          <img
            src={user.profile_picture || '/asset/default-pfp.png'}
            alt="Profile"
            className="user-profile-picture"
          />
        ) : (
          <img alt="" height="50" src="//:0" />
        )}
        <div className="user-name-container">
          <div className="user-name">
            {user ? `${user.name} [${USER_ROLE_MAP[user.role]}]` : ''}
          </div>
        </div>
      </div>

      <div className="main-container">
        <div className="user-info-container">
          <p className="user-info-description">User Info</p>
          <table className="user-info-table">
            <tbody>
              <tr>
                <th>이메일</th>
                <td className="mono-wrap">{user ? user.email : ''}</td>
              </tr>
              <tr>
                <th>전화번호</th>
                <td>{user ? user.phone : ''}</td>
              </tr>
              <tr>
                <th>학번</th>
                <td>{user ? user.student_id : ''}</td>
              </tr>
            </tbody>
          </table>

          <div className="user-info-actions">
            <a
              href={KAKAO_INVITE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="action-button"
            >
              <span className="btn-icon">
                <KakaoIcon />
              </span>
              <span className="btn-label">카카오 입장</span>
            </a>
            <a
              href={DISCORD_INVITE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="action-button"
            >
              <span className="btn-icon">
                <DiscordIcon />
              </span>
              <span className="btn-label">디스코드 입장</span>
            </a>
          </div>
        </div>

        <div className="right-container">
          <div className="user-status-container">
            <div className="user-status-content">
              <p className="user-status-description">User Status</p>
              <p>{user ? USER_STATUS_MAP[user.status] : ''}</p>
            </div>
            <button onClick={() => router.push('/about/welcome')} className="enroll-button">
              입금안내
            </button>
          </div>

          <div className="buttons-container">
            <div className="buttons-grid">
              <button
                onClick={() => router.push('/us/edit-user-info')}
                className="action-button"
              >
                <span className="btn-icon">
                  <ArrowIcon />
                </span>
                <span className="btn-label">정보수정</span>
              </button>
              <button onClick={handleLogout} className="logout-button" aria-label="로그아웃">
                <span className="material-icons">logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
