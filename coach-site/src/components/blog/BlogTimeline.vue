<template>
    <div class="blog-timeline">
        <div class="d-flex flex-column">
            <!-- Button - New Post -->
            <button v-if="!newPost.isShown" type="button" class="btn btn-primary mt-3 mb-2" 
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
        onNewPost,
        onBlurbSaved,
        cancelBlurb
    },
    watch: {
        selectedDate() {
            this.initBlurbs();
        }
    }
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