<template>
  <div id="app">
    <nav id="navbar" class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Planner</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Items</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div id="app-body" class="row g-0">
      <div class="col">
        <Items :style="{ 'height': `${bodyHeight}px`}"></Items>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { style } from '../app.config';
import Items from './components/items/Items.vue'


export default {
  name: 'App',
  components: {
    Items
  },
  data: function() {
    return {
      selectedTab: "metric",
      style: style,
      bodyHeight: undefined
    }
  },
  mounted: function() {
    this.onResize();
  },
  created: function () {
    window.addEventListener('resize', this.onResize);
  },
  methods: {
    onResize() {
      this.bodyHeight = $(window.top).height() - $('#navbar').outerHeight();
    }
  }
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
