<template>
    <div class="blurb-form-control d-flex flex-column">
        <div class="header d-flex flex-column"
             @click="isShown = !isShown"
             @mouseover="hovered = true">
            <div class="d-flex flex-row justify-content-between">
                <div class="d-flex flex-row">
                    <span class="form-head text-start">{{ header }}</span>
                    <img class="icon-button ms-1 mt-auto mb-auto" src="/icon/add-button.png" :width="14" :height="14" 
                         @click.stop="onAddBlurb" />
                </div>
                <img v-if="!isShown" class="caret mt-auto mb-auto me-2" 
                        src='/icon/caret-right.png' width="5" height="8"/>
                <img v-if="isShown" class="caret mt-auto mb-auto me-2" 
                        src='/icon/caret-down.png' width="8" height="5"/>
            </div>
            <hr/>
        </div>
        <div v-if="isShown" class="d-flex flex-column">
            <div v-if="showTextarea" class="d-flex flex-column gap-2">
                <input v-if="showTitle" class="textbox text" type="text" placeholder="Title"
                       v-model.lazy.trim="title"
                       spellcheck="true"/>
                <div class="editor-wrapper" :class="{ invalid: emptyWarning }"
                     v-on:keyup.enter.ctrl="saveBlurb"
                     v-on:keyup.esc.stop="cancelBlurb">
                    <EditorJS class="textarea" ref="textbox" v-model="json" :placeholder="placeholder"/>
                </div>
                <!-- Mappings -->
                <div v-if="mappingGroups.length" class="mappings d-flex flex-column">
                    <div v-for="(group, groupIndex) in mappingGroups" :key="groupIndex" class="mapping-group d-flex flex-column">
                        <div class="mapping-row d-flex flex-row align-items-center">
                            <select class="select mapping-select" v-model.number="group.idMappingType" @change="onMappingTypeChange(groupIndex)">
                                <option :value="undefined" disabled>Select type...</option>
                                <option v-for="type in selectableMappingTypes(groupIndex)" :key="type.id" :value="type.id">{{ type.text }}</option>
                            </select>
                            <input v-if="group.idMappingType" class="textbox mapping-id" type="number" min="1" placeholder="Enter ID..."
                                   v-on:keyup.enter="addMappingByID(groupIndex, $event)"/>
                            <span v-else class="flex-grow-1"></span>
                            <span v-if="itemMapperType(group.idMappingType)" class="select-items-link"
                                  @click="openPicker(groupIndex)">Select items</span>
                            <button class="btn-close mapping-remove" type="button" aria-label="remove mapping"
                                    @click.stop="removeMappingGroup(groupIndex)"></button>
                        </div>
                        <div v-if="group.mappings.length" class="mapping-pills d-flex flex-row flex-wrap">
                            <span v-for="(idEntity, index) in group.mappings" :key="idEntity" class="mapping-pill d-flex flex-row align-items-center">
                                <span class="mapping-pill-id">{{ idEntity }}</span>
                                <span v-if="mappingText(group.idMappingType, idEntity)">{{ mappingText(group.idMappingType, idEntity) }}</span>
                                <button class="btn-close mapping-remove" type="button" aria-label="remove"
                                        @click.stop="removeMapping(groupIndex, index)"></button>
                            </span>
                        </div>
                        <ItemMapper v-if="pickerGroupIndex == groupIndex" :itemType="itemMapperType(group.idMappingType)"
                                    :selectedIDs="group.mappings" @select="onItemMapperSelect" @cancel="closePicker"/>
                    </div>
                </div>
                <button class="add-btn" type="button" :disabled="!canAddMappingGroup" @click="addMappingGroup">
                    <img src="/icon/button/add.png" width="10" height="10"/>Add
                </button>
                <!-- Briefing Type -->
                <div v-if="idBlurbType == BLURBTYPE.BRIEFING || idBlurbType == BLURBTYPE.DEBRIEFING" class="briefing-type pills d-flex flex-row justify-content-between mt-1 gap-1">
                    <span class="app-pill flex-grow-1" :class="{ 'selected': idBriefingType == BLURBTYPE.BRIEFING }"
                          @click="idBriefingType = BLURBTYPE.BRIEFING">
                        Briefing
                    </span>
                    <span class="app-pill flex-grow-1" :class="{ 'selected': idBriefingType == BLURBTYPE.DEBRIEFING }"
                          @click="idBriefingType = BLURBTYPE.DEBRIEFING">
                        Debriefing
                    </span>
                </div>
                <!-- Save Button -->
                <div class="d-flex flex-row align-items-center mt-1 justify-content-end">
                    <span v-if="emptyWarning" class="empty-warning me-auto">Write something before saving</span>
                    <button type="button" @click="saveBlurb">Save</button>
                    <button class="ms-1" type="button" @click="cancelBlurb">Cancel</button>
                </div>
            </div>
            <!-- Blurb Card -->
            <div class="d-flex flex-column">
                <div v-for="blurb in blurbs_Sorted" :key="blurb.id"
                     class="blurb cursor-default d-flex flex-column mt-2"
                     :class="{ selected: blurb.id == selectedID}"
                     @click="editBlurb(blurb.id)">
                    <!-- <span class="text-start">{{ getDateString(blurb.datetime) }}</span> -->
                    <h6 class="text-start">{{ blurb.title }}</h6>
                    <BlurbContent :blurb="blurb" class="text-start"/>
                    <!-- Goal-TimePair IDs -->
                    <div v-if="blurb.goalTimePairs.length > 0" class="goal-timepair d-flex flex-row gap-2">
                        <span v-for="id in blurb.goalTimePairs.map(x => x.id)" :key="id">{{ id }}</span>
                    </div>
                    <!-- Goal-TimePair-Todo IDs -->
                    <div v-if="blurb.goalTimePairTodos.length > 0" class="goal-timepair-todos d-flex flex-row gap-2">
                        <span v-for="id in blurb.goalTimePairTodos.map(x => x.id)" :key="id">{{ id }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getShortDateString } from '../../../../../utility/timeUtility';
import { clone, sortAsc } from '../../../../../utility';
import { extractPlainText, legacyTextToOutputData } from '../../../../../utility/editorjsUtility';
import { BLURBTYPE, BLURB_MAPPING_TYPE } from '../../../../model/constants';
import { blurbMappingTypes } from '../../../../model/types';
import EditorJS from '../../../controls/input/EditorJS.vue';
import BlurbContent from '../../../controls/display/BlurbContent.vue';
import ItemMapper from './ItemMapper.vue';

const T = BLURB_MAPPING_TYPE;

// Routine has no backend join table, and a briefing is a timeframe + metric rather than an entity ID
const EXCLUDED_MAPPING_TYPES = [T.ROUTINE, T.BRIEFING];

const ITEM_MAPPER_TYPES = {
    [T.GOAL]: 'goal',
    [T.TODO]: 'todo',
    [T.METRIC]: 'metric',
};

// Entity ID lists on a blurb, by mapping type
const BLURB_ID_LISTS = {
    [T.METRIC]: blurb => blurb.metricIDs,
    [T.GOAL]: blurb => blurb.goalIDs,
    [T.TODO]: blurb => blurb.todoIDs,
    [T.ITERATION]: blurb => blurb.iterationIDs,
    [T.FITNESSGOAL]: blurb => blurb.fitnessGoalIDs,
    [T.GOALTIMEPAIR]: blurb => blurb.goalTimePairs,
    [T.GOALTIMEPAIRTODO]: blurb => blurb.goalTimePairTodos,
    [T.TODOTIMEPAIR]: blurb => blurb.todoTimePairIDs,
    [T.TODOREPEAT]: blurb => blurb.todoRepeatIDs,
    [T.FOODITEM]: blurb => blurb.foodItemIDs,
    [T.MEAL]: blurb => blurb.mealIDs,
    [T.WORKOUT]: blurb => blurb.workoutIDs,
    [T.EXERCISE]: blurb => blurb.exerciseIDs,
    [T.LOGENTRY]: blurb => blurb.logEntryIDs,
};

export default {
    name: 'BlurbFormControl',
    components: { EditorJS, BlurbContent, ItemMapper },
    props: {
        header: {
            type: String,
            default: () => "Blurb"
        },
        blurbs: {
            type: Array,
            default: () => []
        },
        placeholder: {
            type: String,
            default: () => ""
        },
        showTitle: {
            type: Boolean,
            default: () => false
        },
        idBlurbType: Number
    },
    data: function () {
        return {
            BLURBTYPE: clone(BLURBTYPE),
            universalStore: undefined,
            goalStore: undefined,
            todoStore: undefined,
            metricStore: undefined,
            iterationStore: undefined,
            workoutStore: undefined,
            physicalStore: undefined,
            title: undefined,
            json: undefined,
            selectedID: undefined,
            isShown: true,
            showTextarea: false,
            mappingGroups: [],
            originalMappings: [],
            pickerGroupIndex: undefined,
            idBriefingType: undefined,
            emptyWarning: false
        }
    },
    created: async function() {
        let universalStore = await import(`@/store/universalStore`);
        this.universalStore = universalStore.useUniversalStore();
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
        let metricStore = await import(`@/store/metricStore`);
        this.metricStore = metricStore.useMetricStore();
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
        let workoutStore = await import(`@/store/workoutStore`);
        this.workoutStore = workoutStore.useWorkoutStore();
        let physicalStore = await import(`@/store/physicalStore`);
        this.physicalStore = physicalStore.usePhysicalStore();

        // If briefing blurb, defaut to briefing briefing type
        if (this.idBlurbType == this.BLURBTYPE.BRIEFING || this.idBlurbType == this.BLURBTYPE.DEBRIEFING) {
            this.idBriefingType = this.idBlurbType;
        }
    },
    watch: {
        json() {
            this.emptyWarning = false;
        }
    },
    computed: {
        blurbs_Sorted() {
            let blurbs = [];
            if (this.universalStore) {
                this.blurbs.forEach(_blurb => {
                    let blurb = this.universalStore.getBlurb(_blurb.id);
                    if (blurb) {
                        blurbs.push(blurb);
                    }
                })
            }
            return sortAsc([...blurbs], "position");
        },
        canAddMappingGroup() {
            return this.mappingGroups.every(group => !!group.idMappingType) && this.selectableMappingTypes(-1).length > 0;
        }
    },
    methods: {
        reset,
        onAddBlurb,
        selectableMappingTypes,
        itemMapperType,
        addMappingGroup,
        removeMappingGroup,
        onMappingTypeChange,
        addMappingByID,
        removeMapping,
        openPicker,
        closePicker,
        onItemMapperSelect,
        mappingText,
        loadMappings,
        callParentListener,
        editBlurb,
        cancelBlurb,
        saveBlurb,
        getDateString(datetime) {
            if (datetime) {
                let date = new Date(datetime);
                return getShortDateString(date);
            }
            return "";
        },
    },
}

function reset() {
    this.emptyWarning = false;
    this.selectedID = undefined;
    this.title = undefined;
    this.json = undefined;
    this.mappingGroups = [];
    this.originalMappings = [];
    this.pickerGroupIndex = undefined;
}

function selectableMappingTypes(groupIndex) {
    let usedTypes = this.mappingGroups
        .filter((group, index) => index != groupIndex)
        .map(group => group.idMappingType);
    return blurbMappingTypes.filter(type => !EXCLUDED_MAPPING_TYPES.includes(type.id) && !usedTypes.includes(type.id));
}

function itemMapperType(idMappingType) {
    return ITEM_MAPPER_TYPES[idMappingType];
}

function addMappingGroup() {
    if (!this.canAddMappingGroup) return;
    this.closePicker();
    this.mappingGroups.push({ idMappingType: undefined, mappings: [] });
}

function removeMappingGroup(groupIndex) {
    this.closePicker();
    this.mappingGroups.splice(groupIndex, 1);
}

function onMappingTypeChange(groupIndex) {
    this.mappingGroups[groupIndex].mappings = [];
    this.closePicker();
}

function addMappingByID(groupIndex, e) {
    let group = this.mappingGroups[groupIndex];
    let id = Number(e.target.value);
    e.target.value = '';
    if (!group?.idMappingType || !Number.isInteger(id) || id <= 0) return;
    if (!group.mappings.includes(id)) group.mappings.push(id);
}

function removeMapping(groupIndex, index) {
    this.mappingGroups[groupIndex].mappings.splice(index, 1);
}

function openPicker(groupIndex) {
    this.pickerGroupIndex = groupIndex;
}

function closePicker() {
    this.pickerGroupIndex = undefined;
}

function onItemMapperSelect(addedIDs, removedIDs) {
    let group = this.mappingGroups[this.pickerGroupIndex];
    if (group) {
        (addedIDs || []).forEach(id => { if (!group.mappings.includes(id)) group.mappings.push(id); });
        group.mappings = group.mappings.filter(id => !(removedIDs || []).includes(id));
    }
    this.closePicker();
}

/* Name of a mapped entity, or undefined when it can't be looked up (the pill then shows only its ID) */
function mappingText(idMappingType, id) {
    if (!this.goalStore) return undefined;
    switch (idMappingType) {
        case T.METRIC: return this.metricStore.getItem(id)?.text;
        case T.GOAL:
        case T.FITNESSGOAL: return this.goalStore.getItem(id)?.text;
        case T.TODO: return this.todoStore.getItem(id)?.text;
        case T.ITERATION: return this.iterationStore.getIteration(id)?.text;
        case T.FOODITEM: return this.physicalStore.getFoodItem(id)?.name;
        case T.WORKOUT: return this.workoutStore.getWorkout(id)?.name;
        case T.EXERCISE: return this.workoutStore.getExercise(id)?.name;
        case T.LOGENTRY: return this.metricStore.getLogItem(id)?.name;
        case T.GOALTIMEPAIR: {
            let goal = this.goalStore.getItems().find(g => (g.timePairs || []).some(tp => tp.id == id));
            return goal?.text;
        }
        case T.GOALTIMEPAIRTODO: {
            for (let goal of this.goalStore.getItems()) {
                for (let timePair of goal.timePairs || []) {
                    let gtpt = (timePair.goalTimePairTodos || []).find(x => x.id == id);
                    if (gtpt) return this.todoStore.getItem(gtpt.todoID)?.text;
                }
            }
            return undefined;
        }
        default: return undefined;
    }
}

function loadMappings(blurb) {
    this.mappingGroups = Object.entries(BLURB_ID_LISTS)
        .map(([type, getIDs]) => ({
            idMappingType: Number(type),
            mappings: (getIDs(blurb) || []).map(x => x.id)
        }))
        .filter(group => group.mappings.length > 0);
    this.originalMappings = this.mappingGroups.flatMap(group =>
        group.mappings.map(idEntity => ({ mappingType: group.idMappingType, idEntity })));
}

/* Calls the parent's @addBlurb / @saveBlurb listener directly instead of using $emit, so the promise it
 * returns (resolving to the saved blurb) can be awaited before the blurb's mappings are saved */
function callParentListener(listenerName, blurb) {
    let listener = this.$attrs[listenerName];
    return Promise.resolve(typeof listener == 'function' ? listener(blurb) : undefined);
}

function onAddBlurb() {
    this.reset();
    this.showTextarea = true;
}

function editBlurb(id) {
    this.selectedID = id;

    let index = this.blurbs_Sorted.findIndex(x => x.id == id);
    if (index > -1) {
        let blurb = this.blurbs_Sorted[index];
        this.json = blurb.json ? JSON.parse(blurb.json) : legacyTextToOutputData(blurb.text);
        this.title = blurb.title;
        this.loadMappings(blurb);
        this.showTextarea = true;
        this.$nextTick(() => this.$refs["textbox"] && this.$refs["textbox"].focus());
    }
}

function cancelBlurb() {
    if (this.$refs["textbox"]) this.$refs["textbox"].blur();
    this.reset();
    this.showTextarea = false;
}

async function saveBlurb() {
    // Parents skip blurbs with no text, so keep the form open and warn instead of silently discarding it
    if (extractPlainText(this.json).trim() == "") {
        this.emptyWarning = true;
        return;
    }

    let idBlurb = this.selectedID;
    let mappingKey = m => `${m.mappingType}|${m.idEntity}`;
    let mappings = this.mappingGroups.flatMap(group =>
        group.mappings.map(idEntity => ({ mappingType: group.idMappingType, idEntity })));
    let originalKeys = this.originalMappings.map(mappingKey);
    let currentKeys = mappings.map(mappingKey);
    let toMappingProps = m => ({ mappingType: m.mappingType, idEntity: m.idEntity, position: null, idTimeframe: null, idMetric: null });
    let mappings_Added = mappings.filter(m => !originalKeys.includes(mappingKey(m))).map(toMappingProps);
    let mappings_Removed = this.originalMappings.filter(m => !currentKeys.includes(mappingKey(m))).map(toMappingProps);

    /* Mappings are saved below through the universal UpdateBlurb, so the goal endpoints get the blurb's
     * original goal-time-pair IDs - which leaves those mappings unchanged instead of syncing them */
    let originalIDsOfType = type => this.originalMappings.filter(m => m.mappingType == type).map(m => m.idEntity);
    let blurb = {
        id: undefined,
        title: this.title,
        text: extractPlainText(this.json),
        json: this.json ? JSON.stringify(this.json) : undefined,
        datetime: (!idBlurb) ? new Date() : undefined,
        goalTimePairIDs: originalIDsOfType(T.GOALTIMEPAIR),
        goalTimePairTodoIDs: originalIDsOfType(T.GOALTIMEPAIRTODO),
        idBlurbType: this.idBriefingType
    };

    let saving;
    if (!idBlurb) {
        saving = this.callParentListener("onAddBlurb", blurb);
    } else {
        blurb.id = idBlurb;
        saving = this.callParentListener("onSaveBlurb", blurb);
    }
    this.cancelBlurb();

    if (mappings_Added.length == 0 && mappings_Removed.length == 0) return;
    let savedBlurb = await saving;
    idBlurb = idBlurb || savedBlurb?.id;
    if (idBlurb) {
        await this.universalStore.updateBlurb(idBlurb, undefined, [], [], undefined, undefined, undefined,
            mappings_Added, mappings_Removed, undefined);
    }
}

</script>

<style scoped>

.form-head {
    font-size: 20px;
    text-align: start;
    width: 100%;
    display: inline-block;
    font-weight: 500;
}

.header {
    cursor: default;
}

.header:hover .form-head {
    color: var(--form-header-hover);
}

.caret {
    visibility: hidden;
}

.header:hover .caret {
    visibility: visible;
}

.icon-button {
    border-radius: 8px;
    width: 16px;
}

.icon-button:hover {
    background-color: rgba(60, 64, 67, .10);
}

hr {
    margin-top: 3px;
    margin-bottom: 3px;
    color: #8A8A8A;
}

.blurb {
    padding: 8px;
    font-size: 14px;
    background-color: #F5F5F5;
    border-radius: 4px;
    border: transparent solid 1px;
    white-space: pre-wrap;
}

.blurb.selected {
    border: #979797 solid 1px;
}

button:not(.btn-close):not(.add-btn) {
    height: 25px;
    background-color: #BAD8F1;
    border: #3B99FC solid 1px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 16px;
}

button.btn-close {
    font-size: 8px;
    visibility: hidden;
}

.editor-wrapper.invalid {
    border: 1px solid var(--workout-red);
    border-radius: 4px;
}

.empty-warning {
    font-size: 13px;
    color: var(--workout-red);
}

.mappings {
    gap: 10px;
    margin-top: 4px;
}

.mapping-group {
    gap: 6px;
}

.mapping-row {
    gap: 8px;
}

.mapping-select {
    width: 150px;
    height: 28px;
    flex-shrink: 0;
    border: 1px solid rgba(0, 0, 0, .08) !important;
}

.mapping-id {
    flex: 1 1 auto;
    min-width: 0;
    border: 1px solid rgba(0, 0, 0, .08) !important;
}

.select-items-link {
    cursor: pointer;
    font-size: 14px;
    color: #3B99FC;
    white-space: nowrap;
}

button.btn-close.mapping-remove {
    visibility: visible;
    flex-shrink: 0;
}

.mapping-pills {
    gap: 6px;
}

.mapping-pill {
    gap: 6px;
    padding: 4px 6px;
    font-size: 14px;
    line-height: 14px;
    background-color: var(--pill-default);
    border-radius: 4px;
}

.mapping-pill-id {
    font-size: 12px;
    font-weight: 500;
    color: var(--gray-text);
}

.add-btn {
    align-self: flex-start;
}

.add-btn:disabled {
    opacity: .5;
}
</style>