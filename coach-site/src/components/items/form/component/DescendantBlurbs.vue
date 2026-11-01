<template>
    <div class="descendant-blurbs d-flex flex-column">
        <div class="header d-flex flex-column"
             @click="toggle">
            <div class="d-flex flex-row justify-content-between">
                <span class="form-head text-start">{{ header }}</span>
                <img v-if="!isShown" class="caret mt-auto mb-auto me-2"
                     src='/icon/caret-right.png' width="5" height="8" />
                <img v-if="isShown" class="caret mt-auto mb-auto me-2"
                     src='/icon/caret-down.png' width="8" height="5" />
            </div>
            <hr />
        </div>

        <div v-if="isShown" class="d-flex flex-column">
            <div v-if="blurbs.length == 0" class="empty-hint">No blurbs from descendants yet.</div>
            <div v-for="entry in blurbs" :key="entry.blurb.id" class="blurb cursor-default d-flex flex-column mt-2">
                <span class="source text-start">{{ entry.label }}</span>
                <h6 v-if="entry.blurb.title" class="text-start">{{ entry.blurb.title }}</h6>
                <BlurbContent :blurb="entry.blurb" class="text-start" />
            </div>
        </div>
    </div>
</template>

<script>
import BlurbContent from '../../../controls/display/BlurbContent.vue';

export default {
    name: 'DescendantBlurbs',
    components: { BlurbContent },
    props: {
        header: {
            type: String,
            default: () => 'From Descendants',
        },
        /* { itemType: 'goal'|'todo'|'iteration', itemId: Number, label: String } */
        descendants: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            goalStore: undefined,
            todoStore: undefined,
            iterationStore: undefined,
            universalStore: undefined,
            isShown: false,
            hasExpanded: false,
        };
    },
    created: async function () {
        let goalStore = await import('@/store/goalStore');
        this.goalStore = goalStore.useGoalStore();

        let todoStore = await import('@/store/todoStore');
        this.todoStore = todoStore.useTodoStore();

        let iterationStore = await import('@/store/iterationStore');
        this.iterationStore = iterationStore.useIterationStore();

        let universalStore = await import('@/store/universalStore');
        this.universalStore = universalStore.useUniversalStore();
    },
    computed: {
        iterationRefs() {
            return this.descendants.filter(d => d.itemType == 'iteration');
        },
        iterationIds() {
            return this.iterationRefs.map(d => d.itemId);
        },
        /* Full iteration records (for their blurbIds) - fetched in a single batched call for
         * whichever ids aren't already loaded in iterationStore's date-range cache. Only runs once
         * this section has been expanded. */
        iterations() {
            if (!this.hasExpanded || !this.iterationStore || this.iterationIds.length == 0) return [];
            return this.iterationStore.getIterationsWithIDs(this.iterationIds);
        },
        /* { id, label } for every blurb id across all descendants - goal/todo blurb ids come
         * straight off the already-loaded item (label resolved for free from goalStore/todoStore
         * by the parent form); iteration blurb ids come off whatever `iterations` above has
         * resolved so far, labeled with the iteration's own text. */
        blurbRefs() {
            if (!this.hasExpanded) return [];
            let refs = [];
            this.descendants.forEach(d => {
                if (d.itemType == 'goal') {
                    let goal = this.goalStore?.getItem(d.itemId);
                    (goal?.blurbs || []).forEach(b => refs.push({ id: b.id, label: d.label }));
                } else if (d.itemType == 'todo') {
                    let todo = this.todoStore?.getItem(d.itemId);
                    (todo?.blurbIds || []).forEach(id => refs.push({ id, label: d.label }));
                }
            });
            this.iterations.forEach(iteration => {
                (iteration.blurbIds || []).forEach(id => refs.push({ id, label: iteration.text }));
            });
            return refs;
        },
        blurbs() {
            if (!this.universalStore || this.blurbRefs.length == 0) return [];
            let resolved = this.universalStore.getBlurbsWithID(this.blurbRefs.map(r => r.id));
            return resolved.map(blurb => ({
                blurb,
                label: this.blurbRefs.find(r => r.id == blurb.id)?.label,
            }));
        },
    },
    methods: {
        toggle() {
            this.isShown = !this.isShown;
            if (this.isShown) this.hasExpanded = true;
        },
    },
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
    white-space: pre-wrap;
}

.source {
    font-size: 11px;
    color: #9A9A9A;
}

.empty-hint {
    color: #9A9A9A;
    font-size: 13px;
    padding: 8px 0;
}
</style>
