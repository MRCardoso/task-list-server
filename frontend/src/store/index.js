import Vue from 'vue'
import Vuex from 'vuex'

import bus from '@/store/modules/bus'
import auth from '@/store/modules/auth'
import uploader from '@/store/modules/uploader'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: { bus, auth, uploader }
})