<template>
    <div :id="`metric-form-modal-${id}`" class="modal-dialog modal-xl modal-fullscreen-md-down modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
        <div class="modal-header">
            <span class="me-2">Metric {{ (metric) ? metric.id : "" }}</span>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div v-if="!mapper.isShown && !isKanbanShown" class="container-fluid">
                <div class="label row gx-0">
                    <div class="col">
                        <input id="text" class="textbox" type="text" placeholder="Title"
                               v-model.lazy.trim="text.value"
                               v-on:keyup.enter="save()"
                               spellcheck="true"/>
                    </div>
                </div>
                <div class="body row gx-0">
                        <div class="blurb d-flex flex-column col-12 col-sm-12 col-md-6 col-lg-6 mt-2 gap-2">
                            <!-- Description -->
                            <div class="description d-flex flex-column">
                                <div class="header d-flex flex-column">
                                    <div class="d-flex flex-row justify-content-between">
                                        <span class="form-head text-start">Description</span>
                                        <img class="caret mt-auto mb-auto me-2" src="/icon/caret-right.png" width="5" height="8"/>
                                    </div>
                                    <hr/>
                                </div>
                                <textarea class="textarea"
                                          v-model.lazy.trim="description.value"
                                          placeholder="Click to add Description"
                                          spellcheck="true"></textarea>
                            </div>
                            <!-- Reasons -->
                            <BlurbFormControl header="Reasons" placeholder="Click to add Reason" :blurbs="reasons"
                                              @addBlurb="addReason($event)" @saveBlurb="updateBlurb($event)" />
                            <!-- Blurbs -->
                            <BlurbFormControl header="Blurbs" placeholder="Click to add Blurb" :blurbs="blurbs" :showTitle="true"
                                              @addBlurb="addBlurb($event)" @saveBlurb="updateBlurb($event)" />
                        </div>
                        <div class="items col-12 col-sm-12 col-md-6 col-lg-6 mt-2 form-column">
                            <!-- Routines -->
                            <FormItemList itemType="routine" :itemIDs="routineIDs"
                                          parentType="metric" :parentID="id" :repeatIDs="[]"
                                          @addItemClicked="addItemClicked" @addItem="addItem"/>
                            <!-- Goals -->
                            <FormItemList itemType="goal" :itemIDs="goalIDs"
                                          parentType="metric" :parentID="id" :repeatIDs="[]"
                                          @addItemClicked="addItemClicked" @addItem="addItem"/>
                            <!-- Todos -->
                            <FormItemList itemType="todo" :itemIDs="todoIDs"
                                          parentType="metric" :parentID="id" :repeatIDs="[]"
                                          @addItemClicked="addItemClicked" @addItem="addItem"/>
                        </div>
                    </div>
            </div>
            <div v-if="mapper.isShown" class="container">
                <div class="row g-2">
                    <div class="col-12">
                        <ItemMapper v-if="mapper.type == 'routine'"
                                    itemType="routine" :selectedIDs="routineIDs"
                                    @close="mapper.isShown=false" @cancel="cancelMapping" @select="(x,y) => selectItems('routine', x, y)"/>
                        <ItemMapper v-if="mapper.type == 'goal'"
                                    itemType="goal" :selectedIDs="goalIDs"
                                    @close="mapper.isShown=false" @cancel="cancelMapping" @select="(x,y) => selectItems('goal', x, y)"/>
                        <ItemMapper v-if="mapper.type == 'todo'"
                                    itemType="todo" :selectedIDs="todoIDs"
                                    @close="mapper.isShown=false" @cancel="cancelMapping" @select="(x,y) => selectItems('todo', x, y)"/>
                    </div>
                </div>
            </div>
            <div v-if="isKanbanShown" class="container-fluid">
                <ItemKanban :idParent="id" :idKanbanType="ITEMTYPES.METRIC" />
            </div>
        </div>
        <div v-if="!mapper.isShown && !isKanbanShown" class="modal-footer">
            <button type="button" class="btn btn-info" @click="showKanban">Kanban</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <!-- <button type="button" class="btn btn-primary" @click="save()">Save changes</button> -->
        </div>
        <div v-if="isKanbanShown" class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="isKanbanShown = false">Back</button>
        </div>
        </div>
    </div>
</template>

<script>
import FormItemList from '../component/FormItemList.vue';
import ItemMapper from '../component/ItemMapper.vue';
import BlurbFormControl from '../component/BlurbFormControl.vue';
import ItemKanban from '../component/ItemKanban.vue';
import { sortItems } from '../../../../../utility';
import { BLURBTYPE, ITEMTYPES } from '../../../../model/constants'

export default {
    name: "MetricFormModal",
    components: { ItemMapper, FormItemList, BlurbFormControl, ItemKanban },
    props: {
      id: Number
    },
    data: function() {
        return {
            store: null,
            BLURBTYPE: BLURBTYPE,
            ITEMTYPES: ITEMTYPES,
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
            reasons: [],
            blurbs: [],
            mapper: {
                isShown: false,
                type: undefined
            },
            isKanbanShown: false
        }
    },
    created: async function() {
        let metricStore = await import(`@/store/metricStore`);
        this.store = metricStore.useMetricStore();

        let metric = this.store.getItem(this.id);
        this.setProps(metric);
    },
    computed: {
        metric() {
            if (this.store) {
                let metric = this.store.getItem(this.id);
                this.setProps(metric);
                return metric;
            } else {
                return null;
            }
        },
        routineIDs() {
            if (this.metric) {
                var routines = sortItems(this.metric.routines, "metric", this.id);
                return routines.map(x => x.id);
            } else {
                return [];
            }
        },
        goalIDs() {
            if (this.metric) {
                var goals = sortItems(this.metric.goals, "metric", this.id);
                return goals.map(x => x.id);
            } else {
                return [];
            }
        },
        todoIDs() {
            if (this.metric) {
                var todos = sortItems(this.metric.todos, "metric", this.id);
                return todos.map(x => x.id);
            } else {
                return [];
            }
        }
    },
    methods: {
        setProps(metric) {
            this.text.value = metric.text;
            this.text.oldValue = metric.text;
            this.text.isUpdated = false;

            this.description.value = metric.description;
            this.description.oldValue = metric.description;
            this.description.isUpdated = false;

            // this.reasons = metric.blurbs.filter(x => x.idType == this.BLURBTYPE.REASON);
            // this.blurbs = metric.blurbs.filter(x => x.idType == this.BLURBTYPE.BLURB);
        },
        selectItems(itemType, addedIDs, removedIDs) {
            this.store.mapItems(this.id, itemType, addedIDs, removedIDs);

            this.mapper.isShown = false;
            this.mapper.type = undefined;
        },
        saveDescription() {
            if (this.id > 0) {
                if (this.description.value.trim() != "" && this.description.value != this.description.oldValue) {
                    this.store.saveDescription(this.id, this.description.value);
                }
            }
        },
        // save() {
        //     let model = {
        //         id: this.id,
        //         text: this.text
        //     };
        //     this.store.saveMetric(model);
        //     this.$emit("closeItemModal");
        // },
        addItem(itemType, itemText) {
            this.store.createAndMapItem(this.id, itemType, itemText);
        },
        addItemClicked(itemType) {
            this.mapper.isShown = true;
            this.mapper.type = itemType;
        },
        addReason(blurb) {
            if (this.id > 0) {
                if (blurb.text.trim() != "") {
                    blurb.idType = BLURBTYPE.REASON;
                    this.store.addBlurb(this.id, blurb);
                }
            }
        },
        addBlurb(blurb) {
            if (this.id > 0) {
                if (blurb.text.trim() != "") {
                    blurb.idType = BLURBTYPE.BLURB;
                    this.store.addBlurb(this.id, blurb);
                }
            }
        },
        updateBlurb(blurb) {
            if (this.id > 0) {
                if (blurb.text.trim() != "") {
                    blurb.idType = BLURBTYPE.BLURB;
                    this.store.updateBlurb(blurb);
                }
            }
        },
        cancelMapping() {
            this.mapper.isShown = false;
            this.mapper.type = undefined;
        },
        showKanban() {
            this.isKanbanShown = true;
        }
    },
    watch: {
        'text.value'(value) {
            if (value != this.text.oldValue) {
                this.text.isUpdated = true;
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
    }
}
</script>

<style scoped>
.modal-header {
    padding: 4px 16px 0 18px;
    border-bottom: none;
    border-left: var(--metric-color, #8A8A8A) solid 8px;
}

.modal-body {
    padding: 0px;
}

.label.row {
    border-left: var(--metric-color, #8A8A8A) solid 8px;
    padding-left: 8px;
    padding-right: 16px;
}

.body.row {
    padding: 6px 16px;
}

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
    font-weight: 500;
}

.caret {
    visibility: hidden;
}

.header {
    cursor: default;
}

.header:hover .form-head {
    color: var(--form-header-hover);
}

.header:hover .caret {
    visibility: visible;
}

hr {
    margin-top: 3px;
    margin-bottom: 3px;
    color: #8A8A8A
}

.btn-close {
    font-size: 12px;
}

.blurb {
    padding-right: 8px;
    overflow: scroll;
}

.description {
    margin-bottom: 8px;
}

.items {
    padding-left: 8px;
    padding-right: 8px
}
</style>
