<template>
    <div class="blog-timeline px-3">
        <div class="d-flex flex-column py-4 gap-4">
            <!-- Button - New Post -->
            <button v-if="!newPost.isShown" type="button" class="btn btn-primary" 
                    @click="onNewPost">
                    New Post
            </button>
            <!-- New Post -->
            <BlurbForm v-else-if="newPost.isShown" :datetime="newPost.datetime"
                       @saved="onBlurbSaved" @cancel="cancelBlurb"/>
            <BlurbCard v-for="blurbID in blurbIDs" :key="blurbID" :idBlurb="blurbID"
                       class="blurb d-flex flex-column" />
        </div>
    </div>
</template>

<script>
import { usePlannerStore } from '@/store/plannerStore'
import { useUniversalStore } from '@/store/universalStore'
import { useIterationStore } from '@/store/iterationStore'
import { TIMEFRAME } from '../../model/constants'
import { toLongDateString, toShortTimeString, formatInputDateTime, getTimeframeEndpoints, today } from '../../../utility/timeUtility'
import { sortDateDesc } from '../../../utility'
import BlurbCard from './BlurbTimelineCard.vue'
import BlurbForm from './BlurbForm.vue'

export default {
    name: 'BlogTimeline',
    components: { BlurbCard, BlurbForm },
    props: {

    },
    data: function () {
        return {
            plannerStore: undefined,
            universalStore: undefined,
            iterationStore: undefined,
            requestedIterationIDs: new Set(),
            blurbs: [],
            newPost: {
                isShown: false,
                datetime: undefined
            }
        }
    },
    created: async function() {
        this.plannerStore = usePlannerStore();
        this.universalStore = useUniversalStore();
        this.iterationStore = useIterationStore();

        // this.initBlurbs();
        this.universalStore.getBlurbs(TIMEFRAME.MONTH, this.selectedDate);
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        blurbIDs() {
            let blurbs = [];
            if (this.universalStore) {
                blurbs = this.universalStore.blurbs;
                blurbs = sortDateDesc(blurbs, 'datetime');
            }
            return blurbs.map(x => x.id);
        }
    },
    methods: {
        initBlurbs,
        fetchBlurbIterations,
        onNewPost,
        onBlurbSaved,
        cancelBlurb
    },
    watch: {
        selectedDate() {
            this.initBlurbs();
        },
        blurbIDs() {
            this.fetchBlurbIterations();
        }
    }
}

/* Fetch the iterations the blurb cards show, in one request, instead of one GetIteration per card lookup.
 * Skips iterations already loaded (e.g. by GetIterationsInRange) or already requested. */
function fetchBlurbIterations() {
    if (!this.universalStore || !this.iterationStore) return;

    let ids = [...new Set(this.universalStore.blurbs
        .flatMap(blurb => (blurb.iterationIDs || []).map(x => x.id)))];
    let loadedIDs = new Set(this.iterationStore.getLoadedIterationsWithIDs(ids).map(x => x.id));
    let missingIDs = ids.filter(id => !loadedIDs.has(id) && !this.requestedIterationIDs.has(id));
    if (missingIDs.length == 0) return;

    missingIDs.forEach(id => this.requestedIterationIDs.add(id));
    this.iterationStore.getIterationsWithIDs(missingIDs);
}

async function initBlurbs() {
    let blurbs = await this.universalStore.getBlurbs(TIMEFRAME.MONTH, this.selectedDate);

    // let {start, end} = getTimeframeEndpoints(TIMEFRAME.MONTH, this.selectedDate);

    blurbs = sortDateDesc(blurbs, 'datetime');

    blurbs.forEach(blurb => {
        let blurb_new = {
            id: blurb.id,
            date: toLongDateString(blurb.datetime),
            time: toShortTimeString(blurb.datetime),
            title:blurb.title,
            text: blurb.text,
            tags: []
        };
        this.blurbs.push(blurb_new);
    });
}

function onNewPost() {
    this.newPost.datetime = formatInputDateTime();
    this.newPost.isShown = true;
}

function onBlurbSaved() {
    this.newPost.isShown = false;
}

function cancelBlurb() {
    this.newPost.isShown = false;
}

</script>

<style scoped>
.blog-timeline {
    background-color: #F5F5F5;
}
</style>