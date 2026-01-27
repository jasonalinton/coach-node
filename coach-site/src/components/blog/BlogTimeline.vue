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
            <div v-for="blurb in blurbs" :key="blurb.id"
                 class="blurb d-flex flex-column">
                <span class="date">{{ blurb.date }}</span>
                <span class="time">{{ blurb.time }}</span>
                <span v-if="blurb.title" class="title">{{ blurb.title }}</span>
                <span class="text">{{ blurb.text }}</span>
                <div class="d-flex flex-row">
                    <span v-for="(tag, index) in blurb.tags" :key="index" class="tag">{{ tag }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { usePlannerStore } from '@/store/plannerStore'
import { useUniversalStore } from '@/store/universalStore'
import { TIMEFRAME } from '../../model/constants'
import { toLongDateString, toShortTimeString, formatInputDateTime, getTimeframeEndpoints, today } from '../../../utility/timeUtility'
import { sortDateDesc } from '../../../utility'

export default {
    name: 'BlogTimeline',
    components: {  },
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
        blurbs() {
            let blurbs = [];
            if (this.universalStore) {
                blurbs = this.universalStore.blurbs;
                blurbs = sortDateDesc(blurbs, 'datetime');
                blurbs = blurbs.map(blurb => {
                    return {
                        id: blurb.id,
                        date: toLongDateString(blurb.datetime),
                        time: toShortTimeString(blurb.datetime),
                        title:blurb.title,
                        text: blurb.text,
                        tags: []
                    };
                });
            }
            return blurbs;
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

.blurb {
    background-color: #EDEDED;
    padding: 15px 28px;
    text-align: start;
    margin: 22px auto 0 auto;
    max-width: 720px;
    width: 100%;
}

.blurb .date {
    font-size: 12px;
}

.blurb .time {
    font-size: 10px;
    font-style: italic;
    font-weight: bolder;
}

.blurb .title {
    font-size: 28px;
    line-height: 34px;
    color: #4A90E2
}

.blurb .text {
    font-size: 14px;
    white-space: pre-wrap;
}

.blurb .textarea.invalid {
    border: solid 1px red;
}

.blurb .tag {
    font-size: 12px;
    color: #F5A623;
}
</style>