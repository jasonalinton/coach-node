<template>
    <div id="app">
        <Navbar v-if="selectedPage != 'planner'"></Navbar>
        <div id="app-body" class="row g-0">
            <div class="col">
                <Planner v-if="selectedPage == 'planner'"></Planner>
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
    },
    methods: {
        onResize() {
            this.bodyHeight =
                $(window.top).height() - $("#navbar").outerHeight();
        },
    },
};
</script>


<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #565656;
    /* margin-top: 60px; */
}
</style>
