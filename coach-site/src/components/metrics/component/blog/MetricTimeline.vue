<template>
    <div class="blog-posts d-flex flex-column">
        <button v-if="!newPost.isShown" type="button" class="btn btn-primary mt-3 mb-2" 
                @click="onNewPost">New Post</button>
        <div v-else-if="newPost.isShown" class="new-post blurb d-flex flex-column">
            <div class="d-flex flex-column">
                <input class="date-picker mb-2" type="datetime-local" :value="newPost.datetime" @change="onDateTimeChange"/>
                <input class="textbox mb-2" type="text" placeholder="Title"
                       v-model.lazy.trim="newPost.title" 
                       spellcheck="true"/>
                <EditorJS class="textarea mb-2" :class="{ 'invalid': newPost.isTextValid == false}"
                          v-model="newPost.json"
                          placeholder="Click to write post"
                          @focusout="onTextBlur"/>
                <div class="d-flex flex-row mt-1 justify-content-end">
                    <button type="button" @click="saveBlurb">Save</button>
                    <button class="ms-1" type="button" @click="cancelBlurb">Cancel</button>
                </div>
            </div>
        </div>
        <BlurbCard v-for="blurbID in blurbIDs" :key="blurbID" :idBlurb="blurbID"
                    class="blurb d-flex flex-column" />
    </div>
</template>

<script>
import { usePlannerStore } from '@/store/plannerStore'
import { useUniversalStore } from '@/store/universalStore'
import { TIMEFRAME } from '../../../../model/constants'
import { toLongDateString, toShortTimeString, formatInputDateTime, today } from '../../../../../utility/timeUtility'
import { sortDateDesc } from '../../../../../utility'
import { extractPlainText, isEmptyOutputData } from '../../../../../utility/editorjsUtility'
import BlurbCard from '../../../blog/BlurbTimelineCard.vue'
import EditorJS from '../../../controls/input/EditorJS.vue'

export default {
    name: 'MetricTimeline',
    components: { BlurbCard, EditorJS },
    props: {
        idMetric: Number
    },
    data: function () {
        return {
            plannerStore: undefined,
            universalStore: undefined,
            newPost: {
                isShown: false,
                datetime: undefined,
                title: undefined,
                json: undefined,
                isTextValid: undefined
            }
        }
    },
    created: async function() {
        this.plannerStore = usePlannerStore();
        this.universalStore = useUniversalStore();

        this.universalStore.getBlurbsInMetric(this.idMetric, TIMEFRAME.MONTH, this.selectedDate);
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        blurbIDs() {
            let blurbs = [];
            if (this.universalStore) {
                blurbs = this.universalStore.blurbs.filter(blurb => blurb.idMetric == this.idMetric);
                blurbs = sortDateDesc(blurbs, 'datetime');
            }
            return blurbs.map(x => x.id);
        },
    },
    methods: {
        refreshNewPost() {
            this.newPost.title = undefined;
            this.newPost.json = undefined;
            this.newPost.isTextValid = undefined;
        },
        onNewPost() {
            this.refreshNewPost();
            this.newPost.datetime = formatInputDateTime();
            this.newPost.isShown = true;
        },
        onDateTimeChange(value) {
            value = value.currentTarget.value;
            this.newPost.datetime = value;
        },
        onTextBlur() {
            this.newPost.isTextValid = !isEmptyOutputData(this.newPost.json);
        },
        saveBlurb() {
            if (this.newPost.isTextValid) {
                let date = new Date(this.newPost.datetime);
                let text = extractPlainText(this.newPost.json);
                let json = JSON.stringify(this.newPost.json);
                this.universalStore
                    .addMetricBlurb(this.idMetric, date, text, this.newPost.title, json);
            this.newPost.isShown = false;
            }
        },
        cancelBlurb() {
            this.newPost.isShown = false;
        }
    },
    watch: {
        selectedDate() {
            this.universalStore.getBlurbsInMetric(this.idMetric, TIMEFRAME.MONTH, this.selectedDate);
        }
    }
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
    padding: 15px 22px;
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
    font-size: 22px;
    font-weight: 400;
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