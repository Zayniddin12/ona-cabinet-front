export interface IUserStatistics {
  title: string;
  number: number;
  icon: string;
}

export interface IUser {
  id: string;
  userName: string;
  userId: string;
  born: Date | string;
  grade: string;
  region: string;
  illness: string;
  is_active: boolean;
  image: string;
}
