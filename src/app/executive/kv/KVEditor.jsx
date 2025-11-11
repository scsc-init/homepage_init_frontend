'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './KV.module.css';
import { HIDDEN_KV_KEYS } from '@/util/constants';

export default function KVEditor() {
  const router = useRouter();
  const [keyInput, setKeyInput] = useState('footer-message');
  const [value, setValue] = useState('');
  const [original, setOriginal] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const presets = useMemo(
    () =>
      [
        { label: 'footer-message', value: 'footer-message' },
        { label: 'main-president', value: 'main-president' },
        { label: 'vice-president', value: 'vice-president' },
      ].filter((p) => !HIDDEN_KV_KEYS.includes(p.value)),
    [],
  );

  const canSave = useMemo(() => keyInput.trim().length > 0, [keyInput]);

  const loadKV = async () => {
    if (!keyInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/kv/${encodeURIComponent(keyInput.trim())}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        const raw = typeof data?.value === 'string' ? data.value : '';
        const v = raw.replace(/\\n/g, '\n');
        setOriginal(v);
        setValue(v);
      } else if (res.status === 404) {
        setOriginal('');
        setValue('');
      } else if (res.status === 401 || res.status === 403) {
        alert('권한이 없습니다.');
        router.refresh();
      } else {
        alert('값을 불러오지 못했습니다.');
      }
    } catch (e) {
      alert('불러오기 실패: ' + (e?.message || '네트워크 오류'));
    } finally {
      setLoading(false);
    }
  };

  const saveKV = async () => {
    if (!canSave) return;
    if (!window.confirm('저장하시겠습니까?')) return;
    setSaving(true);
    try {
      const bodyValue = value.replace(/\r\n|\n/g, '\\n');
      const res = await fetch(`/api/kv/${encodeURIComponent(keyInput.trim())}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: bodyValue }),
      });
      if (res.ok) {
        const data = await res.json();
        const raw = typeof data?.value === 'string' ? data.value : '';
        const v = raw.replace(/\\n/g, '\n');
        setOriginal(v);
        setValue(v);
        router.refresh();
      } else if (res.status === 401 || res.status === 403) {
        alert('편집 권한이 없습니다.');
        router.refresh();
      } else {
        alert('저장에 실패했습니다.');
      }
    } catch (e) {
      alert('저장 실패: ' + (e?.message || '네트워크 오류'));
    } finally {
      setSaving(false);
    }
  };

  const clearKV = async () => {
    if (!canSave) return;
    if (!window.confirm('값을 비웁니다. 계속하시겠습니까?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/kv/${encodeURIComponent(keyInput.trim())}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: '' }),
      });
      if (res.ok) {
        setOriginal('');
        setValue('');
        router.refresh();
      } else if (res.status === 401 || res.status === 403) {
        alert('편집 권한이 없습니다.');
        router.refresh();
      } else {
        alert('비우기에 실패했습니다.');
      }
    } catch (e) {
      alert('비우기 실패: ' + (e?.message || '네트워크 오류'));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadKV();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.editor}>
      <div className={styles.row}>
        <select
          className={styles.select}
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
        >
          {presets.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <input
          className={styles.input}
          placeholder="키를 입력하세요"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={loadKV}
          disabled={loading || saving || !canSave}
        >
          {loading ? '불러오는 중...' : '불러오기'}
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.label}>값</div>
        <textarea
          className={styles.textarea}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="여기에 값을 입력하세요"
        />
        <div className={styles.meta}>
          <span>길이: {value.length}</span>
          <span>저장됨: {original.length}자</span>
        </div>
        <div className={styles.actions}>
          <button className={styles.button} onClick={saveKV} disabled={saving || !canSave}>
            {saving ? '저장 중...' : '저장'}
          </button>
          <button
            className={`${styles.button} ${styles.outline}`}
            onClick={() => setValue(original)}
            disabled={saving}
          >
            되돌리기
          </button>
          <button
            className={`${styles.button} ${styles.danger}`}
            onClick={clearKV}
            disabled={saving || !canSave}
          >
            비우기
          </button>
        </div>
      </div>
    </div>
  );
}
