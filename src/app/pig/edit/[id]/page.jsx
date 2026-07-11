import EditIgClient from '@/app/(ig)/EditIgClient';
import styles from '@/app/(ig)/IgEditorPage.module.css';
import { fetchBackendServerJson } from '@/util/fetch/server';

export const metadata = { title: 'PIG' };

export default async function EditPigPage({ params }) {
  const { id } = await params;

  let pig;
  try {
    pig = await fetchBackendServerJson('GET', `/api/sig/${id}`);
  } catch {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>PIG 수정</h1>
        </div>
        <div className={styles.card}>피그 정보를 불러오지 못했습니다.</div>
      </div>
    );
  }

  const article = pig.content ?? { content: '' };

  return <EditIgClient kind="pig" itemId={id} item={pig} article={article} />;
}
