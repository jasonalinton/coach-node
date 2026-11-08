<template>
    <BlurbForm v-if="blurb && isEditing" :blurb="rawBlurb" @saved="onSaved" @cancel="onCancel"/>
    <div v-else-if="blurb" class="blurb-timeline-card" @click="startEditing">
        <div class="universal-content">
            <div class="title-badges">
                <div class="badges-row">
                    <span v-if="mappingType" class="badge mapping-badge"
                          :style="{ backgroundColor: mappingTheme.bg, color: mappingTheme.text }">
                        {{ mappingType.text }}
                    </span>
                    <span v-for="typeBadge in typeBadges" :key="typeBadge.id" class="badge type-badge">
                        {{ typeBadge.text }}
                    </span>
                </div>
                <span class="date-time">{{ dateTimeDisplay }}</span>
                <span v-if="blurb.title" class="title">{{ blurb.title }}</span>
            </div>
            <BlurbContent class="body-text" :blurb="blurb"/>
        </div>
        <template v-if="mappingRows.length">
            <div class="divider"></div>
            <div class="mapping-content">
                <p class="mapping-heading" :style="{ color: mappingTheme.text }">Mapping Details</p>
                <div class="mapping-rows">
                    <div v-for="(row, index) in mappingRows" :key="index" class="mapping-row">
                        <img :src="row.icon" class="mapping-icon" alt="" />
                        <span class="mapping-label">{{ row.label }}</span>
                        <span class="mapping-value">{{ row.value }}</span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { toShortDateTimeString } from '../../../utility/timeUtility';
import { BLURB_MAPPING_TYPE } from '../../model/constants';
import { toDateString } from '../../../utility';
import { metrics, blurbMappingTypes, blurbTypes, timeframes } from '../../model/types';
import iconActivity from '@/assets/icons/icon-activity.svg';
import iconClock from '@/assets/icons/icon-clock.svg';
import iconList from '@/assets/icons/icon-list.svg';
import iconTarget from '@/assets/icons/icon-target.svg';
import BlurbContent from '../controls/display/BlurbContent.vue';
import BlurbForm from './BlurbForm.vue';

const MAPPING_THEMES = {
    [BLURB_MAPPING_TYPE.METRIC]: { bg: '#e0f2f1', text: '#00897b' },
    [BLURB_MAPPING_TYPE.GOAL]: { bg: '#e3f2fd', text: '#1e88e5' },
    [BLURB_MAPPING_TYPE.TODO]: { bg: '#fff8e1', text: '#d97706' },
};
const DEFAULT_MAPPING_THEME = { bg: '#f3f4f6', text: '#4b5563' };

const MAPPING_ICONS = {
    [BLURB_MAPPING_TYPE.METRIC]: iconActivity,
    [BLURB_MAPPING_TYPE.GOAL]: iconTarget,
    [BLURB_MAPPING_TYPE.FITNESSGOAL]: iconTarget,
    [BLURB_MAPPING_TYPE.GOALTIMEPAIR]: iconClock,
    [BLURB_MAPPING_TYPE.GOALTIMEPAIRTODO]: iconList,
    [BLURB_MAPPING_TYPE.TODO]: iconList,
    [BLURB_MAPPING_TYPE.TODOTIMEPAIR]: iconClock,
    [BLURB_MAPPING_TYPE.TODOREPEAT]: iconClock,
    [BLURB_MAPPING_TYPE.ITERATION]: iconClock,
    [BLURB_MAPPING_TYPE.BRIEFING]: iconClock,
};

export default {
    name: 'BlurbTimelineCard',
    components: { BlurbContent, BlurbForm },
    props: {
        idBlurb: Number
    },
    data: function () {
        return {
            universalStore: undefined,
            goalStore: undefined,
            todoStore: undefined,
            iterationStore: undefined,
            workoutStore: undefined,
            metricStore: undefined,
            physicalStore: undefined,
            isEditing: false,
        }
    },
    created: async function() {
        let universalStore = await import(`@/store/universalStore`);
        this.universalStore = universalStore.useUniversalStore();
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
        let workoutStore = await import(`@/store/workoutStore`);
        this.workoutStore = workoutStore.useWorkoutStore();
        let metricStore = await import(`@/store/metricStore`);
        this.metricStore = metricStore.useMetricStore();
        let physicalStore = await import(`@/store/physicalStore`);
        this.physicalStore = physicalStore.usePhysicalStore();
    },
    computed: {
        blurb() {
            if (this.universalStore) {
                let blurb = this.universalStore.blurbs.find(x => x.id == this.idBlurb);
                if (blurb) {
                    return {
                        id: blurb.id,
                        idMappingType: blurb.idMappingType,
                        idMetric: blurb.idMetric,
                        datetime: blurb.datetime,
                        title: blurb.title,
                        text: blurb.text,
                        json: blurb.json,
                        metricIDs: blurb.metricIDs || [],
                        goalIDs: blurb.goalIDs || [],
                        todoIDs: blurb.todoIDs || [],
                        typeIDs: blurb.typeIDs || [],
                    };
                }
            }
            return undefined;
        },
        rawBlurb() {
            if (!this.universalStore) return undefined;
            return this.universalStore.blurbs.find(x => x.id == this.idBlurb);
        },
        mappingType() {
            if (!this.blurb) return undefined;
            return blurbMappingTypes.find(x => x.id == this.blurb.idMappingType);
        },
        mappingTheme() {
            if (this.mappingType && MAPPING_THEMES[this.mappingType.id]) {
                return MAPPING_THEMES[this.mappingType.id];
            }
            return DEFAULT_MAPPING_THEME;
        },
        typeBadges() {
            if (!this.blurb) return [];
            return this.blurb.typeIDs
                .map(typeID => blurbTypes.find(x => x.id == typeID.id))
                .filter(Boolean);
        },
        dateTimeDisplay() {
            return this.blurb ? toShortDateTimeString(this.blurb.datetime) : '';
        },
        mappingRows() {
            let blurb = this.rawBlurb;
            if (!blurb) return [];

            const T = BLURB_MAPPING_TYPE;
            let rows = [];
            let addRows = (idMappingType, values) => {
                let label = `${blurbMappingTypes.find(x => x.id == idMappingType)?.text || ''}:`;
                let icon = MAPPING_ICONS[idMappingType] || iconActivity;
                values.forEach(value => rows.push({ idMappingType, icon, label, value }));
            };
            let lookupIDs = (childIDs, lookup) => (childIDs || []).map(childID => lookup(childID.id) || `#${childID.id}`);

            addRows(T.METRIC, lookupIDs(blurb.metricIDs, id => this.getMetric(id)?.text));
            addRows(T.GOAL, lookupIDs(blurb.goalIDs, id => this.goalStore?.getItem(id)?.text));
            addRows(T.FITNESSGOAL, lookupIDs(blurb.fitnessGoalIDs, id => this.goalStore?.getItem(id)?.text));
            addRows(T.GOALTIMEPAIR, (blurb.goalTimePairs || []).map(tp => this.timePairLabel(tp)));
            addRows(T.GOALTIMEPAIRTODO, (blurb.goalTimePairTodos || []).map(gtpt => this.todoStore?.getItem(gtpt.todoID)?.text || `#${gtpt.id}`));
            addRows(T.TODO, lookupIDs(blurb.todoIDs, id => this.todoStore?.getItem(id)?.text));
            addRows(T.TODOTIMEPAIR, lookupIDs(blurb.todoTimePairIDs, () => undefined));
            addRows(T.TODOREPEAT, lookupIDs(blurb.todoRepeatIDs, () => undefined));
            addRows(T.ITERATION, lookupIDs(blurb.iterationIDs, id => this.iterationStore?.getIteration(id)?.text));
            addRows(T.FOODITEM, lookupIDs(blurb.foodItemIDs, id => this.physicalStore?.getFoodItem(id)?.name));
            addRows(T.MEAL, lookupIDs(blurb.mealIDs, () => undefined));
            addRows(T.WORKOUT, lookupIDs(blurb.workoutIDs, id => this.workoutStore?.getWorkout(id)?.name));
            addRows(T.EXERCISE, lookupIDs(blurb.exerciseIDs, id => this.workoutStore?.getExercise(id)?.name));
            addRows(T.LOGENTRY, lookupIDs(blurb.logEntryIDs, id => this.metricStore?.getLogItem(id)?.name));
            addRows(T.BRIEFING, (blurb.positions || [])
                .filter(position => position.parentType == 'Timeframe')
                .map(position => {
                    let timeframe = timeframes.find(t => t.id == position.parentID);
                    let metric = this.getMetric(position.idMetric);
                    return `${timeframe ? timeframe.text : ''} / ${metric ? metric.text : ''}`;
                }));

            // Keep the blurb's primary mapping type first
            return rows.sort((a, b) => (b.idMappingType == blurb.idMappingType) - (a.idMappingType == blurb.idMappingType));
        }
    },
    methods: {
        timePairLabel(timePair) {
            if (!timePair) return '';
            let start = timePair.startAt || timePair.startTime;
            let end = timePair.endAt || timePair.endTime;
            let startText = start ? toDateString(start.dateTime || start) : '?';
            let endText = end ? toDateString(end.dateTime || end) : '?';
            return `${startText} - ${endText}`;
        },
        getMetric(idMetric) {
            return metrics.find(x => x.id == idMetric);
        },
        startEditing() {
            this.isEditing = true;
        },
        onSaved() {
            this.isEditing = false;
        },
        onCancel() {
            this.isEditing = false;
        }
    },
}
</script>

<style scoped>
.blurb-timeline-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.03);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
    max-width: 720px;
    text-align: start;
    margin: auto;
    margin-bottom: 32px;
    cursor: pointer;
}

.universal-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.title-badges {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.badges-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.badge {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
    white-space: nowrap;
}

.type-badge {
    background-color: #f3f4f6;
    color: #4b5563;
}

.date-time {
    font-size: 14px;
    font-weight: 500;
    color: #9ca3af;
}

.title {
    font-size: 22px;
    font-weight: bold;
    line-height: 1.2;
    color: #1a1c1e;
}

.body-text {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: #575859;
    white-space: pre-wrap;
}

.divider {
    height: 1px;
    width: 100%;
    background-color: #e5e7eb;
}

.mapping-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
}

.mapping-heading {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
}

.mapping-rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
}

.mapping-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.mapping-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
}

.mapping-label {
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    white-space: nowrap;
}

.mapping-value {
    flex: 1;
    font-size: 14px;
    font-weight: 600;
    color: #1a1c1e;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
