<template>
    <div class="d-flex flex-column">
        <!-- <CalendarToolbar class="mt-2 mb-2" @selectDate="selectDate" /> -->
        <div class="d-flex flex-column mt-2 gap-3">
            <template v-for="item in items">
                <DashboardRoutine v-if="item.type == 'routine'" :idRoutine="item.id" />
                <DashboardInventory v-if="item.type == 'inventory-log'" :idTodo="item.id" />
                <DashboardMeal v-if="item.type == 'meal'" :idTodo="item.id" />
                <DashboardExercise v-if="item.type == 'exercise'" />
            </template>
        </div>
    </div>
</template>

<script>
import CalendarToolbar from './CalendarToolbar.vue';
import DashboardRoutine from './DashboardRoutine.vue';
import DashboardInventory from './DashboardInventory.vue';
import DashboardExercise from './DashboardExercise.vue';
import DashboardMeal from './DashboardMeal.vue';

export default {
    name: 'DashboardView',
    components: { CalendarToolbar, DashboardRoutine, DashboardInventory, 
                  DashboardMeal, DashboardExercise },
    props: {
        
    },
    data: function () {
        return {
            selectedDate: undefined,
            items: [
                { type: "routine", id: 6 }, // Morning Routine
                { type: "inventory-log", id: 6 }, // Morning Routine
                { type: "meal", id: 14 }, // Eat Breakfast
                { type: "meal", id: 216 }, // Eat Lunch
                { type: "meal", id: 267 }, // Eat Dinner
                { type: "exercise" }, // Exercise
                { type: "routine", id: 3 }, // Night Routine
            ]
        }
    },
    methods: {
        selectDate(date) {
            this.selectedDate = date;
        }
    },
}

</script>

<style scoped>

</style>