'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import InquiryButton from '@/components/InquiryButton';
import * as validator from '@/util/validator';
import styles from '../auth.module.css';
import '@/styles/theme.css';

function cleanName(raw) {
  if (!raw) return '';

  return raw
    .normalize('NFC')
    .replace(/^[\s\-\u00AD\u2010-\u2015]+/u, '')
    .split('/')[0]
    .replace(/\s+/g, ' ')
    .trim();
}

function validateWithCallback(validate, value) {
  return new Promise((resolve) => {
    validate(value, resolve);
  });
}

export default function ExternalRegisterClient() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    email: '',
    name: '',
    phone: '',
    student_id: '',
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setForm((previous) => ({
      ...previous,
      email: session?.user?.email?.toLowerCase() ?? '',
      name: cleanName(session?.user?.name ?? ''),
    }));
  }, [session]);

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
      const response = await fetch('/api/user/external/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          phone,
          student_id: studentId || null,
          reason: form.reason.trim() || null,
          hashToken: session?.hashToken,
        }),
      });

      if (response.status === 201) {
        setSubmitted(true);
        return;
      }

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 409) {
        alert('이미 외부회원 가입 신청이 접수된 이메일입니다.');
        return;
      }

      alert(data?.detail || '가입 신청 중 오류가 발생했습니다.');
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
            <p>임원진의 승인 후 외부회원으로 로그인할 수 있습니다.</p>
            <button type="button" onClick={() => (window.location.href = '/')}>
              홈으로 이동
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: '4vh' }}>
            <h2>외부회원 가입 신청</h2>

            <p>이메일</p>
            <input
              value={form.email}
              disabled
              style={{ width: '100%', boxSizing: 'border-box' }}
            />

            <p>이름</p>
            <input
              value={form.name}
              disabled
              style={{ width: '100%', boxSizing: 'border-box' }}
            />

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
              style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
            />

            <p className={`${styles.PolicyLink} ${styles.agree}`}>
              신청 시 개인정보 처리방침에 동의합니다.
            </p>

            <button
              type="submit"
              className={`${styles.SignupBtn} ${submitting ? styles['is-disabled'] : ''}`}
              disabled={submitting || !form.email || !form.name || !form.phone}
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
