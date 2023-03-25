export interface UserData {
  name: string;
  account: string;
  id: string;
}

export interface User extends UserData {
  password: string;
}

export type Mode = "login" | "signup";

export interface InputContent {
  account: string;
  password: string;
  name: string;
}
