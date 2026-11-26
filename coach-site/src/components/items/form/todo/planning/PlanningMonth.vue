<template>
    <div class="planning-month d-flex flex-column">
        <div class="head">{{ title }}</div>
        <div class="week d-flex flex-row">
            <div v-for="(dow, index) in daysOfWeek" :key="index" class="dow pill">{{ dow }}</div>
        </div>
        <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="week d-flex flex-row">
            <div v-for="date in week" :key="+date" class="day pill" :class="dayClasses(date)">
                {{ date.getDate() }}
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { dayKey, monthWeeks } from './planningUtility'

export default {
    name: 'PlanningMonth',
    props: {
        month: Date,
        levels: Map,      // day key -> 1..3
        highlighted: Set, // day keys planned by the hovered source
        dimmed: Set,      // day keys with iterations from other sources
    },
    data: function() {
        return {
            daysOfWeek: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            todayKey: dayKey(new Date())
        }
    },
    computed: {
        title() { return moment(this.month).format("MMMM YYYY") },
        weeks() { return monthWeeks(this.month) }
    },
    methods: {
        dayClasses(date) {
            if (date.getMonth() != this.month.getMonth()) return 'other-month';
            let key = dayKey(date);
            return [
                `level-${this.levels.get(key) || 0}`,
                { today: key == this.todayKey, highlight: this.highlighted.has(key), dim: this.dimmed.has(key) }
            ];
        }
    }
}
</script>

<style scoped>
.planning-month {
    width: 224px;
    padding: 4px 10px;
    background-color: white;
}

.head {
    font-family: SF Pro Rounded, 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #343434;
    margin-bottom: 4px;
}

.week {
    justify-content: space-between;
    margin-bottom: 4px;
}

.pill {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    user-select: none;
}

.dow {
    color: #5F6368;
}

.day {
    color: #202124;
    transition: opacity .15s ease-in-out, box-shadow .15s ease-in-out;
}

.day.other-month {
    color: rgba(0, 0, 0, .4);
}

.day.today {
    color: #1A73E8;
    font-weight: 700;
}

.day.level-1 { background-color: #D2E3FC; }
.day.level-2 { background-color: #8AB4F8; }
.day.level-3 { background-color: #1A73E8; color: white; }

.day.highlight {
    box-shadow: inset 0 0 0 1.5px #669DF6;
}

.day.dim {
    opacity: .3;
}

/* One month fills the width on phones */
@container (max-width: 36rem) {
    .planning-month {
        width: 100%;
        padding: 4px 0;
    }
}
</style>
