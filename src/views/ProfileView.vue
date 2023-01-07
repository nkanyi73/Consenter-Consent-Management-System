<template>
  <v-app>
    <v-container>
      <template>
        <v-card>
          <v-toolbar color="#1F8A60" dark flat prominent>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="logout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
            <template v-slot:extension>
              <v-tabs v-model="tabs" centered>
                <v-tab> Personal Information </v-tab>
                <v-tab> Educational Information </v-tab>
                <v-tab> Contact Information </v-tab>
                <v-tab> Financial Information </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>

          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <PersonalInfo />
            </v-tab-item>
            <v-tab-item>
              <EducationInfo />
            </v-tab-item>
            <v-tab-item>
              <ContactInfo />
            </v-tab-item>
            <v-tab-item>
              <FinancialInfo />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </template>
    </v-container>
  </v-app>
</template>

<script>
import PersonalInfo from "@/components/PersonalInfo.vue";
import EducationInfo from "@/components/EducationInfo.vue";
import ContactInfo from "../components/ContactInfo.vue";
import FinancialInfo from "../components/FinancialInfo.vue";
import router from "../router/index.js"

export default {
  components: {
    PersonalInfo,
    EducationInfo,
    ContactInfo,
    FinancialInfo,
  },
  data: () => ({
    tabs: null,
  }),
  methods: {
    logout() {
      localStorage.uuid = null;
      localStorage.role = null;
      router.push("/login");
    },
  },
};
</script>
