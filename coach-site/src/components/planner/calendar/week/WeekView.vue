<template>
    <div class="d-flex h-100">
        <div class="week-view d-flex flex-column h-100 w-100"
             ref="weekView"
             :style="{ 'min-width': `${64 * dayCount}px` }">
            <div class="header d-flex"
                 :style="{ 'padding-left': `${hour.labelWidth}px` }">
                <div v-for="(day, index) in dayModels"
                     :key="index"
                     class="head day-view d-flex flex-column flex-grow-1 h-100"
                     :class="[day.pointInTime, {'selected': day.isSelected}]"
                     :style="{ 'flex-basis': 0 }">
                    <!-- Date Label -->
                    <div class="date-label cursor-default d-flex flex-column justify-content-between"
                         @click="selectDate(day.date)">
                        <div class="dow">{{ day.dow }}</div> <!-- Day of Week -->
                        <div class="date-icon">{{ day.day }}</div><!-- Date -->
                    </div>
                    <TaskList :date="day.date"
                             :taskList="taskList(day)">
                              <!--  :minHeight="maxTasks * 22"> -->
                    </TaskList>
                    <DayPoints :date="day.date"/>
                </div>
            </div>
            <div class="body d-flex h-100 overflow-scroll">
                <div class="hour-labels overflow-hidden"
                     :style="{ 'min-width': `${hour.labelWidth}px`, height: 'fit-content' }">
                    <div v-for="(h, index) in hour.hours"
                         :key="index"
                         :style="{ 'min-height': `${hour.blockHeight}px` }">
                        <div v-if="index != 0">
                            <p class="hour-label">{{ h.twelveHourString }}</p>
                        </div>
                    </div>
                </div>
                <div v-if="dayModels.length > 0"
                     class="hour-blocks d-flex w-100 overflow-hidden"
                     ref="hourBlocks"
                     :style="{ height: 'fit-content' }"
                        @scroll="onScroll">
                    <HourBlocks v-for="(day, index) in dayModels"
                                :key="index"
                                class="day-view flex-grow-1"
                                :date="day.date"
                                :style="{ 'flex-basis': 0 }"
                                :blockHeight="hour.blockHeight">
                    </HourBlocks>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import date from "date-and-time";
import TaskList from "../TaskList.vue";
import DayPoints from "../DayPoints.vue";
import HourBlocks from "../event/HourBlocks.vue";
import { replaceItem, removeItem } from "../../../../../utility";
import { getHoursObjectArray } from "../../../../../utility/plannerUtility";
import { firstDayOfWeek, lastDayOfWeek, addDay, today } from "../../../../../utility/timeUtility";

export default {
    name: "WeekView",
    components: { TaskList, DayPoints, HourBlocks },
    data: function () {
        return {
            appStore: undefined,
            padding: 60,
            days: [],
            dayModels: [],
            date,
            maxTasks: 0,
            width: 0,
            grid: "",
            hour: {
                hours: [],
                labelWidth: 50,
                blockHeight: 48,
            },
            events: [],
            tasks: [],
            firstDay: null,
            lastDay: null,
            plannerStore: undefined,
            eventStore: undefined,
            iterationStore: undefined
        };
    },
    created: async function() {
        this.appStore = useAppStore();

        let eventStore = await import(`@/store/eventStore`);
        this.eventStore = eventStore.useEventStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
        this.plannerStore.startClock();
    },
    beforeMount: function () {},
    mounted: function () {
        this.width = this.$refs.weekView.clientWidth;
        // this.initTimeline();
        this.initHours();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : this.today;
        },
        today() {
            return today();
        },
        startAt() {
            return firstDayOfWeek(this.selectedDate);
            // return firstDayOfWeek(firstDayOfMonth(this.selectedDate));
        },
        endAt() {
            return lastDayOfWeek(this.selectedDate);
        },
        dayCount() {
            return (this.appStore) ? this.appStore.planner.dayCount : 7;
        }
    },
    methods: {
        initHours,
        initTimeline,
        newDay,
        replaceItem,
        removeItem,
        getHoursObjectArray,
        onScroll,
        taskList(day) {
            // If task is mapped to an event, don't add to task list
            return day.tasks.filter((_task) => !_task.isInEvent);
        },
        selectDate(date) {
            this.plannerStore.selectDate(date);
        }
    },
    watch: {
        dayCount(value) {
            this.initTimeline();
            localStorage.setItem(`week-view-day-count`, value);
        },
        selectedDate() {
            this.initTimeline();
            this.eventStore.getEvents(this.startAt, this.endAt, true);
            this.iterationStore.getIterationsInRange(this.startAt, this.endAt, true);
        },
    },
};

function initHours() {
    this.hour.hours = this.getHoursObjectArray();
}

function initTimeline() {
    let indexDate =
        this.dayCount == 7
            ? firstDayOfWeek(this.selectedDate)
            : new Date(this.selectedDate);

    this.firstDay = new Date(indexDate);
    this.days = [];
    let dayModels = [];
    for (let i = 0; i < this.dayCount; i++) {
        this.days.push(indexDate);
        dayModels.push(this.newDay(indexDate));
        indexDate = addDay(indexDate, 1);
    }

    this.lastDay = new Date(indexDate);
    this.dayModels = dayModels;
}

function newDay(day) {
    /* Get tasks in correct date range */
    let tasks = this.tasks.filter(_task => 
        new Date(_task.startAt).toDateString() == day.toDateString() &&
        (_task.endAt == null || new Date(_task.endAt).toDateString() == day.toDateString()));

    /* Get tasks that aren't in events */
    tasks = tasks.filter(_task => _task.events.length == 0);
    

    let pointInTime = "";
    if (day < this.today) {
        pointInTime = "past";
    } else if (+day == +this.today) {
        pointInTime = "present";
    } else if (day > this.today) {
        pointInTime = "future";
    }
    
    return {
        dow: date.format(day, "ddd"),
        day: date.format(day, "D"),
        date: new Date(day.getTime()),
        dateString: day.toDateString(),
        tasks,
        pointInTime,
        isSelected: (+day == +this.selectedDate) ? true : false
    };
}

function onScroll() {
    // console.log(this.$refs.hourBlocks.scrollTop);
    // console.log("this.$refs.hourBlocks.scrollTop");
    // this.$refs.hourLabels.scrollTop = this.$refs.hourBlocks.scrollTop;
}
</script>

<style scoped>
.week-view {
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto;
}

.day-view {
    min-width: calc(100% / 7);
    border-left: 1px solid #D8D8D8;
    /* font-family: SF Pro Display; */
}

.head {
    border-bottom: 1px solid #D8D8D8;
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

.head.selected:not(.present) .date-icon {
    background-color: #D2E3FC;
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