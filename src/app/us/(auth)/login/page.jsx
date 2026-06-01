import AuthClient from './AuthClient';

export default async function LoginPage(props) {
  const searchParams = await props.searchParams;

  const redirectTo =
    typeof searchParams?.redirect === 'string' && searchParams.redirect
      ? searchParams.redirect
      : null;

  return <AuthClient initialRedirect={redirectTo} />;
}
