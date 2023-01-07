<template>
  <v-container>
    <v-card>
      <v-container fluid>
        <v-row dense>
          <v-col
            v-for="(requester, index) in requesters"
            :key="requester"
            :cols="12"
          >
            <v-card>
              <v-card-title
                >User at Address &lt; {{ requester }} &gt;
              </v-card-title>
              <v-card-text
                >requested for your {{ category[index] }}</v-card-text
              >
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-btn
                  elevation="5"
                  @click="grantAccess(requester, category_ids[index])"
                  >Grant</v-btn
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
import { NODE_API_URL } from "../../config/dev.env";
import router from "@/router";
import axios from "axios";
const Web3 = require("web3/dist/web3.min.js");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://goerli.infura.io/v3/2c79500c736344aaab707050d476516d"
  )
);
export default {
  data: () => ({
    requesters: "",
    purpose: "",
    date: "",
    category: [],
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
          `${NODE_API_URL}/notifications?to=${formattedAddress}&status=Rejected`
        );
        for (let i = 0; i < Object.keys(notifications.data).length; i++) {
          this.category.push(notifications.data[i]["Category"]["name"]);
          this.category_ids.push(notifications.data[i]["Category"]["id"]);
        }

        this.requesters = notifications.data.map(({ from }) => from);
        this.notification_ids = notifications.data.map(({ id }) => id);
      }, 1000);
    },
    async grantAccess(requester, category_id) {
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
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
  mounted() {
    this.fetchNotificationData();
  },
};
</script>
