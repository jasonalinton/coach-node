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
// Send an unspecified date when serializing to JSON
Date.prototype.toJSON = function(){ return moment(this).format().slice(0, -6); }
String.prototype.toDate = function() {
  let array = this.split("T");
  if (array.length == 2) {
    return new Date(this); 
  } else {
    // String dates that don't have a time are converted to GMT (prevent that)
    return new Date(this + "T00:00:00"); 
  }
}
String.prototype.toCamelCase = function() { 
  return this.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}
String.prototype.capitalize = function() { 
  return this.charAt(0).toUpperCase() + this.slice(1);
}
Number.prototype.round = function() { 
  return Math.round(this);
}