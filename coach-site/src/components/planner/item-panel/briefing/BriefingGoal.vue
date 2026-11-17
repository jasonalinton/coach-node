<template>
    <div v-if="goal" class="briefing-goal d-flex flex-column">
        <div class="goal-row d-flex flex-row align-items-center">
            <span class="text-start goal flex-grow-1">{{ goal.text }}</span>
            <span v-if="reasons.length > 1" class="reasons-toggle d-flex flex-row align-items-center"
                  :class="{ expanded: showAllReasons }"
                  @click="showAllReasons = !showAllReasons">
                {{ showAllReasons ? 'Hide' : `+${reasons.length - 1}` }}
                <img class="caret" src='/icon/caret-down.png' width="8" height="5"/>
            </span>
        </div>
        <!-- Top reason -->
        <div v-if="!showAllReasons && topReason" class="reason d-flex flex-row">
            <span class="bar"></span>
            <span class="text-start">{{ topReason.text }}</span>
        </div>
        <!-- All reasons -->
        <div v-if="showAllReasons" class="reasons d-flex flex-column">
            <div v-for="(reason, index) in reasons" :key="reason.id"
                 class="reason d-flex flex-row" :class="{ top: index == 0 }">
                <span class="bar"></span>
                <span class="text-start flex-grow-1">{{ reason.text }}</span>
                <span v-if="index == 0" class="top-pill">Top</span>
            </div>
        </div>
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
            showAllReasons: false,
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
                // Ordered by the blurb's position in this goal, so the first reason is the top reason
                sortAsc([...this.goal.blurbs], "position").forEach(_blurb => {
                    let blurb = this.universalStore.getBlurb(_blurb.id);
                    if (blurb) {
                        blurbs.push(blurb);
                    }
                })
            }
            return blurbs;
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
            return [];
        },
        topReason() {
            return this.reasons[0];
        }
    },
    methods: {

    },
}

</script>

<style scoped>
.briefing-goal {
    gap: 2px;
}

.goal-row {
    gap: 8px;
}

.goal {
    color: #3B99FC;
}

.reasons-toggle {
    gap: 4px;
    padding: 1px 6px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 500;
    color: #8A8A8A;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
}

.reasons-toggle:hover, .reasons-toggle.expanded {
    background-color: #F1F3F4;
}

.reasons-toggle.expanded .caret {
    transform: rotate(180deg);
}

.reasons {
    gap: 6px;
    padding-top: 2px;
}

.reason {
    gap: 8px;
    padding-left: 2px;
    font-size: 14px;
    line-height: 20px;
    color: #565656;
}

.bar {
    flex-shrink: 0;
    width: 2px;
    border-radius: 1px;
    background-color: #BAD8F1;
}

.reasons .bar {
    background-color: #E6E6E6;
}

.reasons .reason.top {
    color: #212529;
}

.reasons .reason.top .bar {
    background-color: #3B99FC;
}

.top-pill {
    align-self: flex-start;
    padding: 2px 5px;
    font-size: 11px;
    line-height: 14px;
    font-weight: 500;
    color: #3B99FC;
    background-color: var(--pill-default);
    border-radius: 4px;
}
</style>
