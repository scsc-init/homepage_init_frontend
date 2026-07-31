type WebsiteLike = {
  url?: string | null;
};

type SanitizedWebsite = {
  label: string;
  url: string;
  sort_order: number;
};

export const mapWebsitesForForm = (websites: WebsiteLike[] = []): { url: string }[] =>
  (Array.isArray(websites) ? websites : []).map((site) => ({
    url: site?.url ?? '',
  }));

export const sanitizeWebsites = (websites: WebsiteLike[] = []): SanitizedWebsite[] =>
  (Array.isArray(websites) ? websites : [])
    .map((site, index) => {
      const url = site?.url?.trim() ?? '';
      return { label: url || `링크 ${index + 1}`, url, sort_order: index };
    })
    .filter((site): site is SanitizedWebsite => site.url.length > 0);
