'use server';

export async function isSkipEmailCheck() {
  return process.env.SNU_EMAIL_CHECK === 'FALSE';
}
