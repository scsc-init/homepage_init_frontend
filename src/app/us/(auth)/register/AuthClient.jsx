// src/app/us/login/AuthClient.jsx
'use client';

import { useEffect, useState, useRef } from 'react';
import '@/styles/theme.css';
import styles from '../auth.module.css';
import '@radix-ui/colors/red.css';
import '@radix-ui/colors/green.css';
import * as validator from '@/util/validator';

function cleanName(raw) {
  if (!raw) return '';
  return raw
    .normalize('NFC')
    .replace(/^[\s\-\u00AD\u2010-\u2015]+/u, '')
    .split('/')[0]
    .replace(/\s+/g, ' ')
    .trim();
}

function log(event, data = {}) {
  try {
    const body = JSON.stringify({ event, data, ts: new Date().toISOString() });
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

export default function AuthClient({ session }) {
  const [stage, setStage] = useState(1);
  const [form, setForm] = useState({
    email: '',
    name: '',
    student_id_year: '',
    student_id_number: '',
    phone1: '',
    phone2: '',
    phone3: '',
    major_id: '',
    profile_picture_url: '',
  });
  const [majors, setMajors] = useState([]);
  const [college, setCollege] = useState('');
  const studentIdNumberRef = useRef(null);
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);
  const [signupBusy, setSignupBusy] = useState(false);

  useEffect(() => {
    const email = (session?.user?.email || '').toLowerCase();
    const cName = cleanName(session?.user?.name || '');
    const image = session?.user?.image || '';
    setForm((p) => ({ ...p, email, name: cName, profile_picture_url: image }));
    log('signup_required', { email });
  }, [session]);

  useEffect(() => {
    if (stage !== 4) return;
    const fetchMajors = async () => {
      try {
        const res = await fetch(`/api/majors`, { credentials: 'include' });
        const data = await res.json();
        setMajors(data);
        log('majors_loaded', { count: Array.isArray(data) ? data.length : 0 });
      } catch (e) {
        log('majors_load_failed', { error: String(e) });
      }
    };
    fetchMajors();
  }, [stage]);

  const handleSubmit = async () => {
    log('signup_submit_start');
    const student_id = `${form.student_id_year}${form.student_id_number}`;
    const phone = `${form.phone1}${form.phone2}${form.phone3}`;
    const email = String(form.email || '').toLowerCase();

    const createRes = await fetch(`/api/user/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email,
        name: form.name,
        student_id,
        phone,
        major_id: Number(form.major_id),
        status: 'pending',
        profile_picture: form.profile_picture_url,
        profile_picture_is_url: true,
        hashToken: session.hashToken,
      }),
    });
    if (createRes.status !== 201) {
      let createData;
      try {
        createData = await createRes.json();
      } catch {
        createData = { detail: '서버 응답을 처리할 수 없습니다.' };
      }
      log('signup_create_failed', {
        status: createRes.status,
        detail: createData?.detail || null,
      });
      alert(`유저 생성 실패: ${createData?.detail || '알 수 없는 오류가 발생했습니다.'}`);
      return;
    }

    log('signup_create_success');

    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, hashToken: session.hashToken }),
    });

    if (loginRes.ok) {
      log('login_complete');
      window.location.href = '/about/welcome';
    } else {
      log('login_failed');
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
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
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
            <p>
              이름: <strong>{form.name}</strong>
            </p>
            <button
              onClick={() => setStage(2)}
              style={{ width: '100%', boxSizing: 'border-box' }}
              disabled={!form.email || !form.name}
            >
              다음
            </button>
          </div>
        )}

        {stage === 2 && (
          <div style={{ marginTop: '0vh' }}>
            <p>학번 입력</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                value={form.student_id_year}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, student_id_year: val });
                  if (val.length === 4) studentIdNumberRef.current?.focus();
                }}
                maxLength={4}
                placeholder="2025"
              />
              <span style={{ fontSize: '1.25rem' }}>-</span>
              <input
                ref={studentIdNumberRef}
                value={form.student_id_number}
                onChange={(e) => setForm({ ...form, student_id_number: e.target.value })}
                maxLength={5}
                placeholder="10056"
              />
            </div>
            <button
              onClick={() => {
                const sid = `${form.student_id_year}${form.student_id_number}`;
                validator.studentID(sid, (ok) =>
                  ok ? setStage(3) : alert('올바른 학번 형식이 아닙니다.'),
                );
              }}
              disabled={!form.student_id_year || !form.student_id_number}
            >
              다음
            </button>
          </div>
        )}

        {stage === 3 && (
          <div style={{ marginTop: '0vh' }}>
            <p>전화번호 입력</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={form.phone1}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, phone1: val });
                  if (val.length === 3) phone2Ref.current?.focus();
                }}
                maxLength={3}
                placeholder="010"
              />
              <input
                ref={phone2Ref}
                value={form.phone2}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, phone2: val });
                  if (val.length === 4) phone3Ref.current?.focus();
                }}
                maxLength={4}
                placeholder="1234"
              />
              <input
                ref={phone3Ref}
                value={form.phone3}
                onChange={(e) => setForm({ ...form, phone3: e.target.value })}
                maxLength={4}
                placeholder="5678"
              />
            </div>
            <button
              onClick={() => {
                const phone = `${form.phone1}${form.phone2}${form.phone3}`;
                validator.phoneNumber(phone, (ok) =>
                  ok ? setStage(4) : alert('전화번호 형식이 올바르지 않습니다.'),
                );
              }}
              disabled={!form.phone1 || !form.phone2 || !form.phone3}
            >
              다음
            </button>
          </div>
        )}

        {stage === 4 && (
          <div style={{ marginTop: '0vh' }}>
            <p>단과대학 소속 입력</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select onChange={(e) => setCollege(e.target.value)} value={college}>
                <option value="">단과대학 선택</option>
                {[...new Set(majors.map((m) => m.college))].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                onChange={(e) => setForm({ ...form, major_id: e.target.value })}
                value={form.major_id}
              >
                <option value="">학과/학부 선택</option>
                {majors
                  .filter((m) => m.college == college)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.major_name}
                    </option>
                  ))}
              </select>
            </div>
            <p className={`${styles.PolicyLink} ${styles.agree}`}>
              회원 가입 시{' '}
              <a
                href="https://github.com/scsc-init/homepage_init/blob/master/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                개인정보 처리방침
              </a>
              에 동의합니다.
            </p>
            <button
              type="button"
              className={`${styles.SignupBtn} ${signupBusy ? styles['is-disabled'] : ''}`}
              onClick={async () => {
                if (signupBusy) return;
                setSignupBusy(true);
                if (!college) {
                  alert('단과대학을 선택하세요.');
                  setSignupBusy(false);
                  return;
                }
                if (!form.major_id) {
                  alert('학과/학부를 선택하세요.');
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
              가입하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
