import InAppBrowser from './InAppBrowser';

type BrowserPageProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ redirect?: string | string[] }>;
};

export default async function BrowserPage(props: BrowserPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const redirectTo = typeof searchParams?.redirect === 'string' ? searchParams.redirect : null;

  return <InAppBrowser initialRedirect={redirectTo} slug={params?.slug || []} />;
}
