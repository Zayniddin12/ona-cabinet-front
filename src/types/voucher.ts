import { TMerchant } from "@/types/index";

export interface TResidentVoucher {
  id: number;
  name: string;
  merchant: TMerchant;
  type: "service";
  price: string;
  amount: number;
  product: string;
  count: number;
  end_date: Date;
  expire_duration: number;
  moderation_status: "active" | "in_moderation";
  total_count: number;
  available_count: number;
}

export interface TAttachedEmployee {
  id: number;
  first_name: string;
  last_name: string;
  moderation_status: "dismissed" | "accepted";
  avatar: string;
  phone: string;
  gender: "male" | "female";
  voucher_count: number;
  voucher_expire_at: string;
}
