import { fetchBackendClient, fetchBackendClientJson } from './client';

type KvResponse = {
  key: string;
  value?: string | null;
};

function buildKvsPath(keys: string[] | undefined): string {
  if (keys === undefined) return '/api/kvs';

  const params = new URLSearchParams();
  keys.forEach((key) => params.append('q', key));
  const query = params.toString();
  return query ? `/api/kvs?${query}` : '/api/kvs';
}

export async function getKvsClient(keys: string[]): Promise<string[]>;
export async function getKvsClient(keys: undefined): Promise<KvResponse[]>;
export async function getKvsClient(
  keys: string[] | undefined,
): Promise<string[] | KvResponse[]> {
  if (keys !== undefined && keys.length === 0) return [];

  const kvs = await fetchBackendClientJson<KvResponse[]>(buildKvsPath(keys), {}, true).catch(
    () => [],
  );

  if (keys === undefined) return kvs;

  const valueByKey = new Map(kvs.map((kv) => [kv.key, kv.value ?? '']));
  return keys.map((key) => valueByKey.get(key) ?? '');
}

export async function getKvClient(key: string): Promise<string> {
  const [value] = await getKvsClient([key]);
  return value ?? '';
}

export async function setKvClient(key: string, value: string | null): Promise<Response> {
  return fetchBackendClient(
    `/api/kv/${encodeURIComponent(key)}/update`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    },
    true,
  );
}

export async function fetchMajors<T = unknown[]>(): Promise<T> {
  return fetchBackendClientJson<T>('/api/majors', {}, true);
}
