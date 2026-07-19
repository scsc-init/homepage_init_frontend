'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useMe } from '@/util/hooks/useMe';
import { replaceLoginWithRedirect } from '@/util/loginRedirect';
import styles from './myProfile.module.css';
import { MainLogoImage } from '@/components/common/MainLogoImage';
import { FaDiscord } from 'react-icons/fa';
import { AiOutlineMessage } from 'react-icons/ai';
import { MdArrowOutward, MdOutlineInfo, MdLogout } from 'react-icons/md';
import { getKvsClient } from '@/util/fetch/client-util';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const USER_ROLE_MAP = {
  0: '최저권한',
  100: '휴회원',
  200: '준회원',
  300: '정회원',
  400: '졸업생',
  500: '운영진',
  1000: '회장',
};

function getUserStatusText(user) {
  if (user.is_active === true) return '활동 중 (입금 확인 완료)';
  if (user.is_banned === true) return '제명됨';
  if (user.is_active === false) return '회비 미납부';
  return '상태 확인 불가';
}

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
  const { me } = useMe();
  const [user, setUser] = useState(null);
  const [inviteLinks, setInviteLinks] = useState({ kakao: '', discord: '' });
  const router = useRouter();
  useEffect(() => {
    const fetchInviteLinks = async () => {
      const [kakao, discord] = await getKvsClient([
        'TEXT_KAKAO_INVITE_LINK',
        'TEXT_DISCORD_INVITE_LINK',
      ]);
      setInviteLinks({ kakao, discord });
    };
    fetchInviteLinks();
  }, []);
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

            if (loginData.jwt && loginData.userProfile) {
              data = loginData.userProfile;

              await update({
                backendJwt: loginData.jwt,
                userProfile: data,
              });
            }
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
  }, [router, session, status, update, me]);

  const handleLogout = async () => {
    await onAuthFail();
    window.location.href = '/';
  };

  return (
    <div>
      <div className={styles['main-logo-wrapper__mypage']}>
        <p className={styles['main-logo-description']}>My Page</p>
        <MainLogoImage
          className={styles['main-logo__mypage']}
          width={1976}
          height={670}
          loading="eager"
        />
      </div>

      <div className={styles['user-profile-wrapper']}>
        <img
          src={user?.profile_picture || '/asset/default-pfp.png'}
          alt="Profile"
          width={50}
          height={50}
          className={styles['user-profile-picture']}
        />
        <div className={styles['user-name-container']}>
          <div className={styles['user-name']}>
            {user ? `${user.name} [${USER_ROLE_MAP[user.role] || '알 수 없음'}]` : ''}
          </div>
        </div>
      </div>

      <div className={styles['main-container']}>
        <div className={styles['user-info-container']}>
          <h2 className={styles['user-info-description']}>User Info</h2>
          <table className={styles['user-info-table']}>
            <tbody>
              <tr>
                <th>이메일</th>
                <td className={styles['mono-wrap']}>{user ? user.email : ''}</td>
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
                <td>{user ? getUserStatusText(user) : ''}</td>
              </tr>
            </tbody>
          </table>

          <div className={styles['user-info-actions']}>
            <a
              href={inviteLinks.kakao}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['action-button']}
            >
              <span className={styles['btn-icon']}>
                <AiOutlineMessage size="24" />
              </span>
              <span className={styles['btn-label']}>카카오톡 입장</span>
            </a>
            <a
              href={inviteLinks.discord}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['action-button']}
            >
              <span className={styles['btn-icon']}>
                <FaDiscord size="24" />
              </span>
              <span className={styles['btn-label']}>디스코드 입장</span>
            </a>

            <a
              href="/about/welcome"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['action-button']}
            >
              <span className={styles['btn-icon']}>
                <MdOutlineInfo size="24" />
              </span>
              <span className={styles['btn-label']}>입금 안내</span>
            </a>

            <a
              href="/us/edit-user-info"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['action-button']}
            >
              <span className={styles['btn-icon']}>
                <MdArrowOutward size="24" />
              </span>
              <span className={styles['btn-label']}>정보 수정</span>
            </a>
            <button
              onClick={handleLogout}
              className={styles['action-button']}
              style={{
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                fontFamily: 'inherit',
              }}
            >
              <span className={styles['btn-icon']}>
                <MdLogout size="24" />
              </span>
              <span className={styles['btn-label']}>로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
