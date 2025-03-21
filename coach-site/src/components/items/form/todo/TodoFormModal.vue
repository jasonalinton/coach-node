<template>
    <div :id="`todo-form-modal-${id}`" class="modal-dialog modal-xl modal-fullscreen-md-down modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <span class="me-2">Todo {{ (todo) ? todo.id : "" }}</span>
                <span class="activity-type" :style="{ 'background-color': activityTypeColor || 'lightskyblue' }">{{ activityType }}</span>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>

            </div>
            <div class="modal-body">
                <div v-if="!mapper.isShown" class="container-fluid">
                    <div class="row g-2">
                        <div class="col-12">
                            <div class="d-flex flex-column">
                                <!-- Text -->
                                <div class="text-wrapper">
                                    <input id="text" class="textbox" type="text" placeholder="Title"
                                        v-model.lazy.trim="text.value" 
                                        spellcheck="true"/>
                                </div>
                                <!-- Toolbar -->
                                <div class="toolbar d-flex flex-row mt-1">
                                    <!-- Metrics -->
                                    <div class="metrics d-flex flex-row">
                                        <span v-for="metric in metrics" :key="metric.id"
                                              class="metric" :class="{ 'active': hasMetric(metric.id)}"
                                              @click="toggleMetric(metric.id)">{{ metric.text }}</span>
                                    </div>
                                    <!-- Points -->
                                    <div class="input-wrrapper d-flex flex-row">
                                        <label class="me-1" :for="`todo-${id}-points`">Points</label>
                                        <input type="number" class="form-control form-control-sm" :id="`todo-${id}-points`"
                                               :value="points.value"
                                               @blur="points.value = $event.target.value">
                                    </div>
                                    <!-- Type -->
                                    <div class="input-wrrapper d-flex flex-row">
                                        <label class="me-1" :for="`todo-${id}-type`">Type</label>
                                        <select :id="`todo-${id}-type`" class="form-select form-select-sm" aria-label="select" v-model="typeID.value"> 
                                            <option :value="null">None</option> 
                                            <option v-for="todoType in todoTypes" v-bind:key="todoType.id" :value="todoType.id">{{todoType.text}}</option> 
                                        </select>
                                    </div>
                                    <!-- Meduim -->
                                    <div class="input-wrrapper d-flex flex-row">
                                        <label class="me-1" :for="`todo-${id}-type`">Meduim</label>
                                        <select :id="`todo-${id}-type`" class="form-select form-select-sm" aria-label="select" v-model="mediumID.value"> 
                                            <option :value="null">None</option> 
                                            <option v-for="medium in mediums" v-bind:key="medium.id" :value="medium.id">{{medium.text}}</option> 
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row g-2 pt-2">
                        <div class="col-12 col-sm-4">
                            <!-- Description -->
                            <div class="d-flex flex-column">
                                <div class="header d-flex flex-column">
                                    <div class="d-flex flex-row justify-content-between">
                                        <span class="text-start">Description</span>
                                        <img class="mt-auto mb-auto me-2" src="/icon/caret-right.png" width="5" height="8"/>
                                    </div>
                                    <hr/>
                                </div>
                                <textarea class="textarea" 
                                          v-model.lazy.trim="description.value"
                                          spellcheck="true"></textarea>
                            </div>
                        </div>
                        <!-- Item Mapping -->
                        <div class="col-6 col-sm-4 form-column">
                            <!-- Parents -->
                            <FormItemList itemType="todo" :itemIDs="parentIDs" :isParent="true"
                                          parentType="todo" :parentID="id" :repeatIDs="repeatIDs"
                                          @addItemClicked="addItemClicked" @addItem="addItem"/>
                            <!-- Children -->
                            <FormItemList itemType="todo" :itemIDs="childIDs" :isChild="true"
                                          parentType="todo" :parentID="id" :repeatIDs="repeatIDs"
                                          @addItemClicked="addItemClicked" @addItem="addItem"/>
                            <!-- Goals -->
                            <FormItemList itemType="goal" :itemIDs="goalIDs" :isChild="false"
                                          parentType="todo" :parentID="id" :repeatIDs="repeatIDs"
                                          @addItemClicked="addItemClicked" @addItem="addItem"/>
                        </div>
                        <div class="col-6 col-sm-4 d-flex flex-column">
                            <!-- Repetition -->
                            <div>
                                <span class="form-head">Repetition</span>
                                <!-- Quick Add Item -->
                                <div class="d-flex justify-content-between mt-1 mb-1">
                                    <button class="add-btn my-auto" type="button" @click="addRepeatClicked">
                                        <img src="/icon/button/add.png" width="10" height="10"/>Add
                                    </button>
                                </div>
                                <div>
                                    <RepeatControl v-for="repeat in repeats.value" :key="repeat.id"
                                                   :repeat="repeat" :itemID="id" itemType="todo" :canEdit="selectedRepeatID == undefined"
                                                   @saveRepeat="saveRepeat" @setSelectedRepeat="setSelectedRepeat" @cancelRepeatEditing="cancelRepeatEditing"
                                                   @refreshRepetition="refreshRepetitionForRepeat"
                                                   @deleteFutureRepetitions="deleteFutureRepetitionsForRepeat"/>
                                </div>
                            </div>
                            <!-- Time -->
                            <div>
                                <span class="form-head">Time</span>
                                <!-- Quick Add Item -->
                                <div class="d-flex justify-content-between mt-1 mb-1">
                                    <button class="add-btn my-auto" type="button" @click="addTimeClicked">
                                        <img src="/icon/button/add.png" width="10" height="10"/>Add
                                    </button>
                                </div>
                                <div>
                                    <TimePairControl v-for="timePair in timePairs.value" :key="timePair.id"
                                                     :timePair="timePair" :itemID="id" itemType="todo" :canEdit="selectedTimePairID == undefined"
                                                     @saveTimePair="saveTimePair" @setSelectedTimePair="setSelectedTimePair" @cancelTimePairEditing="cancelTimePairEditing"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="mapper.isShown" class="container">
                    <div class="row g-2">
                        <div class="col-12">
                            <ItemMapper v-if="mapper.type == 'parent'" 
                                        itemType="todo" :selectedIDs="parentIDs" 
                                        @close="mapper.isShown=false" @cancel="cancelMapping" @select="(x,y) => selectItems('parent', x, y)"/>
                            <ItemMapper v-if="mapper.type == 'child'" 
                                        itemType="todo" :selectedIDs="childIDs" 
                                        @close="mapper.isShown=false" @cancel="cancelMapping" @select="(x,y) => selectItems('child', x, y)"/>
                            <ItemMapper v-if="mapper.type == 'goal'" 
                                        itemType="goal" :selectedIDs="goalIDs" 
                                        @close="mapper.isShown=false" @cancel="cancelMapping" @select="(x,y) => selectItems('goal', x, y)"/>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!mapper.isShown" class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="createTask">Create Task</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="save">Save</button>
            </div>
        </div>
    </div>
</template>

<script>
import RepeatControl from '../component/RepeatControl.vue';
import TimePairControl from '../component/TimePairControl.vue';
import FormItemList from '../component/FormItemList.vue';
import ItemMapper from '../component/ItemMapper.vue'
import { clone, replaceItem, addOrReplaceItem, sortItems, sortAsc } from '../../../../../utility';
import { metrics, todoTypes, mediums, todoActivityTypes } from '../../../../model/types';

export default {
    name: "TodoFormModal",
    components: { RepeatControl, TimePairControl, ItemMapper, FormItemList },
    props: {
      id: Number
    },
    data: function() {
        return {
            store: null,
            plannerStore: null,
            metrics: clone(metrics),
            todoTypes: clone(todoTypes),
            mediums: clone(mediums),
            todoActivityTypes: clone(todoActivityTypes),
            text: {
                value: undefined,
                oldValue: undefined,
                isUpdated: false
            },
            description: {
                value: undefined,
                oldValue: undefined,
                isUpdated: false
            },
            points: {
                value: undefined,
                oldValue: undefined,
                isUpdated: false
            },
            typeID: {
                value: undefined,
                oldValue: undefined,
                isUpdated: false
            },
            mediumID: {
                value: undefined,
                oldValue: undefined,
                isUpdated: false
            },
            metricIDs: {
                value: [],
                oldValue: [],
                isUpdated: false
            },
            repeats: {
                value: [],
                added: [],
                deletedIDs: []
            },
            timePairs: {
                value: [],
                added: [],
                deletedIDs: []
            },
            todos: {
                ids: [],
                value: [],
                newItems: [],
                addedIDs: [],
                removedIDs: []
            },
            selectedRepeatID: undefined,
            selectedTimePairID: undefined,
            mapper: {
                isShown: false,
                type: undefined
            },
        }
    },
    created: async function() {
        let todoStore = await import(`@/store/todoStore`);
        this.store = todoStore.useTodoStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let todo = this.store.getItem(this.id);
        this.setProps(todo);
    },
    computed: {
        todo() {
            if (this.store) {
                let todo = this.store.getItem(this.id);
                this.setProps(todo);
                return todo;
            } else {
                return null;
            }
        },
        parentIDs() {
            if (this.todo) {
                var parents = sortItems(this.todo.parents, "todo", this.id);
                return parents.map(x => x.id);
            } else {
                return [];
            }
        },
        childIDs() {
            if (this.todo) {
                var children = sortItems(this.todo.children, "todo", this.id);
                return children.map(x => x.id);
            } else {
                return [];
            }
        },
        goalIDs() {
            if (this.todo) {
                var goals = sortItems(this.todo.goals, "todo", this.id);
                return goals.map(x => x.id);
            } else {
                return [];
            }
        },
        repeatIDs() {
            if (this.repeats?.value) {
                return this.repeats.value.map(x => x.id);
            } else {
                return [];
            }
        },
        activityType() {
            if (this.todo && this.todo.activityTypeID)  {
                let activityType = this.todoActivityTypes.find(x => x.id == this.todo.activityTypeID);
                if (activityType) {
                    return activityType.text;
                }
            }
            return undefined;
        },
        activityTypeColor() {
            if (this.todo && this.todo.activityTypeID)  {
                let activityType = this.todoActivityTypes.find(x => x.id == this.todo.activityTypeID);
                if (activityType) {
                    return activityType.color;
                }
            }
            return undefined;
        }
    },
    methods: {
        setProps(todo) {
            this.text.value = todo.text;
            this.text.oldValue = todo.text;
            this.text.isUpdated = false;

            this.description.value = todo.description;
            this.description.oldValue = todo.description;
            this.description.isUpdated = false;

            this.points.value = todo.points;
            this.points.oldValue = todo.points;
            this.points.isUpdated = false;

            this.typeID.value = todo.typeID;
            this.typeID.oldValue = todo.typeID;
            this.typeID.isUpdated = false;

            this.mediumID.value = todo.mediumID;
            this.mediumID.oldValue = todo.mediumID;
            this.mediumID.isUpdated = false;

            this.metricIDs.value = clone(todo.metricIDs),
            this.metricIDs.oldValue = clone(todo.metricIDs),
            this.metricIDs.isUpdated = false;

            this.repeats.value = clone(todo.repeats),
            this.repeats.added = [];
            this.repeats.updated = [];
            this.repeats.deletedIDs = [];

            this.timePairs.value = clone(todo.timePairs),
            this.timePairs.added = [];
            this.timePairs.updated = [];
            this.timePairs.deletedIDs = [];

        },
        setSelectedRepeat(repeatID) {
            this.selectedRepeatID = repeatID;
        },
        setSelectedTimePair(timePairID) {
            this.selectedTimePairID = timePairID;
        },
        selectItems(itemType, addedIDs, removedIDs) {
            this.store.mapItems(this.id, itemType, addedIDs, removedIDs);

            this.mapper.isShown = false;
            this.mapper.type = undefined;

        },
        saveRepeat(repeat) {
            let _repeat = clone(repeat);
            _repeat.startRepeat = _repeat.startRepeat.value;
            _repeat.endRepeat = (_repeat.endRepeat) ? _repeat.endRepeat.value : null;
            _repeat.startIteration = (_repeat.startIteration) ? _repeat.startIteration.value : null;
            _repeat.endIteration = (_repeat.endIteration) ? _repeat.endIteration.value : null;
            replaceItem(_repeat, this.repeats.value);
            
            let savedRepeat = clone(repeat);
            if (repeat.id > 0) {
                addOrReplaceItem(savedRepeat, this.repeats.updated);
            } else {
                addOrReplaceItem(savedRepeat, this.repeats.added);
            }

            this.selectedRepeatID = undefined;
        },
        saveTimePair(timePair) {
            let _timePair = clone(timePair);
            _timePair.startTime = (_timePair.startTime) ? _timePair.startTime.value : null;
            _timePair.endTime = (_timePair.endTime) ? _timePair.endTime.value : null;
            replaceItem(_timePair, this.timePairs.value);
            
            let savedTimePair = clone(timePair);
            if (timePair.id > 0) {
                addOrReplaceItem(savedTimePair, this.timePairs.updated);
            } else {
                addOrReplaceItem(savedTimePair, this.timePairs.added);
            }

            this.selectedTimePairID = undefined;
        },
        save() {
            let model = {
                id: this.id,
                text: this.text,
            };
            this.store.saveTodo(model);
            this.$emit("closeItemModal");
        },
        saveText() {
            if (this.id > 0) {
                if (this.text.value.trim() != "" && this.text.value != this.text.oldValue) {
                    this.store.saveText(this.id, this.text.value);
                }
            }
        },
        saveDescription() {
            if (this.id > 0) {
                if (this.description.value.trim() != "" && this.description.value != this.description.oldValue) {
                    this.store.saveDescription(this.id, this.description.value);
                }
            }
        },
        savePoints() {
            if (this.id > 0) {
                if (this.points.value.trim() != "" && this.points.value != this.points.oldValue) {
                    this.store.savePoints(this.id, this.points.value);
                }
            }
        },
        saveType() {
            if (this.id > 0) {
                if (this.typeID.value != this.typeID.oldValue) {
                    this.store.saveType(this.id, this.typeID.value);
                }
            }
        },
        saveMedium() {
            if (this.id > 0) {
                if (this.mediumID.value != this.mediumID.oldValue) {
                    this.store.saveMedium(this.id, this.mediumID.value);
                }
            }
        },
        toggleMetric(metricID) {
            if (!this.metricIDs.value.includes(metricID)) { // Add metric
                this.metricIDs.value.push(metricID);
                this.store.mapItems(this.id, "metric", [metricID], []);
            } else { // Remove metric
                let index = this.metricIDs.value.indexOf(metricID);
                this.metricIDs.value.splice(index, 1);
                this.store.mapItems(this.id, "metric", [], [metricID]);
            }
        },
        hasMetric(metricID) {
            return (this.metricIDs.value.includes(metricID)) ? true : false;
        },
        createTask() {
            this.store.createTask(this.id, this.plannerStore.selectedDate);
        },
        addItem(itemType, itemText) {
            this.store.createAndMapItem(this.id, itemType, itemText);
        },
        addItemClicked(itemType) {
            this.mapper.isShown = true;
            this.mapper.type = itemType;
        },
        addTimeClicked() {
            let timePairs = sortAsc(this.timePairs.value, 'id');
            let newTimePair = this.plannerStore.createTimePair();
            newTimePair.id = (timePairs.length > 0 && timePairs[0].id < 0) ? timePairs[0].id - 1 : -1;
            this.timePairs.value.unshift(newTimePair);
        },
        addRepeatClicked() {
            let repeats = sortAsc(this.repeats.value, 'id');
            let newRepeat = this.plannerStore.createRepeat();
            newRepeat.id = (repeats.length > 0 && repeats[0].id < 0) ? repeats[0].id - 1 : -1;
            this.repeats.value.unshift(newRepeat);
        },
        cancelMapping() {
            this.mapper.isShown = false;
            this.mapper.type = undefined;
        },
        cancelRepeatEditing(id) {
            if (id < 0) {
                let index = this.repeats.value.findIndex(x => x.id == id);
                this.repeats.value.splice(index, 1)
            }
            this.selectedRepeatID = undefined;
        },
        cancelTimePairEditing(id) {
            if (id < 0) {
                let index = this.timePairs.value.findIndex(x => x.id == id);
                this.timePairs.value.splice(index, 1)
            }
            this.selectedTimePairID = undefined;
        },
        refreshRepetitionForRepeat(repeatID) {
            this.store.refreshRepetitionForRepeat(this.id, repeatID)
        },
        deleteFutureRepetitionsForRepeat(repeatID, selectedDate) {
            this.store.deleteFutureRepetitionsForRepeat(this.id, repeatID, selectedDate)
        },
    },
    watch: {
        'text.value'(value) {
            if (value != this.text.oldValue) {
                this.text.isUpdated = true;
                this.saveText();
            } else {
                this.isUpdated = false;
            }
        },
        'description.value'(value) {
            if (value != this.description.oldValue) {
                this.description.isUpdated = true;
                this.saveDescription();
            } else {
                this.isUpdated = false;
            }
        },
        'points.value'(value) {
            if (value != this.points.oldValue) {
                this.points.isUpdated = true;
                this.savePoints();
            } else {
                this.isUpdated = false;
            }
        },
        'typeID.value'(value) {
            if (value != this.typeID.oldValue) {
                this.typeID.isUpdated = true;
                this.saveType();
            } else {
                this.isUpdated = false;
            }
        },
        'mediumID.value'(value) {
            if (value != this.mediumID.oldValue) {
                this.mediumID.isUpdated = true;
                this.saveMedium();
            } else {
                this.isUpdated = false;
            }
        },
    }
}
</script>

<style scoped>
.modal-header {
    padding: 4px 16px 0 26px;
    border-bottom: none;
}

.modal-body {
    padding: 0px;
}

.modal-tital {
    font-size: 1rem;
}

.btn-close {
    width: 6px;
    height: 6px;
}

.activity-type {
    border-radius: 4px;
    color: white;
    padding: 0 4px;
    font-size: 14px;
}

.text-wrapper {
    padding-left: 16px;
    padding-right: 16px;
}

#text {
    height: 52px;
    font-size: 32px;
}

.input-wrrapper {
    height: 31px;
    line-height: 31px;
}

.form-column {
    overflow: auto;
}

.form-head {
    font-size: 20px;
    text-align: start;
    width: 100%;
    display: inline-block;
}

.toolbar {
    height: 60px;
    background-color: #F5F5F5;
}

.toolbar .metric {
    font-size: 20px;
    padding: 8px;
    margin: auto 0 auto 0;
    border: solid 1px transparent;
}

.toolbar .metric.active {
    border: solid 1px black;
    border-radius: 10px;
}

.header {
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
}

.header:hover {
    color: #005A9E;
}

.header:hover hr{
    background-color: #005A9E;
}

hr {
    margin: 3px 0 4px 0;
}

.points {
    height: 30px;
}
</style>