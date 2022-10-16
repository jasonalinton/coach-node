import Vue from 'vue'
import App from './App.vue'
import { createProvider } from './vue-apollo'
import moment from 'moment'
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

Vue.config.productionTip = false;

Vue.prototype.$navbarConfig = {
  selectedPage: 'planner',
  planner: {
    selectedView: 'weekView',
    week: {
      dayCount: 5
    }
  }
}

new Vue({
  apolloProvider: createProvider(),
  pinia,
  render: h => h(App)
}).$mount('#app')

// https://stackoverflow.com/questions/31096130/how-to-json-stringify-a-javascript-date-and-preserve-timezone
Date.prototype.toJSON = function(){ return moment(this).format(); }