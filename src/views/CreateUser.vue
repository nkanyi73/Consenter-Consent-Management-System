<template>
  <v-container>
    <NavDrawer />
    <v-sheet id="sheet">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <validation-provider
            v-slot="{ errors }"
            name="Name"
            rules="required|max:10"
          >
            <v-text-field
              v-model="name"
              :counter="10"
              :error-messages="errors"
              label="Name"
              required
            >
            </v-text-field>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="dob" rules="required">
            <v-text-field
              v-model="dob"
              :error-messages="errors"
              label="Date of Birth"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
              v-slot="{ errors }"
              name="Email"
              rules="required|email"
            >
              <v-text-field
                v-model="email"
                :error-messages="errors"
                label="User E-mail"
                required
              ></v-text-field>
            </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="nationality"
            rules="required"
          >
            <v-text-field
              v-model="nationality"
              :error-messages="errors"
              label="Nationality"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="affiliation"
            rules="required"
          >
            <v-text-field
              v-model="affiliation"
              :error-messages="errors"
              label="Affiliation"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="subject"
            rules="required"
          >
            <v-text-field
              v-model="subject"
              :error-messages="errors"
              label="Subject's Address"
              required
            ></v-text-field>
          </validation-provider>

          <v-btn class="mr-4" type="submit" :disabled="invalid"> submit </v-btn>
          <v-btn @click="clear"> clear </v-btn>
        </form>
      </validation-observer>
    </v-sheet>
  </v-container>
</template>

<script>
/* eslint-disable */
import { required, email} from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
import { useConnectStore } from "../store/index";
import NavDrawer from "@/components/NavDrawer.vue";
const Web3 = require("web3/dist/web3.min.js");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://goerli.infura.io/v3/2c79500c736344aaab707050d476516d"
  )
);
import InitialContractBuild from "../artifacts/contracts/InitializeContract.sol/InitializeContract.json";

//  import { getAuth } from '@firebase/auth';
// eslint-disable-next-line
import { db } from "../firebase";
import firebase from "firebase/compat/app";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import router from "@/router";
import axios from "axios";
import { async } from "@firebase/util";
//  import { getAuth } from 'firebase/auth'
//  import  firebase  from 'firebase/compat/app';
//  import 'firebase/compat/auth';
//  import 'firebase/compat/firestore';
let transactionHash;
let adminContractAddress;
let userContractAddress;
import { NODE_API_URL } from '../../config/dev.env'

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});
extend("email", {
  ...email,
  message: "Email must be valid",
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    NavDrawer,
  },
  data: () => ({
    name: "",
    dob: "",
    email: "",
    affiliation: "",
    nationality: "",
    subject: "",
  }),
  methods: {
    async submit() {
      const connectStore = useConnectStore();
      connectStore.loading = true;
      try {
        const response = await axios.get(
          `${NODE_API_URL}/users/${localStorage.uuid}`
        );
        adminContractAddress = response.data.contractAddress;
      } catch (error) {
        alert(error.message);
      }
      const context = this

      const names = web3.utils.asciiToHex(this.name);
      const email = this.email;
      const birth = web3.utils.asciiToHex(this.dob);
      const nation = web3.utils.asciiToHex(this.nationality);
      const address = this.subject;
      const affiliate = this.affiliation;

      const encodedParameters = web3.eth.abi
        .encodeParameters(
          ["bytes32", "bytes32", "bytes32", "address", "address"],
          [names, birth, nation, affiliate, address]
        )
        .slice(2);
      const bytecodeWithEncodedParameters =
        InitialContractBuild.bytecode + encodedParameters;
      try {
        const { ethereum } = window;

        window.contract = new web3.eth.Contract(InitialContractBuild.abi);
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
            transactionHash = result;
          });
      } catch (error) {
        connectStore.loading = false;
        alert(error.message);
      }
      setTimeout(function () {
        window.ethereum
          .request({
            method: "eth_getTransactionReceipt",
            params: [transactionHash],
          })
          .then(async (res) => {
            userContractAddress = res["contractAddress"];
            console.log(affiliate)
            console.log(context.affiliation)
            const response = await axios.post(
              `${NODE_API_URL}/register`,
              {
                username: web3.utils.hexToAscii(names),
                role_id: 2,
                email: email,
                password: "password",
                walletAddress: address,
                contractAddress: userContractAddress,
                affiliation: affiliate
              }
            );
            // console.log(contractAddress)
            // console.log(userContractAddress)
            const functionBytecode = web3.eth.abi.encodeFunctionCall(
              {
                name: "setUserCounter",
                type: "function",
                inputs: [
                  {
                    type: "address",
                    name: "_contract",
                  },
                  {
                    type: "address",
                    name: " _user",
                  },
                ],
              },
              [userContractAddress, address]
            );
            window.ethereum
              .request({
                method: "eth_sendTransaction",
                params: [
                  {
                    from: window.ethereum.selectedAddress,
                    to: adminContractAddress,
                    data: functionBytecode,
                  },
                ],
              })
              .then(() => {
                connectStore.loading = false;
                alert("Contract Successfully Deployed");
                router.push("dashboard");
              })
              .catch((error) => {
                connectStore.loading = false;
                alert(error.message);
              });
          })
          .catch((error) => {
            alert(error.message);
          });
      }, 35000);
    },
    clear() {
      (this.name = ""),
        (this.dob = ""),
        (this.affiliation = ""),
        (this.email = ""),
        (this.nationality = ""),
        (this.subject = ""),
        this.$refs.observer.reset();
    },
  },

  //   setup() {
  //     const submit = async () => {
  //       connectStore.loading = true;
  //       firebase.auth().onAuthStateChanged((user) => {
  //         if (user) {
  //           // User logged in already or has just logged in.
  //           const userID = user.uid;
  //           const docRef = doc(db, "users", userID);
  //           getDoc(docRef).then((docSnap) => {
  //             adminContractAddress = docSnap.data().contractAddress;
  //           });
  //         }
  //       });

  //       const names = web3.utils.asciiToHex(this.name);
  //       const birth = web3.utils.asciiToHex(this.dob);
  //       const nation = web3.utils.asciiToHex(this.nationality);
  //       const address = this.subject;
  //       const affiliate = this.affiliation;
  //       // let dataParam = web3.eth.abi.encodeFunctionSignature(`(${names}, ${dob}, ${nationality})`)
  //       const encodedParameters = web3.eth.abi
  //         .encodeParameters(
  //           ["bytes32", "bytes32", "bytes32", "address", "address"],
  //           [names, birth, nation, affiliate, address]
  //         )
  //         .slice(2);
  //       const bytecodeWithEncodedParameters =
  //         InitialContractBuild.bytecode + encodedParameters;
  //       try {
  //         const { ethereum } = window;
  //         // console.log("hi")
  //         window.contract = new web3.eth.Contract(InitialContractBuild.abi);
  //         const parameters = {
  //           from: window.ethereum.selectedAddress,
  //           gas: 0, // 30400
  //           gasPrice: 0, // 10000000000000
  //           data: bytecodeWithEncodedParameters,
  //         };

  //         // contract = contract.deploy({data: bytecode})
  //         ethereum
  //           .request({
  //             method: "eth_sendTransaction",
  //             params: [parameters],
  //           })
  //           .then((result) => {
  //             transactionHash = result;
  //           });
  //       } catch (error) {
  //         connectStore.loading = false;
  //         alert(error.message);
  //       }

  //       // await connectStore.deployInitialContract(data.name, data.dob, data.affiliation,
  //       // data.subject, data.nationality).then(() => {
  //       //     console.log("res")
  //       //     console.log(connectStore.transactionHash)
  //       //     // alert("Contract Successfully deployed")
  //       // }).catch((error) => {
  //       //     // console.log(error)
  //       //     alert(error.message)
  //       // })

  //       // const docRef = await getDoc( doc(db, "users", getAuth().currentUser.uid))
  //       // console.log(docRef)
  //       setTimeout(function () {
  //         window.ethereum
  //           .request({
  //             method: "eth_getTransactionReceipt",
  //             params: [transactionHash],
  //           })
  //           .then((res) => {
  //             userContractAddress = res["contractAddress"];
  //             setDoc(doc(db, "contracts", data.affiliation), {
  //               [data.subject]: userContractAddress,
  //             });
  //             // console.log(contractAddress)
  //             const functionBytecode = web3.eth.abi.encodeFunctionCall(
  //               {
  //                 name: "setUserCounter",
  //                 type: "function",
  //                 inputs: [
  //                   {
  //                     type: "address",
  //                     name: "_contract",
  //                   },
  //                   {
  //                     type: "address",
  //                     name: " _user",
  //                   },
  //                 ],
  //               },
  //               [userContractAddress, address]
  //             );
  //             window.ethereum
  //               .request({
  //                 method: "eth_sendTransaction",
  //                 params: [
  //                   {
  //                     from: window.ethereum.selectedAddress,
  //                     to: adminContractAddress,
  //                     data: functionBytecode,
  //                   },
  //                 ],
  //               })
  //               .then(() => {
  //                 connectStore.loading = false;
  //                 alert("Contract Successfully Deployed");
  //                 router.push("dashboard");
  //               })
  //               .catch((error) => {
  //                 connectStore.loading = false;
  //                 alert(error.message);
  //               });
  //           })
  //           .catch((error) => {
  //             alert(error.message);
  //           });
  //       }, 30000);
  //     };
  //     return {
  //       connectStore,
  //       submit,
  //     };
  //   },
  created() {},
};
</script>
