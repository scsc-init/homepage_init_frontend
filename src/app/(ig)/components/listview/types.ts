import type { IgDetail } from '@/app/(ig)/components/detail/types';
import type { UserId } from '@/types/user';

export type IgSearchParams = Promise<Record<string, string | string[] | undefined>>;

export type IgListItem = Pick<
  IgDetail,
  'title' | 'description' | 'owner' | 'year' | 'semester' | 'status' | 'tags'
> & {
  id: number;
  members?: { user_id?: UserId; user?: { id?: UserId } }[] | null;
};
