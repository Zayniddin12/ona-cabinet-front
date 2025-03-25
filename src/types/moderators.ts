export interface IModeratorAdd {
  username: string;
  email: string;
  name: string;
  type: string;
  password: string;
  repeatPassword: string;
}

export interface IModerator {
  id: number;
  username: string;
  email: string;
  first_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  type: "user" | "moderator" | "admin" | "superadmin";
}
