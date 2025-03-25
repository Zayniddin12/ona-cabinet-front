import { maxLength, minLength, required } from "@vuelidate/validators";

import { useForm } from "@/composables/useForm";
import { isPhone } from "@/helpers";

export const mainData = useForm(
  {
    active: true,
  },
  {}
);
export const formStepOne = useForm(
  {
    image: "",
    surname: "",
    name: "",
    middle_name: "",
    full_name: "",
    birthdate: "",
    id: "",
    phone_number: "",
    program: [],
    series: "",
    series_number: "",
    jshshir: "",
    copy_passport: "",
    region: "",
    city: "",
    mfy: "",
    address: "",
    residence: "",
    temporary_region: "",
    temporary_city: "",
    temporary_mfy: "",
    temporary_address: "",
    temporary_residence: "",
    conditions: {},
    passport_conditions: {},
    address_conditions: {},
    inputs: [
      {
        value: "",
      },
    ],
    additional_info: "",
    responsible_person: "",
    date_application: "",
    management_deed_date: "",
    application_file: "",
    referral: "",
  },
  {
    surname: {
      required,
    },
    middle_name: {
      required,
    },
    name: {
      required,
    },
    birthdate: {
      required,
    },
    jshshir: {
      required: (val: string) => val?.length >= 14,
    },
    series: {
      required,
    },
    phone_number: {
      isPhone,
      minLength: minLength(10),
    },
    series_number: {
      required,
    },
    responsible_person: {
      required,
    },
    program: {
      required,
    },
    copy_passport: {
      required,
    },
  }
);

export const formStepTwo = useForm(
  {
    year: "",
    family: "",
    life_condition: "",
    family_image: "",
    life_condition_image: "",
    marriage_doc: "",
    divorce_doc: "",
    died_husband_doc: "",
    died_family_doc: "",
    conditions: {},
    relatives: [],
  },
  {}
);

export const familyInfoForm = useForm(
  {
    year: "",
    family: "",
    life_condition: "",
    family_image: "",
    life_condition_image: "",
  },
  {}
);

export const formStepThree = useForm(
  {
    illness: "",
    diagnosis: "",
    additional_info_illness: "",
    disabled: "",
    illness_doc: "",
    medical_certificate: "",
    medical: {},
  },
  {}
);

export const formStepSupport = useForm(
  [
    {
      support_type: [],
      all_price: "",
      number: "",
      support_date: "",
      file_petition: [{}],
      file_petition_id: [],
      photo_report: [{}],
      photo_report_id: [],
      photo_cost: [{}],
      photo_cost_id: [],
      about_help: [{}],
      about_help_id: [],
    },
  ],
  {}
);

export const formSupportEdit = useForm(
  [
    {
      support_type: "",
      all_price: "",
      number: "",
      support_date: "",
      file_petition: [],
      file_petition_id: [],
      photo_report: [],
      photo_report_id: [],
      photo_cost: [],
      photo_cost_id: [],
      about_help: [],
      about_help_id: [],
    },
  ],
  {
    // support_date: {
    //   required,
    // },
    support_type: {
      required,
    },
  }
);

export const formStepFour = useForm(
  {
    conditions: {},
  },
  {}
);
export const formStepFourr = useForm(
  {
    life_situation: "",
    income_level: "",
    employment: "",
    marital_status: "",
    disability: "",
    home: "",
    training: "",
  },
  {
    income_level: { required },
    employment: { required },
    marital_status: { required },
  }
);
// life situation
export const formStepFive = useForm(
  {
    bank: "",
    stir: "",
    bank_mfo: "",
    bank_account_number: "",
    bank_card_number: "",
    income_type: "",
    salary: "",
    job: "",
    income_type_document: "",
    conditions: {},
    finance: {},
    job_description: "",
  },
  {
    stir: {
      required,
      maxLength: maxLength(11),
    },
    bank_mfo: {
      required,
    },
    bank_account_number: { required },
    bank_card_number: { required },
    bank: { required },
  }
);
export const formStepSeven = useForm(
  {
    participant: "",
    status: null,
    start_date: "",
    end_date: "",
    files: [],
    file_id: [],
  },
  {
    participant: { required },
    status: { required },
    start_date: { required },
    end_date: { required },
    file_id: { required },
  }
);
