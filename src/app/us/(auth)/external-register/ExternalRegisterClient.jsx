'use client';

import { useRef, useState } from 'react';
import * as validator from '@/util/validator';
import styles from '../auth.module.css';
import '@/styles/theme.css';
import { MainLogoImage } from '@/components/common/MainLogoImage';

function validateWithCallback(validate, value) {
  return new Promise((resolve) => {
    validate(value, resolve);
  });
}

export default function ExternalRegisterClient({ email, name, submitApplication }) {
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
  const [submitted, setSubmitted] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [kakaoNameDiffers, setKakaoNameDiffers] = useState(false);
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    const trimmedName = form.name.trim();
    const validName = await validateWithCallback(validator.name, trimmedName);
    if (!validName) {
      alert('이름 형식이 올바르지 않습니다(1~64자)');
      return;
    }
    const phone = `${form.phone1}${form.phone2}${form.phone3}`.replace(/\D/g, '');
    const studentId = form.student_id.replace(/\D/g, '');

    const validPhone = await validateWithCallback(validator.phoneNumber, phone);
    if (!validPhone) {
      alert('전화번호 형식이 올바르지 않습니다.');
      return;
    }

    if (studentId) {
      const validStudentId = await validateWithCallback(validator.studentID, studentId);

      if (!validStudentId) {
        alert('학번 형식이 올바르지 않습니다.');
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
        alert('이미 외부회원 가입 신청이 접수된 이메일입니다.');
        return;
      }

      alert(result.detail || '가입 신청 중 오류가 발생했습니다.');
    } catch (error) {
      console.error(error);
      alert('가입 신청 중 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id={styles.GoogleSignupContainer}>
      <div className={`${styles.GoogleSignupCard} ${styles.ExternalRegisterCard}`}>
        {submitted ? (
          <div style={{ marginTop: '4vh', textAlign: 'center' }}>
            <div className={styles['main-logo-wrapper__login']}>
              <MainLogoImage
                className={`${styles['main-logo__login']} logo`}
                width={1976}
                height={670}
                loading="eager"
              />
            </div>
            <h2>가입 신청이 접수되었습니다.</h2>
            <p>가입 신청 후 임원진에게 별도로 연락해 주세요.</p>
            <p>임원진의 확인 및 승인 후 외부회원으로 로그인할 수 있습니다.</p>
            <button type="button" onClick={() => (window.location.href = '/')}>
              홈으로 이동
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={styles.ExternalRegisterForm}
            style={{ marginTop: '2vh' }}
          >
            <h2>외부회원 가입 신청</h2>

            <p>이메일</p>
            <input value={email} disabled style={{ width: '100%', boxSizing: 'border-box' }} />

            <p>이름</p>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value.slice(0, 64) })}
              placeholder="이름"
              maxLength={64}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />

            <label className={styles.KakaoCheckLabel}>
              <input
                type="checkbox"
                className={styles.KakaoCheckInput}
                checked={kakaoNameDiffers}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setKakaoNameDiffers(checked);
                  if (!checked) setForm((prev) => ({ ...prev, kakao_name: '' }));
                }}
              />
              <span className={styles.KakaoCheckBox} aria-hidden="true">
                <svg className={styles.KakaoCheckIcon} viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>카톡 프로필 이름이 본명과 다른가요?</span>
            </label>
            {kakaoNameDiffers && (
              <input
                value={form.kakao_name}
                onChange={(event) =>
                  setForm({ ...form, kakao_name: event.target.value.slice(0, 64) })
                }
                placeholder="카톡 프로필 이름"
                maxLength={64}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            )}

            <p>전화번호</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={form.phone1}
                onChange={(event) => {
                  const val = event.target.value.replace(/\D/g, '').slice(0, 3);
                  setForm({ ...form, phone1: val });
                  if (val.length === 3) phone2Ref.current?.focus();
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
                  setForm({ ...form, phone2: val });
                  if (val.length === 4) phone3Ref.current?.focus();
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

            <p>학번 (선택)</p>
            <input
              value={form.student_id}
              onChange={(event) =>
                setForm({
                  ...form,
                  student_id: event.target.value.replace(/\D/g, '').slice(0, 9),
                })
              }
              placeholder="서울대학교 학번이 있는 경우 입력"
              inputMode="numeric"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />

            <p>가입 신청 사유 (선택)</p>
            <textarea
              value={form.reason}
              onChange={(event) =>
                setForm({
                  ...form,
                  reason: event.target.value.slice(0, 1000),
                })
              }
              placeholder="SCSC 외부회원으로 가입하려는 이유를 입력해주세요."
              className={styles.ReasonTextarea}
              maxLength={1000}
            />

            <label className={styles.KakaoCheckLabel}>
              <input
                type="checkbox"
                className={styles.KakaoCheckInput}
                checked={privacyAgreed}
                onChange={(event) => setPrivacyAgreed(event.target.checked)}
              />
              <span className={styles.KakaoCheckBox} aria-hidden="true">
                <svg className={styles.KakaoCheckIcon} viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>
                <a
                  href="https://github.com/scsc-init/homepage_init/blob/master/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.PolicyAnchor}
                >
                  개인정보 처리방침
                </a>
                에 동의합니다.
              </span>
            </label>
            <p>
              가입 신청 후 임원진 승인 전까지 로그인할 수 없습니다.
              <br />
              가입 신청 후 임원진에게 별도로 연락해 주세요.
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
              {submitting ? '신청 중...' : '가입 신청하기'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
