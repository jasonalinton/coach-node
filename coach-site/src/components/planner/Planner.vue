<template>
    <div class="planner row g-0">
        <div class="col">
            <PlannerNavbar class="nav"></PlannerNavbar>
            <div class="row g-0">
                <div class="col"></div>
            </div>
        </div>
        <div class="col-auto">
            <ItemPanel></ItemPanel>
        </div>
    </div>
</template>

<script>
import PlannerNavbar from "../nav/PlannerNavbar.vue";
import ItemPanel from "./item-panel/ItemPanel.vue";
export default {
    name: "Planner",
    components: { PlannerNavbar, ItemPanel },
};
</script>

<style scoped>
.planner {
    min-width: 100vw;
}
</style>