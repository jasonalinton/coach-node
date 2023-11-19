<template>
    <div class="modal-dialog modal-xl modal-fullscreen-md-down modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" :id="`goal-${id}-ModalLabel`">Modal title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="container">
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
import { saveGoal } from '../../../../api/goalAPI';
import TimeframeControl from '../component/TimeframeControl.vue';

export default {
    name: "GoalFormModal",
    components: { TimeframeControl },
    props: {
      id: Number
    },
    data: function() {
        return {
            store: null,
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
            }
        }
    },
    created: async function() {
        let goalStore = await import(`@/store/goalStore`);
        this.store = goalStore.useGoalStore();

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
        save() {
            let model = {
                id: this.id,
                text: this.text,
                timeframes: this.timeframes
            };
            saveGoal(model);
            this.$emit("closeItemModal");
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
</style>