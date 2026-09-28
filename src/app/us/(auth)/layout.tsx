import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Join us!',
  other: { 'google-signin-client_id': process.env.GOOGLE_CLIENT_ID || '' },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script id="gsi-cid" strategy="beforeInteractive">
        {`window.__GSI_CID=${JSON.stringify(process.env.GOOGLE_CLIENT_ID || '')};`}
      </Script>
      {children}
    </>
  );
}
