import Vue from 'vue'
import Vuex from 'vuex'

import auth from '@/store/modules/auth'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        notification: null,
        loading: false
    },
    mutations: {
        setLoading(state, payload){
            state.loading = payload
        },
        notify(state, payload = null) {
            state.notification = payload;
        },
    },
    modules: { auth }
})