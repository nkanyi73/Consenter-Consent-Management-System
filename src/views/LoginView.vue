<template>
    <v-container>
        <v-sheet id="sheet">
            <h1 class="text-center font-weight-light">Welcome Back</h1>
            <validation-observer ref="observer" v-slot="{ invalid }">
                <form @submit.prevent="login">
                   
                    <validation-provider v-slot="{ errors }" name="email" rules="required|email">
                        <v-text-field v-model="email" :error-messages="errors" label="E-mail" required></v-text-field>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" name="Password" rules="required|max:12|min:6">
                        <v-text-field v-model="password" :error-messages="errors" label="Password" :type="'password'" required></v-text-field>
                    </validation-provider>

                    <v-btn class="mr-4" type="submit" :disabled="invalid">
                        login
                    </v-btn>
                    <v-btn @click="clear">
                        clear
                    </v-btn>
                </form>
            </validation-observer>
        </v-sheet>
        <v-row wrap>
            <v-col cols="12" class="d-flex justify-center">
                <a href="/signup" class="font-weight-light">Don't have an acount? Sign Up Here</a>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
  import { required, email, max, min } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  // eslint-disable-next-line
  import { db } from '../firebase'
  import router from '@/router';
  import  firebase  from 'firebase/compat/app';
  import 'firebase/compat/auth';
  import 'firebase/compat/firestore';
import { useConnectStore } from '@/store';

  setInteractionMode('eager')

  extend('min', {
    ...min,
    message: '{_field_} must be more than {length} characters',
  })

  extend('required', {
    ...required,
    message: '{_field_} can not be empty',
  })

  extend('max', {
    ...max,
    message: '{_field_} may not be greater than {length} characters',
  })

  extend('email', {
    ...email,
    message: 'Email must be valid',
  })

  export default {
    components: {
      ValidationProvider,
      ValidationObserver,
    },
    data() {
        return {
            email: '',
            password: ''
      
        };
    },

    methods: {
        login() {
            const connectStore = useConnectStore()
            connectStore.setLoader(true)
            connectStore.loading = true
            console.log(connectStore.loading)
            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(()=> {
                connectStore.loading = false
                alert("Successfully logged in")
                router.push("dashboard")
                
            }).catch((error) => {
                connectStore.loading = false
                alert(error.message)
            })
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
</script>

<style>
    #sheet {
        background-color: aliceblue !important;
    }
</style>