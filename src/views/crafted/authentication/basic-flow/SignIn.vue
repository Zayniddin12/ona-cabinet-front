<template>
  <div>
    <div></div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line
// @ts-ignore
import Swal from "sweetalert2/dist/sweetalert2.min.js";
import { ErrorMessage, Field, Form, SubmissionHandler } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import * as Yup from "yup";

import { Actions } from "@/store/enums/StoreEnums";

const store = useStore();
const router = useRouter();

const submitButton = ref<HTMLButtonElement | null>(null);

//Create form validation object
const login = Yup.object().shape({
  email: Yup.string().email().required().label("Email"),
  password: Yup.string().min(4).required().label("Password"),
});

//Form submit function
const onSubmitLogin: SubmissionHandler = async (values) => {
  // Clear existing errors
  store.dispatch(Actions.LOGOUT);

  if (submitButton.value) {
    // eslint-disable-next-line
    submitButton.value!.disabled = true;
    // Activate indicator
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  // Send login request
  await store.dispatch(Actions.LOGIN, values);
  const [errorName] = Object.keys(store.getters.getErrors);
  const error = store.getters.getErrors[errorName];

  if (!error) {
    Swal.fire({
      text: "You have successfully logged in!",
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn fw-semobold btn-light-primary",
      },
    }).then(function () {
      // Go to page after successfully login
      router.push({ name: "dashboard" });
    });
  } else {
    Swal.fire({
      text: error[0],
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Try again!",
      customClass: {
        confirmButton: "btn fw-semobold btn-light-danger",
      },
    });
  }

  //Deactivate indicator
  submitButton.value?.removeAttribute("data-kt-indicator");
  // eslint-disable-next-line
  submitButton.value!.disabled = false;
};
</script>
