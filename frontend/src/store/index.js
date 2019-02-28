import Vue from 'vue'
import Vuex from 'vuex'

import auth from '@/store/modules/auth'
import uploader from '@/store/modules/uploader'

Vue.use(Vuex)
const bus = new Vue()

export default new Vuex.Store({
    state: {
        notification: null,
    },
    mutations: {
        notify(state, payload = null) {
            state.notification = payload;
        },
    },
    actions: {
        busNotifyLoading(state, payload) {
            bus.$emit("AppLoading", payload)
        },
        busListenLoading(state, payload) {
            bus.$on("AppLoading", payload)
        },
    },
    modules: { auth, uploader }
})