import type { IgParams } from '@/app/(ig)/components/detail/types';
import IgDetailPage from '@/app/(ig)/components/detail/IgDetailPage';
import { generateIgMetadata } from '@/app/(ig)/components/detail/metadata';

export async function generateMetadata({ params }: { params: IgParams }) {
  return generateIgMetadata('pig', params);
}

export default async function PigDetailPage({ params }: { params: IgParams }) {
  return <IgDetailPage kind="pig" params={params} />;
}
