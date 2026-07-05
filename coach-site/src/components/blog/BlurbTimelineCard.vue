<template>
    <div v-if="blurb" class="blurb-timeline-card">
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
            <p class="body-text">{{ blurb.text }}</p>
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
import { metrics, blurbMappingTypes, blurbTypes } from '../../model/types';
import iconActivity from '@/assets/icons/icon-activity.svg';
import iconList from '@/assets/icons/icon-list.svg';
import iconTarget from '@/assets/icons/icon-target.svg';

const MAPPING_THEMES = {
    [BLURB_MAPPING_TYPE.METRIC]: { bg: '#e0f2f1', text: '#00897b' },
    [BLURB_MAPPING_TYPE.GOAL]: { bg: '#e3f2fd', text: '#1e88e5' },
    [BLURB_MAPPING_TYPE.TODO]: { bg: '#fff8e1', text: '#d97706' },
};
const DEFAULT_MAPPING_THEME = { bg: '#f3f4f6', text: '#4b5563' };

export default {
    name: 'BlurbTimelineCard',
    components: {  },
    props: {
        idBlurb: Number
    },
    data: function () {
        return {
            universalStore: undefined,
            goalStore: undefined,
            todoStore: undefined,
        }
    },
    created: async function() {
        let universalStore = await import(`@/store/universalStore`);
        this.universalStore = universalStore.useUniversalStore();
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
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
                        metricIDs: blurb.metricIDs || [],
                        goalIDs: blurb.goalIDs || [],
                        todoIDs: blurb.todoIDs || [],
                        typeIDs: blurb.typeIDs || [],
                    };
                }
            }
            return undefined;
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
            if (!this.blurb || !this.mappingType) return [];

            let rows = [];
            if (this.mappingType.id == BLURB_MAPPING_TYPE.METRIC) {
                let metric = this.getMetric(this.blurb.metricIDs[0]?.id);
                if (metric) rows.push({ icon: iconActivity, label: 'Metric:', value: metric.text });
            } else if (this.mappingType.id == BLURB_MAPPING_TYPE.GOAL) {
                let goal = this.goalStore?.getItem(this.blurb.goalIDs[0]?.id);
                if (goal) rows.push({ icon: iconTarget, label: 'Goal:', value: goal.text });
            } else if (this.mappingType.id == BLURB_MAPPING_TYPE.TODO) {
                let todo = this.todoStore?.getItem(this.blurb.todoIDs[0]?.id);
                if (todo) rows.push({ icon: iconList, label: 'Todo:', value: todo.text });

                let metric = this.getMetric(this.blurb.idMetric);
                if (metric) rows.push({ icon: iconActivity, label: 'Metric:', value: metric.text });
            }
            return rows;
        }
    },
    methods: {
        getMetric(idMetric) {
            return metrics.find(x => x.id == idMetric);
        }
    },
}
</script>

<style scoped>
.blurb-timeline-card {
    background-color: white;
    border-radius: 20px;
    box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.03);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 720px;
    text-align: start;
    margin: auto;
    margin-bottom: 32px;
}

.universal-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
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
    font-size: 24px;
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
