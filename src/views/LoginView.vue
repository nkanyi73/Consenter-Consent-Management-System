<template>
  <v-container>
    <v-sheet id="sheet">
      <h1 class="text-center font-weight-light">Welcome Back</h1>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="login">
          <validation-provider
            v-slot="{ errors }"
            name="email"
            rules="required|email"
          >
            <v-text-field
              v-model="email"
              :error-messages="errors"
              label="E-mail"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="Password"
            rules="required|max:12|min:6"
          >
            <v-text-field
              v-model="password"
              :error-messages="errors"
              label="Password"
              :type="'password'"
              required
            ></v-text-field>
          </validation-provider>

          <v-btn class="mr-4" type="submit" :disabled="invalid"> login </v-btn>
          <v-btn @click="clear"> clear </v-btn>
        </form>
      </validation-observer>
    </v-sheet>
    <v-row wrap>
      <v-col cols="12" class="d-flex justify-center">
        <a href="/signup" class="font-weight-light"
          >Don't have an acount? Sign Up Here</a
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable */
import { required, email, max, min } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
// eslint-disable-next-line
import { db } from "../firebase";
import router from "@/router";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { useConnectStore } from "@/store";
import axios from "axios";
import { NODE_API_URL } from "../../config/dev.env";

setInteractionMode("eager");

extend("min", {
  ...min,
  message: "{_field_} must be more than {length} characters",
});

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});

extend("email", {
  ...email,
  message: "Email must be valid",
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    email: "",
    password: "",
  }),

  methods: {
    async login() {
      const connectStore = useConnectStore();
      connectStore.loading = true;
      try {
        const response = await axios.post(`${NODE_API_URL}/login`, {
          email: this.email,
          password: this.password,
        });
        localStorage.uuid = response.data.uuid;
        localStorage.role = response.data.role_id;
        
        alert("Login Successful");
        if (localStorage.role == '1') {
          router.push("dashboard");
        } else if (localStorage.role == '2') {
          router.push("myhome");
        } else {
          router.push("notifications");
        }

        connectStore.loading = false;
      } catch (error) {
        alert(error.response.data);
        connectStore.loading = false;
      }
    },
    clear() {
      this.name = "";
      this.phoneNumber = "";
      this.email = "";
      this.select = null;
      this.checkbox = null;
      this.$refs.observer.reset();
    },
  },
};
</script>

<style>
#sheet {
  background-color: aliceblue !important;
}
</style>
