<template>
    <img class="icon calendar-button" src="/icon/planner-icon.png" :width="36" :height="36"
         @click="toggleCalendar"/>
</template>

<script>
import { useAppStore } from '@/store/appStore'

export default {
    name: 'NavbarCalendarButton',
    components: {  },
    props: {
        
    },
    data: function () {
        return {
            appStore: undefined,
        }
    },
    created: function() {
        this.appStore = useAppStore();
    },
    methods: {
        toggleCalendar() {
            this.appStore.toggleMobileCalendar();
        }
    },
}

</script>

<style scoped>
.icon {
    margin: auto 12px auto 0px;
}

</style>