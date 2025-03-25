export interface IProgramResults {
  id: number;
  name: string;
  code?: string;
  order_number?: number;
  women_count?: number;
}
export interface IWomenList {
  ID: number;
  active: boolean;
  birth_date: string;
  contract_warning_status: string;
  creator: { id: number; username: string };
  draft: boolean;
  first_name: string;
  full_name: string;
  id: number;
  last_name: string;
  living_region: { id: number; title: string; code: number };
  middle_name: string;
  phone: string;
  point: number;
  profile_photo: {
    id: number;
    file: string;
    file_size: number;
    name: string;
  };
  sickness_count: number;
}
[];
export interface IProgram {
  count: number;
  results: IProgramResults[];
}
