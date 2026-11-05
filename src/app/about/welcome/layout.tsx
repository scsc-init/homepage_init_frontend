import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

export async function generateMetadata() {
  const t = await getTranslations('Welcome');
  return { title: t('title') };
}

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  return children;
}
