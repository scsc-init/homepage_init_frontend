'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';
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
import { ROLE_MAP } from '@/util/constants';
import type { UserProfile } from '@/types/user';

const cx = (...classes: unknown[]) => classes.filter(Boolean).join(' ');

function getUserStatusText(user: UserProfile) {
  if (user.is_active === true) return 'active' as const;
  if (user.is_banned === true) return 'banned' as const;
  if (user.is_active === false) return 'duesUnpaid' as const;
  return 'unknownStatus' as const;
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
  const { status } = useSession();
  const t = useTranslations('AboutMyPage');
  const locale = useLocale();
  const { me } = useMe();
  const [user, setUser] = useState<UserProfile | null>(null);
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

      if (me?.email) setUser(me);
    };
    load();
  }, [router, status, me]);

  const handleLogout = async () => {
    await onAuthFail();
    window.location.href = '/';
  };

  return (
    <div>
      <div className={styles['main-logo-wrapper__mypage']}>
        <p className={styles['main-logo-description']}>{t('title')}</p>
        <MainLogoImage
          className={styles['main-logo__mypage']}
          width={1976}
          height={670}
          loading="eager"
        />
      </div>

      <div className={styles['user-profile-wrapper']}>
        <img
          src={user?.profile_picture || '/asset/default-pfp.webp'}
          alt="Profile"
          width={50}
          height={50}
          className={styles['user-profile-picture']}
        />
        <div className={styles['user-name-container']}>
          <div className={styles['user-name']}>
            {user
              ? `${user.name} [${(locale === 'en-US' ? ROLE_MAP[user.role]?.english : ROLE_MAP[user.role]?.korean) || t('unknownRole')}]`
              : ''}
          </div>
        </div>
      </div>

      <div className={styles['main-container']}>
        <div className={styles['user-info-container']}>
          <h2 className={styles['user-info-description']}>{t('userInfo')}</h2>
          <table className={styles['user-info-table']}>
            <tbody>
              <tr>
                <th>{t('email')}</th>
                <td className={styles['mono-wrap']}>{user ? user.email : ''}</td>
              </tr>
              <tr>
                <th>{t('phone')}</th>
                <td>{user ? user.phone : ''}</td>
              </tr>
              <tr>
                <th>{t('studentId')}</th>
                <td>{user ? user.student_id : ''}</td>
              </tr>
              <tr>
                <th>{t('statusLabel')}</th>
                <td>{user ? t(getUserStatusText(user)) : ''}</td>
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
              <span className={styles['btn-label']}>{t('kakao')}</span>
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
              <span className={styles['btn-label']}>{t('discord')}</span>
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
              <span className={styles['btn-label']}>{t('payment')}</span>
            </a>

            <Link href="/us/edit-user-info" className={styles['action-button']}>
              <span className={styles['btn-icon']}>
                <MdArrowOutward size="24" />
              </span>
              <span className={styles['btn-label']}>{t('edit')}</span>
            </Link>
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
              <span className={styles['btn-label']}>{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
