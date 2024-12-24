<template>
    <div class="backlog d-flex flex-column flex-grow-1 overflow-scroll">
        <ul v-if="iterations" class="item-list mt-2">
            <li v-for="(iteration, index) in iterations" v-bind:key="iteration.id" :style="{ 'z-index': -index }">
                <ListItem :iteration="iteration" 
                          @onEdit="$emit('editIteration', iteration)">
                </ListItem>
            </li>
        </ul>
    </div>
</template>

<script>
import ListItem from '../component/ListItem.vue'
import { sortDesc } from '../../../../../utility';

export default {
    name: 'TodoPanelBacklog',
    components: { ListItem },
    data: function () {
        return {
            appStore: undefined,
            iterationStore: undefined,
            newTaskText: undefined,
        }
    },
    created: async function() {
        let appStore = await import(`@/store/appStore`);
        this.appStore = appStore.useAppStore();
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
        this.iterationStore.getUnplannedIterations(true);
    },
    computed: {
        iterations() { 
            if (this.iterationStore) {
                let iterations = this.iterationStore.iterations;
                iterations = iterations.filter(iteration => {
                    return !iteration.startAt && !iteration.isRepeat
                });
                iterations = iterations.filter(iteration => iteration.idRoutine == null && iteration.idRoutineIteration == null);
                return sortDesc(iterations, "id");
            } else {
                return [];
            }
        },
    },
}
</script>

<style scoped>
.toolbar {
    padding: 8px;
    z-index: 3;
    background-color: white;
}

.item-list {
    margin-bottom: 8px;
    z-index: 2;
}

ul {
    font-size: 14px;
    color: #3C4043;
    list-style: none;
    padding: 0px;
    margin: 0px;
    text-align: start;
}

.item-list {
    margin-bottom: 8px;
    z-index: 2;
}

.item-list li {
    position: relative;
}

</style>