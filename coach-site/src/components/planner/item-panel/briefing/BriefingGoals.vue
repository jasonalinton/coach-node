<template>
    <div class="briefing-goals d-flex flex-column p-2">
        <BriefingSectionHeader title="Goals" :count="goalCount" :isShown="isShown" @toggle="isShown = !isShown" />
        <div v-if="isShown" class="d-flex flex-column">
            <div v-for="(group, index) in goalGroups" :key="group.idTimeframe"
                 class="timeframe-group d-flex flex-column" :class="{ first: index == 0 }">
                <!-- Group label -->
                <div class="group-label d-flex flex-row align-items-center">
                    <span class="group-name" :class="{ selected: group.idTimeframe == idTimeframe }">{{ groupName(group.idTimeframe) }}</span>
                    <span class="group-range">{{ groupRange(group.idTimeframe) }}</span>
                    <span v-if="index > 0" class="group-line flex-grow-1"></span>
                </div>
                <BriefingGoal v-for="goalID in group.goalIDs" :key="goalID"
                              :idGoal="goalID" :idTimeframe="group.idTimeframe" />
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import BriefingGoal from './BriefingGoal.vue';
import BriefingSectionHeader from './BriefingSectionHeader.vue';
import { TIMEFRAME } from '../../../../model/constants';
import { today, firstDayOfWeek, lastDayOfWeek } from '../../../../../utility/timeUtility';

export default {
    name: 'BriefingGoals',
    components: { BriefingGoal, BriefingSectionHeader },
    props: {
        idTimeframe: {
            type: Number,
            default: () => 55
        },
        goalGroups: {
            type: Array,
            default: () => []
        }
    },
    data: function () {
        return {
            plannerStore: undefined,
            isShown: true,
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        goalCount() {
            return this.goalGroups.reduce((count, group) => count + group.goalIDs.length, 0);
        }
    },
    methods: {
        groupName,
        groupRange
    },
}

function groupName(idTimeframe) {
    switch (idTimeframe) {
        case TIMEFRAME.DAY: return "Today";
        case TIMEFRAME.WEEK: return "This week";
        case TIMEFRAME.MONTH: return "This month";
        case TIMEFRAME.YEAR: return "This year";
    }
    return "";
}

// Ex. Mon, Nov 16 | Nov 15 – 21 | November | 2026
function groupRange(idTimeframe) {
    let date = moment(this.selectedDate);
    switch (idTimeframe) {
        case TIMEFRAME.DAY:
            return date.format("ddd, MMM D");
        case TIMEFRAME.WEEK: {
            let start = moment(firstDayOfWeek(this.selectedDate));
            let end = moment(lastDayOfWeek(this.selectedDate));
            let endFormat = (start.month() == end.month()) ? "D" : "MMM D";
            return `${start.format("MMM D")} – ${end.format(endFormat)}`;
        }
        case TIMEFRAME.MONTH:
            return date.format("MMMM");
        case TIMEFRAME.YEAR:
            return date.format("YYYY");
    }
    return "";
}

</script>

<style scoped>
.timeframe-group {
    gap: 10px;
    padding-top: 10px;
}

.timeframe-group.first {
    padding-top: 6px;
}

.group-label {
    gap: 6px;
    font-size: 11px;
    line-height: 14px;
}

.group-name {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .04em;
    color: #8A8A8A;
}

.group-name.selected {
    color: #0D6EFD;
}

.group-range {
    color: #ADB5BD;
}

.group-line {
    height: 1px;
    background-color: #EEEEEE;
}
</style>
