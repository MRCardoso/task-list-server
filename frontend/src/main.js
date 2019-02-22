import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'
import App from './App.vue'
import VueMoment from 'vue-moment'

import './plugins/vuetify'
import './plugins/axios'
import './plugins/toasted'
import './app.css'

import router from './router/index'
import store from './store/index'

Vue.config.productionTip = false

Vue.use(VueMoment)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
