import { getApiSecret } from '@/util/getApiSecret';
import { getBaseUrl } from '@/util/getBaseUrl';
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  const { slug } = await params;
  const res = await fetch(`${getBaseUrl()}/api/w/${slug}`, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });
  if (!res.ok) {
    notFound();
  }

  const html = await res.text();
  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
}
