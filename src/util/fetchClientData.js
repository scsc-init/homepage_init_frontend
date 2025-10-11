'use client';

export async function fetchMeClient() {
  const res = await fetch('/api/user/profile');
  return res.ok ? await res.json() : null;
}
