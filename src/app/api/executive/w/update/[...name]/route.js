import { fetchBackendServer } from '@/util/fetch/server';

export async function POST(request, { params }) {
  const resolvedParams = await params;
  const name = normalizeName(resolvedParams?.name);
  const formData = await request.formData();

  return fetchBackendServer('POST', `/api/executive/w/${encodePathValue(name)}/update`, {
    body: formData,
  });
}

function normalizeName(name) {
  if (Array.isArray(name)) return name.join('/');
  return name || '';
}

function encodePathValue(value) {
  return value.split('/').map(encodeURIComponent).join('/');
}
