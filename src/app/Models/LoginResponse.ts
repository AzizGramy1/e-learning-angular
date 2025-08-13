import { User } from "./User";

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}