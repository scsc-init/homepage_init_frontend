import { getTranslations } from 'next-intl/server';
import type { IgParams } from '@/app/(ig)/components/detail/types';
import EditIgPage from '@/app/(ig)/components/editor/EditIgPage';

export async function generateMetadata() {
  const t = await getTranslations('Ig');
  return { title: t('kind.small-group') };
}

export default async function EditSmallGroupPage({ params }: { params: IgParams }) {
  return <EditIgPage kind="small-group" params={params} />;
}
