import IgDetailPage from '@/app/(ig)/components/detail/IgDetailPage';
import { generateIgMetadata } from '@/app/(ig)/components/detail/metadata';

export async function generateMetadata({ params }) {
  return generateIgMetadata('small-group', params);
}

export default async function SmallGroupDetailPage({ params }) {
  return <IgDetailPage kind="small-group" params={params} />;
}
