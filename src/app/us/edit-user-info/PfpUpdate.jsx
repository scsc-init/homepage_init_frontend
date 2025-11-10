'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';

export default function PfpUpdate() {
  const [mode, setMode] = useState('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const router = useRouter();

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
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_picture: url,
          profile_picture_is_url: true,
        }),
      });
      if (res.status === 401) {
        alert('로그인이 필요합니다.');
        router.push('/us/login');
        return;
      }
      alert(res.status === 204 ? '변경 완료' : `변경 실패`);
      router.push('/about/my-page');
    } else if (mode === 'file' && file) {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/user/update-pfp-file', {
        method: 'POST',
        body: form,
      });
      if (res.status === 401) {
        alert('로그인이 필요합니다.');
        router.push('/us/login');
        return;
      }
      alert(res.status === 204 ? '변경 완료' : `변경 실패`);
      router.push('/about/my-page');
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
          <img src={preview} alt="Preview" />
        </div>
      )}

      <button onClick={handleSubmit}>저장</button>
    </div>
  );
}
