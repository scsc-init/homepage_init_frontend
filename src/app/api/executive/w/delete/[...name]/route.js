import { fetchBackendServer } from '@/util/fetch/server';

export async function POST(_, { params }) {
  const resolvedParams = await params;
  const name = normalizeName(resolvedParams?.name);
  return fetchBackendServer('POST', `/api/executive/w/${encodePathValue(name)}/delete`);
}

function normalizeName(name) {
  if (Array.isArray(name)) return name.join('/');
  return name || '';
}

function encodePathValue(value) {
  return value.split('/').map(encodeURIComponent).join('/');
}
