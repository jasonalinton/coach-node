import { createApp } from 'vue'

import App from './App.vue'
import moment from 'moment'
import { createPinia } from 'pinia'

const app = createApp(App)

import { createMemoryHistory, createRouter } from 'vue-router'
import Planner from './components/planner/Planner.vue'
import ItemTabs from './components/items/ItemTabs.vue'
import PhysicalView from './components/metrics/physical/PhysicalView.vue'

const routes = [
  { path: '/', component: Planner },
  { path: '/planner', component: Planner },
  { path: '/items', component: ItemTabs },
  { path: '/physical-view', component: PhysicalView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

const pinia = createPinia();

app.use(router);
app.use(pinia);

app.mount("#app");

// https://stackoverflow.com/questions/31096130/how-to-json-stringify-a-javascript-date-and-preserve-timezone
Date.prototype.toJSON = function(){ return moment(this).format(); }