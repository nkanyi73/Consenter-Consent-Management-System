<template>
<div class="signup">
    <!-- <LoaderView /> -->
    <v-container>
        <v-sheet id="sheet">
            <h1 class="text-center font-weight-light">Hi There</h1>
            <validation-observer ref="observer" v-slot="{ invalid }">
                <form @submit.prevent="submit">
                    <validation-provider v-slot="{ errors }" name="Name" rules="required|max:10">
                        <v-text-field v-model="data.name" :counter="10" :error-messages="errors" label="Username" required>
                        </v-text-field>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" name="Email" rules="required|email">
                        <v-text-field v-model="data.email" :error-messages="errors" label="E-mail" required></v-text-field>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" name="Password" rules="required|max:12|min:6">
                        <v-text-field v-model="data.password" :error-messages="errors" label="Password" :type="'password'" required></v-text-field>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" name="Address">
                        <v-text-field v-model="data.address" :error-messages="errors" label="Wallet Address">
                        </v-text-field>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" name="select">
                        <v-select v-model="data.select" :items="data.items" :error-messages="errors" label="Role"
                            data-vv-name="select"></v-select>
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
        <v-row wrap>
            <v-col cols="12" class="d-flex justify-center">
                <a href="login" class="font-weight-light">Already have an acount? Log in Here</a>
            </v-col>
        </v-row>
    </v-container>
    </div>
</template>

<script>
  import { required, email, max, min } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  import { useConnectStore } from '../store/index'
  import { defineComponent } from '@vue/composition-api';
  import { reactive } from 'vue'
//   import LoaderView from '@/components/LoaderView.vue';
import  firebase  from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { doc, setDoc } from '@firebase/firestore';
import { getAuth } from '@firebase/auth';
// eslint-disable-next-line
import { db } from '../firebase'
  import router from '@/router';
//   import bcrypt from 'bcryptjs'

  setInteractionMode('eager')


  extend('required', {
    ...required,
    message: '{_field_} can not be empty',
  })

  extend('max', {
    ...max,
    message: '{_field_} may not be greater than {length} characters',
  })

  extend('min', {
    ...min,
    message: '{_field_} must be more than {length} characters',
  })


  extend('email', {
    ...email,
    message: 'Email must be valid',
  })

  export default defineComponent ({
     setup() {
      const connectStore = useConnectStore()
      window.stores = {connectStore}
      const data = reactive({
        name: '',
        email: '',
        password: '',
        address: connectStore.account.value || window.ethereum.selectedAddress,
        select: null,
        items: [
            'Institution',
            'Subject',
            'Third Party',
        ],
      })
      console.log(data)
      const submit = async () => {
        connectStore.loading = true
        firebase.auth().createUserWithEmailAndPassword(data.email,data.password).then(() => {
        
        alert('Successfully Logged In');
        
        
        router.push('dashboard')
        // console.log(getAuth().currentUser.uid)
        setDoc(doc(db,'users', getAuth().currentUser.uid), {
            email: data.email,
            address: data.address,
            role: data.select
        })
        connectStore.loading = false;
      }).catch(error => {
        connectStore.loading = false;
        alert(error.message)
      })
      }
        
        
        // router.push('dashboard')
        // console.log({...data})
      
      return {
        connectStore,
        data,
        submit
      };
      
    },
    components: {
    ValidationProvider,
    ValidationObserver,
    // LoaderView
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
});
</script>

<style>
    #sheet {
        background-color: aliceblue !important;
    }
</style>