import WithAuthorization from '@/components/WithAuthorization';
import KVEditor from './KVEditor';
import styles from './KV.module.css';

export default async function KVPage() {
  return (
    <WithAuthorization>
      <div className={styles.panel}>
        <h2>KV 테이블 관리</h2>
        <div className={styles.section}>
          <KVEditor />
        </div>
      </div>
    </WithAuthorization>
  );
}
