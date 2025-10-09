import Script from 'next/script';

export const metadata = {
  title: 'Join us!',
  other: { 'google-signin-client_id': process.env.GOOGLE_CLIENT_ID || '' },
};

export default function LoginLayout({ children }) {
  return (
    <>
      <Script id="gsi-cid" strategy="beforeInteractive">
        {`window.__GSI_CID=${JSON.stringify(process.env.GOOGLE_CLIENT_ID || '')};`}
      </Script>
      {children}
    </>
  );
}
