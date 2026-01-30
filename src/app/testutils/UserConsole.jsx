'use client';

import styles from './page.module.css';

export default function UserConsole() {
  return (
    <section className={styles['section']}>
      <h2>User Console</h2>
      <a href="/executive/user">유저 관리 페이지</a>
      <button onClick={fetchDeleteAllUsers}>모든 유저 삭제</button>
    </section>
  );
}

async function fetchDeleteAllUsers() {
  if (!confirm('정말 모든 유저를 삭제하시겠습니까?')) return;
  const res = await fetch('/api/test/users', { method: 'DELETE' });
  if (res.status === 204) alert('유저 삭제 성공');
  else alert(`유저 삭제 실패; status=${res.status}; msg=${await res.text()}`);
}
