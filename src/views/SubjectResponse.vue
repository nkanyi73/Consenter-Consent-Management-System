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

      <v-toolbar-title>My Home</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container fluid>
      <v-row dense>
        <v-col
          v-for="(address) in addresses"
          :key="address"
          :cols=12
        >
          <v-card>
            <v-card-title>User at Address &lt; {{ address }} &gt; </v-card-title>
            <v-card-text>Click one of these buttons to view information</v-card-text>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  </v-container>
</template>

<!-- <script>
    import { db } from '../firebase'
    export default {
        data: () => ({
            from: '',
            purpose: '',
            date: ''          
        }),
        methods: {
            fetchNotificationData() {
                db.collection('notifications')
                .doc(window.ethereum.selectedAddress)
                .get()
                .then(snapshot => {
                    const document  = snapshot.data()
                    console.log(document)
                })
            },
            grantAccess () {
                const functionBytecode = web3.eth.encodeFunctionCall({
                    name: 'grant',
                    type: 'function',
                    inputs: [{
                        type: 'address',
                        name: '_requester'
                    }, 
                    {
                        type: 'uint16',
                        name: '_data'
                    }]
                }) 
            }
        },
        created () {
            this.fetchNotificationData()
        },
    }
</script> -->