<template>
    <div v-if="blurb"class="blurb-card d-flex">
        <!-- Head -->
        <span class="date">{{ blurb.date }}</span>
        <span class="time">{{ blurb.time }}</span>
        <div v-if="head">{{ head }}</div>
        <span v-if="blurb.title" class="title">{{ blurb.title }}</span>
        <span class="text">{{ blurb.text }}</span>
        <div class="d-flex flex-row">
            <span v-for="(tag, index) in blurb.tags" :key="index" class="tag">{{ tag }}</span>
        </div>
    </div>
</template>

<script>
import { toLongDateString, toShortTimeString } from '../../../utility/timeUtility';
import { BLURBTYPE } from '../../model/constants';

export default {
    name: 'BlurbCard',
    components: {  },
    props: {
        idBlurb: Number
    },
    data: function () {
        return {
            universalStore: undefined,
        }
    },
    created: async function() {
        let universalStore = await import(`@/store/universalStore`);
        this.universalStore = universalStore.useUniversalStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        blurb() {
            if (this.universalStore) {
                let blurb = this.universalStore.blurbs.find(x => x.id == this.idBlurb);
                if (blurb) {
                    return {
                        id: blurb.id,
                        idType: blurb.idType,
                        date: toLongDateString(blurb.datetime),
                        time: toShortTimeString(blurb.datetime),
                        title:blurb.title,
                        text: blurb.text,
                        tags: [],
                    };
                }
            }
            return undefined;
        },
        head() {
            if (this.blurb) {
                if (this.blurb.idType == BLURBTYPE.BRIEFING) {
                    return `Briefing`;
                }
            } else {
                return undefined;
            }
        }
    },
    methods: {
        
    },
}

</script>

<style scoped>
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