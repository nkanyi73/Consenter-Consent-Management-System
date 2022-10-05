<template>
    <v-sheet id="sheet">
        <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="submit">
                <validation-provider v-slot="{ errors }" name="university" rules="required">
                    <v-text-field v-model="university" :counter="10" :error-messages="errors" label="University Name" required>
                    </v-text-field>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="highSchool" rules="required">
                    <v-text-field v-model="highSchool" :error-messages="errors" label="High School Name" required></v-text-field>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="highSchoolGrade" rules="required">
                    <v-text-field v-model="highSchoolGrade" :error-messages="errors" label="High School Grade" required></v-text-field>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="gpa" rules="required">
                    <v-text-field v-model="gpa" :error-messages="errors" label="GPA" required></v-text-field>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="retakes" rules="required">
                    <v-text-field v-model="retakes" :error-messages="errors" label="Number of retakes" required></v-text-field>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="pending" rules="required">
                    <v-text-field v-model="pending" :error-messages="errors" label="Number of Pending Units" required></v-text-field>
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
     import { required,} from 'vee-validate/dist/rules'
     import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
     import { useConnectStore } from '../store/index'
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
       components: {
         ValidationProvider,
         ValidationObserver,
       },
       setup: () => ({ connectStore: useConnectStore() }),
       data() {
            return {
                university: '',
                highSchool: '',
                highSchoolGrade:'',
                gpa: '',
                retakes: 0,
                pending: 0
            };
        },
        created() {
        //do this before loading page
        this.getInitialValues()
        },
 
     methods: {
         submit() {
            this.connectStore.loading = true;
                window.contract = new web3.eth.Contract(InitialContractBuild.abi, contractAddress[0]);
                const uniName = web3.utils.asciiToHex(this.university);
                const hSchoolName = web3.utils.asciiToHex(this.highSchool);
                const hGrade = web3.utils.asciiToHex(this.highSchoolGrade);
                const gpa = web3.utils.asciiToHex(this.gpa);
                const retakes = this.retakes;
                const pending = this.pending
                const functionHash = web3.eth.abi.encodeFunctionCall({
                name: 'setEducation',
                type: 'function',
                inputs: [{
                    type: 'bytes32',
                    name: '_universityName'
                },
                {
                    type: 'bytes32',
                    name: '_highSchoolName'
                },
                {
                    type: 'bytes2',
                    name: '_highSchoolGrade'
                },
                {
                    type: 'bytes32',
                    name: '_gpa'
                },
                {
                    type: 'uint256',
                    name: '_noOfRetakes'
                }, 
                {
                    type: 'uint8',
                    name: '_pendingUnits'
                }]
                }, [uniName, hSchoolName, hGrade, gpa, retakes, pending]);
                const parameters = {
                from: window.ethereum.selectedAddress,
                to: contractAddress[0],
                data: functionHash
                };
                window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [parameters]
                }).then(() => {
                alert("Successfully updated education information")
                this.connectStore.loading = false;
                router.push('/dashboard')
                }).catch((error) => {
                this.connectStore.loading = false;
                alert(error.message)
                })
         },
         getInitialValues () {
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
                            name: 'getEducation',
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
                        const decoded = web3.eth.abi.decodeParameters(['bytes32', 'bytes32', 'bytes2', 'bytes32', 'uint256', 'uint8'], res);
                        self.university = web3.utils.hexToUtf8(decoded[0]);
                        self.highSchool = web3.utils.hexToUtf8(decoded[1]);
                        self.highSchoolGrade = web3.utils.hexToUtf8(decoded[2]);
                        self.gpa = web3.utils.hexToUtf8(decoded[3]);
                        self.retakes = decoded[4]
                        self.pending = decoded[5]
                    }).catch((error) => {
                        console.log(error)
                    })
                    }).catch((error) => {
                    console.log(error)
                    }) 
         },
         clear() {
             this.university = ''
             this.highSchool = ''
             this.highSchoolGrade = ''
             this.gpa = ''
             this.retakes = ''
             this.pending = ''
         },
     },
 }
 </script>