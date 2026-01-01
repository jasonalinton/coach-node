<template>
    <div v-if="goal" class="briefing-goal d-flex flex-column">
        <span class="text-start goal">{{ goal.text }}</span>
        <ul>
            <li v-for="reason in reasons" :key="reason.id" class="text-start reason">{{ reason.text }}</li>
        </ul>
        <!-- <div class="d-flex flex-column">
            <p v-for="reason in reasons" :key="reason.id" class="text-start reason">{{ reason.text }}</p>
        </div> -->
    </div>
</template>

<script>
import { BLURBTYPE } from '../../../../model/constants';
import { today } from '../../../../../utility/timeUtility';
import { sortAsc } from '../../../../../utility';

export default {
    name: 'BriefingGoal',
    components: {  },
    props: {
        idGoal: Number,
        idTimeframe: {
            type: Number,
            default: () => 55
        }
    },
    data: function () {
        return {
            goalStore: undefined,
            plannerStore: undefined,
            universalStore: undefined,
        }
    },
    created: async function() {
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let universalStore = await import(`@/store/universalStore`);
        this.universalStore = universalStore.useUniversalStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        goal() {
            if (this.goalStore) {
                let goal = this.goalStore.getItem(this.idGoal);
                return goal;
            }
            return undefined;
        },
        blurbs() {
            let blurbs = [];
            if (this.universalStore) {
                this.goal.blurbs.forEach(_blurb => {
                    let blurb = this.universalStore.getBlurb(_blurb.id);
                    if (blurb) {
                        blurbs.push(blurb);
                    }
                })
            }
            return sortAsc([...blurbs], "position");
        },
        reasons() {
            if (this.goal) {
                let timePairIDs = this.goal.timePairs.filter(timePair => {
                    if (timePair.idTimeframe != this.idTimeframe) {
                        return false;
                    }

                    let start = (timePair.startTime) ? new Date(timePair.startTime.dateTime) : undefined
                    let end = (timePair.endTime) ? new Date(timePair.endTime.dateTime) : undefined
                    if ((start && +start <= +this.selectedDate) && (end && +end >= +this.selectedDate)) {
                        return true;
                    }
                    return false;
                }).map(x => x.id);
                // Reasons in the same timeframe or with no timeframe
                let reasons = this.blurbs.filter(x => {
                    let isReason = x.idType == BLURBTYPE.REASON;
                    if (isReason) {
                        if (x.goalTimePairs.length == 0)
                            return true;
                        let index = x.goalTimePairs.findIndex(gtp => timePairIDs.includes(gtp.id));
                        return (index > -1);
                    } else {
                        return false;
                    }
                })
                return reasons;
            }
        }
    },
    methods: {
        
    },
}

// Get timepairs in timeframe
// Get blurbs in goal
// Get blurbs that match goal timepair that are a reason

</script>

<style scoped>
.goal {
    color: #3B99FC;
}
</style>