import { fetchBackendClientJson } from './client';

type KvResponse = {
  value?: string;
};

export async function getKvsClient(keys: string[]): Promise<string[]> {
  const list = Array.isArray(keys) ? keys : [];
  const results = await Promise.allSettled(
    list.map((key) =>
      fetchBackendClientJson<KvResponse>(`/api/kv/${encodeURIComponent(key)}`, {}, true),
    ),
  );

  return results.map((result) =>
    result.status === 'fulfilled' ? (result.value.value ?? '') : '',
  );
}

export async function getKvClient(key: string): Promise<string> {
  const [value] = await getKvsClient([key]);
  return value ?? '';
}

export async function fetchMajors<T = unknown[]>(): Promise<T> {
  return fetchBackendClientJson<T>('/api/majors', {}, true);
}
