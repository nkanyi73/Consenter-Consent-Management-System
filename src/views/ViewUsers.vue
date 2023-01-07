<template>
  <v-container>
    <NavDrawerVue />
    <v-card>
      <v-toolbar color="#1F8A60" dark flat prominent>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>Manage Third Parties</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-toolbar>

      <v-container fluid>
        <v-row dense>
          <v-col
            v-for="thirdParty in thirdParties"
            :key="thirdParty"
            :cols="12"
          >
            <v-card>
              <v-card-title
                >User at Address &lt; {{ thirdParty }} &gt;
              </v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn-toggle v-model="toggle_exclusive">
                  <v-btn>
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                  <v-btn>
                    <v-icon>mdi-alpha-x</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
import NavDrawerVue from "@/components/NavDrawer.vue";
import { NODE_API_URL } from "../../config/dev.env";
import axios from "axios";

export default {
  data: () => ({
    thirdParties: [],
    toggle_exclusive: 0,
    active: []
  }),
  methods: {
    async fetchData() {
      var self = this;
      await axios
        .get(`${NODE_API_URL}/users?userStatus=not`)
        .then((res) => {
          console.log(res.data);
          for (let i = 0; i < Object.keys(res.data).length; i++) {
            self.thirdParties.push(res.data[i]["walletAddress"]);
            self.active.push(res.data[i]["disabled"]);
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
  components: {
    NavDrawerVue,
  },
  created() {
    this.fetchData();
  },
};
</script>
