import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify, {
    iconfont: 'md',
    theme: {
        primary: '',
        success: '',
        info: '', 
        error: '',
    }
});

export default new Vuetify({
});
