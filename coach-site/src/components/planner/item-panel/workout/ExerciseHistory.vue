<template>
    <div class="exercise-history d-flex flex-column overflow-scroll pt-2">
        <div class="label d-flex flex-row">
            <img class="icon-button"
                 src='/icon/previous.png' width="20" height="20"
                 @click.prevent="back"/>
            <!-- <span>{{ workout.name }}</span> -->
        </div>
        <div class="d-flex flex-row justify-content-center">
            <span class="tab p-2" :class="{ selected: (selectedTab == 'results')}"
                  @click="selectedTab = 'results'">
                Results
            </span>
            <span class="tab p-2" :class="{ selected: (selectedTab == 'trends')}"
                  @click="selectedTab = 'trends'">
                Trends
            </span>
        </div>
        <div v-if="selectedTab == 'trends'" class="trends">
            <ExerciseChart v-if="history" 
                           class="mt-2"
                           setProp="weight" :history="history" />
            <ExerciseChart v-if="history" 
                           class="mt-2"
                           setProp="reps" :history="history" />
        </div>
        <div v-if="selectedTab == 'results'" class="results">
            <div v-for="(day, index) in history" :key="index"
                 class="mt-3 ps-3 d-flex flex-column">
                <span class="text-start">{{ dateString(day.date) }}</span>
                <div class="d-flex flex-column mt-1">
                    <div v-for="(set, index2) in day.sets" :key="index2" 
                         class="d-flex flex-row mt-1">
                        <span class="set-number">{{ index2 + 1 }}</span>
                        <span class="ps-1">{{ `${set.reps} reps` }}</span>
                        <span v-if="set.weight" class="ps-1">{{ `${set.weight} lbs` }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { useWorkoutStore } from '@/store/workoutStore';
import ExerciseChart from './ExerciseChart.vue';
import { getMonthDateYearShort } from '../../../../../utility/timeUtility';

export default {
    name: 'ExerciseHistory',
    components: { ExerciseChart },
    props: {
    },
    data: function () {
        return {
            appStore: undefined,
            workoutStore: undefined,
            selectedTab: "results"
        }
    },
    created: function() {
        this.appStore = useAppStore();
        this.workoutStore = useWorkoutStore();
    },
    computed: {
        idExercise() {
            return (this.appStore) 
                ? this.appStore.itemPanel.workout.exerciseHistory.idExercise
                : undefined;
        },
        variationIDs() {
            return (this.appStore) 
                ? this.appStore.itemPanel.workout.exerciseHistory.variationIDs
                : undefined;
        },
        history() {
            if (this.idExercise && this.variationIDs) {
                var history = this.workoutStore.getExerciseHistory(this.idExercise, this.variationIDs);
                return history;
            }
            return undefined;
        }
    },
    methods: {
        dateString(date) {
            return getMonthDateYearShort(new Date(date));
        },
        back() {
            this.appStore.onBackWorkoutPanel();
        }
    },
}

</script>

<style scoped>
.tab:hover {
    background-color: rgba(60, 64, 67, .08);
    cursor: default;
}

.tab.selected {
    background-color: rgba(60, 64, 67, .3);
}

.set-number {
    width: 24px;
    background-color: rgba(60, 64, 67, .3);
    border-radius: 12px;
}
</style>