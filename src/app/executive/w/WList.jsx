'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { utc2kst } from '@/util/constants';

export default function WList({ wMetas }) {
  const [isBusy, setIsBusy] = useState(false);
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
    try {
      const res = await fetch(`/api/executive/w/create`, {
        method: 'POST',
        body: form,
      });
      if (res.status !== 201) {
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
      const res = await fetch(`/api/executive/w/${encodeURIComponent(name)}/update`, {
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
      const res = await fetch(`/api/executive/w/${encodeURIComponent(name)}/delete`, {
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

  return (
    <div className={isBusy ? 'is-busy' : undefined}>
      <div className="adm-section">
        <h3>HTML 페이지 목록</h3>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th className="adm-th">페이지명</th>
                <th className="adm-th">최종수정자</th>
                <th className="adm-th">파일크기(Bytes)</th>
                <th className="adm-th">생성시각</th>
                <th className="adm-th">수정시각</th>
                <th className="adm-th">수정버튼</th>
                <th className="adm-th">삭제버튼</th>
              </tr>
            </thead>
            <tbody>
              {wMetas.map((w) => (
                <tr key={w[0].name}>
                  <td className="adm-td">
                    <Link href={`/w/${encodeURIComponent(w[0].name)}`}>{w[0].name}</Link>
                  </td>
                  <td className="adm-td">{w[1]}</td>
                  <td className="adm-td">{w[0].size}</td>
                  <td className="adm-td">{utc2kst(w[0].created_at)}</td>
                  <td className="adm-td">{utc2kst(w[0].updated_at)}</td>
                  <td className="adm-td">
                    <input
                      type="file"
                      title=" "
                      accept=".html"
                      onChange={handleUpdate(w[0].name)}
                      disabled={isBusy}
                    />
                  </td>
                  <td className="adm-td">
                    <button
                      className="adm-button"
                      onClick={() => onClickDelete(w[0].name)}
                      disabled={isBusy}
                    >
                      페이지 삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="adm-section">
        <h3>HTML 파일 업로드</h3>
        <p>파일명이 이름으로 지정됩니다</p>
        <div className="adm-actions">
          <input
            type="file"
            title=" "
            accept=".html"
            onChange={handleCreate}
            disabled={isBusy}
          />
        </div>
      </div>
    </div>
  );
}
