import AuthClient from './AuthClient';

export default async function LoginPage(props) {
  const searchParams = await props.searchParams;

  const redirectTo =
    typeof searchParams?.redirect === 'string' && searchParams.redirect
      ? searchParams.redirect
      : null;

  const snuEmailCheck = process.env.SNU_EMAIL_CHECK?.toUpperCase() === 'TRUE';
  return <AuthClient initialRedirect={redirectTo} snuEmailCheck={snuEmailCheck} />;
}
