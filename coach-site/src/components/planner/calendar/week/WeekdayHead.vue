<template>
    <div class="head weekday-head d-flex flex-column flex-grow-1 h-100"
            :class="pointInTime"
            :style="{ 'flex-basis': 0 }">
        <!-- Date Label -->
        <div class="date-label d-flex flex-column justify-content-between"
             @click="selectDate">
            <div class="dow">{{ dow }}</div> <!-- Day of Week -->
            <div class="date-icon">{{ dateNumber }}</div><!-- Date -->
        </div>
        <TaskList :date="date.getTime()"
                    :taskList="[]">
                    <!--  :minHeight="maxTasks * 22"> -->
        </TaskList>
    </div>
</template>

<script>
import TaskList from "../TaskList.vue";
import { dow, dateNumber } from '../../../../../utility/timeUtility';

export default {
    name: "WeekdayHead",
    components: { TaskList, HourBlocks },
    props: {
        date: Date,
    },
    data: function () {
        return {
            tasks: [],
            plannerStore: undefined
        };
    },
    computed: {
        currentTime() {
            if (this.plannerStore) {
                return this.plannerStore.currentTime;
            } else {
                return new Date();
            }
        },
        pointInTime() {
            let date = date.getTime();
            let currentTime = this.currentTime.getTime();

            if (date < currentTime) {
                return "past";
            } else if (date == currentTime) {
                return "present";
            } else if (date > currentTime) {
                return "future";
            }
        },
        dow() {
            return dow(this.date);
        },
        dateNumber() {
            return dateNumber(this.date);
        },
        selectDate(date) {
            this.plannerStore.selectDate(date);
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
    }
};
</script>

<style scoped>
.head {
    border-bottom: 1px solid #D8D8D8;
}
.weekday-head {
    min-width: calc(100% / 7);
    border-left: 1px solid #D8D8D8;
    font-family: SF Pro Display;
}

.dow {
    text-transform: uppercase;
    line-height: 14px;
    font-size: 12px;
    font-weight: 500;
    margin: 0 auto 2px auto;
    font-family: "Roboto", sans-serif;
}

.date-label {
    width: 48px;
    height: 64px;
    margin: 8px auto 4px auto;
    font-family: SF Pro Rounded, "Roboto", sans-serif;
}

.past .dow,
.future .dow {
    color: #747474;
}

.present .dow {
    color: #1a73e8;
}

.date-icon {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    line-height: 48px;
    font-size: 24px;
    font-weight: 500;
    text-align: center;
}

.past .date-icon {
    color: #747474;
}

.present .date-icon {
    color: white;
    background-color: #1a73e8;
}

.future .date-icon {
    color: #565656;
}

.hour-labels::-webkit-scrollbar {
    display: none;
}

.hour-labels {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    font-size: 10px;
}

.hour-label {
    line-height: 10px;
    position: relative;
    top: -5px;
    color: #70757a;
}
</style>