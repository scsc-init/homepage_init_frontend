import type { UserId } from '@/types/user';

export const getMemberIdentity = (
  member: { id?: UserId; user_id?: UserId } | null | undefined,
) => member?.id ?? member?.user_id ?? '';
