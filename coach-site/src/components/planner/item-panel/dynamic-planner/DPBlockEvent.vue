<template>
    <div class="dp-block-event d-flex flex-column">
        <div v-if="isComplete" class="header d-flex flex-row align-items-center complete">
            <div class="action-icon complete">
                <img :src="iconComplete" class="glyph complete-glyph" />
            </div>
            <span class="text complete-text">{{ event ? event.text : '' }}</span>
            <span class="points">{{ points.text }}</span>
        </div>
        <div v-else class="header d-flex flex-row align-items-center">
            <div v-if="isPending" class="action-icon start" @click="onStart">
                <img :src="iconStart" class="glyph start-glyph" />
            </div>
            <img v-else-if="isActive" :src="iconStop" class="action-icon stop" @click="onEnd" />
            <span class="text" @click="openEventForm">{{ event ? event.text : '' }}</span>
            <span class="points" @click="onPointsClick">{{ points.text }}</span>
            <div class="delete-button" @click="onDeleteEvent">
                <img :src="iconDeleteX" width="13" height="13" />
            </div>
        </div>
        <div v-if="isExpanded" class="task-list d-flex flex-column">
            <DPTaskItem v-for="task in tasks" :key="task.id" :iteration-id="task.id" />
        </div>
    </div>
</template>

<script>
import DPTaskItem from './DPTaskItem.vue';
import iconComplete from '@/assets/icons/icon-block-complete.svg';
import iconStart from '@/assets/icons/icon-block-start.svg';
import iconStop from '@/assets/icons/icon-block-stop.png';
import iconDeleteX from '@/assets/icons/icon-delete-x.svg';

export default {
    name: 'DPBlockEvent',
    components: { DPTaskItem },
    props: {
        eventId: { type: Number, required: true },
    },
    data: function () {
        return {
            eventStore: undefined,
            appStore: undefined,
            iterationStore: undefined,
            event: undefined,
            isExpanded: false,
            iconComplete,
            iconStart,
            iconStop,
            iconDeleteX,
        }
    },
    created: async function() {
        let eventStore = await import('@/store/eventStore');
        this.eventStore = eventStore.useEventStore();
        let appStore = await import('@/store/appStore');
        this.appStore = appStore.useAppStore();
        let iterationStore = await import('@/store/iterationStore');
        this.iterationStore = iterationStore.useIterationStore();
        this.event = this.eventStore.getEvent(this.eventId);
    },
    computed: {
        isPending() {
            return !this.event || !this.event.startAt;
        },
        isActive() {
            return !!this.event && !!this.event.startAt && !this.event.endAt;
        },
        isComplete() {
            // Intentionally left for manual completion by the user — see plan notes.
            return false;
        },
        tasks() {
            return this.event ? this.event.iterations : [];
        },
        points() {
            let actual = 0;
            let potential = 0;
            this.tasks.forEach(t => {
                if (t.points) {
                    potential += t.points;
                    if (t.completedAt) actual += t.points;
                }
            });
            return { actual, potential, text: `${actual}/${potential} pts` };
        },
    },
    methods: {
        onStart, onEnd, onPointsClick, openEventForm, onDeleteEvent,
    },
}

function onStart() {
    let duration = (new Date(this.event.endAt)).getTime() - (new Date(this.event.startAt)).getTime();
    let now = new Date();
    this.event.startAt = now.toJSON();
    this.event.endAt = new Date(now.getTime() + duration).toJSON();
    this.eventStore.updateEvent(this.event.id, this.event.text, this.event.startAt, this.event.endAt);
    this.isExpanded = true;
}

function onEnd() {
    let now = new Date().toJSON();
    this.event.endAt = now;
    this.eventStore.updateEvent(this.event.id, this.event.text, this.event.startAt, this.event.endAt);
    this.tasks.filter(t => !t.completedAt).forEach(t => this.iterationStore.deleteIteration(t.id));
    this.isExpanded = false;
}

function onPointsClick() {
    this.isExpanded = !this.isExpanded;
}

function openEventForm() {
    this.appStore.setSelectedEvent(this.event);
}

function onDeleteEvent() {
    this.eventStore.deleteEvent(this.event.id);
}
</script>

<style scoped>
.dp-block-event {
    background-color: white;
    user-select: none;
}

.header {
    padding: 8px 14px;
    gap: 12px;
}

.action-icon {
    width: 26px;
    height: 26px;
    border-radius: 13px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-icon.start,
.action-icon.complete {
    background-color: #10B981;
    cursor: pointer;
}

.action-icon.stop {
    cursor: pointer;
}

.glyph.start-glyph {
    width: 13px;
    height: 13px;
}

.glyph.complete-glyph {
    width: 14px;
    height: 14px;
}

.text {
    flex-grow: 1;
    font-size: 14px;
    font-weight: 600;
    color: #3B5BDB;
}

.text:hover {
    text-decoration: underline;
    cursor: pointer;
}

.complete .complete-text {
    color: #374151;
    text-decoration: line-through;
    font-weight: 500;
}

.points {
    font-size: 12px;
    color: #4B5563;
    cursor: pointer;
    flex-shrink: 0;
}

.delete-button {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background-color: white;
    border: 1px solid #DDE3DF;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    visibility: hidden;
    flex-shrink: 0;
}

.dp-block-event:hover .delete-button {
    visibility: visible;
}

.task-list {
    padding: 0px 14px 8px 14px;
}
</style>
