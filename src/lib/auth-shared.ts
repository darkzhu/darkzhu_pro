export type UserProfile = {
  nickname: string;
  bio: string;
  avatar: string;
  provider: string;
};

export type SessionUser = {
  id?: string;
  username: string;
  nickname: string;
  avatar?: string;
  provider: string;
  role?: string;
  permissions?: string[];
};

export const DEFAULT_PROFILE: UserProfile = {
  nickname: "admin",
  bio: "正在认真经营自己的小站。",
  avatar: "",
  provider: "账号登录"
};
