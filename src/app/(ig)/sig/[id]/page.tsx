import type { IgParams } from '@/app/(ig)/components/detail/types';
import IgDetailPage from '@/app/(ig)/components/detail/IgDetailPage';
import { generateIgMetadata } from '@/app/(ig)/components/detail/metadata';

export async function generateMetadata({ params }: { params: IgParams }) {
  return generateIgMetadata('sig', params);
}

export default async function SigDetailPage({ params }: { params: IgParams }) {
  return <IgDetailPage kind="sig" params={params} />;
}
