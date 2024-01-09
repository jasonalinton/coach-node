<template>
    <div :id="`goal-form-modal-${id}`" class="modal-dialog modal-xl modal-fullscreen-md-down modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" :id="`goal-${id}-ModalLabel`">{{ (goal) ? goal.id : "" }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div v-if="!mapper.isShown" class="container-fluid">
                <div class="row g-2">
                    <div class="col-sm-12 col-lg-7 col-xl-8">
                        <input id="text" class="textbox" type="text" placeholder="Title"
                               v-model.lazy.trim="text.value" 
                               v-on:keyup.enter="save()"
                               spellcheck/>
                    </div>
                    <div class="col-sm-12 col-lg-5 col-xl-4">
                        <TimeframeControl v-if="timeframes.value" 
                                          :selectedTimeframes="timeframes.value"
                                          @toggleTimeframe="toggleTimeframe($event)"/>
                    </div>
                </div>
                <div class="row g-2">
                        <div class="col-12 col-sm-4">
                            
                        </div>
                        <div class="col-6 col-sm-4 form-column">
                            <FormItemList itemType="goal" :itemIDs="childIDs" :isChild="true"
                                          parentType="goal" :parentID="id" :repeatIDs="repeatIDs"
                                          @addItemClicked="addChildClicked" @addItem="addItem"/>
                        </div>
                        <div class="col-6 col-sm-4 d-flex flex-column">
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
                                                   :repeat="repeat" :itemID="id" itemType="goal" :canEdit="selectedRepeatID == undefined"
                                                   @saveRepeat="saveRepeat" @setSelectedRepeat="setSelectedRepeat" @cancelRepeatEditing="cancelRepeatEditing"/>
                                </div>
                            </div>
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
                                                     :timePair="timePair" :itemID="id" itemType="goal" :canEdit="selectedTimePairID == undefined"
                                                     @saveTimePair="saveTimePair" @setSelectedTimePair="setSelectedTimePair" @cancelTimePairEditing="cancelTimePairEditing"/>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            <div v-if="mapper.isShown && mapper.type == 'children'" class="container">
                <div class="row g-2">
                    <div class="col-12">
                        <ItemMapper itemType="goal" :selectedIDs="childIDs" 
                                    @close="mapper.isShown=false" @cancel="cancelMapping" @select="selectChildren"/>
                    </div>
                </div>
            </div>  
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="save()">Save changes</button>
        </div>
        </div>
    </div>
</template>

<script>
import { saveGoal, mapChildren, createAndMapItem } from '../../../../api/goalAPI';
import TimeframeControl from '../component/TimeframeControl.vue';
import RepeatControl from '../component/RepeatControl.vue';
import TimePairControl from '../component/TimePairControl.vue';
import FormItemList from '../component/FormItemList.vue';
import ItemMapper from '../component/ItemMapper.vue';
import { clone, replaceItem, addOrReplaceItem, sortItems, sortAsc } from '../../../../../utility';

export default {
    name: "GoalFormModal",
    components: { TimeframeControl, RepeatControl, TimePairControl, ItemMapper, FormItemList },
    props: {
      id: Number
    },
    data: function() {
        return {
            store: null,
            plannerStore: null,
            text: {
                value: undefined,
                oldValue: undefined,
                isUpdated: false
            },
            timeframes: {
                value: undefined,
                original: undefined,
                addedIDs: undefined,
                removedIDs: undefined
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
            children: {
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
        let goalStore = await import(`@/store/goalStore`);
        this.store = goalStore.useGoalStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let goal = this.store.getItem(this.id);
        this.setProps(goal);
    },
    computed: {
        goal() {
            if (this.store) {
                let goal = this.store.getItem(this.id);
                this.setProps(goal);
                return goal;
            } else {
                return null;
            }
        },
        childIDs() {
            if (this.goal) {
                var children = sortItems(this.goal.children, "goal", this.id);
                return children.map(x => x.id);
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
        }
    },
    methods: {
        setProps(goal) {
            this.text.value = goal.text;
            this.text.oldValue = goal.text;
            this.text.isUpdated = false;

            this.timeframes = {
                value: [],
                original: [],
                addedIDs: [],
                removedIDs: []
            }
            goal.timeframes.forEach(x => {
                this.timeframes.value.push(x);
                this.timeframes.original.push(x);
            })
        },
        setSelectedRepeat(repeatID) {
            this.selectedRepeatID = repeatID;
        },
        setSelectedTimePair(timePairID) {
            this.selectedTimePairID = timePairID;
        },
        toggleTimeframe(event) {
            if (event.isSelected) {
                this.addTimeframe(event);
            } else {
                this.removeTimeframe(event);
            }
        },
        addTimeframe(timeframe) {
            /* Add timeframe to array if not already there */
            let exists = this.timeframes.value.findIndex(x => x.id == timeframe.id);
            if (exists == -1) {
                this.timeframes.value.push(timeframe);

                /* If timeframe wasn't in original array, add ID to added ID's */
                if (this.timeframes.original.findIndex(x => x.id == timeframe.id) == -1) {
                    this.timeframes.addedIDs.push(timeframe.id);
                }

                /* Make sure ID in not marked as removed */
                var index_ID = this.timeframes.removedIDs.findIndex(x => x == timeframe.id);
                if (index_ID > -1)
                    this.timeframes.removedIDs.splice(index_ID, 1);
            }
        },
        removeTimeframe(timeframe) {
            let exists = this.timeframes.value.findIndex(x => x.id == timeframe.id);
            if (exists > -1) {
                this.timeframes.value.splice(exists, 1);
                
                /* If timeframe was in original array, add ID to removed ID's */
                if (this.timeframes.original.findIndex(x => x.id == timeframe.id) > -1) {
                    this.timeframes.removedIDs.push(timeframe.id);
                }
                
                /* Make sure ID in not marked as added */
                var index_ID = this.timeframes.addedIDs.findIndex(x => x == timeframe.id);
                if (index_ID > -1)
                    this.timeframes.addedIDs.splice(index_ID, 1);
            }
        },
        selectChildren(addedIDs, removedIDs) {
            this.children.addedIDs = [...addedIDs];
            this.children.removedIDs = [...removedIDs];

            mapChildren(this.id, addedIDs, removedIDs);

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
            _timePair.startAt = (_timePair.startAt) ? _timePair.startAt.value : null;
            _timePair.endAt = (_timePair.endAt) ? _timePair.endAt.value : null;
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
                timeframes: this.timeframes
            };
            saveGoal(model);
            this.$emit("closeItemModal");
        },
        addItem(itemType, itemText) {
            createAndMapItem(this.id, itemType, itemText);
        },
        addChildClicked() {
            this.mapper.isShown = true;
            this.mapper.type = "children";
        },
        addRepeatClicked() {
            let repeats = sortAsc(this.repeats.value, 'id');
            let newRepeat = this.plannerStore.createRepeat();
            newRepeat.id = (repeats.length > 0 && repeats[0].id < 0) ? repeats[0].id - 1 : -1;
            this.repeats.value.unshift(newRepeat);
        },
        addTimeClicked() {
            let timePairs = sortAsc(this.timePairs.value, 'id');
            let newTimePair = this.plannerStore.createTimePair();
            newTimePair.id = (timePairs.length > 0 && timePairs[0].id < 0) ? timePairs[0].id - 1 : -1;
            this.timePairs.value.unshift(newTimePair);
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
        }
    },
    watch: {
        'text.value'(value) {
            if (value != this.text.oldValue) {
                this.text.isUpdated = true;
            } else {
                this.isUpdated = false;
            }
        }
    }
}
</script>

<style scoped>
#text {
    height: 52px;
    font-size: 32px;
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
</style>