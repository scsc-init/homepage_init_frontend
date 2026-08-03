'use client';

import { useState } from 'react';
import InquiryButton from '@/components/InquiryButton';
import * as validator from '@/util/validator';
import styles from '../auth.module.css';
import '@/styles/theme.css';

function validateWithCallback(validate, value) {
  return new Promise((resolve) => {
    validate(value, resolve);
  });
}

export default function ExternalRegisterClient({ email, name, submitApplication }) {
  const [form, setForm] = useState({
    phone: '',
    student_id: '',
    reason: '',
    kakao_name: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [kakaoNameDiffers, setKakaoNameDiffers] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    const phone = form.phone.replace(/\D/g, '');
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
      <div className={styles.GoogleSignupCard}>
        {submitted ? (
          <div style={{ marginTop: '10vh', textAlign: 'center' }}>
            <h2>가입 신청이 접수되었습니다.</h2>
            <p>가입 신청 후 임원진에게 별도로 연락해 주세요.</p>
            <p>임원진의 확인 및 승인 후 외부회원으로 로그인할 수 있습니다.</p>
            <button type="button" onClick={() => (window.location.href = '/')}>
              홈으로 이동
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: '4vh' }}>
            <h2>외부회원 가입 신청</h2>

            <p>이메일</p>
            <input value={email} disabled style={{ width: '100%', boxSizing: 'border-box' }} />

            <p>이름</p>
            <input value={name} disabled style={{ width: '100%', boxSizing: 'border-box' }} />

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
                onChange={(event) => setForm({ ...form, kakao_name: event.target.value })}
                placeholder="카톡 프로필 이름"
                style={{ width: '100%', boxSizing: 'border-box', marginTop: '0.5rem' }}
              />
            )}

            <p>전화번호</p>
            <input
              value={form.phone}
              onChange={(event) =>
                setForm({
                  ...form,
                  phone: event.target.value.replace(/\D/g, '').slice(0, 11),
                })
              }
              placeholder="01012345678"
              inputMode="numeric"
              required
              style={{ width: '100%', boxSizing: 'border-box' }}
            />

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
              rows={5}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />

            <label className={`${styles.PolicyLink} ${styles.agree}`}>
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={(event) => setPrivacyAgreed(event.target.checked)}
              />{' '}
              <a
                href="https://github.com/scsc-init/homepage_init/blob/master/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                개인정보 처리방침
              </a>
              에 동의합니다.
            </label>
            <p>가입 신청 후 임원진 승인 전까지 로그인할 수 없습니다.</p>

            <button
              type="submit"
              className={`${styles.SignupBtn} ${submitting ? styles['is-disabled'] : ''}`}
              disabled={
                submitting ||
                !email ||
                !name ||
                !form.phone ||
                !privacyAgreed ||
                (kakaoNameDiffers && !form.kakao_name.trim())
              }
            >
              {submitting ? '신청 중...' : '가입 신청하기'}
            </button>
          </form>
        )}
      </div>

      <InquiryButton />
    </div>
  );
}
