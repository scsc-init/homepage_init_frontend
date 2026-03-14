// src/app/executive/sig/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import SigList from './SigList';
import { safeFetch, fetchUsers } from '@/util/fetchAPIData';
import styles from '../igpage.module.css';

export default async function ExecutiveSigPage() {
  const [sigMetas, users] = await Promise.allSettled([
    safeFetch('GET', `/api/sigs`),
    fetchUsers(),
  ]);
  if (sigMetas.status !== 'fulfilled' || users.status !== 'fulfilled') return null;

  const sigs = sigMetas.value.map((s) => ({
    ...s,
    ownerName: users.value.find((u) => u.id === s.owner).name,
  }));

  return (
    <WithAuthorization>
      <div className={styles['admin-panel']}>
        <h2>SIG 관리</h2>
        <div className={styles['adm-section']}>
          <SigList sigs={sigs} />
        </div>
      </div>
    </WithAuthorization>
  );
}
