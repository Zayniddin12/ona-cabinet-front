export interface TResidentAddForm {
  logo: File;
  name: string;
  phone: string;
  category: number;
  date: Date;
  email: string;
  password: string;
  group: number[];
  responsiblePerson: string;
  region: string;
  district: string;
  address: string;
  id: string;
}

export interface TResidentCategory {
  id: number;
  name: string;
}

export interface TResident {
  id: number;
  name: string;
  logo: string;
  category: TResidentCategory;
}

export interface TResidentResponse {
  name: string;
  id: number;
  logo: string;
  category: {
    id: number;
    name: string;
  };
  created_at: Date;
  phone: string;
  email: string;
  region: {
    id: number;
    parent: number;
  };
  address: string;
  password: string;
  client_id: string;
  resident_groups: TResidentCategory[];
  responsible_person: string;
}

export type TApplicationStatus =
  | "new"
  | "waiting_for_payment"
  | "rejected"
  | "sold";

export interface TApplication {
  resident: {
    logo: string;
    name: string;
    category: string;
  };
  voucher: string;
  count: number;
  note: string;
  note_for_payment: string;
  created_at: string;
  phone: string;
  responsible_person: string;
  id: number;
  status: TApplicationStatus;
}

export interface TResidentGroup {
  allocated_residents: TResidentResponse[];
  non_allocated_residents: TResidentResponse[];
  id: number;
  name: string;
}
