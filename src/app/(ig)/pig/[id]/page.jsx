import IgDetailPage from '@/app/(ig)/components/detail/IgDetailPage';
import { generateIgMetadata } from '@/app/(ig)/components/detail/metadata';

export async function generateMetadata({ params }) {
  return generateIgMetadata('pig', params);
}

export default async function PigDetailPage({ params }) {
  return <IgDetailPage kind="pig" params={params} />;
}
