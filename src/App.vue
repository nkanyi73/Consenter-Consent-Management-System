<template>
  <v-app class="app">
      <v-main>
        <LoaderView v-if="connectStore.loading" />
        <router-view />
      </v-main>
    </v-app>
</template>

<script>
import { useConnectStore } from './store/index'
import { defineComponent } from '@vue/composition-api';
import LoaderView from './components/LoaderView.vue';


export default defineComponent({
  setup(){
    const connectStore = useConnectStore();
    return {
        connectStore
      };
  },
  name: 'App',
  components: { LoaderView },
  data: () => ({
    //
  }),
});
</script>

<style>
  .app{
    background-color:aliceblue !important;
  }
</style>
