'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as validator from '@/util/validator';
import PfpUpdate from './PfpUpdate';
import styles from './page.module.css';
import { oldboyLevel } from '@/util/constants';
import { useMe } from '@/util/hooks/useMe';
import { pushLoginWithRedirect } from '@/util/loginRedirect';

type Major = {
  id: number;
  college: string;
  major_name: string;
};

type ErrorResponse = {
  detail?: string;
};

function EditUserInfoClient() {
  const router = useRouter();
  const t = useTranslations('UsEditProfile');
  const { me, isLoading: isMeLoading, isUnauthenticated } = useMe();

  const [form, setForm] = useState({
    name: '',
    kakao_name: '',
    phone: '',
    student_id: '',
    major_id: '',
    profile_picture: '',
  });

  const [majors, setMajors] = useState<Major[]>([]);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [oldboyApplicant, setOldboyApplicant] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMeLoading) return;

    if (isUnauthenticated || !me) {
      alert(t('loginRequired'));
      pushLoginWithRedirect(router);
      return;
    }

    // Populate own info and enable the form immediately from the session,
    // so values show and buttons are clickable without waiting on the network.
    setForm({
      name: me.name || '',
      kakao_name: me.kakao_name || '',
      phone: me.phone || '',
      student_id: me.student_id || '',
      major_id: me.major_id?.toString() || '',
      profile_picture: me.profile_picture || '',
    });

    setUserRole(me.role);
    setLoading(false);

    // Load majors (dropdown options) and oldboy state in the background.
    const fetchData = async () => {
      const [resMajors, resOldboy] = await Promise.all([
        fetchBackendClient('/api/majors'),
        fetchBackendClient('/api/user/oldboy/applicant'),
      ]);

      const majorList: Major[] = resMajors.ok ? ((await resMajors.json()) as Major[]) : [];

      setMajors(majorList);

      if (!resMajors.ok) {
        console.warn('Failed to load majors');
      }

      if (resOldboy.ok) {
        const applicant: unknown = await resOldboy.json();
        setOldboyApplicant(applicant);
      }
    };

    fetchData();
  }, [router, me, isMeLoading, isUnauthenticated]);

  const handleSubmit = async () => {
    const { name, kakao_name, phone, student_id, major_id } = form;
    const errors: string[] = [];

    validator.name(name, (ok) => {
      if (!ok) errors.push(t('invalidName'));
    });

    validator.phoneNumber(phone, (ok) => {
      if (!ok) errors.push(t('invalidPhone'));
    });

    validator.studentID(student_id, (ok) => {
      if (!ok) errors.push(t('invalidStudentId'));
    });

    if (errors.length) {
      alert(errors[0]);
      return;
    }

    setLoading(true);

    const res = await fetchBackendClient('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        kakao_name,
        phone,
        student_id,
        major_id: Number(major_id),
      }),
    });

    setLoading(false);

    if (res.status === 204) {
      alert(t('updated'));
      router.push('/about/my-page');
    } else if (res.status === 409) {
      alert(t('duplicate'));
    } else if (res.status === 422) {
      alert(t('invalidInput'));
    } else {
      alert(t('updateFailed'));
    }
  };

  const handleDelete = async () => {
    const ok = confirm(t('deleteConfirm'));

    if (!ok) return;

    setLoading(true);

    const res = await fetchBackendClient('/api/user/delete', {
      method: 'POST',
    });

    setLoading(false);

    if (res.status === 204) {
      alert(t('deleted'));
      router.push('/about/my-page');
    } else if (res.status === 403) {
      const data = (await res.json()) as ErrorResponse;
      alert(t('unauthorized', { detail: data.detail ?? '' }));
    } else {
      alert(t('updateFailed'));
    }
  };

  const handleOBRegister = async () => {
    const ok = confirm(t('oldboyConfirm'));

    if (!ok) return;

    setLoading(true);

    const res = await fetchBackendClient('/api/user/oldboy/register', {
      method: 'POST',
    });

    setLoading(false);

    if (res.status === 201) {
      alert(t('oldboyRequested'));
      router.push('/about/my-page');
    } else if (res.status === 400) {
      alert(t('oldboyIneligible'));
    } else if (res.status === 409) {
      alert(t('oldboyAlreadyRequested'));
    } else {
      alert(t('requestFailed'));
    }
  };

  const handleOBUnregister = async () => {
    const ok = confirm(t('oldboyCancelConfirm'));

    if (!ok) return;

    setLoading(true);

    const res = await fetchBackendClient('/api/user/oldboy/unregister', {
      method: 'POST',
    });

    setLoading(false);

    if (res.status === 204) {
      alert(t('oldboyCanceled'));
      router.push('/about/my-page');
    } else if (res.status === 400) {
      alert(t('oldboyCannotCancel'));
    } else if (res.status === 404) {
      alert(t('oldboyNotRequested'));
    } else {
      alert(t('cancelFailed'));
    }
  };

  const handleOBReactivate = async () => {
    const ok = confirm(t('reactivateConfirm'));

    if (!ok) return;

    setLoading(true);

    const res = await fetchBackendClient('/api/user/oldboy/reactivate', {
      method: 'POST',
    });

    setLoading(false);

    if (res.status === 204) {
      alert(t('reactivateRequested'));
      router.push('/about/welcome');
    } else if (res.status === 400) {
      alert(t('reactivateIneligible'));
    } else {
      alert(t('requestFailed'));
    }
  };

  return (
    <div className={styles.editUserInfo}>
      <h2>{t('title')}</h2>

      <img
        src={form.profile_picture || '/asset/default-pfp.webp'}
        alt="Profile"
        className={styles['user-profile-picture']}
        width={50}
        height={50}
      />

      <PfpUpdate />

      <div className={styles.userData}>
        <label>{t('name')}</label>
        <input type="text" value={form.name} disabled />

        <label>{t('kakaoName')}</label>
        <input
          type="text"
          value={form.kakao_name}
          onChange={(e) =>
            setForm({
              ...form,
              kakao_name: e.target.value,
            })
          }
          placeholder={t('kakaoPlaceholder')}
        />

        <label>{t('phone')}</label>
        <input
          type="text"
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
          placeholder="01012345678"
        />

        <label>{t('studentId')}</label>
        <input
          type="text"
          value={form.student_id}
          onChange={(e) =>
            setForm({
              ...form,
              student_id: e.target.value,
            })
          }
          placeholder="202512345"
        />

        <label>{t('major')}</label>
        <select
          value={form.major_id}
          onChange={(e) =>
            setForm({
              ...form,
              major_id: e.target.value,
            })
          }
        >
          <option value="">{t('majorSelect')}</option>

          {majors.map((m) => (
            <option key={m.id} value={m.id}>
              {m.college} - {m.major_name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.editUserInfoButton}>
        <button onClick={handleSubmit} disabled={loading}>
          {t('save')}
        </button>

        <button onClick={handleDelete} disabled={loading}>
          {t('inactive')}
        </button>

        {userRole === oldboyLevel ? (
          <button onClick={handleOBReactivate} disabled={loading}>
            {t('regularRequest')}
          </button>
        ) : oldboyApplicant === null ? (
          <button onClick={handleOBRegister} disabled={loading}>
            {t('alumniRequest')}
          </button>
        ) : (
          <button onClick={handleOBUnregister} disabled={loading}>
            {t('alumniCancel')}
          </button>
        )}
      </div>
    </div>
  );
}

export default function EditUserInfoPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.home}>
        <div className={styles.editUserInfoContainer}>
          <EditUserInfoClient />
        </div>
      </div>
    </div>
  );
}
