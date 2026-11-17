'use client';

import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import * as validator from '@/util/validator';
import styles from '../auth.module.css';
import '@/styles/theme.css';
import { MainLogoImage } from '@/components/common/MainLogoImage';
import Checkbox from '@/components/form-control/Checkbox';

type ValidatorFunction = (value?: string, then?: (isValid: boolean) => void) => void;

type ExternalMemberApplicationForm = {
  name: string;
  phone: string;
  student_id: string | null;
  reason: string | null;
  kakao_name: string | null;
};

type ExternalMemberApplicationResult = {
  status: number;
  detail: string | null;
};

type ExternalRegisterClientProps = {
  email: string;
  name: string;
  submitApplication: (
    form: ExternalMemberApplicationForm,
  ) => Promise<ExternalMemberApplicationResult>;
};

function validateWithCallback(validate: ValidatorFunction, value: string): Promise<boolean> {
  return new Promise((resolve) => {
    validate(value, resolve);
  });
}

export default function ExternalRegisterClient({
  email,
  name,
  submitApplication,
}: ExternalRegisterClientProps) {
  const [form, setForm] = useState({
    name: name ?? '',
    phone1: '',
    phone2: '',
    phone3: '',
    student_id: '',
    reason: '',
    kakao_name: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const t = useTranslations('UsExternalRegister');
  const [submitted, setSubmitted] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [kakaoNameDiffers, setKakaoNameDiffers] = useState(false);

  const phone2Ref = useRef<HTMLInputElement>(null);
  const phone3Ref = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) return;

    const trimmedName = form.name.trim();

    const validName = await validateWithCallback(validator.name, trimmedName);

    if (!validName) {
      alert(t('invalidName'));
      return;
    }

    const phone = `${form.phone1}${form.phone2}${form.phone3}`.replace(/\D/g, '');

    const studentId = form.student_id.replace(/\D/g, '');

    const validPhone = await validateWithCallback(validator.phoneNumber, phone);

    if (!validPhone) {
      alert(t('invalidPhone'));
      return;
    }

    if (studentId) {
      const validStudentId = await validateWithCallback(validator.studentID, studentId);

      if (!validStudentId) {
        alert(t('invalidStudentId'));
        return;
      }
    }

    setSubmitting(true);

    try {
      const result = await submitApplication({
        name: trimmedName,
        phone,
        student_id: studentId || null,
        reason: form.reason.trim() || null,
        kakao_name: form.kakao_name.trim() || null,
      });

      if (result.status === 201) {
        setSubmitted(true);
        return;
      }

      if (result.status === 409) {
        alert(t('duplicateEmail'));
        return;
      }

      alert(result.detail || t('applicationError'));
    } catch (error) {
      console.error(error);

      alert(t('networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id={styles.GoogleSignupContainer}>
      <div className={`${styles.GoogleSignupCard} ${styles.ExternalRegisterCard}`}>
        {submitted ? (
          <div
            style={{
              marginTop: '4vh',
              textAlign: 'center',
            }}
          >
            <div className={styles['main-logo-wrapper__login']}>
              <MainLogoImage
                className={`${styles['main-logo__login']} logo`}
                width={1976}
                height={670}
                loading="eager"
              />
            </div>

            <h2>{t('received')}</h2>

            <p>{t('contactOfficers')}</p>

            <p>{t('approval')}</p>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/';
              }}
            >
              {t('home')}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={styles.ExternalRegisterForm}
            style={{ marginTop: '2vh' }}
          >
            <h2>{t('title')}</h2>

            <p>{t('email')}</p>

            <input
              value={email}
              disabled
              style={{
                width: '100%',
                boxSizing: 'border-box',
              }}
            />

            <p>{t('name')}</p>

            <input
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value.slice(0, 64),
                })
              }
              placeholder={t('namePlaceholder')}
              maxLength={64}
              style={{
                width: '100%',
                boxSizing: 'border-box',
              }}
            />

            <Checkbox
              className={styles.SignupCheckbox}
              checked={kakaoNameDiffers}
              onChange={(event) => {
                const checked = event.target.checked;

                setKakaoNameDiffers(checked);

                if (!checked) {
                  setForm((prev) => ({
                    ...prev,
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
                onChange={(event) =>
                  setForm({
                    ...form,
                    kakao_name: event.target.value.slice(0, 64),
                  })
                }
                placeholder={t('kakaoPlaceholder')}
                maxLength={64}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            )}

            <p>{t('phone')}</p>

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <input
                value={form.phone1}
                onChange={(event) => {
                  const val = event.target.value.replace(/\D/g, '').slice(0, 3);

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
                inputMode="numeric"
              />

              <input
                ref={phone2Ref}
                value={form.phone2}
                onChange={(event) => {
                  const val = event.target.value.replace(/\D/g, '').slice(0, 4);

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
                inputMode="numeric"
              />

              <input
                ref={phone3Ref}
                value={form.phone3}
                onChange={(event) =>
                  setForm({
                    ...form,
                    phone3: event.target.value.replace(/\D/g, '').slice(0, 4),
                  })
                }
                maxLength={4}
                placeholder="5678"
                inputMode="numeric"
              />
            </div>

            <p>{t('studentIdOptional')}</p>

            <input
              value={form.student_id}
              onChange={(event) =>
                setForm({
                  ...form,
                  student_id: event.target.value.replace(/\D/g, '').slice(0, 9),
                })
              }
              placeholder={t('studentIdPlaceholder')}
              inputMode="numeric"
              style={{
                width: '100%',
                boxSizing: 'border-box',
              }}
            />

            <p>{t('reasonOptional')}</p>

            <textarea
              value={form.reason}
              onChange={(event) =>
                setForm({
                  ...form,
                  reason: event.target.value.slice(0, 1000),
                })
              }
              placeholder={t('reasonPlaceholder')}
              className={styles.ReasonTextarea}
              maxLength={1000}
            />

            <Checkbox
              className={styles.SignupCheckbox}
              checked={privacyAgreed}
              onChange={(event) => setPrivacyAgreed(event.target.checked)}
            >
              <a
                href="https://github.com/scsc-init/homepage_init/blob/master/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8.md"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.PolicyAnchor}
              >
                {t('privacy')}
              </a>
              {t('agreePrivacy')}
            </Checkbox>

            <p>
              {t('cannotLogin')}
              <br />
              {t('contactOfficers')}
            </p>

            <button
              type="submit"
              className={`${styles.SignupBtn} ${submitting ? styles['is-disabled'] : ''}`}
              disabled={
                submitting ||
                !email ||
                !form.name.trim() ||
                !form.phone1 ||
                !form.phone2 ||
                !form.phone3 ||
                !privacyAgreed ||
                (kakaoNameDiffers && !form.kakao_name.trim())
              }
            >
              {submitting ? t('submitting') : t('apply')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
