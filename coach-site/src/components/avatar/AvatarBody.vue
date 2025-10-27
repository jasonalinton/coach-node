<template>
    <div class="avatar-body w-100">
        <img src="/avatar/Avatar (Blue Underwear).jpg" width="140"/>
    </div>
</template>

<script>

export default {
    name: 'AvatarBody',
    components: {  },
    props: {
        
    },
    data: function () {
        return {
            metricStore: undefined
        }
    },
    created: async function() {
        let metricStore = await import(`@/store/metricStore`);
        this.metricStore = metricStore.useMetricStore();
    },
    computed: {
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>