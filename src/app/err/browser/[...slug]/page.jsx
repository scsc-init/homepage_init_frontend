import InAppBrowser from './InAppBrowser';

export default async function BrowserPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const redirectTo = typeof searchParams?.redirect === 'string' ? searchParams.redirect : null;

  return <InAppBrowser initialRedirect={redirectTo} slug={params?.slug || []} />;
}
