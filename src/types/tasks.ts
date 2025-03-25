import { IDate } from "@/types/index";

export interface ITask {
  id: number;
  name: string;
  phone: number;
  contract_type: number;
  active: boolean;
  end_date: string;
  participant_count: number;
  ten_days_left: boolean;
  twenty_days_left: boolean;
  daily_activity: number;
  weekly_activity: number;
  monthly_activity: number;
  user: null;
}
