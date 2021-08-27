import Vue from 'vue'
import axios from 'axios'
import { endpointURL } from '@/api.config'
import { browserData } from '@/utils/index'

let { name, version } = browserData()

axios.defaults.baseURL = endpointURL

Vue.use({
    install(Vue) {
        Vue.prototype.$http = axios

        Vue.prototype.$http.interceptors.request.use(config => {
            // put here your rules
            if(!config.params){
                config.params = {}
            }
            
            config.params.PlatformName = name
            config.params.PlatformVersion = version
            
            return config;
        }, error => Promise.Reject(error))
    }
})