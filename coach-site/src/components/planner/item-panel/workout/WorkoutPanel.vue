<template>
    <div class="row g-0 h-100">
        <div class="col h-100 d-flex flex-column">
            <!-- Header -->
            <ItemPanelHeader :title="title" :sort="sort" :selectedDate="selectedDate"
                             @onSortChange="onSortChange">
            </ItemPanelHeader>
            <WorkoutPanelDashboard v-if="activePanel == 'dashboard'"
                                   @selectView="selectView"
                                   @back="back"/>
            <WorkoutList v-if="activePanel == 'workoutList'"
                         @setPanelHeader="setPanelHeader"
                         @back="back"/>
            <WorkoutForm v-if="activePanel == 'workoutForm'"
                         :workout="workoutView.workout"
                         @selectView="selectView"
                         @back="back"/>
            <ExerciseList v-if="activePanel == 'exerciseList'"
                          @setPanelHeader="setPanelHeader"
                          @back="back"/>
        </div>
    </div>
</template>

<script>
import { useWorkoutStore } from '../../../../store/workoutStore';
import ItemPanelHeader from '../component/ItemPanelHeader.vue';
import WorkoutList from './WorkoutList.vue';
import WorkoutPanelDashboard from './WorkoutPanelDashboard.vue';
import WorkoutForm from './WorkoutForm.vue';
import ExerciseList from './ExerciseList.vue';


var sortItems = [
    { id: 1, text: "Custom" },
];

export default {
    name: 'WorkoutPanel',
    components: { ItemPanelHeader, WorkoutList, WorkoutForm, WorkoutPanelDashboard, ExerciseList },
    props: {
        selectedDate: Date
    },
    data: function () {
        return {
            sort: {
                by: 'Custom',
                items: sortItems,
            },
            title: "Workout Dashboard",
            activePanel: "dashboard",
            lastPanel: "",
            panelQueue: [ ],
            workoutView: {
                workout: undefined
            },
            exerciseForm: {
                id: undefined
            }
        }
    },
    created: function() {
        this.workoutStore = useWorkoutStore();
        this.workoutStore.initialize();

        let workoutPanelSortBy_Store = localStorage.getItem(`workout-panel-sort-by`);
        if (workoutPanelSortBy_Store) {
            this.sort.by = workoutPanelSortBy_Store;
        } else {
            localStorage.setItem(`workout-panel-sort-by`, this.sort.by);
        }
    },
    methods: {
        onSortChange,
        selectView,
        setPanelHeader,
        back
    },
}

function onSortChange(sortBy) {
    this.sort.by = sortBy;
    localStorage.setItem(`workout-panel-sort-by`, sortBy);
}

function selectView(value) {
    // this.lastPanel = this.activePanel;
    this.panelQueue.push(this.activePanel);
    this.activePanel = value.panel;

    if (value && value.panel && value.panel == 'dashboard') {
        this.activePanel = "Workout Dashboard";
    } else if (value && value.panel && value.panel == 'workoutList') {
        this.title = "Workout List";
    } else if (value && value.panel && value.panel == 'workoutForm') {
        this.workoutView.workout = value.workout;
        this.title = "Workout";
    } else if (value && value.panel && value.panel == 'exerciseList') {
        this.title = (value.panelTitle) ? value.panelTitle : "Exercises";
    } else if (value && value.panel && value.panel == 'exerciseForm') {
        this.title = "Exercise Form";
    }
}

function setPanelHeader(props) {
    this.title = props.text;
}

function back() {
    // this.activePanel = this.lastPanel

    this.activePanel = this.panelQueue.pop();
    // if (this.activePanel == "dashboard") {
    //     this.panelQueue.push(this.activePanel);
    // }
}
</script>

<style scoped>

</style>