import Vue from 'vue'
import axios from 'axios'
import { endpointURL } from '@/api.config'

axios.defaults.baseURL = endpointURL

Vue.use({
    install(Vue) {
        Vue.prototype.$http = axios
    }
})