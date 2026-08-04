import EditIgClient from '@/app/(ig)/components/editor/EditIgClient';
import styles from '@/app/(ig)/components/editor/IgEditorPage.module.css';
import { fetchBackendServerJson } from '@/util/fetch/server';

const EDIT_CONFIG = {
  sig: {
    heading: 'SIG 수정',
    errorMessage: '시그 정보를 불러오지 못했습니다.',
  },
  pig: {
    heading: 'PIG 수정',
    errorMessage: '피그 정보를 불러오지 못했습니다.',
  },
};

export default async function EditIgPage({ kind, params }) {
  const config = EDIT_CONFIG[kind];
  const { id } = await params;

  let item;
  try {
    item = await fetchBackendServerJson('GET', `/api/sig/${id}`);
  } catch {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{config.heading}</h1>
        </div>
        <div className={styles.card}>{config.errorMessage}</div>
      </div>
    );
  }

  const article = item.content ?? { content: '' };

  return <EditIgClient kind={kind} itemId={id} item={item} article={article} />;
}
