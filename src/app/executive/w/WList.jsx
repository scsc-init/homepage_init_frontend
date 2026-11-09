'use client';

import { useLocale, useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { formatExecutiveDate } from '@/app/executive/formatExecutiveDate';
import * as AdminLayout from '@/app/executive/AdminLayout';

export default function WList({ wMetas }) {
  const t = useTranslations('Executive');
  const locale = useLocale();
  const [isBusy, setIsBusy] = useState(false);
  const [createName, setCreateName] = useState('');
  const router = useRouter();

  const handleCreate = async (e) => {
    if (isBusy) return;
    setIsBusy(true);
    const file = e.target.files?.[0];
    if (!file) {
      setIsBusy(false);
      return;
    }
    const form = new FormData();
    form.append('file', file);
    if (createName.trim()) {
      form.append('name', createName.trim());
    }
    try {
      const res = await fetchBackendClient(`/api/executive/w/create`, {
        method: 'POST',
        body: form,
      });
      if (res.status !== 201) {
        const err = await res.json();
        alert(t('fileFailedPrefix') + err.detail);
      } else {
        router.refresh();
        setCreateName('');
        alert(t('fileProcessed'));
      }
    } catch {
      alert(t('fileFailed'));
    } finally {
      setIsBusy(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleUpdate = (name) => async (e) => {
    if (isBusy) return;
    setIsBusy(true);
    const file = e.target.files?.[0];
    if (!file) {
      setIsBusy(false);
      return;
    }
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetchBackendClient(toBackendWPath(name, 'update'), {
        method: 'POST',
        body: form,
      });
      if (res.status !== 200) {
        const err = await res.json();
        alert(t('fileFailedPrefix') + err.detail);
      } else {
        router.refresh();
        alert(t('fileProcessed'));
      }
    } catch {
      alert(t('fileFailed'));
    } finally {
      setIsBusy(false);
      if (e.target) e.target.value = '';
    }
  };

  const onClickDelete = async (name) => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      const res = await fetchBackendClient(toBackendWPath(name, 'delete'), {
        method: 'POST',
      });
      if (res.status !== 204) {
        const err = await res.json();
        alert(t('deleteFailedPrefix') + err.detail);
      } else {
        router.refresh();
        alert(t('deleteSuccess'));
      }
    } catch {
      alert(t('deleteFailed'));
    } finally {
      setIsBusy(false);
    }
  };

  const onClickDownload = async (name) => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      const res = await fetchBackendClient(toBackendWPath(name, 'download'));
      if (!res.ok) throw new Error('download failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name.replaceAll('/', '__')}.html`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch {
      alert(t('downloadFailed'));
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className={isBusy ? 'is-busy' : undefined}>
      <AdminLayout.AdminSection>
        <h3>{t('htmlPages')}</h3>
        <AdminLayout.AdminTableWrap>
          <AdminLayout.AdminTable>
            <thead>
              <tr>
                <th>{t('pageName')}</th>
                <th>{t('lastEditor')}</th>
                <th>{t('fileSize')}</th>
                <th>{t('createdAt')}</th>
                <th>{t('updatedAt')}</th>
                <th>{t('views')}</th>
                <th>{t('editAction')}</th>
                <th>{t('downloadAction')}</th>
                <th>{t('deleteAction')}</th>
              </tr>
            </thead>
            <tbody>
              {wMetas.map((w) => (
                <tr key={w[0].name}>
                  <td>
                    <Link href={toClientPath('/w', w[0].name)}>{w[0].name}</Link>
                  </td>
                  <td>{w[1]}</td>
                  <td>{w[0].size}</td>
                  <td>{formatExecutiveDate(w[0].created_at, locale)}</td>
                  <td>{formatExecutiveDate(w[0].updated_at, locale)}</td>
                  <td>{w[0].view_cnt}</td>
                  <td>
                    <input
                      type="file"
                      title=" "
                      accept=".html"
                      onChange={handleUpdate(w[0].name)}
                      disabled={isBusy}
                    />
                  </td>
                  <td>
                    <AdminLayout.AdminButton
                      type="button"
                      onClick={() => onClickDownload(w[0].name)}
                      disabled={isBusy}
                    >
                      {t('download')}
                    </AdminLayout.AdminButton>
                  </td>

                  <td>
                    <AdminLayout.AdminButtonDanger
                      type="button"
                      onClick={() => onClickDelete(w[0].name)}
                      disabled={isBusy}
                    >
                      {t('deletePage')}
                    </AdminLayout.AdminButtonDanger>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminLayout.AdminTable>
        </AdminLayout.AdminTableWrap>
      </AdminLayout.AdminSection>

      <AdminLayout.AdminSection>
        <h3>{t('htmlUpload')}</h3>
        <p>{t('htmlPageNameHelp')}</p>
        <AdminLayout.AdminActions>
          <input
            type="text"
            placeholder={t('pageNamePlaceholder')}
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            disabled={isBusy}
          />
          <input
            type="file"
            title=" "
            accept=".html"
            onChange={handleCreate}
            disabled={isBusy}
          />
        </AdminLayout.AdminActions>
      </AdminLayout.AdminSection>
    </div>
  );
}

function toClientPath(basePath, name) {
  return `${basePath}/${encodePathValue(name)}`;
}

function toBackendWPath(name, action) {
  return `/api/executive/w/${encodePathValue(name)}/${action}`;
}

function encodePathValue(value) {
  return value.split('/').map(encodeURIComponent).join('/');
}
