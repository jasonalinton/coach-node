import Vue from 'vue'
import App from './App.vue'
import { createProvider } from './vue-apollo'
import moment from 'moment'

Vue.config.productionTip = false

new Vue({
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')

// https://stackoverflow.com/questions/31096130/how-to-json-stringify-a-javascript-date-and-preserve-timezone
Date.prototype.toJSON = function(){ return moment(this).format(); }