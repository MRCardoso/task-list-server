import Vue from 'vue'
import axios from 'axios'
import { endpointURL } from '@/api.config'

Vue.use({
    install(Vue) {
        Vue.prototype.$http = axios.create({
            baseURL: endpointURL 
        })
    }
})