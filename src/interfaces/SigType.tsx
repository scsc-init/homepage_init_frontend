// Sig Tag가 정해지면 추가
// 일단 시그장 항목 넣기

import { GroupType } from './GroupType';
import { UserType } from './UserType';

export interface SigType {
  id: number;
  sigCategory: 'SIG' | 'PIG';
  sigName: string;
  sigLeader: UserType;
  group: GroupType;
}
