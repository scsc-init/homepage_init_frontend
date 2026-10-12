import EditIgClient from '@/app/(ig)/components/editor/EditIgClient';
import styles from '@/app/(ig)/components/editor/IgEditorPage.module.css';
import type { IgArticle, IgItem, IgKind } from '@/app/(ig)/components/editor/types';
import { fetchBackendServerJson } from '@/util/fetch/server';

type EditIgPageProps = {
  kind: IgKind;
  params: Promise<{ id: string }>;
};

type EditPageConfig = {
  heading: string;
  errorMessage: string;
};

const EDIT_CONFIG: Record<IgKind, EditPageConfig> = {
  sig: {
    heading: 'SIG 수정',
    errorMessage: '시그 정보를 불러오지 못했습니다.',
  },
  pig: {
    heading: 'PIG 수정',
    errorMessage: '피그 정보를 불러오지 못했습니다.',
  },
};

function resolveArticle(item: IgItem): IgArticle {
  if (item.content && typeof item.content === 'object' && !Array.isArray(item.content)) {
    return item.content;
  }

  return {
    content: typeof item.content === 'string' ? item.content : '',
  };
}

export default async function EditIgPage({ kind, params }: EditIgPageProps) {
  const config = EDIT_CONFIG[kind];
  const { id } = await params;

  let item: IgItem;

  try {
    item = await fetchBackendServerJson<IgItem>('GET', `/api/sig/${id}`);
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

  return <EditIgClient kind={kind} itemId={id} item={item} article={resolveArticle(item)} />;
}
