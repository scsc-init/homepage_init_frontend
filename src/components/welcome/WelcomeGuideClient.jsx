'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DEPOSIT_ACC, DISCORD_INVITE_LINK, KAKAO_INVITE_LINK } from '@/util/constants';
import CopyButton from '@/components/CopyButton';
import styles from '@/app/about/about.module.css';

const STATUS = {
  LOADING: 'loading',
  ERROR: 'error',
  UNAUTHENTICATED: 'unauthenticated',
  PENDING: 'pending',
  COMPLETED: 'completed',
};

export default function WelcomeGuideClient() {
  const [state, setState] = useState({ status: STATUS.LOADING, profile: null });

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile', { credentials: 'include' });
        if (!mounted) return;
        if (res.status === 401 || res.status === 403) {
          setState({ status: STATUS.UNAUTHENTICATED, profile: null });
          return;
        }
        if (!res.ok) {
          setState({ status: STATUS.ERROR, profile: null });
          return;
        }
        const data = await res.json();
        const status = data?.status;
        if (status === 'pending' || status === 'standby') {
          setState({ status: STATUS.PENDING, profile: data });
        } else {
          setState({ status: STATUS.COMPLETED, profile: data });
        }
      } catch (err) {
        if (mounted) setState({ status: STATUS.ERROR, profile: null });
      }
    };
    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  if (state.status === STATUS.LOADING || state.status === STATUS.PENDING) return null;

  const renderDiscordKakao = () => (
    <>
      <h3>
        <a
          href={DISCORD_INVITE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.textLink}
        >
          디스코드 서버 링크
        </a>
        <CopyButton link={DISCORD_INVITE_LINK} />
      </h3>
      <h3>
        <a
          href={KAKAO_INVITE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.textLink}
        >
          카카오톡 안내방 링크
        </a>
        <CopyButton link={KAKAO_INVITE_LINK} />
      </h3>
    </>
  );

  const renderContent = () => {
    switch (state.status) {
      case STATUS.UNAUTHENTICATED:
        return (
          <div className={styles.contentBlock}>
            <h2>로그인이 필요합니다</h2>
            <p>회원 정보를 확인하려면 먼저 로그인 해 주세요.</p>
            <Link href="/us/login" className={styles.textLink}>
              로그인 페이지로 이동
            </Link>
          </div>
        );
      case STATUS.COMPLETED:
        return (
          <div className={styles.contentBlock}>
            <h2>등록이 완료되었습니다</h2>
            <p>디스코드와 카카오톡 안내방에서 최신 공지와 일정을 확인하세요.</p>
            {renderDiscordKakao()}
            <Link href="/about/my-page" className={styles.textLink}>
              마이페이지로 이동
            </Link>
          </div>
        );
      case STATUS.ERROR:
      default:
        return (
          <div className={styles.contentBlock}>
            <h2>안내를 불러오지 못했습니다</h2>
            <p>잠시 후 다시 시도해 주세요.</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.welcomeContent}>{renderContent()}</div>
    </div>
  );
}
