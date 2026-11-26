<template>
    <div class="day-picker-layer" @click.self="$emit('close')">
        <div class="day-picker d-flex flex-column" :style="position" role="dialog" @click.stop>
            <span class="grabber"></span>
            <div v-if="title" class="sheet-title d-flex flex-row justify-content-between align-items-center">
                <span>{{ title }}</span>
                <button type="button" class="form-btn outline" @click="pick(today)">Today</button>
            </div>
            <div class="head d-flex flex-row align-items-center">
                <span class="month">{{ monthTitle }}</span>
                <button type="button" class="nav" aria-label="Previous month" @click="shiftMonth(-1)">‹</button>
                <button type="button" class="nav" aria-label="Next month" @click="shiftMonth(1)">›</button>
            </div>
            <div class="week d-flex flex-row">
                <span v-for="(dow, index) in daysOfWeek" :key="index" class="dow pill">{{ dow }}</span>
            </div>
            <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="week d-flex flex-row">
                <button v-for="date in week" :key="+date" type="button" class="day pill"
                        :class="dayClasses(date)" @click="pick(date)">{{ date.getDate() }}</button>
            </div>
            <div class="footer d-flex flex-row justify-content-between align-items-center">
                <span class="hint">{{ hint }}</span>
                <button v-if="!title" type="button" class="form-btn outline sm" @click="pick(today)">Today</button>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { today } from '../../../../../utility'
import { dayKey, monthWeeks } from '../todo/planning/planningUtility'

/** A month of days to pick from. Anchored to its trigger on wider screens, a bottom sheet on phones. */
export default {
    name: 'DayPickerPopover',
    props: {
        selectedDate: Date, // shown light blue (e.g. the planner's selected date)
        title: String,      // sheet heading on phones, e.g. "Create task on…"
        hint: { type: String, default: "Pick a day" },
        anchor: Object,    // trigger's getBoundingClientRect(); right edges line up
        placement: { type: String, default: "above" }
    },
    emits: ['pick', 'close'],
    data: function() {
        return {
            month: moment(this.selectedDate || today()).startOf('month').toDate(),
            daysOfWeek: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            today: today()
        }
    },
    computed: {
        position() {
            if (!this.anchor) return {};
            let left = Math.max(8, this.anchor.right - 252);
            return (this.placement == "above")
                ? { left: `${left}px`, bottom: `${window.innerHeight - this.anchor.top + 6}px` }
                : { left: `${left}px`, top: `${this.anchor.bottom + 6}px` };
        },
        monthTitle() { return moment(this.month).format("MMMM YYYY") },
        weeks() { return monthWeeks(this.month) }
    },
    methods: {
        shiftMonth(count) {
            this.month = moment(this.month).add(count, 'month').toDate();
        },
        dayClasses(date) {
            return {
                'other-month': date.getMonth() != this.month.getMonth(),
                today: dayKey(date) == dayKey(this.today),
                selected: this.selectedDate && dayKey(date) == dayKey(this.selectedDate)
            };
        },
        pick(date) {
            this.$emit('pick', moment(date).startOf('day').toDate());
        }
    },
    mounted() {
        this.onKeydown = (e) => { if (e.key == 'Escape') this.$emit('close') };
        document.addEventListener('keydown', this.onKeydown);
    },
    unmounted() {
        document.removeEventListener('keydown', this.onKeydown);
    }
}
</script>

<style scoped>
.day-picker-layer {
    position: fixed;
    inset: 0;
    z-index: 1060;
}

.day-picker {
    position: absolute;
    width: 252px;
    padding: 10px 12px;
    gap: 4px;
    background-color: white;
    border: 1px solid #DEE2E6;
    border-radius: 8px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, .15);
}

.grabber, .sheet-title {
    display: none !important;
}

.head {
    gap: 4px;
    margin-bottom: 2px;
}

.month {
    flex-grow: 1;
    text-align: start;
    font-family: SF Pro Rounded, 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #343434;
}

.nav {
    width: 22px;
    height: 22px;
    border: none;
    border-radius: 4px;
    background: none;
    color: #5F6368;
    font-size: 18px;
    line-height: 18px;
}

.nav:hover {
    background-color: rgba(60, 64, 67, .08);
}

.week {
    justify-content: space-between;
}

.pill {
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    border-radius: 12px;
    background: none;
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
}

.day:hover {
    background-color: #F1F3F4;
}

.day.other-month {
    color: #9AA0A6;
}

.day.selected {
    background-color: #D2E3FC;
}

.day.today {
    background-color: #1A73E8;
    color: white;
    font-weight: 700;
}

.footer {
    gap: 8px;
    margin-top: 4px;
    padding-top: 8px;
    border-top: 1px solid #DEE2E6;
}

.hint {
    font-size: 12px;
    color: #6C757D;
}

/* Phones: a bottom sheet with bigger tap targets */
@media (max-width: 575.98px) {
    .day-picker-layer {
        background-color: rgba(0, 0, 0, .4);
    }

    .day-picker {
        position: fixed;
        left: 0 !important;
        right: 0 !important;
        top: auto !important;
        bottom: 0 !important;
        width: auto;
        padding: 8px 16px 28px;
        gap: 6px;
        border: none;
        border-radius: 16px 16px 0 0;
    }

    .grabber {
        display: block !important;
        width: 36px;
        height: 5px;
        margin: 0 auto 6px;
        border-radius: 3px;
        background-color: #CED4DA;
    }

    .sheet-title {
        display: flex !important;
        font-size: 18px;
        font-weight: 600;
        color: #212529;
    }

    .month {
        font-size: 16px;
    }

    .pill {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        font-size: 15px;
        line-height: 40px;
    }

    .dow {
        height: 20px;
        font-size: 12px;
        line-height: 20px;
    }

    .footer {
        border-top: none;
    }

    .footer .form-btn {
        display: none;
    }
}
</style>
