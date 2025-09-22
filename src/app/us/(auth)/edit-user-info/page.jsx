'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as validator from '../login/validator';
import PfpUpdate from './PfpUpdate';
import './page.css';
import { oldboyLevel } from '@/util/constants';

function EditUserInfoClient() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    student_id: '',
    major_id: '',
    profile_picture: '',
  });
  const [majors, setMajors] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [oldboyApplicant, setOldboyApplicant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const jwt = localStorage.getItem('jwt');
      const fetches = [];
      fetches.push(fetch('/api/user/profile', { headers: { 'x-jwt': jwt } }));
      fetches.push(fetch('/api/majors'));
      fetches.push(fetch('/api/user/oldboy/applicant', { headers: { 'x-jwt': jwt } }));
      const [resUser, resMajors, resOldboy] = await Promise.all(fetches);

      if (!resUser.ok) {
        alert('로그인이 필요합니다.');
        router.push('/us/login');
        return;
      }
      const user = await resUser.json();
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        student_id: user.student_id || '',
        major_id: user.major_id?.toString() || '',
        profile_picture: user.profile_picture || '',
      });
      setUserRole(user.role);

      const majorList = resMajors.ok ? await resMajors.json() : [];
      setMajors(majorList);
      if (!resMajors.ok) console.warn('Failed to load majors');
      if (resOldboy.ok) {
        setOldboyApplicant(await resOldboy.json());
      }
      setLoading(false);
    };
    fetchData();
  }, [router]);

  const handleSubmit = async () => {
    const { name, phone, student_id, major_id } = form;
    const errors = [];
    validator.name(name, (ok) => {
      if (!ok) errors.push('이름이 올바르지 않습니다.');
    });
    validator.phoneNumber(phone, (ok) => {
      if (!ok) errors.push('전화번호 형식이 올바르지 않습니다.');
    });
    validator.studentID(student_id, (ok) => {
      if (!ok) errors.push('학번 형식이 올바르지 않습니다.');
    });
    if (errors.length) {
      alert(errors[0]);
      return;
    }

    const jwt = localStorage.getItem('jwt');
    setLoading(true);
    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-jwt': jwt,
      },
      body: JSON.stringify({
        name,
        phone,
        student_id,
        major_id: Number(major_id),
      }),
    });
    setLoading(false);

    if (res.status === 204) {
      alert('정보가 수정되었습니다.');
      router.push('/about/my-page');
    } else if (res.status === 409) {
      alert('이미 사용 중인 전화번호 또는 학번입니다.');
    } else if (res.status === 422) {
      alert('입력값이 올바르지 않습니다.');
    } else {
      alert('수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDelete = async () => {
    const ok = confirm('정말 휴회원 처리하시겠습니까?');
    if (!ok) return;
    const jwt = localStorage.getItem('jwt');
    setLoading(true);
    const res = await fetch('/api/user/delete', {
      method: 'POST',
      headers: { 'x-jwt': jwt },
    });
    setLoading(false);

    if (res.status === 204) {
      alert('휴회원으로 전환되었습니다.');
      router.push('/about/my-page');
    } else if (res.status === 403) {
      alert(`잘못된 접근입니다: ${(await res.json()).detail}`);
    } else {
      alert('수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleOBRegister = async () => {
    const ok = confirm('정말 졸업생 전환 신청하시겠습니까?');
    if (!ok) return;
    const jwt = localStorage.getItem('jwt');
    setLoading(true);
    const res = await fetch('/api/user/oldboy/register', {
      method: 'POST',
      headers: { 'x-jwt': jwt },
    });
    setLoading(false);

    if (res.status === 201) {
      alert('졸업생 전환 신청이 완료되었습니다.');
      router.push('/about/my-page');
    } else if (res.status === 400) {
      alert(`졸업생 전환 신청 자격이 없습니다.`);
    } else if (res.status === 409) {
      alert(`이미 졸업생 전환 신청을 완료했습니다.`);
    } else {
      alert('신청에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleOBUnregister = async () => {
    const ok = confirm('정말 졸업생 전환 신청을 취소하시겠습니까?');
    if (!ok) return;
    const jwt = localStorage.getItem('jwt');
    setLoading(true);
    const res = await fetch('/api/user/oldboy/unregister', {
      method: 'POST',
      headers: { 'x-jwt': jwt },
    });
    setLoading(false);

    if (res.status === 204) {
      alert('졸업생 전환 신청 취소가 완료되었습니다.');
      router.push('/about/my-page');
    } else if (res.status === 400) {
      alert(
        `이미 졸업생으로 전환되어 취소할 수 없습니다. 정회원으로 전환 기능을 이용해주세요.`,
      );
    } else if (res.status === 404) {
      alert(`졸업생 전환 신청을 하지 않았습니다.`);
    } else {
      alert('신청 취소에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleOBReactivate = async () => {
    const ok = confirm(
      '정말 정회원으로 전환하시겠습니까? 전환 후 회비를 납부해야 전환이 완료됩니다.',
    );
    if (!ok) return;
    const jwt = localStorage.getItem('jwt');
    setLoading(true);
    const res = await fetch('/api/user/oldboy/reactivate', {
      method: 'POST',
      headers: { 'x-jwt': jwt },
    });
    setLoading(false);

    if (res.status === 204) {
      alert('정회원 전환 신청이 완료되었습니다. 회비를 납부해야 정회원 전환이 완료됩니다.');
      router.push('/about/welcome');
    } else if (res.status === 400) {
      alert(`졸업생이 아니어서 정회원으로 전환할 수 없습니다.`);
    } else {
      alert('신청에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div
      style={{
        maxWidth: '25vw',
        minWidth: '250px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <h2 style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>내 정보 수정</h2>
      <img
        src={form.profile_picture ? form.profile_picture : '/main/default-pfp.png'}
        alt="Profile"
        className="user-profile-picture"
      />
      <PfpUpdate />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr',
          rowGap: '1rem',
          columnGap: '0.5rem',
          alignItems: 'center',
        }}
      >
        <label style={{ whiteSpace: 'nowrap' }}>이름</label>
        <input
          type="text"
          value={form.name}
          disabled
          style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
        />

        <label style={{ whiteSpace: 'nowrap' }}>전화번호</label>
        <input
          type="text"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="01012345678"
          style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
        />

        <label style={{ whiteSpace: 'nowrap' }}>학번</label>
        <input
          type="text"
          value={form.student_id}
          onChange={(e) => setForm({ ...form, student_id: e.target.value })}
          placeholder="202512345"
          style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
        />

        <label style={{ whiteSpace: 'nowrap' }}>전공</label>
        <select
          value={form.major_id}
          onChange={(e) => setForm({ ...form, major_id: e.target.value })}
          style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
        >
          <option value="">전공 선택</option>
          {majors.map((m) => (
            <option key={m.id} value={m.id}>
              {m.college} - {m.major_name}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ flex: 1, minWidth: '120px' }}
        >
          저장하기
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{ flex: 1, minWidth: '120px' }}
        >
          휴회원으로 전환
        </button>
        {userRole === oldboyLevel ? (
          <button
            onClick={handleOBReactivate}
            disabled={loading}
            style={{ flex: 1, minWidth: '120px' }}
          >
            정회원 전환 신청
          </button>
        ) : oldboyApplicant === null ? (
          <button
            onClick={handleOBRegister}
            disabled={loading}
            style={{ flex: 1, minWidth: '120px' }}
          >
            졸업생 전환 신청
          </button>
        ) : (
          <button
            onClick={handleOBUnregister}
            disabled={loading}
            style={{ flex: 1, minWidth: '120px' }}
          >
            졸업생 전환 신청 취소
          </button>
        )}
      </div>
    </div>
  );
}

export default function EditUserInfoPage() {
  return (
    <div id="Home">
      <div id="EditUserInfoContainer">
        <EditUserInfoClient />
      </div>
    </div>
  );
}
