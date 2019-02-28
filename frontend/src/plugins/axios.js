import Vue from 'vue'
import axios from 'axios'
import { endpointURL } from '@/api.config'

axios.defaults.baseURL = endpointURL 
// axios.interceptors.response.use(
//     res => res, 
//     err => {
//         if (401 === err.response.status) {
//             window.location = '/'
//         } else {
//             return Promise.reject(err)
//         }
//     }
// )

Vue.use({
    install(Vue) {
        Vue.prototype.$http = axios
    }
})