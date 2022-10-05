<template>
    <v-sheet id="sheet">
        <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="submit">
                
                <validation-provider v-slot="{ errors }" name="Name" rules="required|max:10">
                    <v-text-field v-model="name" :counter="10" :error-messages="errors" label="Name" required>
                    </v-text-field>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="dob" rules="required">
                    <v-text-field v-model="dob" :error-messages="errors" label="Date of Birth" required></v-text-field>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="nationality" rules="required">
                    <v-text-field v-model="nationality" :error-messages="errors" label="Nationality" required></v-text-field>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="affiliation" rules="required">
                    <v-text-field v-model="affiliation" :readonly="true" :error-messages="errors" label="Affiliation" required></v-text-field>
                </validation-provider>

                <v-btn class="mr-4" type="submit" :disabled="invalid">
                    submit
                </v-btn>
                <v-btn @click="clear">
                    clear
                </v-btn>
            </form>
        </validation-observer>
    </v-sheet>
</template>

<script>
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate';
import { required,} from 'vee-validate/dist/rules';
import { useConnectStore } from '@/store/index'
const Web3 = require('web3/dist/web3.min.js')
const web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/2c79500c736344aaab707050d476516d'))
import InitialContractBuild from '../artifacts/contracts/InitializeContract.sol/InitializeContract.json'
import router from '@/router';
let contractAddress;



setInteractionMode('eager')
   
extend('required', {
    ...required,
    message: '{_field_} can not be empty',
})


    export default {
        setup: () => ({ connectStore: useConnectStore() }),
        components: {
            ValidationProvider,
            ValidationObserver,
        },
        data() {
            return {
                name: '',
                dob: '',
                nationality:'',
                affiliation: ''
            };
        },
        watch: {

        },
        created() {
        //do this before loading page
        this.initalizeValues()
        },
        mounted() {
        //do this after loading page
        },
        methods: {
            initalizeValues() {
                //retrieve user's contract address
                const functionBytecode = web3.eth.abi.encodeFunctionCall({
                    name: 'getUser',
                    type: 'function',
                    inputs: [{
                        type: 'address',
                        name: '_user'
                    }]
                    }, [window.ethereum.selectedAddress]);
                //setting the parameters
                //using admin's contract address
                const parameters = {
                    from: window.ethereum.selectedAddress,
                    to: '0x34297b57c2b2487f7daa5e0c079036829f59303f',
                    data: functionBytecode
                }
                var self = this
                
                //making the call;

                window.ethereum.request({
                    method: 'eth_call',
                    params: [parameters]
                    }).then(async function(res) {   
                        contractAddress = web3.eth.abi.decodeParameters(['address'], res)
                        window.contract = new web3.eth.Contract(InitialContractBuild.abi, contractAddress[0])
                        const senderAddress = window.ethereum.selectedAddress
                        const functionBytecode = web3.eth.abi.encodeFunctionCall({
                            name: 'getPersonalInfo',
                            type: 'function',
                            inputs: [{
                                type: 'address',
                                name: '_requester'
                            }]
                        }, [senderAddress]);
                    const parameters = {
                        from: window.ethereum.selectedAddress,
                        to: contractAddress[0],
                        data: functionBytecode
                    };
                    window.ethereum.request({
                        method: 'eth_call',
                        params: [parameters]
                    }).then((res) => {
                        const decoded = web3.eth.abi.decodeParameters(['bytes32', 'bytes32', 'bytes32', 'address'], res);
                        self.name = web3.utils.hexToUtf8(decoded[0]);
                        self.dob = web3.utils.hexToUtf8(decoded[1]);
                        self.nationality = web3.utils.hexToUtf8(decoded[2]);
                        self.affiliation = decoded[3];
                    }).catch((error) => {
                        console.log(error)
                    })
                    }).catch((error) => {
                    console.log(error)
                    })  
            },
            clear() {
                this.name = ''
                this.dob = ''
                this.nationality = ''
            },
            submit() {
                this.connectStore.loading = true;
                window.contract = new web3.eth.Contract(InitialContractBuild.abi, contractAddress[0]);
                const fname = web3.utils.asciiToHex(this.name);
                const userDob = web3.utils.asciiToHex(this.dob);
                const userNationality = web3.utils.asciiToHex(this.nationality);
                const userAffiliation = this.affiliation
                const functionHash = web3.eth.abi.encodeFunctionCall({
                name: 'setPersonalInfo',
                type: 'function',
                inputs: [{
                    type: 'bytes32',
                    name: '_name'
                },
                {
                    type: 'bytes32',
                    name: '_dob'
                },
                {
                    type: 'bytes32',
                    name: '_nationality'
                },
                {
                    type: 'address',
                    name: '_affiliation'
                }]
                }, [fname, userDob, userNationality, userAffiliation]);
                const parameters = {
                from: window.ethereum.selectedAddress,
                to: contractAddress[0],
                data: functionHash
                };
                window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [parameters]
                }).then(() => {
                alert("Successfully updated personal information")
                this.connectStore.loading = false;
                router.push('/dashboard')
                }).catch((error) => {
                this.connectStore.loading = false;
                alert(error.message)
                })
                
            }
        },
        computed: {

        }
    };
</script>


 <!-- <script>
     import { required,} from 'vee-validate/dist/rules'
     import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
     import { useConnectStore } from '../store/index'
     import InitialContractBuild from '../artifacts/contracts/InitializeContract.sol/InitializeContract.json'
     const Web3 = require('web3/dist/web3.min.js')
     const web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io/v3/2c79500c736344aaab707050d476516d'))
     var returnedName;
     var data;
    
   
     setInteractionMode('eager')
   
     extend('required', {
       ...required,
       message: '{_field_} can not be empty',
     })
   
     export default {
       components: {
         ValidationProvider,
         ValidationObserver,
       },
       data(){
        return {

        }
       },
       setup() {
        const connectStore = useConnectStore()
        //retrieve user's contract address
        const functionBytecode = web3.eth.abi.encodeFunctionCall({
            name: 'getUser',
            type: 'function',
            inputs: [{
                type: 'address',
                name: '_user'
            }]
            }, [window.ethereum.selectedAddress]);
        //setting the parameters
        const parameters = {
            from: window.ethereum.selectedAddress,
            to: '0x34297b57c2b2487f7daa5e0c079036829f59303f',
            data: functionBytecode
        }
        //making the call
        window.ethereum.request({
            method: 'eth_call',
            params: [parameters]
        }).then(async function(res) {
            const contractAddress = web3.eth.abi.decodeParameters(['address'], res)
            window.contract = new web3.eth.Contract(InitialContractBuild.abi, contractAddress[0])
            const senderAddress = window.ethereum.selectedAddress
            const functionBytecode = web3.eth.abi.encodeFunctionCall({
                name: 'getPersonalInfo',
                type: 'function',
                inputs: [{
                    type: 'address',
                    name: '_requester'
                }]
            }, [senderAddress]);
            const parameters = {
                from: window.ethereum.selectedAddress,
                to: contractAddress[0],
                data: functionBytecode
            };
             window.ethereum.request({
        method: 'eth_call',
        params: [parameters]
      }).then((res) => {
        // console.log(res);
            const decoded = web3.eth.abi.decodeParameters(['bytes32', 'bytes32', 'bytes32', 'address'], res);
            returnedName = web3.utils.hexToUtf8(decoded[0]);
            const returnedDob = web3.utils.hexToUtf8(decoded[1]);
            const returnedAffiliation = web3.utils.hexToUtf8(decoded[2]);
            // const returnedAddress = decoded[3];
            console.log(returnedName, returnedDob, returnedAffiliation, decoded[3])
        }).catch((error) => {
            console.log(error)
        })
            // console.log(contractAddress[0])
            // const returnedName = await connectStore.getPersonalDetails(contractAddress[0])
            // console.log(await connectStore.getPersonalDetails(contractAddress[0]))
        }).catch((error) => {
            console.log(error)
        })
        
        setTimeout(function() {
            console.log(returnedName)
            
        },10000)
        data = {
                name: '',
                dob: connectStore.returnedDob,
                affiliation: connectStore.returnedAffiliation,
                // nationality: connectStore.re
            }
        
        return {
            connectStore,
            data, 
            returnedName
        };
      
    },
    created(){

    },
     methods: {
         submit() {
             
         },
         clear() {
             this.name = ''
             this.phoneNumber = ''
             this.email = ''
             this.select = null
             this.checkbox = null
             this.$refs.observer.reset()
         },
     },
 }
 </script> -->