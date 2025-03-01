// import Vue from 'vue'
import { createApp } from 'vue'

import App from './App.vue'
import moment from 'moment'
import { createPinia } from 'pinia'

const app = createApp(App)

// import { createMemoryHistory, createRouter } from 'vue-router'
// import Planner from './components/planner/Planner.vue'
// import ItemTabs from './components/items/ItemTabs.vue'

// const routes = [
//   { path: '/', component: Planner },
//   { path: '/item-tables', component: ItemTabs },
// ]

// const router = createRouter({
//   history: createMemoryHistory(),
//   routes,
// })

const pinia = createPinia();
app.use(pinia);

// Vue.config.productionTip = false;

// new Vue({
//   // router,
//   pinia,
//   render: h => h(App)
// }).$mount('#app')

app.mount("#app");

// https://stackoverflow.com/questions/31096130/how-to-json-stringify-a-javascript-date-and-preserve-timezone
Date.prototype.toJSON = function(){ return moment(this).format(); }