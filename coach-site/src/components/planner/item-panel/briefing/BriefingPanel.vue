<template>
    <div class="row g-0 h-100">
        <div class="col h-100 d-flex flex-column">
            <div class="briefing-panel d-flex flex-column flex-grow-1 overflow-hidden">
                <ItemPanelNavbar v-show="showHead" />
                <div class="body d-flex flex-column flex-grow-1">
                    <BriefingGoals />
                    <BriefingBlurb />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ItemPanelNavbar from '../../../mobile/navbar/ItemPanelNavbar.vue';
import BriefingGoals from './BriefingGoals.vue';
import BriefingBlurb from './BriefingBlurb.vue';

export default {
    name: 'BriefingPanel',
    components: { ItemPanelNavbar, BriefingGoals, BriefingBlurb },
    props: {
        showHead: {
            type: Boolean,
            default: true
        }
    },
    data: function () {
        return {
            
        }
    },
    created: function() {
       
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>./BriefingGoals.vue