export interface User {
  name: string;
  account: string;
  password: string;
  id: string;
}

export type Mode = "login" | "signup";

export interface InputContent {
  account: string;
  password: string;
  name: string;
}
