<template>
    <div class="briefing-goals d-flex flex-column p-2">
        <h4 class="text-start" @click="isShown = !isShown">Goals</h4>
        <div v-if="isShown" v-for="goalID in goalIDs" :key="goalIDs" class="d-flex flex-column">
            <BriefingGoal class="mb-1" :idGoal="goalID" />
        </div>
    </div>
</template>

<script>
import BriefingGoal from './BriefingGoal.vue';

export default {
    name: 'BriefingGoals',
    components: { BriefingGoal },
    props: {
        idTimeframe: {
            type: Number,
            default: () => 55
        },
        goalIDs: {
            type: Array,
            default: () => []
        }
    },
    data: function () {
        return {
            isShown: true,
        }
    },
    created: function() {
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>