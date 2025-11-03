'use client';

import styles from './Footer.module.css';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { hideFooterRoutes, footerLogoData } from '@/util/constants';
import { fetchMeClient } from '@/util/fetchClientData';
import { minExecutiveLevel } from '@/util/constants';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const hideFooterRoutes = ['/us/login', '/signup', '/about/my-page'];
  const [footerMessage, setFooterMessage] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(undefined);
  const [isExecutive, setIsExecutive] = useState(false);
  const newRef = useRef(null);
  const router = useRouter();
  const key = 'footer-message';

  if (hideFooterRoutes.includes(pathname)) return null;

  useEffect(() => {
    fetchMeClient().then(setUser);
  }, []);
  useEffect(() => {
    setIsExecutive((user?.role ?? 0) >= minExecutiveLevel);
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#new-message') {
      setShowEditor(true);
      setTimeout(() => newRef.current?.focus(), 0);
    }
  }, []);

  useEffect(() => {
    getFooter();
  }, []);

  const getFooter = async () => {
    const res = await fetch(`/api/kv/${key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      const footer = await res.json();
      setFooterMessage(footer.value);
      router.refresh();
    } else {
      setFooterMessage('Footer 정보를 불러오지 못했습니다.');
      return;
    }
  };

  const divideMessage = Array.isArray(String(footerMessage).split('\\n'))
    ? footerMessage.split('\\n')
    : ['정보를 불러오지 못했습니다.'];

  const editFooter = async () => {
    if (!newMessage.trim()) return;
    if (!window.confirm('정말 저장하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/kv/${key}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: newMessage,
        }),
      });
      if (res.ok) {
        const footer = await res.json();
        setFooterMessage(footer.value);
        setNewMessage(footerMessage);
        setShowEditor(false);
        router.refresh();
      } else if (res.status === 401 || res.status === 403) {
        alert('편집 권한이 없습니다.');
        router.refresh();
      } else {
        alert('Footer 편집 실패');
      }
    } catch (e) {
      alert('Footer 편집 실패: ' + (e?.message || '네트워크 오류'));
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.infoContainer}>
          <div>
            <div>
              {divideMessage.map((message) => (
                <p className={styles.message} key={message}>
                  {message}
                </p>
              ))}
            </div>
          </div>
        </div>
        {isExecutive ? (
          <button className={styles.footerEditButton} onClick={() => setShowEditor((v) => !v)}>
            {showEditor ? '취소' : 'Footer 편집'}
          </button>
        ) : null}
        {showEditor && (
          <div id="new-message">
            <textarea
              className={styles.textBox}
              ref={newRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={footerMessage}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) editFooter();
              }}
            />
            <button className={styles.footerEditButtonSave} onClick={editFooter}>
              저장
            </button>
            <button
              className={styles.footerEditButtonSave}
              onClick={() => {
                setShowEditor(false);
                setNewMessage(footerMessage);
              }}
            >
              취소
            </button>
          </div>
        )}
        <div className={styles.logoList}>
          {footerLogoData.map(({ href, src, alt }) => (
            <div className={styles.logo} key={alt}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                <Image src={src} alt={alt} width={24} height={24} className="logo" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
