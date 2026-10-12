import type { IgParams } from '@/app/(ig)/components/detail/types';
import IgDetailPage from '@/app/(ig)/components/detail/IgDetailPage';
import { generateIgMetadata } from '@/app/(ig)/components/detail/metadata';

export async function generateMetadata({ params }: { params: IgParams }) {
  return generateIgMetadata('small-group', params);
}

export default async function SmallGroupDetailPage({ params }: { params: IgParams }) {
  return <IgDetailPage kind="small-group" params={params} />;
}
