<template>
  <v-container>
    <v-card>
      <v-toolbar color="#1F8A60" dark flat prominent>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>Request for Information</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click.native="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container fluid>
        <v-row dense>
          <v-col v-for="(subject, index) in subjects" :key="subject" :cols="12">
            <v-card>
              <v-card-title
                >User at Address &lt; {{ subject }} &gt;
              </v-card-title>
              <v-card-text
                >Click one of these buttons to view information</v-card-text
              >

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  elevation="5"
                  @click="fetchPersonalInfo(contractAddresses[index], subject)"
                  >Personal Information</v-btn
                >

                <v-btn
                  elevation="5"
                  @click="fetchContactInfo(contractAddresses[index], subject)"
                  >Contact Information</v-btn
                >

                <v-btn
                  elevation="5"
                  @click="fetchEducationInfo(contractAddresses[index], subject)"
                  >Education Information</v-btn
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
import { setDoc, doc, Timestamp } from "@firebase/firestore";
import axios from "axios";
import { db } from "../firebase";
import router from "@/router";
const Web3 = require("web3/dist/web3.min.js");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://goerli.infura.io/v3/2c79500c736344aaab707050d476516d"
  )
);
import { NODE_API_URL } from "../../config/dev.env";

export default {
  data: () => ({
    subjects: "",
    contractAddresses: "",
  }),
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      var self = this;
      await axios
        .get(`${NODE_API_URL}/users?role_id=2`)
        .then((res) => {
          self.subjects = res.data["users"].map(
            ({ walletAddress }) => walletAddress
          );
          self.contractAddresses = res.data["users"].map(
            ({ contractAddress }) => contractAddress
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchPersonalInfo(contractAddress, address) {
      const functionBytecode = web3.eth.abi.encodeFunctionCall(
        {
          name: "getPersonalInfo",
          type: "function",
          inputs: [
            {
              type: "address",
              name: "_address",
            },
          ],
        },
        [window.ethereum.selectedAddress]
      );
      const parameters = {
        from: window.ethereum.selectedAddress,
        to: contractAddress,
        data: functionBytecode,
      };
      window.ethereum
        .request({
          method: "eth_call",
          params: [parameters, "latest"],
        })
        .then(async (res) => {
          const decoded = web3.eth.abi.decodeParameters(
            ["bytes32", "bytes32", "bytes32", "address"],
            res
          );
          const name = web3.utils.hexToUtf8(decoded[0]);
          const dob = web3.utils.hexToUtf8(decoded[1]);
          const nationality = web3.utils.hexToUtf8(decoded[2]);
          alert(
            `Name: ${name} \nDate of birth: ${dob} \nNationality: ${nationality}`
          );
        })
        .catch(async (error) => {
          const response = await axios.post(`${NODE_API_URL}/notifications`, {
            status: "Pending",
            from: window.ethereum.selectedAddress,
            to: address,
            category_id: 1,
          });
          alert(error.message);
        });
    },
    fetchContactInfo(contractAddress, address) {
      const functionBytecode = web3.eth.abi.encodeFunctionCall(
        {
          name: "getContact",
          type: "function",
          inputs: [
            {
              type: "address",
              name: "_address",
            },
          ],
        },
        [window.ethereum.selectedAddress]
      );
      const parameters = {
        from: window.ethereum.selectedAddress,
        to: contractAddress,
        data: functionBytecode,
      };
      window.ethereum
        .request({
          method: "eth_call",
          params: [parameters, "latest"],
        })
        .then(async (res) => {
          const decoded = web3.eth.abi.decodeParameters(
            ["bytes32", "bytes32", "bytes32", "bytes32"],
            res
          );
          const phone = web3.utils.hexToUtf8(decoded[0]);
          const mailingAddress = web3.utils.hexToUtf8(decoded[1]);
          const city = web3.utils.hexToUtf8(decoded[2]);
          const country = web3.utils.hexToUtf8(decoded[3]);
          alert(
            `Phone Number: ${phone} \nMailing Address: ${mailingAddress} \nCity: ${city}\nCountry: ${country}`
          );
        })
        .catch(async (err) => {
          const response = await axios.post(`${NODE_API_URL}/notifications`, {
            status: "Pending",
            from: window.ethereum.selectedAddress,
            to: address,
            category_id: 3,
          });
          alert(err.message);
        });
    },
    fetchEducationInfo(contractAddress, address) {
      const functionBytecode = web3.eth.abi.encodeFunctionCall(
        {
          name: "getEducation",
          type: "function",
          inputs: [
            {
              type: "address",
              name: "_requester",
            },
          ],
        },
        [window.ethereum.selectedAddress]
      );
      
      const parameters = {
        from: window.ethereum.selectedAddress,
        to: contractAddress,
        data: functionBytecode,
      };
      window.ethereum
        .request({
          method: "eth_call",
          params: [parameters, "latest"],
        })
        .then((res) => {
          const decoded = web3.eth.abi.decodeParameters(
            ["bytes32", "bytes32", "bytes2", "bytes32", "uint256", "uint8"],
            res
          );
          const universityName = web3.utils.hexToUtf8(decoded[0]);
          const highSchoolName = web3.utils.hexToUtf8(decoded[1]);
          const highSchoolGrade = web3.utils.hexToUtf8(decoded[2]);
          const gpa = web3.utils.hexToUtf8(decoded[3]);
          const noOfRetakes = decoded[4];
          const noOfPendingUnits = decoded[5];
          alert(
            `University Name: ${universityName} \nHigh School Name: ${highSchoolName}\nHigh School Grade: ${highSchoolGrade}\nGPA: ${gpa}\nNumber of Retakes: ${noOfRetakes}\nNumber of Pending Units: ${noOfPendingUnits}`
          );
        })
        .catch(async (error) => {
          const response = await axios.post(`${NODE_API_URL}/notifications`, {
            status: "Pending",
            from: window.ethereum.selectedAddress,
            to: address,
            category_id: 2,
          });
          alert(error.message);
        });
    },
    logout() {
      localStorage.uuid = null;
      localStorage.role = null;
      router.push("/login");
    },
  },
};
</script>
