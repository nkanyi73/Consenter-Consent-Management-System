<template>
  <v-container>
    <v-card>
      <v-toolbar color="#1F8A60" dark flat prominent>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>Pending Requests</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn to="manageAccess" class="ma-1" color="white" plain>
          Viewed Requests
        </v-btn>
        <v-btn to="profile" class="ma-1" color="white" plain> Profile </v-btn>

        <v-btn icon @click.native="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container fluid>
        <v-row dense>
          <v-col
            v-for="(requester, index) in requesters"
            :key="requester"
            :cols="12"
          >
            <v-card>
              <v-card-title
                >User at Address &lt; {{ requester }} &gt; of Company {{ usernames[index] }}
              </v-card-title>
              <v-card-text
                >is requesting for your {{ category[index] }}</v-card-text
              >
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-btn
                  elevation="5"
                  @click="
                    grantAccess(
                      requester,
                      category_ids[index],
                      notification_ids[index]
                    )
                  "
                  >Grant</v-btn
                >
                <v-btn elevation="5" @click="deny(notification_ids[index])"
                  >Deny</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
/* eslint-disable */
import router from "@/router";
import axios from "axios";
const Web3 = require("web3/dist/web3.min.js");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://goerli.infura.io/v3/2c79500c736344aaab707050d476516d"
  )
);
import { NODE_API_URL } from "../../config/dev.env";
export default {
  data: () => ({
    requesters: "",
    purpose: "",
    date: "",
    category: [],
    usernames: [],
    category_ids: [],
    notification_ids: [],
  }),
  methods: {
    fetchNotificationData() {
      setTimeout(async () => {
        const formattedAddress = web3.utils.toChecksumAddress(
          window.ethereum.selectedAddress
        );
        const notifications = await axios.get(
          `${NODE_API_URL}/notifications?to=${formattedAddress}&status=Pending`
        );
        for (let i = 0; i < Object.keys(notifications.data).length; i++) {
          this.usernames.push(notifications.data[i]["User"]["username"]);
          this.category.push(notifications.data[i]["Category"]["name"]);
          this.category_ids.push(notifications.data[i]["Category"]["id"]);
        }

        this.requesters = notifications.data.map(({ from }) => from);
        this.notification_ids = notifications.data.map(({ id }) => id);
      }, 1000);
    },
    async grantAccess(requester, category_id, notification_id) {
      const response = await axios.get(
        `${NODE_API_URL}/users?walletAddress=${window.ethereum.selectedAddress}`
      );
      const contractAddress = response.data.contractAddress;
      var functionBytecode;
      if (category_id == 1) {
        functionBytecode = web3.eth.abi.encodeFunctionCall(
          {
            name: "grant",
            type: "function",
            inputs: [
              {
                type: "address",
                name: "_requester",
              },
              {
                type: "uint16",
                name: "_data",
              },
            ],
          },
          [requester, 1]
        );
      } else if (category_id == 2) {
        functionBytecode = web3.eth.abi.encodeFunctionCall(
          {
            name: "grant",
            type: "function",
            inputs: [
              {
                type: "address",
                name: "_requester",
              },
              {
                type: "uint16",
                name: "_data",
              },
            ],
          },
          [requester, 4]
        );
      } else if (category_id == 3) {
        functionBytecode = web3.eth.abi.encodeFunctionCall(
          {
            name: "grant",
            type: "function",
            inputs: [
              {
                type: "address",
                name: "_requester",
              },
              {
                type: "uint16",
                name: "_data",
              },
            ],
          },
          [requester, 2]
        );
      } else {
        functionBytecode = web3.eth.abi.encodeFunctionCall(
          {
            name: "grant",
            type: "function",
            inputs: [
              {
                type: "address",
                name: "_requester",
              },
              {
                type: "uint16",
                name: "_data",
              },
            ],
          },
          [requester, 8]
        );
      }
      const parameters = {
        from: window.ethereum.selectedAddress,
        to: contractAddress,
        data: functionBytecode,
      };
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [parameters],
        })
        .then(async (res) => {
          const response = await axios.put(
            `${NODE_API_URL}/notifications/${notification_id}`,
            {
              status: "Accepted",
            }
          );
          alert("Operation Successful");
          window.location.reload();
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    async deny(notification_id) {
      try {
        const response = await axios.put(
          `${NODE_API_URL}/notifications/${notification_id}`,
          {
            status: "Rejected",
          }
        );
        window.location.reload();
        alert("Your operation is successful");
      } catch (error) {
        alert(error.message);
      }
    },
    logout() {
      localStorage.uuid = null;
      localStorage.role = null;
      router.push("/login");
    },
  },
  mounted() {
    this.fetchNotificationData();
  },
};
</script>
