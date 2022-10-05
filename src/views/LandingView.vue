<template>
    <div class="landing">
        <NavbarVue />
        <v-layout row wrap>
            <v-flex>
                <v-parallax dark src="https://picsum.photos/id/1067/1920/1080?blur" height="700">
                    <v-overlay value="true" absolute color="#1F8A60">
                        <v-row align="center" justify="center">
                            <v-col class="text-center" cols="12">
                                <h1 class="text-h2 font-weight-thin mb-4">
                                    The Future of Data Privacy Starts Here
                                </h1>
                                <v-btn @click.native="connectStore.connectWallet" class="ma-2 white--text font-weight-medium text-uppercase" outlined>
                                    Connect Wallet
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-overlay>
                </v-parallax>
            </v-flex>
        </v-layout>
    </div>

</template>

<script>
import NavbarVue from '@/components/Navbar.vue'
import { useConnectStore } from '../store/index'
import { defineComponent } from '@vue/composition-api';

export default defineComponent ({
     setup() {
      const connectStore = useConnectStore()
      window.stores = {connectStore}

      return {
        connectStore,
      };
      
    },
    components: {
      NavbarVue
      
    },
});

</script>