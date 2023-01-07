<template>
  <v-sheet id="sheet">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <validation-provider v-slot="{ errors }" name="phone" rules="required">
          <v-text-field
            v-model="phoneNumber"
            :counter="10"
            :error-messages="errors"
            label="Phone Number"
            required
          >
          </v-text-field>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="mailing"
          rules="required"
        >
          <v-text-field
            v-model="mailing"
            :error-messages="errors"
            label="Mailing Address"
            required
          ></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="city" rules="required">
          <v-text-field
            v-model="city"
            :error-messages="errors"
            label="City"
            required
          ></v-text-field>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="country"
          rules="required"
        >
          <v-text-field
            v-model="country"
            :error-messages="errors"
            label="Country"
            required
          ></v-text-field>
        </validation-provider>

        <v-btn class="mr-4" type="submit" :disabled="invalid"> submit </v-btn>
        <v-btn @click="clear"> clear </v-btn>
      </form>
    </validation-observer>
  </v-sheet>
</template>

<script>
/* eslint-disable */
import { required } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
import { useConnectStore } from "../store/index";
import axios from "axios";
const Web3 = require("web3/dist/web3.min.js");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://goerli.infura.io/v3/2c79500c736344aaab707050d476516d"
  )
);
import InitialContractBuild from "../artifacts/contracts/InitializeContract.sol/InitializeContract.json";
import router from "@/router";
let contractAddress;
let adminContractAddress;
import { NODE_API_URL } from "../../config/dev.env";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  setup: () => ({ connectStore: useConnectStore() }),
  data() {
    return {
      phoneNumber: "",
      mailing: "",
      city: "",
      country: "",
    };
  },
  created() {
    //do this before loading page
    this.getInitialValues();
  },
  methods: {
    submit() {
      this.connectStore.loading = true;
      window.contract = new web3.eth.Contract(
        InitialContractBuild.abi,
        contractAddress[0]
      );
      const phone_no = web3.utils.asciiToHex(this.phoneNumber);
      const mailingAddress = web3.utils.asciiToHex(this.mailing);
      const uCity = web3.utils.asciiToHex(this.city);
      const uCountry = web3.utils.asciiToHex(this.country);
      const functionHash = web3.eth.abi.encodeFunctionCall(
        {
          name: "setContact",
          type: "function",
          inputs: [
            {
              type: "bytes32",
              name: "_phoneNumber",
            },
            {
              type: "bytes32",
              name: "_mailingAddress",
            },
            {
              type: "bytes32",
              name: "_city",
            },
            {
              type: "bytes32",
              name: "_country",
            },
          ],
        },
        [phone_no, mailingAddress, uCity, uCountry]
      );
      const parameters = {
        from: window.ethereum.selectedAddress,
        to: contractAddress[0],
        data: functionHash,
      };
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [parameters],
        })
        .then(() => {
          alert("Successfully updated contact information");
          this.connectStore.loading = false;
          router.push("/myhome");
        })
        .catch((error) => {
          this.connectStore.loading = false;
          alert(error.message);
        });
    },
    async getInitialValues() {
      //retrieve user's contract address
      const functionBytecode = web3.eth.abi.encodeFunctionCall(
        {
          name: "getUser",
          type: "function",
          inputs: [
            {
              type: "address",
              name: "_user",
            },
          ],
        },
        [window.ethereum.selectedAddress]
      );
      //setting the parameters
      //using admin's contract address
      try {
        const response = await axios.get(
          `${NODE_API_URL}/users?uuid=${localStorage.uuid}`
        );
        const userAffiliation = response.data.affiliation;
        const adminAddress = await axios.get(
          `${NODE_API_URL}/users?walletAddress=${userAffiliation}`
        );
        adminContractAddress = adminAddress.data.contractAddress;
      } catch (error) {
        alert(error.message);
      }

      const parameters = {
        from: window.ethereum.selectedAddress,
        to: adminContractAddress,
        data: functionBytecode,
      };
      var self = this;

      //making the call;

      window.ethereum
        .request({
          method: "eth_call",
          params: [parameters, "latest"],
        })
        .then(async function (res) {
          contractAddress = web3.eth.abi.decodeParameters(["address"], res);
          window.contract = new web3.eth.Contract(
            InitialContractBuild.abi,
            contractAddress[0]
          );
          const senderAddress = window.ethereum.selectedAddress;
          const functionBytecode = web3.eth.abi.encodeFunctionCall(
            {
              name: "getContact",
              type: "function",
              inputs: [
                {
                  type: "address",
                  name: "_requester",
                },
              ],
            },
            [senderAddress]
          );
          const parameters = {
            from: window.ethereum.selectedAddress,
            to: contractAddress[0],
            data: functionBytecode,
          };
          window.ethereum
            .request({
              method: "eth_call",
              params: [parameters, "latest"],
            })
            .then((res) => {
              const decoded = web3.eth.abi.decodeParameters(
                ["bytes32", "bytes32", "bytes32", "bytes32"],
                res
              );
              self.phoneNumber = web3.utils.hexToUtf8(decoded[0]);
              self.mailing = web3.utils.hexToUtf8(decoded[1]);
              self.city = web3.utils.hexToUtf8(decoded[2]);
              self.country = web3.utils.hexToUtf8(decoded[3]);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    clear() {
      this.phoneNumber = "";
      this.mailing = "";
      this.city = "";
      this.country = "";
    },
  },
};
</script>
