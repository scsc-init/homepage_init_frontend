// src/app/executive/pig/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import PigList from './PigList';
import PigMembersPanel from './PigMembersPanel';
import { fetchPigs, fetchUsers } from '@/util/fetchAPIData';
import styles from '../igpage.module.css';

export default async function ExecutivePigPage() {
  const [pigs, users] = await Promise.all([fetchPigs(), fetchUsers()]);

  return (
    <WithAuthorization>
      <div className={styles['admin-panel']}>
        <h2>PIG 관리</h2>
        <div className={styles['adm-section']}>
          <PigList pigs={Array.isArray(pigs) ? pigs : []} />
        </div>
        <h2>PIG 구성원 관리</h2>
        <div className={styles['adm-section']}>
          <PigMembersPanel
            pigs={Array.isArray(pigs) ? pigs : []}
            users={Array.isArray(users) ? users : []}
          />
        </div>
      </div>
    </WithAuthorization>
  );
}
