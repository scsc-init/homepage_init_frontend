// TODO: 나중에 회원 페이지에 들어가야 할 것들이 구체화되면 추가

export enum UserRoleType {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface UserType {
  id: number;
  name: string;
  role: UserRoleType;
}
