<template>
    <div class="row g-0 h-100">
        <div class="workout-panel col h-100 d-flex flex-column flex-grow-1 overflow-hidden">
            <!-- Header -->
            <ItemPanelHeader v-show="showHead" 
                             :title="title" :sort="sort" :selectedDate="selectedDate"
                             @onSortChange="onSortChange">
            </ItemPanelHeader>
            <WorkoutDashboard v-if="selectedView == 'dashboard' && designVariants.workoutDashboard == 'WorkoutDashboard'"/>
            <WorkoutDashboardLite v-if="selectedView == 'dashboard' && designVariants.workoutDashboard == 'WorkoutDashboardLite'"/>
            <WorkoutPanelDashboard v-if="selectedView == 'dashboard' && designVariants.workoutDashboard == 'WorkoutPanelDashboard'"/>
            <WorkoutList v-if="selectedView == 'workoutList'"
                         @setPanelHeader="setPanelHeader"/>
            <WorkoutForm v-if="selectedView == 'workoutForm'"/>
            <ActiveWorkout v-if="selectedView == 'workoutActive' && designVariants.workoutActive == 'ActiveWorkout'"/>
            <WorkoutActive v-if="selectedView == 'workoutActive' && designVariants.workoutActive == 'WorkoutActive'"/>
            <WorkoutExercise v-if="selectedView == 'workoutExercise' && designVariants.workoutExercise == 'WorkoutExercise'" />
            <WorkoutExercise2 v-if="selectedView == 'workoutExercise' && designVariants.workoutExercise == 'WorkoutExercise2'" />
            <WorkoutExercise3 v-if="selectedView == 'workoutExercise' && designVariants.workoutExercise == 'WorkoutExercise3'" />
            <ExerciseList v-if="selectedView == 'exerciseList'" />
            <ExerciseForm v-if="selectedView == 'exerciseForm'" :id="appStore.itemPanel.workout.exerciseFormID" @back="back" />
            <ExerciseHistory v-if="selectedView == 'exerciseHistory'" />
            <FitnessGoals v-if="selectedView == 'fitnessGoals'" />
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { useWorkoutStore } from '@/store/workoutStore';
import ItemPanelHeader from '../component/ItemPanelHeader.vue';
import WorkoutList from './WorkoutList.vue';
import WorkoutDashboard from './WorkoutDashboard.vue';
import WorkoutPanelDashboard from './WorkoutPanelDashboard.vue';
import WorkoutDashboardLite from './WorkoutDashboardLite.vue';
import WorkoutForm from './WorkoutForm.vue';
import WorkoutActive from './WorkoutActive.vue';
import ActiveWorkout from './ActiveWorkout.vue';
import ExerciseList from './ExerciseList.vue';
import ExerciseForm from './ExerciseForm.vue';
import WorkoutExercise from './WorkoutExercise.vue';
import WorkoutExercise2 from './WorkoutExercise2.vue';
import WorkoutExercise3 from './WorkoutExercise3.vue';
import ExerciseHistory from './ExerciseHistory.vue';
import FitnessGoals from './FitnessGoals.vue';


var sortItems = [
    { id: 1, text: "Custom" },
];

export default {
    name: 'WorkoutPanel',
    components: { ItemPanelHeader, WorkoutList, WorkoutForm, WorkoutActive, ActiveWorkout,
        WorkoutDashboard, WorkoutPanelDashboard, WorkoutDashboardLite, ExerciseList, ExerciseForm, WorkoutExercise, WorkoutExercise2, WorkoutExercise3, ExerciseHistory, FitnessGoals },
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
            customSortBy: 'Custom',
            designVariants: {
                workoutDashboard: 'WorkoutDashboard',
                workoutActive: 'WorkoutActive',
                workoutExercise: 'WorkoutExercise2',
            },
            title: "Workout Dashboard",
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
            this.customSortBy = workoutPanelSortBy_Store;
        } else {
            localStorage.setItem(`workout-panel-sort-by`, this.customSortBy);
        }

        const savedVariants = localStorage.getItem('workout-panel-design-variants');
        if (savedVariants) {
            Object.assign(this.designVariants, JSON.parse(savedVariants));
        }
    },
    computed: {
        selectedView() {
            return (this.appStore) ? this.appStore.itemPanel.workout.selectedView : undefined;
        },
        sort() {
            if (this.selectedView === 'dashboard') {
                return {
                    by: this.designVariants.workoutDashboard,
                    items: [
                        { id: 1, text: 'WorkoutPanelDashboard' },
                        { id: 2, text: 'WorkoutDashboard' },
                        { id: 3, text: 'WorkoutDashboardLite' },
                    ]
                };
            }
            if (this.selectedView === 'workoutActive') {
                return {
                    by: this.designVariants.workoutActive,
                    items: [
                        { id: 1, text: 'ActiveWorkout' },
                        { id: 2, text: 'WorkoutActive' },
                    ]
                };
            }
            if (this.selectedView === 'workoutExercise') {
                return {
                    by: this.designVariants.workoutExercise,
                    items: [
                        { id: 1, text: 'WorkoutExercise' },
                        { id: 2, text: 'WorkoutExercise2' },
                        { id: 3, text: 'WorkoutExercise3' },
                    ]
                };
            }
            return { by: this.customSortBy, items: sortItems };
        }
    },
    methods: {
        onSortChange,
        setPanelHeader,
        selectWorkout,
        back
    }
}

function onSortChange(sortBy) {
    if (this.selectedView === 'dashboard') {
        this.designVariants.workoutDashboard = sortBy;
    } else if (this.selectedView === 'workoutActive') {
        this.designVariants.workoutActive = sortBy;
    } else if (this.selectedView === 'workoutExercise') {
        this.designVariants.workoutExercise = sortBy;
    } else {
        this.customSortBy = sortBy;
        localStorage.setItem(`workout-panel-sort-by`, sortBy);
    }
    localStorage.setItem('workout-panel-design-variants', JSON.stringify(this.designVariants));
}

function setPanelHeader(props) {
    this.title = props.text;
}

function selectWorkout(workoutID) {
    // this.back();
    this.workoutStore.selectWorkout(workoutID);
}

function back() {
    this.appStore.onBackWorkoutPanel();
}
</script>

<style scoped>

</style>