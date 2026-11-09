'use client';

import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import styles from './KV.module.css';
import { HIDDEN_KV_KEYS } from '@/util/constants';
import { getKvClient, getKvsClient, setKvClient } from '@/util/fetch/client-util';

const DEFAULT_PRESET_KEYS = ['footer-message'];

export default function KVEditor() {
  const t = useTranslations('Executive');
  const router = useRouter();
  const [keyInput, setKeyInput] = useState(DEFAULT_PRESET_KEYS[0]);
  const [value, setValue] = useState('');
  const [original, setOriginal] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [presetKeys, setPresetKeys] = useState(DEFAULT_PRESET_KEYS);

  const presets = useMemo(() => {
    const sanitize = (keys) =>
      Array.from(
        new Set(
          keys
            .map((key) => (typeof key === 'string' ? key.trim() : ''))
            .filter((key) => key && !HIDDEN_KV_KEYS.includes(key)),
        ),
      );

    const filtered = sanitize(presetKeys);
    const finalKeys = filtered.length ? filtered : sanitize(DEFAULT_PRESET_KEYS);
    return finalKeys.map((key) => ({ label: key, value: key }));
  }, [presetKeys]);

  const canSave = useMemo(() => keyInput.trim().length > 0, [keyInput]);

  const loadPresetKeys = useCallback(async () => {
    try {
      const data = await getKvsClient(undefined);
      if (Array.isArray(data)) {
        const keys = data
          .map((item) => (typeof item?.key === 'string' ? item.key.trim() : ''))
          .filter(Boolean);
        const uniqueKeys = Array.from(new Set([...DEFAULT_PRESET_KEYS, ...keys]));
        setPresetKeys(uniqueKeys);
      }
    } catch (e) {
      console.warn('KV preset fetch failed:', e);
    }
  }, []);

  const loadKV = async () => {
    if (!keyInput.trim()) return;
    setLoading(true);
    try {
      const raw = await getKvClient(keyInput.trim());
      setOriginal(raw);
      setValue(raw);
    } catch (e) {
      alert(t('loadFailedPrefix') + (e?.message || t('networkError')));
    } finally {
      setLoading(false);
    }
  };

  const saveKV = async () => {
    if (!canSave) return;
    if (!window.confirm(t('confirmSave'))) return;
    setSaving(true);
    try {
      const bodyValue = value;
      const res = await setKvClient(keyInput.trim(), bodyValue);
      if (res.ok) {
        const data = await res.json();
        const raw = typeof data?.value === 'string' ? data.value : '';
        setOriginal(raw);
        setValue(raw);

        router.refresh();
      } else if (res.status === 401 || res.status === 403) {
        alert(t('noEditPermission'));
        router.refresh();
      } else {
        alert(t('saveError'));
      }
    } catch (e) {
      alert(t('saveFailedPrefix') + (e?.message || t('networkError')));
    } finally {
      setSaving(false);
    }
  };

  const clearKV = async () => {
    if (!canSave) return;
    if (!window.confirm(t('confirmClear'))) return;
    setSaving(true);
    try {
      const res = await setKvClient(keyInput.trim(), '');
      if (res.ok) {
        setOriginal('');
        setValue('');
        router.refresh();
      } else if (res.status === 401 || res.status === 403) {
        alert(t('noEditPermission'));
        router.refresh();
      } else {
        alert(t('clearError'));
      }
    } catch (e) {
      alert(t('clearFailedPrefix') + (e?.message || t('networkError')));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadPresetKeys();
  }, [loadPresetKeys]);

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
          placeholder={t('keyPlaceholder')}
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
        />
        <Button onClick={loadKV} disabled={loading || saving || !canSave}>
          {loading ? t('loading') : t('load')}
        </Button>
      </div>

      <div className={styles.section}>
        <div className={styles.label}>{t('value')}</div>
        <textarea
          className={styles.textarea}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t('valuePlaceholder')}
        />
        <div className={styles.meta}>
          <span>{t('valueLength', { value0: value.length ?? '' })}</span>
          <span>{t('savedLength', { value0: original.length ?? '' })}</span>
        </div>
        <div className={styles.actions}>
          <Button onClick={saveKV} disabled={saving || !canSave}>
            {saving ? t('saving') : t('save')}
          </Button>
          <Button variant="secondary" onClick={() => setValue(original)} disabled={saving}>
            {t('revert')}
          </Button>
          <Button variant="danger" onClick={clearKV} disabled={saving || !canSave}>
            {t('clear')}
          </Button>
        </div>
      </div>
    </div>
  );
}
