<template>
    <v-container>
  <v-card>

    <v-toolbar
      color="#1F8A60"
      dark
      flat 
      prominent
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Notifications</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container fluid>
      <v-row dense>
        <v-col
          v-for="(address, index) in addresses"
          :key="address"
          :cols=12
        >
          <v-card>
            <v-card-title>User at Address &lt; {{ address }} &gt; </v-card-title>
            <v-card-text>Click one of these buttons to view information</v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                elevation="5"
                @click = "fetchPersonalInfo(address, contract_addresses[index])"
              >Personal Information</v-btn>

              <v-btn
                elevation="5"
              >Education Information</v-btn>

              <v-btn
                elevation="5"
              >Contact Information</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  </v-container>
</template>

<script>
  import { db } from '../firebase'
  const Web3 = require('web3/dist/web3.min.js')
  const web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/2c79500c736344aaab707050d476516d'))

  export default {
    data: () => ({
      cards: [
        { title: 'Address 1'},
        { title: 'Address 2'},
        { title: 'Address 3'},
      ],

      addresses : '',
      contract_addresses: ''
    }),
    created () {
      this.fetchData()
    },
    methods: {
      fetchData () {
        db.collection('contracts')
          .doc("0x0A5d73ca6E990A316b752FE7003B8b38caD2898d")
          .get()
          .then(snapshot => {
            const document = snapshot.data()
            var addressArray = []
            var contractsArray = []
            for (let key in document) {
              addressArray.push(key)
              contractsArray.push(document[key])
              
              this.addresses = addressArray
              this.contract_addresses = contractsArray

            }
        })
      },
      fetchPersonalInfo(contractAddress, address) {
        const functionBytecode = web3.eth.abi.encodeFunctionCall({
          name: 'personalInfoProcessors',
          type: 'function',
          inputs: [{
            type: 'address',
          }]
        }, [window.ethereum.selectedAddress])
        const parameters = {
          from: window.ethereum.selectedAddress,
          to: contractAddress,
          data: functionBytecode

        }
        window.ethereum.request({
          method: 'eth_call',
          params: [parameters]
        }).then((res) => {
          if (res == 'false') {
            db.collection("notifications")
            .doc(address)
            .add({
              from: window.ethereum.selectedAddress,
              status: 'pending',
              seq_no: '1',
              data: 'Personal Information',
              time: Date.now()
            })
            .then(() => {
              alert("You are not authorized to view this content. A request has been made for you.")
            })
            
          }
          else {
            console.log(res)
          }
        })
      },
      fetchContactInfo(contractAddress, address) {
        const functionBytecode = web3.eth.abi.encodeFunctionCall({
          name: 'contactInfoProcessors',
          type: 'function',
          inputs: [{
            type: 'address',
          }]
        }, [window.ethereum.selectedAddress])
        const parameters = {
          from: window.ethereum.selectedAddress,
          to: contractAddress,
          data: functionBytecode

        }
        window.ethereum.request({
          method: 'eth_call',
          params: [parameters]
        }).then((res) => {
          if (res == 'false') {
            db.collection("notifications")
            .doc(address)
            .add({
              from: window.ethereum.selectedAddress,
              status: 'pending',
              seq_no: '2',
              data: 'Contact Information',
              time: Date.now()
            })
            .then(() => {
              alert("You are not authorized to view this content. A request has been made for you.")
            })
          }
          else {
            console.log(res)
          }
        })
      },
      fetchEducationInfo(contractAddress, address) {
        const functionBytecode = web3.eth.abi.encodeFunctionCall({
          name: 'educationInfoProcessors',
          type: 'function',
          inputs: [{
            type: 'address',
          }]
        }, [window.ethereum.selectedAddress])
        const parameters = {
          from: window.ethereum.selectedAddress,
          to: contractAddress,
          data: functionBytecode

        }
        window.ethereum.request({
          method: 'eth_call',
          params: [parameters]
        }).then((res) => {
          if (res == 'false') {
            db.collection("notifications")
            .doc(address)
            .add({
              from: window.ethereum.selectedAddress,
              status: 'pending',
              seq_no: '4',
              data: 'Education Information',
              time: Date.now(),
            })
            .then(() => {
              alert("You are not authorized to view this content. A request has been made for you.")
            })
          }
          else {
            console.log(res)
          }
        })
      }
    }
  }
</script>