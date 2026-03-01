<template>
    <div class="blog-timeline">
        <div class="d-flex flex-column">
            <!-- Button - New Post -->
            <button v-if="!newPost.isShown" type="button" class="btn btn-primary mt-3 mb-2" 
                    @click="onNewPost">
                    New Post
            </button>
            <!-- New Post -->
            <div v-else-if="newPost.isShown" class="new-post blurb d-flex flex-column">
                <div class="d-flex flex-column">
                    <input class="date-picker mb-2" type="datetime-local" :value="newPost.datetime" @change="onDateTimeChange"/>
                    <input class="textbox mb-2" type="text" placeholder="Title"
                           v-model.lazy.trim="newPost.title" 
                           spellcheck="true"/>
                    <textarea class="textarea mb-2" :class="{ 'invalid': newPost.isTextValid == false}"
                              v-model.trim="newPost.text"
                              placeholder="Click to write post"
                              spellcheck="true"
                              @blur="onTextBlur">
                    </textarea>
                    <div class="d-flex flex-row mt-1 justify-content-end">
                        <button type="button" @click="saveBlurb">Save</button>
                        <button class="ms-1" type="button" @click="cancelBlurb">Cancel</button>
                    </div>
                </div>
            </div>
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
import BlurbCard from './BlurbCard.vue'

export default {
    name: 'BlogTimeline',
    components: { BlurbCard },
    props: {
        
    },
    data: function () {
        return {
            plannerStore: undefined,
            universalStore: undefined,
            blurbs: [],
            newPost: {
                isShown: false,
                datetime: undefined,
                title: undefined,
                text: undefined,
                isTextValid: undefined
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
        refreshNewPost,
        onNewPost,
        onDateTimeChange,
        onTextBlur,
        saveBlurb,
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

function refreshNewPost() {
    this.newPost.title = undefined;
    this.newPost.text = undefined;
    this.newPost.isTextValid = undefined;
}

function onNewPost() {
    this.refreshNewPost();
    this.newPost.datetime = formatInputDateTime();
    this.newPost.isShown = true;
}

function onDateTimeChange(value) {
    value = value.currentTarget.value;
    this.newPost.datetime = value;
}

function onTextBlur() {
    this.newPost.isTextValid = (!this.newPost.text) ? false : true;
}

function saveBlurb() {
    if (this.newPost.isTextValid) {
        let date = new Date(this.newPost.datetime)
        this.universalStore
            .createBlurb(date, this.newPost.text, this.newPost.title);
    this.newPost.isShown = false;
    }
}

function cancelBlurb() {
    this.newPost.isShown = false;
}

</script>

<style scoped>
.new-post button {
    height: 25px;
    background-color: #BAD8F1;
    border: #3B99FC solid 1px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 16px;
}
</style>