<template>
    <div class="row g-0 h-100">
        <div class="workout-panel col h-100 d-flex flex-column flex-grow-1 overflow-hidden">
            <!-- Header -->
            <ItemPanelHeader v-show="showHead" 
                             :title="title" :sort="sort" :selectedDate="selectedDate"
                             @onSortChange="onSortChange">
            </ItemPanelHeader>
            <WorkoutPanelDashboard v-if="selectedView == 'dashboard'"
                                   @selectView="selectView"/>
            <WorkoutList v-if="selectedView == 'workoutList'"
                         @setPanelHeader="setPanelHeader"
                         @selectWorkout="selectWorkout"
                         @back="back"/>
            <WorkoutForm v-if="selectedView == 'workoutForm'"
                         :workout="workoutView.workout"
                         @selectView="selectView"
                         @back="back"/>
            <WorkoutActive v-if="selectedView == 'workoutActive'"/>
            <WorkoutExercise v-if="selectedView == 'exerciseList'"
                          @setPanelHeader="setPanelHeader"
                          @back="back"/>
            <WorkoutExercise v-if="selectedView == 'exerciseActive'" />
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { useWorkoutStore } from '@/store/workoutStore';
import ItemPanelHeader from '../component/ItemPanelHeader.vue';
import WorkoutList from './WorkoutList.vue';
import WorkoutPanelDashboard from './WorkoutPanelDashboard.vue';
import WorkoutForm from './WorkoutForm.vue';
import WorkoutActive from './WorkoutActive.vue';
import ExerciseList from './ExerciseList.vue';
import WorkoutExercise from './WorkoutExercise.vue';


var sortItems = [
    { id: 1, text: "Custom" },
];

export default {
    name: 'WorkoutPanel',
    components: { ItemPanelHeader, WorkoutList, WorkoutForm, WorkoutActive,
        WorkoutPanelDashboard, ExerciseList, WorkoutExercise },
    props: {
        selectedDate: Date,
        showHead: {
            type: Boolean,
            default: true
        }
    },
    data: function () {
        return {
            appStore: undefined,
            workoutStore: undefined,
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
        this.appStore = useAppStore();
        this.workoutStore = useWorkoutStore();
        this.workoutStore.initialize();

        let workoutPanelSortBy_Store = localStorage.getItem(`workout-panel-sort-by`);
        if (workoutPanelSortBy_Store) {
            this.sort.by = workoutPanelSortBy_Store;
        } else {
            localStorage.setItem(`workout-panel-sort-by`, this.sort.by);
        }
    },
    computed: {
        selectedView() {
            return (this.appStore) ? this.appStore.itemPanel.workout.selectedView : undefined;
        }
    },
    methods: {
        onSortChange,
        selectView,
        setPanelHeader,
        selectWorkout,
        back
    }
}

function onSortChange(sortBy) {
    this.sort.by = sortBy;
    localStorage.setItem(`workout-panel-sort-by`, sortBy);
}

function selectView(value) {
    if (this.activePanel != value.panel) {
        this.panelQueue.push(this.activePanel);
    }
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

function selectWorkout(workoutID) {
    // this.back();
    this.workoutStore.selectWorkout(workoutID);
}

function back() {
    this.activePanel = this.panelQueue.pop();
}
</script>

<style scoped>

</style>