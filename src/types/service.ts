import { TMerchant } from "@/types/index";

export interface TService {
  description: string;
  end_date: Date;
  id: number;
  merchant: TMerchant;
  moderation_status: "active" | "blocked" | "in_moderation";
  name: string;
  percentage: number;
  start_date: Date;
  type: "sale" | "cashback";
  using_residents_count: number;
}

export interface TMerchantGroup {
  id: number;
  name: string;
}
