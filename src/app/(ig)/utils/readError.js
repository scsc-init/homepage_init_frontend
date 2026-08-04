export const readError = async (res) => {
  const base = `HTTP ${res.status}`;
  const ct = res.headers.get('content-type') || '';
  try {
    if (ct.includes('application/json')) {
      const body = await res.json();
      const detail = body?.detail ?? body?.message ?? body?.error;
      return detail ? `${base} - ${detail}` : `${base} - ${JSON.stringify(body)}`;
    }
    const text = await res.text();
    return text ? `${base} - ${text}` : base;
  } catch {
    return base;
  }
};
