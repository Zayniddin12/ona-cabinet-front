import { IDate, IOption, IRegion } from "@/types/index";
import { IProgram } from "@/types/programs";

export type IParticipantOption = IOption | IRegion | IProgram;
export type IParticipantOptions = IOption[] | IRegion[] | IProgram[];

export interface IParticipantsFilterItem {
  type: "select" | "input" | "condition";
  mask?: string[];
  fieldLabel: string;
  fieldPlaceholder: string;
  fieldValue?: number | string | boolean | number[];
  paramKey: string;
  options?: IParticipantOptions;
  optionLabelKey?: string;
  optionValueKey?: string;
  selectType?: 1 | 2;
  searchable?: boolean;
  id?: number;
}

export interface ILogFilter {
  responsiblePerson?: number;
  time: IDate;
}
