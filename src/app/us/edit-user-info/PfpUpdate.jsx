'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';
import { pushLoginWithRedirect } from '@/util/loginRedirect';

export default function PfpUpdate() {
  const [mode, setMode] = useState('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const router = useRouter();
  const { data: session, update } = useSession();

  const refreshProfileSession = async () => {
    if (!session?.user?.email || !session?.hashToken) return false;

    try {
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: session.user.email,
          hashToken: session.hashToken,
        }),
      });

      if (!loginRes.ok) return false;

      const loginData = await loginRes.json();
      if (!loginData?.userProfile) return false;

      const updatedSession = await update({
        ...(loginData.jwt ? { backendJwt: loginData.jwt } : {}),
        userProfile: loginData.userProfile,
      });
      return Boolean(updatedSession);
    } catch (error) {
      console.error('Failed to refresh profile session:', error);
      return false;
    }
  };

  const handleProfileUpdateSuccess = async () => {
    const sessionRefreshed = await refreshProfileSession();
    if (sessionRefreshed) {
      alert('변경 완료');
    } else {
      alert(
        '프로필 사진은 변경되었지만 세션을 갱신하지 못했습니다. 페이지를 새로고침해주세요.',
      );
    }
    router.push('/about/my-page');
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    setPreview(inputUrl || null);
  };

  const handleSubmit = async () => {
    if (mode === 'url' && url) {
      const res = await fetchBackendClient('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_picture: url,
          profile_picture_is_url: true,
        }),
      });
      if (res.status === 401) {
        alert('로그인이 필요합니다.');
        pushLoginWithRedirect(router);
        return;
      }
      if (res.status === 204) {
        await handleProfileUpdateSuccess();
      } else {
        alert('변경 실패');
      }
    } else if (mode === 'file' && file) {
      const form = new FormData();
      form.append('file', file);

      const res = await fetchBackendClient('/api/user/update-pfp-file', {
        method: 'POST',
        body: form,
      });
      if (res.status === 401) {
        alert('로그인이 필요합니다.');
        pushLoginWithRedirect(router);
        return;
      }
      if (res.status === 204) {
        await handleProfileUpdateSuccess();
      } else {
        alert('변경 실패');
      }
    }
  };

  return (
    <div className={styles.PfpUpdateContainer}>
      <p>프로필 사진 변경</p>
      <div>
        <label>
          <input
            type="radio"
            name="mode"
            value="url"
            checked={mode === 'url'}
            onChange={() => setMode('url')}
            className={styles.setMode}
          />
          URL 입력
        </label>
        <label className={styles.PfpUpdateContainerSecondLabel}>
          <input
            type="radio"
            name="mode"
            value="file"
            checked={mode === 'file'}
            onChange={() => setMode('file')}
            className={styles.setMode}
          />
          이미지 업로드
        </label>
      </div>

      {mode === 'url' && (
        <input
          type="text"
          placeholder="이미지 URL 입력"
          value={url}
          onChange={handleUrlChange}
          className={styles.imageInput}
        />
      )}

      {mode === 'file' && (
        <input
          type="file"
          accept="image/"
          onChange={handleFileChange}
          className={styles.imageInput}
        />
      )}

      {preview && (
        <div className={styles.imagePreview}>
          <img src={preview} width={50} height={50} alt="Preview" />
        </div>
      )}

      <button onClick={handleSubmit}>저장</button>
    </div>
  );
}
