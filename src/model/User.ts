export interface UserWithoutPWD {
  name: string;
  account: string;
  id: string;
}

export interface User extends UserWithoutPWD {
  password: string;
}

export type Mode = "login" | "signup";

export interface InputContent {
  account: string;
  password: string;
  name: string;
}
