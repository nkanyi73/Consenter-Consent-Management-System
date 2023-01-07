<template>
  <v-app>
    <NavDrawerVue />
    <v-container>
      <template>
        <v-card>
          <v-toolbar color="#1F8A60" dark flat prominent>
            <template v-slot:extension>
              <v-tabs v-model="tabs" centered>
                <v-tab> Accepted Users </v-tab>
                <v-tab> Declined Users </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>

          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <AcceptedUsersVue />
            </v-tab-item>
            <v-tab-item>
              <DeclinedUsersVue />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </template>
    </v-container>
  </v-app>
</template>

<script>
import NavDrawerVue from "@/components/NavDrawer.vue";
import AcceptedUsersVue from "@/components/AcceptedUsers.vue";
import DeclinedUsersVue from "@/components/DeclinedUsers.vue";

export default {
  components: {
    NavDrawerVue,
    AcceptedUsersVue,
    DeclinedUsersVue
  },
  data: () => ({
    tabs: null,
  }),
};
</script>
