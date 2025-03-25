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
    birthdate: "",
    id: "",
    phone_number: "",
    program: "",
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
    name: {
      required,
    },
    birthdate: {
      required,
    },
    series: {
      required,
    },
    series_number: {
      required,
    },
    phone_number: {
      isPhone,
      minLength: minLength(10),
    },
    program: {
      required,
    },
    jshshir: {
      required: (val: string) => val?.length >= 14,
    },
    responsible_person: {
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

export const formStepFour = useForm(
  {
    conditions: {},
  },
  {}
);

export const formStepFive = useForm(
  {
    bank: "",
    stir: "",
    mfo: "",
    account_number: "",
    card_number: "",
    income_type: "",
    salary: 0,
    job: "",
    income_type_doc: "",
    conditions: {},
    finance: {},
    job_description: "",
  },
  {
    stir: {
      required,
      maxLength: maxLength(11),
    },
    mfo: {
      required,
    },
    account_number: { required },
    card_number: { required },
    bank: { required },
  }
);
