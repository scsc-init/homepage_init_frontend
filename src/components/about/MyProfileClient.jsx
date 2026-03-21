'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { fetchMeClient } from '@/util/fetchClientData';
import { DISCORD_INVITE_LINK, KAKAO_INVITE_LINK } from '@/util/constants';
import { replaceLoginWithRedirect } from '@/util/loginRedirect';
import './myProfile.css';
import { MainLogoImage } from '@/components/common/MainLogoImage';
import { FaDiscord } from 'react-icons/fa';
import { AiOutlineMessage } from 'react-icons/ai';
import { MdArrowOutward, MdOutlineInfo } from 'react-icons/md';

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

export default function MyProfileClient() {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        await onAuthFail();
        replaceLoginWithRedirect(router);
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
            replaceLoginWithRedirect(router);
          }
        } else {
          await onAuthFail();
          replaceLoginWithRedirect(router);
        }
        if (!data || !data.email) {
          await onAuthFail();
          replaceLoginWithRedirect(router);
          return;
        }
        setUser(data);
      } catch {
        await onAuthFail();
        replaceLoginWithRedirect(router);
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
          <h2 className="user-info-description">User Info</h2>
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
              <tr>
                <th>활동상태</th>
                <td>
                  {user
                    ? user.is_active === true
                      ? '활동 중 (입금 확인 완료)'
                      : user.is_banned === true
                        ? '제명됨'
                        : user.is_active === false
                          ? '회비 미납부'
                          : '상태 확인 불가'
                    : ''}
                </td>
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
                <AiOutlineMessage size="24" />
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
                <FaDiscord size="24" />
              </span>
              <span className="btn-label">디스코드 입장</span>
            </a>

            <a
              href="/about/welcome"
              target="_blank"
              rel="noopener noreferrer"
              className="action-button"
            >
              <span className="btn-icon">
                <MdOutlineInfo size="24" />
              </span>
              <span className="btn-label">입금 안내</span>
            </a>

            <a
              href="/us/edit-user-info"
              target="_blank"
              rel="noopener noreferrer"
              className="action-button"
            >
              <span className="btn-icon">
                <MdArrowOutward size="24" />
              </span>
              <span className="btn-label">정보 수정</span>
            </a>
          </div>
          <div>
            <button className="my-page-logout-button" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
