import { getTranslations } from 'next-intl/server';
import CreateIgPage from '@/app/(ig)/components/editor/CreateIgPage';

export async function generateMetadata() {
  const t = await getTranslations('Ig');
  return { title: t('kind.small-group') };
}

export default async function CreateSmallGroupPage() {
  return <CreateIgPage kind="small-group" />;
}
