<template>
  <v-app>
    <NavDrawerVue />
    <v-container>
      <v-toolbar flat>
        <span style="text-transform: capitalize; font-size:16pt; font-weight:1;">Hi There,</span>

        <v-btn  uppercase absolute right @click.native="logOut">Log Out</v-btn>

        <!-- <button @click="getAccount">Connect Wallet</button> -->
      </v-toolbar>
      <v-toolbar flat large class="font-weight-thin">
        <v-toolbar-title>Your Dashboard</v-toolbar-title>
      </v-toolbar>
      <v-item-group class="mt-4">
        <v-container>
          <v-row justify="space-between" class="space">
            <v-col cols="12" md="2">
              <v-item v-slot="{active, toggle}">
                <v-card :color="active ? '#1F8A60' : 'white'" class="d-flex align-center rounded-xl" dark height="200"
                  @click="toggle" width="500">
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-list-item three-line class="mt-10">
                        <v-list-item-content>
                          <div class="mb-4">
                            <v-icon x-large :color="active ? 'white': '#1F8A60'">
                              mdi-account-group-outline
                            </v-icon>
                            <v-list-item-subtitle :class="active ? 'white--text': 'black--text'">
                              Number of users
                            </v-list-item-subtitle>
                            <v-list-item-title class="headline mb-1" :class="active ? 'white--text' : 'black--text'">30
                            </v-list-item-title>
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-card>
              </v-item>
            </v-col>
            <v-col cols="12" md="2">
              <v-item v-slot="{active, toggle}">
                <v-card :color="active ? '#1F8A60' : 'white'" class="d-flex align-center rounded-xl" dark height="200"
                  @click="toggle">
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-list-item three-line class="mt-10">
                        <v-list-item-content>
                          <div class="mb-4">
                            <v-icon x-large :color="active ? 'white': '#1F8A60'">
                              mdi-account-group-outline
                            </v-icon>
                            <v-list-item-subtitle :class="active ? 'white--text': 'black--text'">
                              Number of users
                            </v-list-item-subtitle>
                            <v-list-item-title class="headline mb-1" :class="active ? 'white--text' : 'black--text'">30
                            </v-list-item-title>
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-card>
              </v-item>
            </v-col>
            <v-col cols="12" md="2">
              <v-item v-slot="{active, toggle}">
                <v-card :color="active ? '#1F8A60' : 'white'" class="d-flex align-center rounded-xl" dark height="200"
                  @click="toggle">
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-list-item three-line class="mt-10">
                        <v-list-item-content>
                          <div class="mb-4">
                            <v-icon x-large :color="active ? 'white': '#1F8A60'">
                              mdi-account-group-outline
                            </v-icon>
                            <v-list-item-subtitle :class="active ? 'white--text': 'black--text'">
                              Number of users
                            </v-list-item-subtitle>
                            <v-list-item-title class="headline mb-1" :class="active ? 'white--text' : 'black--text'">30
                            </v-list-item-title>
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-card>
              </v-item>
            </v-col>
            <v-col cols="12" md="2">
              <v-item v-slot="{active, toggle}">
                <v-card :color="active ? '#1F8A60' : 'white'" class="d-flex align-center rounded-xl" dark height="200"
                  @click="toggle" width="500">
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-list-item three-line class="mt-10">
                        <v-list-item-content>
                          <div class="mb-4">
                            <v-icon x-large :color="active ? 'white': '#1F8A60'">
                              mdi-account-group-outline
                            </v-icon>
                            <v-list-item-subtitle :class="active ? 'white--text': 'black--text'">
                              Number of users
                            </v-list-item-subtitle>
                            <v-list-item-title class="headline mb-1" :class="active ? 'white--text' : 'black--text'">30
                            </v-list-item-title>
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-card>
              </v-item>
            </v-col>
          </v-row>

        </v-container>

      </v-item-group>
      <v-row>
        <v-col cols="2">
          <v-btn @click.native="connectStore.deployTransactionContract">Deploy Contract</v-btn>
          <v-btn @click.native="connectStore.deployInitialContract">Deploy User Contract</v-btn>
          <v-btn @click.native="connectStore.getPersonalDetails">Get Personal Details</v-btn>
          <v-btn @click.native="connectStore.setPersonalInfo">Set Personal Details</v-btn>
          <v-btn @click.native="connectStore.grant">Grant</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import NavDrawerVue from '@/components/NavDrawer.vue';
import { useConnectStore } from '../store/index'
import { defineComponent } from '@vue/composition-api';
import { signOut, getAuth } from '@firebase/auth';
import router from '@/router';





  export default defineComponent({
    setup() {
      const connectStore = useConnectStore()
      window.stores = {connectStore}
      const logOut = () => {
        signOut(getAuth()).then(() => {
          router.push('/login')
        })
      }
      return {
        connectStore,
        logOut
      };
      
    },
    
    components: {NavDrawerVue},
  });
  
</script>

<style>
   .v-container{ 
    background-color: #1F8A60 !important;
  }
</style>
