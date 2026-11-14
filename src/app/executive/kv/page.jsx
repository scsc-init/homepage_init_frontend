import { getTranslations } from 'next-intl/server';
import WithAuthorization from '@/components/WithAuthorization';
import KVEditor from './KVEditor';
import styles from './KV.module.css';

export default async function KVPage() {
  const t = await getTranslations('Executive');
  return (
    <WithAuthorization>
      <div className={styles.panel}>
        <h2>{t('kvManagement')}</h2>
        <div className={styles.section}>
          <KVEditor />
        </div>
      </div>
    </WithAuthorization>
  );
}
