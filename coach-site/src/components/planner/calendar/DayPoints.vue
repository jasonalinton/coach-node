<template>
    <div>
        <span>{{ `${pointCompleted} / ${pointTotal}` }}</span>
    </div>
</template>

<script>
import { sortAsc } from '../../../../utility';
import { startOfDay, endOfDay } from '../../../../utility/timeUtility';

export default {
    name: 'DayPoints',
    components: {  },
    props: {
        date: Date,
    },
    created: async function() {
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    data: function () {
        return {
            iterationStore: undefined,
        }
    },
    computed: {
        iterations() { 
            if (this.iterationStore) {
                let start = startOfDay(this.date);
                let end = endOfDay(this.date);

                let iterations = this.iterationStore.allIterations;
                iterations = iterations.filter(iteration => {
                    return +new Date(iteration.startAt) >= +start && 
                           +new Date(iteration.endAt) <= +end
                });
                iterations = sortAsc(iterations, 'startAt');
                return iterations;
            } else {
                return [];
            }
        },
        pointTotal() {
            var total = 0;
            this.iterations.forEach(x => {
                if (x.points != null) {
                    total += x.points
                }
            })
            return total;
        },
        pointCompleted() {
            var total = 0;
            this.iterations.forEach(x => {
                if (x.points != null && x.attemptedAt) {
                    total += x.points
                }
            })
            return total;
        }
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>