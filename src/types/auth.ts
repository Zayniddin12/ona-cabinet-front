export interface IUser {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  role: string;
}

export interface IUserAuthInfo {
  errors: any;
  user: IUser;
  isAuthenticated: boolean;
}

export interface IAuthLoginPayload {
  username: string;
  password: string;
}
