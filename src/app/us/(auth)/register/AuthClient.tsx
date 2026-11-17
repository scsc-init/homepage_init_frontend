'use client';

import { useTranslations } from 'next-intl';
import { fetchMajors } from '@/util/fetch/client-util';
import { useEffect, useRef, useState } from 'react';
import '@/styles/theme.css';
import styles from '../auth.module.css';
import '@radix-ui/colors/red.css';
import '@radix-ui/colors/green.css';
import * as validator from '@/util/validator';
import { useSession } from 'next-auth/react';
import { ENABLE_TEST_UTILS } from '@/util/constants';
import { createUser } from './actions';
import Checkbox from '@/components/form-control/Checkbox';

type Major = {
  id: number;
  college: string;
  major_name: string;
};

type LoginResponse = {
  jwt?: string;
};

function cleanName(raw: string) {
  if (!raw) return '';

  return raw
    .normalize('NFC')
    .replace(/^[\s\-\u00AD\u2010-\u2015]+/u, '')
    .split('/')[0]
    .replace(/\s+/g, ' ')
    .trim();
}

function log(event: string, data: Record<string, unknown> = {}) {
  try {
    const body = JSON.stringify({
      event,
      data,
      ts: new Date().toISOString(),
    });
    const url = '/api/log';

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      return;
    }

    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {}
}

export default function AuthClient() {
  const { data: session, update } = useSession();
  const t = useTranslations('UsRegister');

  const [stage, setStage] = useState(1);
  const [form, setForm] = useState({
    email: '',
    name: '',
    kakao_name: '',
    student_id_year: '',
    student_id_number: '',
    phone1: '',
    phone2: '',
    phone3: '',
    major_id: '',
    profile_picture_url: '',
  });

  const [majors, setMajors] = useState<Major[]>([]);
  const [college, setCollege] = useState('');
  const [kakaoNameDiffers, setKakaoNameDiffers] = useState(false);
  const studentIdNumberRef = useRef<HTMLInputElement>(null);
  const phone2Ref = useRef<HTMLInputElement>(null);
  const phone3Ref = useRef<HTMLInputElement>(null);
  const [signupBusy, setSignupBusy] = useState(false);

  useEffect(() => {
    const email = (session?.user?.email || '').toLowerCase();
    const cName = cleanName(session?.user?.name || '');
    const image = session?.user?.image || '';

    setForm((p) => ({
      ...p,
      email,
      name: cName,
      profile_picture_url: image,
    }));

    log('signup_required', { email });
  }, [session]);

  useEffect(() => {
    if (stage !== 4) return;

    const loadMajors = async () => {
      try {
        const data = await fetchMajors<Major[]>();
        setMajors(data);

        log('majors_loaded', {
          count: Array.isArray(data) ? data.length : 0,
        });
      } catch (e) {
        log('majors_load_failed', {
          error: String(e),
        });
      }
    };

    loadMajors();
  }, [stage]);

  const handleSubmit = async () => {
    log('signup_submit_start');

    const hashToken = session?.hashToken;

    if (!hashToken) {
      alert(t('missingSession'));
      return;
    }

    const student_id = `${form.student_id_year}${form.student_id_number}`;
    const phone = `${form.phone1}${form.phone2}${form.phone3}`;
    const email = String(form.email || '').toLowerCase();

    const createRes = await createUser({
      email,
      name: form.name,
      kakao_name: form.kakao_name.trim() || null,
      student_id,
      phone,
      major_id: Number(form.major_id),
      profile_picture: form.profile_picture_url,
      profile_picture_is_url: true,
      hashToken,
    });

    if (createRes.status !== 201) {
      let detail = t('unknownError');

      if (createRes.body && typeof createRes.body === 'object' && 'detail' in createRes.body) {
        const bodyDetail = createRes.body.detail;

        if (typeof bodyDetail === 'string' && bodyDetail) {
          detail = bodyDetail;
        }
      } else if (createRes.body) {
        detail = String(createRes.body);
      }

      log('signup_create_failed', {
        status: createRes.status,
        detail,
      });

      alert(t('createFailed', { detail }));
      return;
    }

    log('signup_create_success');

    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email,
        hashToken,
      }),
    });

    let data: LoginResponse | null = null;

    try {
      data = (await loginRes.json()) as LoginResponse;
    } catch {
      data = null;
    }

    if (loginRes.ok && data?.jwt) {
      await update({
        backendJwt: data.jwt,
      });

      log('login_complete');
      window.location.href = '/about/welcome';
    } else {
      log('login_failed');
      alert(t('loginFailed'));
      return;
    }
  };

  return (
    <div id={styles['GoogleSignupContainer']}>
      <div className={styles['GoogleSignupCard']}>
        {stage === 1 && (
          <div style={{ boxSizing: 'border-box', marginTop: '10vh' }}>
            <input
              value={form.email}
              disabled
              style={{
                width: '100%',
                boxSizing: 'border-box',
              }}
            />

            <p>
              {t('nameLabel')}: <strong>{form.name}</strong>
            </p>

            <Checkbox
              className={styles.SignupCheckbox}
              checked={kakaoNameDiffers}
              onChange={(e) => {
                const checked = e.target.checked;
                setKakaoNameDiffers(checked);

                if (!checked) {
                  setForm((p) => ({
                    ...p,
                    kakao_name: '',
                  }));
                }
              }}
            >
              {t('kakaoDifferent')}
            </Checkbox>

            {kakaoNameDiffers && (
              <input
                value={form.kakao_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    kakao_name: e.target.value.slice(0, 64),
                  })
                }
                placeholder={t('kakaoPlaceholder')}
                maxLength={64}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  marginTop: '0.5rem',
                }}
              />
            )}

            <button
              onClick={() => setStage(2)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
              }}
              disabled={
                !form.email || !form.name || (kakaoNameDiffers && !form.kakao_name.trim())
              }
            >
              {t('next')}
            </button>
          </div>
        )}

        {stage === 2 && (
          <div style={{ marginTop: '0vh' }}>
            <p>{t('studentIdStep')}</p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <input
                value={form.student_id_year}
                onChange={(e) => {
                  const val = e.target.value;

                  setForm({
                    ...form,
                    student_id_year: val,
                  });

                  if (val.length === 4) {
                    studentIdNumberRef.current?.focus();
                  }
                }}
                maxLength={4}
                placeholder="2025"
              />

              <span style={{ fontSize: '1.25rem' }}>-</span>

              <input
                ref={studentIdNumberRef}
                value={form.student_id_number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    student_id_number: e.target.value,
                  })
                }
                maxLength={5}
                placeholder="10056"
              />
            </div>

            <button
              onClick={() => {
                const sid = `${form.student_id_year}${form.student_id_number}`;

                validator.studentID(sid, (ok) =>
                  ok ? setStage(3) : alert(t('invalidStudentId')),
                );
              }}
              disabled={!form.student_id_year || !form.student_id_number}
            >
              {t('next')}
            </button>
          </div>
        )}

        {stage === 3 && (
          <div style={{ marginTop: '0vh' }}>
            <p>{t('phoneStep')}</p>

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <input
                value={form.phone1}
                onChange={(e) => {
                  const val = e.target.value;

                  setForm({
                    ...form,
                    phone1: val,
                  });

                  if (val.length === 3) {
                    phone2Ref.current?.focus();
                  }
                }}
                maxLength={3}
                placeholder="010"
              />

              <input
                ref={phone2Ref}
                value={form.phone2}
                onChange={(e) => {
                  const val = e.target.value;

                  setForm({
                    ...form,
                    phone2: val,
                  });

                  if (val.length === 4) {
                    phone3Ref.current?.focus();
                  }
                }}
                maxLength={4}
                placeholder="1234"
              />

              <input
                ref={phone3Ref}
                value={form.phone3}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone3: e.target.value,
                  })
                }
                maxLength={4}
                placeholder="5678"
              />
            </div>

            <button
              onClick={() => {
                const phone = `${form.phone1}${form.phone2}${form.phone3}`;

                validator.phoneNumber(phone, (ok) =>
                  ok ? setStage(4) : alert(t('invalidPhone')),
                );
              }}
              disabled={!form.phone1 || !form.phone2 || !form.phone3}
            >
              {t('next')}
            </button>
          </div>
        )}

        {stage === 4 && (
          <div style={{ marginTop: '0vh' }}>
            <p>{t('collegeStep')}</p>

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <select onChange={(e) => setCollege(e.target.value)} value={college}>
                <option value="">{t('collegePlaceholder')}</option>

                {[...new Set(majors.map((m) => m.college))].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                onChange={(e) =>
                  setForm({
                    ...form,
                    major_id: e.target.value,
                  })
                }
                value={form.major_id}
              >
                <option value="">{t('majorPlaceholder')}</option>

                {majors
                  .filter((m) => m.college === college)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.major_name}
                    </option>
                  ))}
              </select>
            </div>

            <p className={`${styles.PolicyLink} ${styles.agree}`}>
              {t('privacyBefore')}{' '}
              <a
                href="https://github.com/scsc-init/homepage_init/blob/master/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('privacyLink')}
              </a>
              {t('privacyAfter')}
            </p>

            <button
              type="button"
              className={`${styles.SignupBtn} ${signupBusy ? styles['is-disabled'] : ''}`}
              onClick={async () => {
                if (signupBusy) return;

                setSignupBusy(true);

                if (!college) {
                  alert(t('chooseCollegeError'));
                  setSignupBusy(false);
                  return;
                }

                if (!form.major_id) {
                  alert(t('chooseMajorError'));
                  setSignupBusy(false);
                  return;
                }

                try {
                  await handleSubmit();
                } finally {
                  setSignupBusy(false);
                }
              }}
              disabled={signupBusy}
              aria-disabled={signupBusy}
            >
              {ENABLE_TEST_UTILS && t('testAdminPrefix')}
              {t('signUp')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
