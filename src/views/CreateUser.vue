<template>
<v-container>
    <NavDrawer />
    <v-sheet id="sheet">
        <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="submit">
                <validation-provider v-slot="{ errors }" name="Name" rules="required|max:10">
                    <v-text-field v-model="data.name" :counter="10" :error-messages="errors" label="Name" required>
                    </v-text-field>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="dob" rules="required">
                    <v-text-field v-model="data.dob" :error-messages="errors" label="Date of Birth" required></v-text-field>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="nationality" rules="required">
                    <v-text-field v-model="data.nationality" :error-messages="errors" label="Nationality" required></v-text-field>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="affiliation" rules="required">
                    <v-text-field v-model="data.affiliation" :error-messages="errors" label="Affiliation" required></v-text-field>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="subject" rules="required">
                    <v-text-field v-model="data.subject" :error-messages="errors" label="Subject's Address" required></v-text-field>
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
    </v-container>
</template>

 <script>
     import { required,} from 'vee-validate/dist/rules'
     import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
     import { useConnectStore } from '../store/index'
     import NavDrawer from '@/components/NavDrawer.vue'
     const Web3 = require('web3/dist/web3.min.js')
     const web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/2c79500c736344aaab707050d476516d'))
     import InitialContractBuild from '../artifacts/contracts/InitializeContract.sol/InitializeContract.json'
     
    //  import { getAuth } from '@firebase/auth';
     // eslint-disable-next-line
     import { db } from '../firebase'
     import  firebase  from 'firebase/compat/app';
     import { doc, getDoc, setDoc } from '@firebase/firestore';
     import router from '@/router'
    //  import { getAuth } from 'firebase/auth'
    //  import  firebase  from 'firebase/compat/app';
    //  import 'firebase/compat/auth';
    //  import 'firebase/compat/firestore';
    let transactionHash;
    let adminContractAddress;
    let userContractAddress;
   
   
     setInteractionMode('eager')
   
     extend('required', {
       ...required,
       message: '{_field_} can not be empty',
     })
   
     export default {
       components: {
    ValidationProvider,
    ValidationObserver,
    NavDrawer
    },
       setup() {
      const connectStore = useConnectStore()
      const data = {
        name: '',
        dob: '',
        affiliation: '',
        nationality: '',
        subject: ''
      }
      const submit = async () => {
        connectStore.loading = true
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User logged in already or has just logged in.
                const userID =user.uid;
                const docRef = doc(db, "users", userID);
                getDoc(docRef).then(docSnap => {
                    adminContractAddress = docSnap.data().contractAddress
                })
                
            } 
            });
        
        const names = web3.utils.asciiToHex(data.name)
        const birth = web3.utils.asciiToHex(data.dob)
        const nation = web3.utils.asciiToHex(data.nationality)
        const address = data.subject
        const affiliate = data.affiliation
        // let dataParam = web3.eth.abi.encodeFunctionSignature(`(${names}, ${dob}, ${nationality})`)
        const encodedParameters = web3.eth.abi.encodeParameters(
        ['bytes32', 'bytes32', 'bytes32', 'address', 'address'],
        [names, birth, nation, affiliate, address]
        ).slice(2);
        const bytecodeWithEncodedParameters = InitialContractBuild.bytecode + encodedParameters
        try {
        const { ethereum } = window;
        // console.log("hi")
        window.contract = new web3.eth.Contract(InitialContractBuild.abi)
        const parameters =
        {
            from: window.ethereum.selectedAddress,
            gas: 0, // 30400
            gasPrice: 0, // 10000000000000
            data: bytecodeWithEncodedParameters,
        };


        // contract = contract.deploy({data: bytecode})
        ethereum.request({
            method: 'eth_sendTransaction',
            params: [parameters],
        }).then((result) => {
            transactionHash = result
        });
        } catch (error) {
            connectStore.loading = false;
            alert(error.message)
    }
        // await connectStore.deployInitialContract(data.name, data.dob, data.affiliation, 
        // data.subject, data.nationality).then(() => {
        //     console.log("res")
        //     console.log(connectStore.transactionHash)
        //     // alert("Contract Successfully deployed")
        // }).catch((error) => {
        //     // console.log(error)
        //     alert(error.message)
        // })

        // const docRef = await getDoc( doc(db, "users", getAuth().currentUser.uid))
        // console.log(docRef)
        setTimeout(function() {
            window.ethereum.request ({
                method: 'eth_getTransactionReceipt',
                params: [transactionHash]
            }).then((res) => {
                userContractAddress = res['contractAddress']
                setDoc(doc(db, 'contracts', data.affiliation), {
                    [data.subject] : userContractAddress
                }); 
                // console.log(contractAddress)
                const functionBytecode = web3.eth.abi.encodeFunctionCall({
                    name: 'setUserCounter',
                    type: 'function',
                    inputs: [{
                        type: 'address',
                        name: '_contract'
                    },
                    {
                        type: 'address',
                        name: ' _user'
                    }]
                    }, [userContractAddress, address]);
                window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [{
                        from: window.ethereum.selectedAddress,
                        to: adminContractAddress,
                        data: functionBytecode
                    }]
                }).then(() => {
                    connectStore.loading = false;
                    alert("Contract Successfully Deployed")
                    router.push('dashboard')
                }).catch((error) => {
                    connectStore.loading = false;
                    alert(error.message)
                })
                
            }).catch((error) => {
                alert(error.message)
            })
        }, 30000)
      }
      return {
        connectStore,
        data,
        submit
      };
      
    },
 
     methods: {
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
 </script>