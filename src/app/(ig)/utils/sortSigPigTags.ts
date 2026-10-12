import type { IgDetail } from '@/app/(ig)/components/detail/types';

export type SigPigTag = NonNullable<IgDetail['tags']>[number];

export function sortSigPigTags(tags: IgDetail['tags'] | null): SigPigTag[] {
  return [...(Array.isArray(tags) ? tags : [])]
    .filter((tag) => tag?.text)
    .sort((a, b) => {
      if (!!a?.is_major !== !!b?.is_major) return a?.is_major ? -1 : 1;
      return String(a?.text ?? '').localeCompare(String(b?.text ?? ''), 'ko');
    });
}
