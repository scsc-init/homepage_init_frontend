import { getTranslations } from 'next-intl/server';
import EditIgClient from '@/app/(ig)/components/editor/EditIgClient';
import styles from '@/app/(ig)/components/editor/IgEditorPage.module.css';
import { fetchBackendServerJson } from '@/util/fetch/server';

export default async function EditIgPage({ kind, params }) {
  const t = await getTranslations('Ig');
  const kindLabel = t(`kind.${kind}`);
  const { id } = await params;

  let item;
  try {
    item = await fetchBackendServerJson('GET', `/api/sig/${id}`);
  } catch {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('editHeading', { kind: kindLabel })}</h1>
        </div>
        <div className={styles.card}>{t('loadError', { kind: kindLabel })}</div>
      </div>
    );
  }

  const article = item.content ?? { content: '' };

  return <EditIgClient kind={kind} itemId={id} item={item} article={article} />;
}
