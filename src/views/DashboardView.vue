<template>
  <v-app>
    <NavDrawerVue />
    <v-container>
      <v-toolbar flat>
        <span
          style="text-transform: capitalize; font-size: 16pt; font-weight: 1"
          >Hi There,</span
        >
        <v-spacer></v-spacer>

        <v-btn class="ma-2" @click="deployContract()">Deploy Contract</v-btn>
        <v-btn class="ma-2" @click="logout">Log Out</v-btn>

        <!-- <button @click="getAccount">Connect Wallet</button> -->
      </v-toolbar>
      <v-toolbar flat large class="font-weight-thin">
        <v-toolbar-title>Your Dashboard</v-toolbar-title>
      </v-toolbar>
      <v-item-group class="mt-4">
        <v-container>
          <v-row justify="space-between" class="space">
            <v-col cols="12" md="2">
              <v-item v-slot="{ active, toggle }">
                <v-card
                  :color="active ? '#1F8A60' : 'white'"
                  class="d-flex align-center rounded-xl"
                  dark
                  height="200"
                  @click="toggle"
                  width="500"
                >
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-list-item three-line class="mt-10">
                        <v-list-item-content>
                          <div class="mb-4">
                            <v-icon
                              x-large
                              :color="active ? 'white' : '#1F8A60'"
                            >
                              mdi-account-group-outline
                            </v-icon>
                            <v-list-item-subtitle
                              :class="active ? 'white--text' : 'black--text'"
                            >
                              Number of Requests
                            </v-list-item-subtitle>
                            <v-list-item-title
                              class="headline mb-1"
                              :class="active ? 'white--text' : 'black--text'"
                              >{{ noOfRequests }}
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
              <v-item v-slot="{ active, toggle }">
                <v-card
                  :color="active ? '#1F8A60' : 'white'"
                  class="d-flex align-center rounded-xl"
                  dark
                  height="200"
                  @click="toggle"
                >
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-list-item three-line class="mt-10">
                        <v-list-item-content>
                          <div class="mb-4">
                            <v-icon
                              x-large
                              :color="active ? 'white' : '#1F8A60'"
                            >
                              mdi-account-group-outline
                            </v-icon>
                            <v-list-item-subtitle
                              :class="active ? 'white--text' : 'black--text'"
                            >
                              Number of Data Subjects
                            </v-list-item-subtitle>
                            <v-list-item-title
                              class="headline mb-1"
                              :class="active ? 'white--text' : 'black--text'"
                              >{{ noOfSubjects }}
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
              <v-item v-slot="{ active, toggle }">
                <v-card
                  :color="active ? '#1F8A60' : 'white'"
                  class="d-flex align-center rounded-xl"
                  dark
                  height="200"
                  @click="toggle"
                >
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-list-item three-line class="mt-10">
                        <v-list-item-content>
                          <div class="mb-4">
                            <v-icon
                              x-large
                              :color="active ? 'white' : '#1F8A60'"
                            >
                              mdi-account-group-outline
                            </v-icon>
                            <v-list-item-subtitle
                              :class="active ? 'white--text' : 'black--text'"
                            >
                              Number of Third Parties
                            </v-list-item-subtitle>
                            <v-list-item-title
                              class="headline mb-1"
                              :class="active ? 'white--text' : 'black--text'"
                              >{{ noOf3rdParties }}
                            </v-list-item-title>
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-card>
              </v-item>
            </v-col>
            <!-- <v-col cols="12" md="2">
              <v-item v-slot="{ active, toggle }">
                <v-card
                  :color="active ? '#1F8A60' : 'white'"
                  class="d-flex align-center rounded-xl"
                  dark
                  height="200"
                  @click="toggle"
                  width="500"
                >
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-list-item three-line class="mt-10">
                        <v-list-item-content>
                          <div class="mb-4">
                            <v-icon
                              x-large
                              :color="active ? 'white' : '#1F8A60'"
                            >
                              mdi-account-group-outline
                            </v-icon>
                            <v-list-item-subtitle
                              :class="active ? 'white--text' : 'black--text'"
                            >
                              Number of users
                            </v-list-item-subtitle>
                            <v-list-item-title
                              class="headline mb-1"
                              :class="active ? 'white--text' : 'black--text'"
                              >30
                            </v-list-item-title>
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-card>
              </v-item>
            </v-col> -->
          </v-row>
        </v-container>
      </v-item-group>
    </v-container>
  </v-app>
</template>

<script>
/* eslint-disable */
import NavDrawerVue from "@/components/NavDrawer.vue";
import axios from "axios";
import { useConnectStore } from "../store/index";
import router from "@/router";
import TransactionContractBuild from "../artifacts/contracts/Transaction.sol/Transaction.json";
import InitialContractBuild from "../artifacts/contracts/InitializeContract.sol/InitializeContract.json";
const Web3 = require("web3/dist/web3.min.js");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://goerli.infura.io/v3/2c79500c736344aaab707050d476516d"
  )
);
import { NODE_API_URL } from "../../config/dev.env";

export default {
  data: () => ({
    noOfSubjects: "",
    noOf3rdParties: "",
    noOfRequests: "",
  }),
  created() {
    this.getSpecificUsers();
  },
  methods: {
    deployContract() {
      const connectStore = useConnectStore();
      connectStore.loading = true;
      try {
        const { ethereum } = window;
        const names = web3.utils.asciiToHex("Strathmore University");
        const encodedParameters = web3.eth.abi
          .encodeParameters(["bytes32"], [names])
          .slice(2);
        const bytecodeWithEncodedParameters =
          TransactionContractBuild.bytecode + encodedParameters;
        window.contract = new web3.eth.Contract(TransactionContractBuild.abi);
        const parameters = {
          from: window.ethereum.selectedAddress,
          gas: 0, // 30400
          gasPrice: 0, // 10000000000000
          data: bytecodeWithEncodedParameters,
        };
        ethereum
          .request({
            method: "eth_sendTransaction",
            params: [parameters],
          })
          .then((result) => {
            setTimeout(function () {
              ethereum
                .request({
                  method: "eth_getTransactionReceipt",
                  params: [result],
                })
                .then(async (res) => {
                  const result = await axios.put(
                    `${NODE_API_URL}/users/${localStorage.uuid}`,
                    {
                      contractAddress: res.contractAddress,
                    }
                  );
                  connectStore.loading = false;
                  alert("Contract Successfully Deployed");
                });
            }, 30000);
          });
      } catch (error) {
        connectStore.loading = false;
        alert("An error occurred")
        console.log(error);
      }
    },
    async getSpecificUsers() {
      const noOfSubjects = await axios.get(`${NODE_API_URL}/users?role_id=2`);
      this.noOfSubjects = noOfSubjects.data["users"].length;
      const noOf3rdParties = await axios.get(`${NODE_API_URL}/users?role_id=3`);
      this.noOf3rdParties = noOf3rdParties.data["users"].length;
      // const noOfTransactions = await axios.get(`${NODE_API_URL}/notifications`);
      // this.noOfRequests = noOfTransactions.data;
    },
    logout() {
      localStorage.uuid = null;
      localStorage.role = null;
      router.push("/login");
    },
  },
  components: {
    NavDrawerVue,
  },
  //   setup() {
  //     console.log(localStorage.uuid);
  //     const connectStore = useConnectStore();
  //     window.stores = { connectStore };
  //     const logOut = () => {
  //       signOut(getAuth()).then(() => {
  //         router.push("/login");
  //       });
  //     };
  //     return {
  //       connectStore,
  //       logOut,
  //     };
  //   },

  //   components: { NavDrawerVue },
};
</script>

<style>
.v-container {
  background-color: #1f8a60 !important;
}
</style>
