'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import styles from './page.module.css';
import { pushLoginWithRedirect } from '@/util/loginRedirect';

type ProfilePictureMode = 'url' | 'file';

export default function PfpUpdate() {
  const [mode, setMode] = useState<ProfilePictureMode>('url');
  const t = useTranslations('UsProfilePicture');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleProfileUpdateSuccess = async () => {
    alert(t('success'));
    router.push('/about/my-page');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);

    if (f) {
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
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
        alert(t('loginRequired'));
        pushLoginWithRedirect(router);
        return;
      }

      if (res.status === 204) {
        await handleProfileUpdateSuccess();
      } else {
        alert(t('failed'));
      }
    } else if (mode === 'file' && file) {
      const form = new FormData();
      form.append('file', file);

      const res = await fetchBackendClient('/api/user/update-pfp-file', {
        method: 'POST',
        body: form,
      });

      if (res.status === 401) {
        alert(t('loginRequired'));
        pushLoginWithRedirect(router);
        return;
      }

      if (res.status === 204) {
        await handleProfileUpdateSuccess();
      } else {
        alert(t('failed'));
      }
    }
  };

  return (
    <div className={styles.PfpUpdateContainer}>
      <p>{t('title')}</p>

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
          {t('urlMode')}
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
          {t('uploadMode')}
        </label>
      </div>

      {mode === 'url' && (
        <input
          type="text"
          placeholder={t('urlPlaceholder')}
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

      <button onClick={handleSubmit}>{t('save')}</button>
    </div>
  );
}
