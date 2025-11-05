'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Footer.module.css';

export default function FooterMessage() {
  const [footerMessage, setFooterMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const key = 'footer-message';

  useEffect(() => {
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
        setNewMessage(footer.value);
      } else {
        setFooterMessage('Footer 정보를 불러오지 못했습니다.');
        return;
      }
    };
    getFooter();
  }, []);

  const editFooter = async () => {
    if (!newMessage.trim()) return;
    if (!window.confirm('정말 저장하시겠습니까?')) return;
    setIsSaving(true);
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
        setNewMessage(footer.value);
        router.refresh();
      } else if (res.status === 401 || res.status === 403) {
        alert('편집 권한이 없습니다.');
        router.refresh();
      } else {
        alert('Footer 편집 실패');
      }
    } catch (e) {
      alert('Footer 편집 실패: ' + (e?.message || '네트워크 오류'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles['footerData']}>
      <div className={styles['footerSection']}>
        <textarea
          className={styles['footerTextArea']}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={footerMessage}
        />
        <button className={styles['footerButton']} onClick={editFooter} disabled={isSaving}>
          {isSaving ? '저장 중...' : '저장'}
        </button>
        <button
          className={styles['footerButton']}
          onClick={() => {
            setNewMessage(footerMessage);
          }}
          disabled={isSaving}
        >
          {isSaving ? '취소 불가' : '취소'}
        </button>
      </div>
    </div>
  );
}
