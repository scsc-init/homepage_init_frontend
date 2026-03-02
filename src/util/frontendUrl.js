export function ensureAbsoluteFrontendUrl(raw) {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)) return trimmed;
  const origin =
    typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
  if (!origin) return trimmed;
  if (trimmed.startsWith('/')) return `${origin}${trimmed}`;
  return `${origin}/${trimmed.replace(/^\/+/, '')}`;
}
