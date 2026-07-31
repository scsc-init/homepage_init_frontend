import EditIgClient from '@/app/(ig)/EditIgClient';
import styles from '@/app/(ig)/IgEditorPage.module.css';
import { fetchBackendServerJson } from '@/util/fetch/server';

export const metadata = { title: 'SIG' };

export default async function EditSigPage({ params }) {
  const { id } = await params;

  let sig;
  try {
    sig = await fetchBackendServerJson('GET', `/api/sig/${id}`);
  } catch {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>SIG 수정</h1>
        </div>
        <div className={styles.card}>시그 정보를 불러오지 못했습니다.</div>
      </div>
    );
  }

  const article = sig.content ?? { content: '' };

  return <EditIgClient kind="sig" itemId={id} item={sig} article={article} />;
}
