<template>
    <nav id="navbar" class="navbar navbar-expand-sm navbar-light">
        <div class="container-fluid">
            <MenuButton class="menu-button"></MenuButton>
            <a class="navbar-brand" href="#">Inventory Planner</a>
        </div>
    </nav>
</template>

<script>
import MenuButton from '../controls/button/icon/MenuButton.vue';
export default {
    components: { MenuButton },
    name: "PlannerNavbar",
};
</script>

<style>
.navbar {
    border-bottom: 1px solid rgba(220, 220, 220, .5)
}

.menu-button {
    margin: 0 12px;
}


</style>