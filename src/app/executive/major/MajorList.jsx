'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import React, { useState } from 'react';
import Button from '@/components/common/Button';
import styles from './MajorList.module.css';

export default function MajorList({ majors: majorsDefault }) {
  const t = useTranslations('Executive');
  const [majors, setMajors] = useState(majorsDefault ?? []);
  const [newMajor, setNewMajor] = useState({ college: '', major_name: '' });

  const updateMajorField = (id, field, value) => {
    setMajors((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const saveMajor = async (major) => {
    const res = await fetchBackendClient(`/api/executive/major/update/${major.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(major),
    });
    if (res.status === 204) alert(t('saved'));
    else alert(t('saveFailedPrefix') + res.status);
  };

  const deleteMajor = async (id) => {
    if (!confirm(t('confirmDelete'))) return;
    const res = await fetchBackendClient(`/api/executive/major/delete/${id}`, {
      method: 'POST',
    });
    if (res.status === 204) {
      alert(t('deleted'));
      setMajors((prev) => prev.filter((m) => m.id !== id));
    } else alert(t('deleteFailedPrefix') + res.status);
  };

  const createMajor = async () => {
    const res = await fetchBackendClient(`/api/executive/major/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMajor),
    });
    if (res.status === 201) {
      setNewMajor({ college: '', major_name: '' });
      alert(t('added'));
    } else alert(t('addFailedPrefix') + res.status);
  };

  return (
    <div>
      <h2>{t('majorList')}</h2>
      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '10%' }}>ID</th>
              <th style={{ width: '30%' }}>{t('college')}</th>
              <th style={{ width: '40%' }}>{t('majorName')}</th>
              <th style={{ width: '20%' }}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td>
                <input
                  className={styles.input}
                  placeholder={t('collegeName')}
                  value={newMajor.college}
                  onChange={(e) =>
                    setNewMajor((prev) => ({
                      ...prev,
                      college: e.target.value,
                    }))
                  }
                />
              </td>
              <td>
                <input
                  className={styles.input}
                  placeholder={t('majorName')}
                  value={newMajor.major_name}
                  onChange={(e) =>
                    setNewMajor((prev) => ({
                      ...prev,
                      major_name: e.target.value,
                    }))
                  }
                />
              </td>
              <td>
                <Button className={styles.button} onClick={createMajor}>
                  {t('add')}
                </Button>
              </td>
            </tr>
            {majors.map((major) => (
              <tr key={major.id}>
                <td>{major.id}</td>
                <td>
                  <input
                    className={styles.input}
                    value={major.college}
                    onChange={(e) => updateMajorField(major.id, 'college', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className={styles.input}
                    value={major.major_name}
                    onChange={(e) => updateMajorField(major.id, 'major_name', e.target.value)}
                  />
                </td>
                <td>
                  <div>
                    <Button className={styles.button} onClick={() => saveMajor(major)}>
                      {t('save')}
                    </Button>
                    <Button
                      variant="secondary"
                      className={styles.button}
                      onClick={() => deleteMajor(major.id)}
                    >
                      {t('delete')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
