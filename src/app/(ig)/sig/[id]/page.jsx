import IgDetailPage from '@/app/(ig)/components/detail/IgDetailPage';
import { generateIgMetadata } from '@/app/(ig)/components/detail/metadata';

export async function generateMetadata({ params }) {
  return generateIgMetadata('sig', params);
}

export default async function SigDetailPage({ params }) {
  return <IgDetailPage kind="sig" params={params} />;
}
