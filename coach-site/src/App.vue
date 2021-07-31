<template>
    <div id="app">
        <Navbar v-if="selectedPage != 'planner'"></Navbar>
        <div id="app-body" class="row g-0">
            <div class="col">
                <Planner v-if="selectedPage == 'planner'" :selectedPage="selectedPage"></Planner>
                <Items
                    v-if="selectedPage == 'items'"
                    :style="{ height: `${bodyHeight}px` }"
                ></Items>
            </div>
        </div>
    </div>
</template>

<script>
import $ from "jquery";
import { style } from "../app.config";
import Navbar from "./components/nav/Navbar.vue";
import Planner from "./components/planner/Planner.vue";
import Items from "./components/items/Items.vue";

export default {
    name: "App",
    components: {
        Navbar,
        Planner,
        Items,
    },
    data: function () {
        return {
            selectedPage: "planner",
            selectedTab: "metric",
            style: style,
            bodyHeight: undefined,
        };
    },
    mounted: function () {
        this.onResize();
    },
    created: function () {
        window.addEventListener("resize", this.onResize);

        // let selectedPage_Store = localStorage.getItem(`selected-page`);
        // if (selectedPage_Store) {
        //     this.selectedPage = selectedPage_Store;
        // } else {
        //     localStorage.setItem(`selected-page`, this.selectedPage);
        // }
    },
    methods: {
        onResize() {
            this.bodyHeight =
                $(window.top).height() - $("#navbar").outerHeight();
        },
    },
    watch: {
        // selectedPage(value) {
        //     localStorage.setItem(`selected-page`, value);
        // },
    },
};
</script>


<style>
#app {
    font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: start;
    color: #565656;
    /* margin-top: 60px; */
}

/* @font-face {
  font-family: "San Francisco";
  font-weight: 400;
  src: url("https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-regular-webfont.woff");
} */

@import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');

/* @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&family=Varela+Round&display=swap'); */
</style>
