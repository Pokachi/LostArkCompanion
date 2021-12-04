import BootstrapVue from 'bootstrap-vue'
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import Notification from 'vue-notification'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { appConfig } from './config'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faImages, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import '@/mixins/globalMixin'

Vue.use(BootstrapVue)
Vue.use(Notification)

// Font-awesome library
library.add(faImages, faAngleDoubleLeft)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

// Custom settings for app
Vue.prototype.$appConfig = appConfig

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})