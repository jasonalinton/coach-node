<template>
    <div class="month d-flex flex-column d-flex flex-column" ref="monthView">
        <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="week d-flex flex-row" :class="{ first: weekIndex == 0 }">
            <div v-for="(day, dayIndex) in week.days" :key="dayIndex" class="day d-flex flex-column flex-fill" :class="day.pointInTime">
                <!-- Head -->
                <div class="head d-flex flex-column">
                    <!-- Date Label -->
                    <div class="date-label d-flex flex-column justify-content-between" @click="selectDate(day.date)">
                        <div v-if="weekIndex == 0" class="dow">{{ day.dow }}</div> <!-- Day of Week -->
                        <div class="date-icon">{{ day.day }}</div><!-- Date -->
                        <button type="button" class="date-add-btn" aria-label="Add to story" @click.stop="addToDayStory(day.date)">
                            <i class="fa-solid" :class="hasStory(day.date) ? 'fa-play' : 'fa-plus'"></i>
                        </button>
                    </div>
                </div>
                <TaskList :date="day.date"
                          :taskList="day.tasks">
                </TaskList>
            </div>
        </div>
    </div>
</template>

<script>
import date from "date-and-time";
import moment from "moment";
import { firstDayOfMonth, sunday, today } from "../../../../../utility/timeUtility";
import TaskList from '../TaskList.vue';

export default {
    name: 'MonthView',
    components: { TaskList },
    props: {
    },
    data: function() {
        return {
            plannerStore: undefined,
            mediaStore: undefined,
            rows: 5,
            weeks: [],
            weekModels: [],
            moment,
            date,
            today: today(),
            maxTasks: 6,
            /* Date-and-time toDateString()s that already have story media, within the visible
             * range - drives whether a day's hover + button shows "add" or "view" (play). */
            storyDates: [],
        }
    },
    beforeMount: function() {
        this.initTimeline();
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let mediaStore = await import(`@/store/mediaStore`);
        this.mediaStore = mediaStore.useMediaStore();
        this.refreshStoryDates();
    },
    computed: {
        dayWidth() { return this.$refs.monthView.clientWidth / 7  },
        dayHeight() { return this.$refs.monthView.clientHeight  },
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
    },
    methods: {
        initTimeline,
        selectDate(date) {
            this.plannerStore.selectDate(date);
        },
        addToDayStory(date) {
            this.mediaStore.openStory(date);
        },
        hasStory(date) {
            return this.storyDates.includes(date.toDateString());
        },
        async refreshStoryDates() {
            if (!this.mediaStore || this.weeks.length === 0) return;
            let lastWeek = this.weeks[this.weeks.length - 1];
            let firstDay = this.weeks[0].days[0].date;
            let lastDay = lastWeek.days[lastWeek.days.length - 1].date;
            this.storyDates = await this.mediaStore.getStoryDatesInRange(firstDay, lastDay);
        },
    },
    watch: {
        selectedDate() {
            this.initTimeline();
        }
    }
}

function initTimeline() {
    let _firstDayOfMonth = firstDayOfMonth(this.selectedDate);
    let _firstSunday = sunday(_firstDayOfMonth);

    
    this.weeks = [];
    let date = _firstSunday;
    for (let i = 0; i < this.rows; i++) {
        let week = { days: [] };
        for (let j = 0; j < 7; j++) {
            let day = {
                dow: this.date.format(date, "ddd"),
                day: date.getDate(),
                date: new Date(date.getTime()),
                tasks: []
            };

            if (date.getTime() < this.selectedDate.getTime()) {
                day.pointInTime = "past";
            } else if (date.getTime() == this.selectedDate.getTime()) {
                day.pointInTime = "present";
            } else if (date.getTime() > this.selectedDate.getTime()) {
                day.pointInTime = "future";
            }

            date = this.moment(date).add(1, 'day').toDate();
            week.days.push(day);
        }
        this.weeks.push(week);
    }

    this.refreshStoryDates();
}

</script>

<style scoped>
.month {
    /* width: 100%; */
    min-width: 448px;
    height: calc(100vh - 64px);
    overflow-x: scroll;
}

.date-label {
    position: relative;
    width: 48px;
    height: 33px;
    margin: 8px auto 4px auto;
    font-family: SF Pro Rounded, 'Roboto', sans-serif;
    cursor: pointer;
}

.date-add-btn {
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1A73E8;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 9px;
    line-height: 1;
    padding: 0;
    opacity: 0;
    transition: opacity .1s;
}

.date-label:hover .date-add-btn {
    opacity: 1;
}

.week.first .date-label {
    height: 53px;
}

.day {
    /* min-width: 64px; */
    width: calc(100% / 7);
    height: calc((100vh - 64px) / 5);
    border-left: 1px solid #D8D8D8;
    border-bottom: 1px solid #D8D8D8;
    font-family: SF Pro Display;
    padding-right: 8px;
}

.dow {
    text-transform: uppercase;
    line-height: 14px;
    font-size: 12px;
    font-weight: 500;
    margin: 0 auto 2px auto;
    font-family: 'Roboto', sans-serif;
}

.past .dow, .future .dow {
    color: #747474;
}

.present .dow {
    color: #1A73E8;
}

.date-icon {
    width: 32px;
    height: 32px;
    margin: auto;
    border-radius: 16px;
    line-height: 32px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
}

.past .date-icon {
    color: #747474;
}

.present .date-icon {
    color: white;
    background-color: #1A73E8;
}

.future .date-icon {
    color: #565656;
}

</style>