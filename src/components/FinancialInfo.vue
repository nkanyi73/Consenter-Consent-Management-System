<template>
    <v-sheet id="sheet">
        <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="submit">
                <validation-provider v-slot="{ errors }" name="bank" rules="required">
                    <v-text-field v-model="data.bank" :counter="10" :error-messages="errors" label="Bank Name" required>
                    </v-text-field>
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
                bank: ''
            };
        },
       
 
     methods: {
         submit() {
             
         },
         clear() {
             this.bank = ''
         },
     },
 }
 </script>