'use client';

import { useSession, signOut } from 'next-auth/react';
import styles from './page.module.css';

export default function NextauthConsole() {
  const { data, status } = useSession();
  return (
    <section className={styles['section']}>
      <h2>NEXTAUTH Session</h2>
      <h3>{status}</h3>
      <p>{JSON.stringify(data)}</p>
      <button onClick={signOut}>signOut</button>
    </section>
  );
}
