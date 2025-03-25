export interface IFile {
  id: number;
  file: string;
  file_size: number;
  name: string;
  url: string;
}

interface ITitle {
  id: number;
  title: string;
}

interface IRegion extends ITitle {
  code: number;
}

interface IDistrict extends ITitle {
  region: number;
}

interface ICondition extends ITitle {
  type: {
    id: number;
    title: string;
    place: string;
    selection_type: number;
  };
  point: number;
  show_in_statistics: boolean;
}

interface IStreet extends ITitle {
  district: number;
}

interface IProgram {
  id: number;
  order_number: number;
  name: string;
  code: string;
  description: string;
  delete: [
    173,
    {
      "main.Participant_programs": 172;
      "main.Program": 1;
    }
  ];
}

export interface IFamilyInfo {
  id: number;
  participant: number;
  year: number;
  family_info: string;
  lifestyle: string;
  family_photo: IFile[];
  living_condition_files: IFile[];
}

export interface IPerson {
  id: number;
  ID: number;
  draft: boolean;
  creator: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  full_name: string;
  living_region: IRegion;
  living_district: IDistrict;
  living_street: IStreet;
  living_house_number: string;
  constant_address_document: any[]; // Array of unknown objects
  constant_region: IRegion;
  constant_district: IDistrict;
  constant_street: IStreet;
  constant_house_number: string;
  constant_address_mail_index: string;
  living_address_mail_index: string;
  additional_info: string;
  contact: null;
  last_edited_admin: number;
  birth_date: string;
  phone: string;
  profile_photo: number;
  relative: null;
  year: number;
  family_info: string;
  lifestyle: string;
  family_photo: IFile[];
  living_condition_files: IFile[];
  marriage_certificate: IFile[];
  divorce_certificate: IFile[];
  husband_death_certificate: IFile[];
  family_members_death_certificate: IFile[];
  illness_certificate: IFile[];
  illness: null | string;
  relative_document: IFile[];
  disability: [];
  diagnosis: string;
  medical_info: string;
  medical_data: [];
  responsible_person: number;
  application_date: string;
  application_file: IFile[];
  date_of_management_act: string;
  referrall: null;
  applicant: null;
  communicated_at: null;
  what_can_do: string;
  bank: number;
  bank_account_number: string;
  STIR: string;
  bank_card_number: string;
  plastic_card_photo: null;
  passport_number: string;
  passport_serial: string;
  passport_scan: IFile[];
  pinfl: string;
  conditions: ICondition[];
  point: 41;
  income_type: null;
  income_type_document: number[];
  monthly_income: number;
  monthly_income_one: null;
  monthly_income_two: null;
  status: "active";
  programs: IProgram[];
  frozen_by: null;
  frozen_date: null;
  is_participant: boolean;
  family_members: number[];
  contact_infos: string;
  profession: string;
  deleted: boolean;
}

export interface IStatistic {
  title: string;
  value: number;
}

interface IParticipant {
  id: number;
  full_name: string;
  point: number;
  responsible_person: string;
}

export interface IParticipants {
  id: number;
  participant: number;
  support_type: {
    id: number;
    title: string;
  };
  allocated_amount: number;
  support_date: string;
  number: number;
  file_petition: IFile[];
  photo_report: IFile[];
  about_help: IFile[];
  photo_cost: IFile[];
  created_at: string;
  updated_at: string;
}

export interface IParticipantLog {
  id: number;
  participant: IParticipant;
  object_repr: string;
  timestamp: string;
  action: number;
}

export interface IResponsiblePerson {
  id: number;
}
