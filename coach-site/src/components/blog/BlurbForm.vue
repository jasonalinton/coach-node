<template>
    <div class="blurb-form">
        <div>
            {{ blurb.id }}
        </div>
        <div class="form-fields">
            <!-- Title -->
            <div class="field">
                <div class="field-label"><span>Title</span></div>
                <input class="field-input" type="text" placeholder="Enter a title..."
                       v-model.trim="title" spellcheck="true"/>
            </div>
            <!-- Body -->
            <div class="field">
                <div class="field-label"><span>Body</span><span class="required">*</span></div>
                <EditorJS class="field-editor" v-model="json" placeholder="Write your thoughts..."/>
            </div>
            <!-- Types -->
            <div class="field">
                <div class="field-label"><span>Types</span></div>
                <div class="type-pills">
                    <span v-for="type in blurbTypes" :key="type.id" class="type-pill"
                          :class="{ selected: isTypeSelected(type.id) }"
                          @click="toggleType(type.id)">
                        {{ type.text }}
                    </span>
                </div>
            </div>
            <!-- Mapping Details -->
            <div class="field mapping-section">
                <div class="field-label"><span>Mapping Details</span></div>
                <div v-for="(group, groupIndex) in mappingGroups" :key="groupIndex" class="mapping-group">
                    <div class="mapping-row">
                        <select class="mapping-select" v-model.number="group.idMappingType" @change="onMappingTypeChange(groupIndex)">
                            <option :value="undefined" disabled>Select type...</option>
                            <option v-for="type in selectableMappingTypes(groupIndex)" :key="type.id" :value="type.id">{{ type.text }}</option>
                        </select>
                        <input v-if="group.idMappingType && group.idMappingType != BLURB_MAPPING_TYPE.BRIEFING"
                               class="mapping-id-input" type="text" inputmode="numeric" placeholder="Enter ID..."
                               @keyup.enter="addMappingByID(groupIndex, $event)"/>
                        <span v-if="group.idMappingType" class="select-items-link"
                              @click="openItemPicker(groupIndex)">{{ group.idMappingType == BLURB_MAPPING_TYPE.BRIEFING ? 'Set briefing' : 'Select items' }}</span>
                        <span v-if="mappingGroups.length > 1" class="mapping-group-remove" @click="removeMappingGroup(groupIndex)">&times;</span>
                    </div>
                    <div v-if="group.mappings.length" class="mapping-chips">
                        <span v-for="(mapping, index) in group.mappings" :key="index" class="mapping-chip">
                            <span v-if="mapping.idEntity != null" class="mapping-chip-id">{{ mapping.idEntity }}</span>
                            <span v-if="mapping.text && mapping.text != `#${mapping.idEntity}`">{{ mapping.text }}</span>
                            <span class="mapping-chip-remove" @click="removeMapping(groupIndex, index)">&times;</span>
                        </span>
                    </div>
                    <!-- Picker popover -->
                    <div v-if="activePickerIndex == groupIndex" class="picker-popover">
                        <!-- Goal / Todo / Routine / Metric via ItemMapper -->
                        <ItemMapper v-if="mappingKind == 'itemMapper' || (pickerStep == 1 && (mappingKind == 'cascadeGoal' || mappingKind == 'cascadeTodo'))"
                                    :itemType="pickerItemMapperType" :selectedIDs="[]"
                                    @select="onItemMapperSelect" @cancel="closePicker"/>

                        <!-- Local search list (single-level types, and cascade steps 2/3) -->
                        <div v-else-if="mappingKind != 'briefing'" class="local-picker d-flex flex-column">
                            <input class="search-input" type="text" placeholder="Search"
                                   v-model="localPickerSearch"/>
                            <div class="local-picker-list">
                                <div v-for="item in filteredLocalPickerItems" :key="item.id"
                                     class="local-picker-item" @click="onLocalItemPicked(item)">
                                    {{ item.text }}
                                </div>
                                <div v-if="filteredLocalPickerItems.length == 0" class="local-picker-empty">No items found</div>
                            </div>
                            <div class="picker-footer">
                                <span class="btn-cancel-picker" @click="closePicker">Cancel</span>
                            </div>
                        </div>

                        <!-- Briefing: Timeframe + Metric -->
                        <div v-else class="briefing-picker d-flex flex-column">
                            <select class="mapping-select" v-model.number="briefingIdTimeframe">
                                <option :value="undefined" disabled>Timeframe...</option>
                                <option v-for="timeframe in timeframes" :key="timeframe.id" :value="timeframe.id">{{ timeframe.text }}</option>
                            </select>
                            <select class="mapping-select mt-2" v-model.number="briefingIdMetric">
                                <option :value="undefined" disabled>Metric...</option>
                                <option v-for="metric in metricStore.getItems()" :key="metric.id" :value="metric.id">{{ metric.text }}</option>
                            </select>
                            <div class="picker-footer">
                                <span class="btn-cancel-picker" @click="closePicker">Cancel</span>
                                <span class="btn-confirm-picker" :class="{ disabled: !briefingIdTimeframe || !briefingIdMetric }"
                                      @click="confirmBriefingMapping">Add</span>
                            </div>
                        </div>
                    </div>
                </div>
                <span class="add-mapping-link" :class="{ disabled: !canAddMapping }"
                      @click="addMappingGroup">Add mapping</span>
            </div>
        </div>
        <div class="form-footer">
            <span class="btn-cancel" @click="cancel">Cancel</span>
            <span class="btn-submit" :class="{ disabled: !isValid }" @click="save">{{ isEditMode ? 'Save Blurb' : 'Create Blurb' }}</span>
        </div>
    </div>
</template>

<script>
import ItemMapper from '../items/form/component/ItemMapper.vue';
import EditorJS from '../controls/input/EditorJS.vue';
import { clone, toDateString, addDay } from '../../../utility';
import { extractPlainText, isEmptyOutputData, legacyTextToOutputData } from '../../../utility/editorjsUtility';
import { BLURB_MAPPING_TYPE } from '../../model/constants';
import { blurbTypes, blurbMappingTypes, timeframes } from '../../model/types';

const ITEM_MAPPER_KIND_BY_TYPE = {
    [BLURB_MAPPING_TYPE.GOAL]: 'goal',
    [BLURB_MAPPING_TYPE.TODO]: 'todo',
    [BLURB_MAPPING_TYPE.METRIC]: 'metric',
};

// Routine has no backend join table (no RoutineIDs on BlurbModel, no BlurbMappingProps support) - excluded from the picker.
const EXCLUDED_MAPPING_TYPES = [BLURB_MAPPING_TYPE.ROUTINE];

const LOCAL_SINGLE_LEVEL_TYPES = [
    BLURB_MAPPING_TYPE.FITNESSGOAL, BLURB_MAPPING_TYPE.FOODITEM, BLURB_MAPPING_TYPE.MEAL,
    BLURB_MAPPING_TYPE.WORKOUT, BLURB_MAPPING_TYPE.EXERCISE, BLURB_MAPPING_TYPE.LOGENTRY,
    BLURB_MAPPING_TYPE.ITERATION,
];

export default {
    name: 'BlurbForm',
    components: { ItemMapper, EditorJS },
    props: {
        blurb: { type: Object, default: undefined },
        datetime: { type: [String, Date], default: undefined }
    },
    data: function () {
        return {
            universalStore: undefined,
            goalStore: undefined,
            todoStore: undefined,
            metricStore: undefined,
            routineStore: undefined,
            iterationStore: undefined,
            workoutStore: undefined,
            physicalStore: undefined,
            plannerStore: undefined,

            title: '',
            json: null,
            selectedTypeIDs: [],
            mappingGroups: [{ idMappingType: undefined, mappings: [] }],
            originalMappings: [],

            activePickerIndex: undefined,
            pickerStep: 1,
            pickerGoal: undefined,
            pickerTodo: undefined,
            pickerTimePair: undefined,
            localPickerItems: [],
            localPickerSearch: '',

            briefingIdTimeframe: undefined,
            briefingIdMetric: undefined,

            blurbTypes: clone(blurbTypes),
            timeframes: clone(timeframes),
            BLURB_MAPPING_TYPE: clone(BLURB_MAPPING_TYPE),
        }
    },
    created: async function() {
        let universalStore = await import('@/store/universalStore');
        this.universalStore = universalStore.useUniversalStore();
        let goalStore = await import('@/store/goalStore');
        this.goalStore = goalStore.useGoalStore();
        let todoStore = await import('@/store/todoStore');
        this.todoStore = todoStore.useTodoStore();
        let metricStore = await import('@/store/metricStore');
        this.metricStore = metricStore.useMetricStore();
        let routineStore = await import('@/store/routineStore');
        this.routineStore = routineStore.useRoutineStore();
        let iterationStore = await import('@/store/iterationStore');
        this.iterationStore = iterationStore.useIterationStore();
        let workoutStore = await import('@/store/workoutStore');
        this.workoutStore = workoutStore.useWorkoutStore();
        let physicalStore = await import('@/store/physicalStore');
        this.physicalStore = physicalStore.usePhysicalStore();
        let plannerStore = await import('@/store/plannerStore');
        this.plannerStore = plannerStore.usePlannerStore();

        this.initFromBlurb();
    },
    computed: {
        isEditMode() {
            return !!this.blurb;
        },
        isValid() {
            return !isEmptyOutputData(this.json);
        },
        canAddMapping() {
            let unusedTypes = this.selectableMappingTypes(-1);
            return this.mappingGroups.every(group => !!group.idMappingType) && unusedTypes.length > 0;
        },
        // Primary mapping type stored on the blurb itself
        idMappingType() {
            let group = this.mappingGroups.find(g => g.idMappingType && g.mappings.length) || this.mappingGroups.find(g => g.idMappingType);
            return group?.idMappingType;
        },
        activeGroup() {
            return this.mappingGroups[this.activePickerIndex];
        },
        pickerMappingType() {
            return this.activeGroup?.idMappingType;
        },
        referenceDate() {
            if (this.blurb && this.blurb.datetime) return new Date(this.blurb.datetime);
            if (this.datetime) return new Date(this.datetime);
            return new Date();
        },
        mappingKind() {
            const T = this.BLURB_MAPPING_TYPE;
            if (ITEM_MAPPER_KIND_BY_TYPE[this.pickerMappingType]) return 'itemMapper';
            if (LOCAL_SINGLE_LEVEL_TYPES.includes(this.pickerMappingType)) return 'local';
            if (this.pickerMappingType == T.GOALTIMEPAIR || this.pickerMappingType == T.GOALTIMEPAIRTODO) return 'cascadeGoal';
            if (this.pickerMappingType == T.TODOTIMEPAIR || this.pickerMappingType == T.TODOREPEAT) return 'cascadeTodo';
            if (this.pickerMappingType == T.BRIEFING) return 'briefing';
            return undefined;
        },
        pickerItemMapperType() {
            if (this.mappingKind == 'itemMapper') return ITEM_MAPPER_KIND_BY_TYPE[this.pickerMappingType];
            if (this.mappingKind == 'cascadeGoal') return 'goal';
            if (this.mappingKind == 'cascadeTodo') return 'todo';
            return undefined;
        },
        filteredLocalPickerItems() {
            if (!this.localPickerSearch) return this.localPickerItems;
            let term = this.localPickerSearch.toLowerCase();
            return this.localPickerItems.filter(item => (item.text || '').toLowerCase().includes(term));
        }
    },
    methods: {
        isTypeSelected(id) {
            return this.selectedTypeIDs.includes(id);
        },
        toggleType(id) {
            let index = this.selectedTypeIDs.indexOf(id);
            if (index == -1) this.selectedTypeIDs.push(id);
            else this.selectedTypeIDs.splice(index, 1);
        },
        selectableMappingTypes(groupIndex) {
            let usedTypes = this.mappingGroups
                .filter((group, index) => index != groupIndex)
                .map(group => group.idMappingType);
            return blurbMappingTypes.filter(type => !EXCLUDED_MAPPING_TYPES.includes(type.id) && !usedTypes.includes(type.id));
        },
        addMappingGroup() {
            if (!this.canAddMapping) return;
            this.closePicker();
            this.mappingGroups.push({ idMappingType: undefined, mappings: [] });
        },
        removeMappingGroup(groupIndex) {
            this.closePicker();
            this.mappingGroups.splice(groupIndex, 1);
        },
        onMappingTypeChange(groupIndex) {
            this.mappingGroups[groupIndex].mappings = [];
            this.closePicker();
        },
        openItemPicker(groupIndex) {
            if (!this.mappingGroups[groupIndex]?.idMappingType) return;
            this.activePickerIndex = groupIndex;
            this.pickerStep = 1;
            this.pickerGoal = undefined;
            this.pickerTodo = undefined;
            this.pickerTimePair = undefined;
            this.localPickerSearch = '';

            if (this.mappingKind == 'local') {
                this.setLocalPickerItems();
            }
        },
        closePicker() {
            this.activePickerIndex = undefined;
            this.pickerStep = 1;
            this.pickerGoal = undefined;
            this.pickerTodo = undefined;
            this.pickerTimePair = undefined;
        },
        onItemMapperSelect(addedIDs) {
            if (!addedIDs || addedIDs.length == 0) return;

            if (this.mappingKind == 'itemMapper') {
                addedIDs.forEach(id => {
                    this.activeGroup.mappings.push({
                        mappingType: this.pickerMappingType,
                        idEntity: id,
                        text: this.lookupItemMapperText(id),
                        idTimeframe: null,
                        idMetric: null
                    });
                });
                this.closePicker();
            } else if (this.mappingKind == 'cascadeGoal' && this.pickerStep == 1) {
                this.pickerGoal = this.goalStore.getItem(addedIDs[0]);
                this.pickerStep = 2;
                this.setLocalPickerItems();
            } else if (this.mappingKind == 'cascadeTodo' && this.pickerStep == 1) {
                this.pickerTodo = this.todoStore.getItem(addedIDs[0]);
                this.pickerStep = 2;
                this.setLocalPickerItems();
            }
        },
        addMappingByID(groupIndex, event) {
            let group = this.mappingGroups[groupIndex];
            let id = Number(event.target.value.trim());
            event.target.value = '';
            if (!group?.idMappingType || !Number.isInteger(id) || id <= 0) return;
            if (group.mappings.some(m => m.idEntity == id)) return;

            group.mappings.push({
                mappingType: group.idMappingType,
                idEntity: id,
                text: this.mappingTextByID(group.idMappingType, id) || `#${id}`,
                idTimeframe: null,
                idMetric: null
            });
        },
        mappingTextByID(idMappingType, id) {
            const T = this.BLURB_MAPPING_TYPE;
            switch (idMappingType) {
                case T.METRIC: return this.metricStore.getItem(id)?.text;
                case T.GOAL:
                case T.FITNESSGOAL: return this.goalStore.getItem(id)?.text;
                case T.TODO: return this.todoStore.getItem(id)?.text;
                case T.ITERATION: return this.iterationStore.getIteration(id)?.text;
                case T.WORKOUT: return this.workoutStore.getWorkout(id)?.name;
                case T.EXERCISE: return this.workoutStore.getExercise(id)?.name;
                case T.LOGENTRY: return this.metricStore.getLogItem(id)?.name;
                default: return undefined;
            }
        },
        lookupItemMapperText(id) {
            const T = this.BLURB_MAPPING_TYPE;
            if (this.pickerMappingType == T.GOAL) return this.goalStore.getItem(id)?.text;
            if (this.pickerMappingType == T.TODO) return this.todoStore.getItem(id)?.text;
            if (this.pickerMappingType == T.METRIC) return this.metricStore.getItem(id)?.text;
            return '';
        },
        setLocalPickerItems() {
            const T = this.BLURB_MAPPING_TYPE;
            let items = [];

            if (this.pickerMappingType == T.FITNESSGOAL) {
                items = this.goalStore.fitnessGoals.map(g => ({ id: g.id, text: g.text }));
            } else if (this.pickerMappingType == T.FOODITEM) {
                if (this.physicalStore.foodItems.length == 0) this.physicalStore.getRecentFoodItems2();
                items = this.physicalStore.foodItems.map(f => ({ id: f.id, text: f.name }));
            } else if (this.pickerMappingType == T.MEAL) {
                let start = addDay(this.referenceDate, -14);
                let end = addDay(this.referenceDate, 14);
                this.physicalStore.getMealsInRange(start, end, true);
                items = this.physicalStore.meals.map(m => ({ id: m.id, text: `${m.name} (${toDateString(m.startAt)})` }));
            } else if (this.pickerMappingType == T.WORKOUT) {
                if (this.workoutStore.workouts.length == 0) this.workoutStore.getWorkouts(true);
                items = this.workoutStore.workouts.map(w => ({ id: w.id, text: w.name }));
            } else if (this.pickerMappingType == T.EXERCISE) {
                if (this.workoutStore.exercises.length == 0) this.workoutStore.getExercises(true);
                items = this.workoutStore.exercises.map(e => ({ id: e.id, text: e.name }));
            } else if (this.pickerMappingType == T.LOGENTRY) {
                if (this.metricStore.logItems.length == 0) this.metricStore.initializeLogItems();
                items = this.metricStore.getLogItems().map(l => ({ id: l.id, text: l.name }));
            } else if (this.pickerMappingType == T.ITERATION) {
                let start = addDay(this.referenceDate, -14);
                let end = addDay(this.referenceDate, 14);
                let iterations = this.iterationStore.getIterationsInRange(+start, +end, true);
                items = iterations.map(it => ({ id: it.id, text: it.text }));
            } else if (this.mappingKind == 'cascadeGoal') {
                if (this.pickerStep == 2 && this.pickerGoal) {
                    items = (this.pickerGoal.timePairs || []).map(tp => ({ id: tp.id, text: this.timePairLabel(tp) }));
                } else if (this.pickerStep == 3 && this.pickerTimePair) {
                    items = (this.pickerTimePair.goalTimePairTodos || []).map(gtpt => {
                        let todo = this.todoStore.getItem(gtpt.todoID);
                        return { id: gtpt.id, text: todo ? todo.text : `Todo ${gtpt.todoID}` };
                    });
                }
            } else if (this.mappingKind == 'cascadeTodo' && this.pickerTodo) {
                if (this.plannerStore.timePairs.length == 0 && this.plannerStore.repeats.length == 0) {
                    this.plannerStore.getRepeatsAndTimePairs();
                }
                if (this.pickerMappingType == T.TODOTIMEPAIR) {
                    items = this.plannerStore.timePairs
                        .filter(tp => tp.idTodo == this.pickerTodo.id)
                        .map(tp => ({ id: tp.id, text: this.timePairLabel(tp) }));
                } else if (this.pickerMappingType == T.TODOREPEAT) {
                    items = this.plannerStore.repeats
                        .filter(r => r.idTodo == this.pickerTodo.id)
                        .map(r => ({ id: r.id, text: this.repeatLabel(r) }));
                }
            }

            this.localPickerItems = items;
        },
        timePairLabel(timePair) {
            if (!timePair) return '';
            let start = timePair.startAt || timePair.startTime;
            let end = timePair.endAt || timePair.endTime;
            let startText = start ? toDateString(start.dateTime || start) : '?';
            let endText = end ? toDateString(end.dateTime || end) : '?';
            return `${startText} - ${endText}`;
        },
        repeatLabel(repeat) {
            if (!repeat) return '';
            let timeframe = this.timeframes.find(t => t.id == repeat.idTimeframe);
            return `Every ${timeframe ? timeframe.text : ''}`;
        },
        onLocalItemPicked(item) {
            if (this.mappingKind == 'cascadeGoal' && this.pickerStep == 2 && this.pickerMappingType == this.BLURB_MAPPING_TYPE.GOALTIMEPAIRTODO) {
                this.pickerTimePair = (this.pickerGoal.timePairs || []).find(tp => tp.id == item.id);
                this.pickerStep = 3;
                this.setLocalPickerItems();
                return;
            }

            this.activeGroup.mappings.push({
                mappingType: this.pickerMappingType,
                idEntity: item.id,
                text: item.text,
                idTimeframe: null,
                idMetric: null
            });
            this.closePicker();
        },
        confirmBriefingMapping() {
            if (!this.briefingIdTimeframe || !this.briefingIdMetric) return;

            let timeframe = this.timeframes.find(t => t.id == this.briefingIdTimeframe);
            let metric = this.metricStore.getItem(this.briefingIdMetric);
            this.activeGroup.mappings.push({
                mappingType: this.BLURB_MAPPING_TYPE.BRIEFING,
                idEntity: null,
                text: `${timeframe ? timeframe.text : ''} / ${metric ? metric.text : ''}`,
                idTimeframe: this.briefingIdTimeframe,
                idMetric: this.briefingIdMetric
            });

            this.briefingIdTimeframe = undefined;
            this.briefingIdMetric = undefined;
            this.closePicker();
        },
        removeMapping(groupIndex, index) {
            this.mappingGroups[groupIndex].mappings.splice(index, 1);
        },
        initFromBlurb() {
            if (!this.blurb) return;

            this.title = this.blurb.title || '';
            this.json = this.blurb.json ? JSON.parse(this.blurb.json) : legacyTextToOutputData(this.blurb.text);
            this.selectedTypeIDs = (this.blurb.typeIDs || []).map(x => x.id);

            const T = this.BLURB_MAPPING_TYPE;
            const idListsByType = {
                [T.METRIC]: { ids: this.blurb.metricIDs, lookup: id => this.metricStore.getItem(id)?.text },
                [T.GOAL]: { ids: this.blurb.goalIDs, lookup: id => this.goalStore.getItem(id)?.text },
                [T.TODO]: { ids: this.blurb.todoIDs, lookup: id => this.todoStore.getItem(id)?.text },
                [T.ITERATION]: { ids: this.blurb.iterationIDs, lookup: id => this.iterationStore.getIteration(id)?.text },
                [T.FITNESSGOAL]: { ids: this.blurb.fitnessGoalIDs, lookup: id => this.goalStore.getItem(id)?.text },
                [T.FOODITEM]: { ids: this.blurb.foodItemIDs, lookup: () => undefined },
                [T.MEAL]: { ids: this.blurb.mealIDs, lookup: () => undefined },
                [T.WORKOUT]: { ids: this.blurb.workoutIDs, lookup: id => this.workoutStore.getWorkout(id)?.name },
                [T.EXERCISE]: { ids: this.blurb.exerciseIDs, lookup: id => this.workoutStore.getExercise(id)?.name },
                [T.LOGENTRY]: { ids: this.blurb.logEntryIDs, lookup: id => this.metricStore.getLogItem(id)?.name },
                [T.TODOTIMEPAIR]: { ids: this.blurb.todoTimePairIDs, lookup: () => undefined },
                [T.TODOREPEAT]: { ids: this.blurb.todoRepeatIDs, lookup: () => undefined },
            };

            let groups = [];
            let pushGroup = (idMappingType, mappings) => {
                if (mappings.length) groups.push({ idMappingType, mappings });
            };
            Object.entries(idListsByType).forEach(([type, entry]) => {
                let idMappingType = Number(type);
                pushGroup(idMappingType, (entry.ids || []).map(childID => ({
                    mappingType: idMappingType,
                    idEntity: childID.id,
                    text: entry.lookup(childID.id) || `#${childID.id}`,
                    idTimeframe: null,
                    idMetric: null
                })));
            });
            pushGroup(T.GOALTIMEPAIR, (this.blurb.goalTimePairs || []).map(tp => ({
                mappingType: T.GOALTIMEPAIR, idEntity: tp.id, text: this.timePairLabel(tp), idTimeframe: null, idMetric: null
            })));
            pushGroup(T.GOALTIMEPAIRTODO, (this.blurb.goalTimePairTodos || []).map(gtpt => {
                let todo = this.todoStore.getItem(gtpt.todoID);
                return { mappingType: T.GOALTIMEPAIRTODO, idEntity: gtpt.id, text: todo ? todo.text : `#${gtpt.id}`, idTimeframe: null, idMetric: null };
            }));
            pushGroup(T.BRIEFING, (this.blurb.positions || [])
                .filter(position => position.parentType == 'Timeframe')
                .map(position => {
                    let timeframe = this.timeframes.find(t => t.id == position.parentID);
                    let metric = this.metricStore.getItem(position.idMetric);
                    return {
                        mappingType: T.BRIEFING, idEntity: null,
                        text: `${timeframe ? timeframe.text : ''} / ${metric ? metric.text : ''}`,
                        idTimeframe: position.parentID, idMetric: position.idMetric ?? null
                    };
                }));

            // Keep the blurb's primary mapping type first
            groups.sort((a, b) => (b.idMappingType == this.blurb.idMappingType) - (a.idMappingType == this.blurb.idMappingType));
            if (groups.length == 0) groups.push({ idMappingType: this.blurb.idMappingType, mappings: [] });

            this.mappingGroups = groups;
            this.originalMappings = groups.flatMap(g => g.mappings);
        },
        mappingKey(mapping) {
            return `${mapping.mappingType}|${mapping.idEntity}|${mapping.idTimeframe}|${mapping.idMetric}`;
        },
        toMappingProps(mapping) {
            return {
                mappingType: mapping.mappingType,
                idEntity: mapping.idEntity ?? null,
                position: null,
                idTimeframe: mapping.idTimeframe ?? null,
                idMetric: mapping.idMetric ?? null,
            };
        },
        async save() {
            if (!this.isValid) return;

            let datetime = this.referenceDate;
            let text = extractPlainText(this.json);
            let json = JSON.stringify(this.json);
            let typeIDs = this.selectedTypeIDs.map((id, index) => ({ id, position: index }));
            let mappings = this.mappingGroups.flatMap(g => g.mappings);

            if (this.isEditMode) {
                let originalTypeIDs = (this.blurb.typeIDs || []).map(x => x.id);
                let typeIDs_Added = this.selectedTypeIDs
                    .filter(id => !originalTypeIDs.includes(id))
                    .map((id, index) => ({ id, position: index }));
                let typeIDs_Removed = originalTypeIDs
                    .filter(id => !this.selectedTypeIDs.includes(id))
                    .map(id => ({ id, position: null }));

                let originalKeys = this.originalMappings.map(this.mappingKey);
                let currentKeys = mappings.map(this.mappingKey);
                let mappings_Added = mappings
                    .filter(m => !originalKeys.includes(this.mappingKey(m)))
                    .map(this.toMappingProps);
                let mappings_Removed = this.originalMappings
                    .filter(m => !currentKeys.includes(this.mappingKey(m)))
                    .map(this.toMappingProps);

                await this.universalStore.updateBlurb(
                    this.blurb.id, this.idMappingType,
                    typeIDs_Added, typeIDs_Removed,
                    text, this.title, datetime,
                    mappings_Added, mappings_Removed, json
                );
            } else {
                await this.universalStore.addBlurb(this.idMappingType, typeIDs, text, this.title, datetime, mappings.map(this.toMappingProps), json);
            }

            this.$emit('saved');
        },
        cancel() {
            this.$emit('cancel');
        }
    }
}
</script>

<style scoped>
.blurb-form {
    background-color: white;
    border-radius: 16px;
    box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.03);
    padding: 48px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 720px;
    text-align: start;
    margin: auto;
    margin-bottom: 32px;
}

.form-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-title {
    margin: 0;
    font-size: 28px;
    font-weight: 800;
    color: #1a1c1e;
}

.form-subtitle {
    margin: 0;
    font-size: 15px;
    color: #6b7280;
}

.form-fields {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.field-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: bold;
    color: #6b7280;
}

.field-label .required {
    color: #ef4444;
}

.field-input,
.field-textarea,
.mapping-select {
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 15px;
    color: #1a1c1e;
    padding: 0 16px;
}

.field-input {
    height: 44px;
}

.field-input::placeholder,
.field-textarea::placeholder {
    color: #9ca3af;
}

.field-textarea {
    height: 180px;
    padding: 12px 16px;
    resize: vertical;
}

.field-editor {
    min-height: 180px;
    padding: 12px 16px;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 15px;
    color: #1a1c1e;
}

.type-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.type-pill {
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    background-color: white;
    border: 1px solid #e5e7eb;
    color: #6b7280;
}

.type-pill.selected {
    background-color: #00897b;
    border-color: #00897b;
    color: white;
}

.mapping-group {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.mapping-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.mapping-select {
    width: 160px;
    height: 44px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
}

.mapping-id-input {
    flex: 1;
    min-width: 0;
    height: 44px;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 15px;
    color: #1a1c1e;
    padding: 0 16px;
}

.mapping-id-input::placeholder {
    color: #9ca3af;
}

.select-items-link {
    cursor: pointer;
    color: #00897b;
    font-weight: bold;
    font-size: 14px;
}

.mapping-group-remove {
    cursor: pointer;
    margin-left: auto;
    color: #9ca3af;
    font-size: 18px;
    font-weight: bold;
}

.add-mapping-link {
    align-self: flex-start;
    cursor: pointer;
    color: #00897b;
    font-weight: bold;
    font-size: 14px;
}

.add-mapping-link::before {
    content: '+ ';
}

.add-mapping-link.disabled {
    color: #9ca3af;
    cursor: default;
    pointer-events: none;
}

.mapping-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
}

.mapping-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background-color: #f3f4f6;
    color: #4b5563;
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 500;
}

.mapping-chip-id {
    font-weight: bold;
    color: #9ca3af;
}

.mapping-chip-remove {
    cursor: pointer;
    font-weight: bold;
}

.picker-popover {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 20;
    margin-top: 4px;
    width: 320px;
    max-height: 320px;
    overflow-y: auto;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    padding: 12px;
}

.search-input {
    height: 36px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 14px;
    margin-bottom: 8px;
}

.local-picker-list {
    max-height: 200px;
    overflow-y: auto;
}

.local-picker-item {
    cursor: pointer;
    padding: 8px;
    font-size: 14px;
    color: #1a1c1e;
    border-radius: 6px;
}

.local-picker-item:hover {
    background-color: #f3f4f6;
}

.local-picker-empty {
    padding: 8px;
    font-size: 13px;
    color: #9ca3af;
}

.picker-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
}

.btn-cancel-picker {
    cursor: pointer;
    font-size: 13px;
    color: #6b7280;
}

.btn-confirm-picker {
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    color: #00897b;
}

.btn-confirm-picker.disabled {
    color: #9ca3af;
    cursor: default;
    pointer-events: none;
}

.form-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.btn-cancel {
    cursor: pointer;
    padding: 10px 16px;
    color: #6b7280;
    font-weight: 600;
    font-size: 15px;
}

.btn-submit {
    cursor: pointer;
    padding: 12px 32px;
    border-radius: 999px;
    background-color: #00897b;
    color: white;
    font-weight: bold;
    font-size: 15px;
}

.btn-submit.disabled {
    background-color: #9ca3af;
    cursor: default;
    pointer-events: none;
}
</style>
