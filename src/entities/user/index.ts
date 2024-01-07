import { TToken } from "..";

export type TUser = {
  id: string;
  fullname: string;
  image?: string;
  email: string;
  isPasswordSet: boolean;
  role: {
    id: string;
    name: string;
    permissions: string[];
  };
} & TToken;
