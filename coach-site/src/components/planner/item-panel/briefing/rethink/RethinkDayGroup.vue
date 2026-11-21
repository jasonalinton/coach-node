<template>
    <div class="rethink-day-group d-flex" :class="{ today: isToday }">
        <div class="date-rail d-flex flex-column align-items-center">
            <div class="date-tile d-flex flex-column align-items-center">
                <span class="weekday">{{ weekday }}</span>
                <span class="day">{{ day }}</span>
            </div>
            <span class="rail"></span>
        </div>
        <div class="notes d-flex flex-column flex-grow-1">
            <RethinkNote v-for="note in shownNotes" :key="note.id" :note="note" :goalStore="goalStore"
                         :time="noteTime(note)" />
            <button v-if="hiddenCount > 0" class="show-more align-self-start" @click="showAll = true">
                Show {{ hiddenCount }} more
            </button>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import RethinkNote from './RethinkNote.vue';
import { isToday } from '../../../../../../utility/timeUtility';

export default {
    name: 'RethinkDayGroup',
    components: { RethinkNote },
    props: {
        date: Date,
        notes: Array,
        goalStore: Object,
        // (note) => time label
        noteTime: Function,
        // Show at most this many notes until "Show N more" is clicked; 0 shows all
        cap: { type: Number, default: 0 },
    },
    data: function () {
        return {
            showAll: false,
        }
    },
    computed: {
        weekday() {
            return moment(this.date).format('ddd').toUpperCase();
        },
        day() {
            return moment(this.date).format('D');
        },
        isToday() {
            return isToday(this.date);
        },
        shownNotes() {
            return (this.cap && !this.showAll) ? this.notes.slice(0, this.cap) : this.notes;
        },
        hiddenCount() {
            return this.notes.length - this.shownNotes.length;
        },
    },
}
</script>

<style scoped>
.rethink-day-group {
    gap: 12px;
}

.date-rail {
    gap: 6px;
}

.date-tile {
    width: 44px;
    padding: 6px 0 7px 0;
    border-radius: 10px;
    background-color: #F1EBE2;
}

.weekday {
    font-size: 10px;
    font-weight: 600;
    line-height: 13px;
    letter-spacing: .06em;
    color: var(--rt-text-muted);
}

.day {
    font-family: var(--rt-serif);
    font-size: 20px;
    font-weight: 600;
    line-height: 24px;
    color: var(--rt-text);
}

.rail {
    flex-grow: 1;
    width: 2px;
    border-radius: 1px;
    background-color: var(--rt-border);
}

.today .date-tile {
    background-color: rgba(180, 83, 42, .10);
}

.today .weekday,
.today .day {
    color: var(--rt-accent);
}

.today .rail {
    background-color: rgba(180, 83, 42, .35);
}

.notes {
    gap: 8px;
    min-width: 0;
}

.show-more {
    padding: 0;
    border: none;
    background: none;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: var(--rt-accent);
}
</style>
