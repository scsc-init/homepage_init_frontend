'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { utc2kst } from '@/util/constants';
import * as AdminLayout from '@/components/AdminLayout';

export default function WList({ wMetas }) {
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
        alert('파일 처리 실패: ' + err.detail);
      } else {
        router.refresh();
        setCreateName('');
        alert('파일 처리 성공');
      }
    } catch {
      alert('파일 처리 실패');
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
      const res = await fetch(toClientPath('/api/executive/w/update', name), {
        method: 'POST',
        body: form,
      });
      if (res.status !== 200) {
        const err = await res.json();
        alert('파일 처리 실패: ' + err.detail);
      } else {
        router.refresh();
        alert('파일 처리 성공');
      }
    } catch {
      alert('파일 처리 실패');
    } finally {
      setIsBusy(false);
      if (e.target) e.target.value = '';
    }
  };

  const onClickDelete = async (name) => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      const res = await fetch(toClientPath('/api/executive/w/delete', name), {
        method: 'POST',
      });
      if (res.status !== 204) {
        const err = await res.json();
        alert('삭제 실패: ' + err.detail);
      } else {
        router.refresh();
        alert('삭제 성공');
      }
    } catch {
      alert('삭제 실패');
    } finally {
      setIsBusy(false);
    }
  };

  const onClickDownload = async (name) => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      const res = await fetch(toClientPath('/api/executive/w/download', name));
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
      alert('다운로드 실패');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className={isBusy ? 'is-busy' : undefined}>
      <AdminLayout.AdminSection>
        <h3>HTML 페이지 목록</h3>
        <AdminLayout.AdminTableWrap>
          <AdminLayout.AdminTable>
            <thead>
              <tr>
                <th>페이지명</th>
                <th>최종수정자</th>
                <th>파일크기(Bytes)</th>
                <th>생성시각</th>
                <th>수정시각</th>
                <th>조회수</th>
                <th>수정버튼</th>
                <th>다운로드버튼</th>
                <th>삭제버튼</th>
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
                  <td>{utc2kst(w[0].created_at)}</td>
                  <td>{utc2kst(w[0].updated_at)}</td>
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
                      다운로드
                    </AdminLayout.AdminButton>
                  </td>

                  <td>
                    <AdminLayout.AdminButtonDanger
                      type="button"
                      onClick={() => onClickDelete(w[0].name)}
                      disabled={isBusy}
                    >
                      페이지 삭제
                    </AdminLayout.AdminButtonDanger>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminLayout.AdminTable>
        </AdminLayout.AdminTableWrap>
      </AdminLayout.AdminSection>

      <AdminLayout.AdminSection>
        <h3>HTML 파일 업로드</h3>
        <p>파일명이 이름으로 지정됩니다</p>
        <AdminLayout.AdminActions>
          <input
            type="text"
            placeholder="예: scpc2026/sponsors"
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
  const segments = name.split('/').map(encodeURIComponent).join('/');
  return `${basePath}/${segments}`;
}
