<template>
    <IconButton class="menu-button float-left" src="/icon/menu-button.png" :width="40" :height="40"
                @clicked="onClick" />
</template>

<script>
import { useAppStore } from '@/store/appStore'
import IconButton from '../../../controls/button/IconButton.vue';

export default {
    name: 'NavbarMenuButton',
    components: { IconButton },
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
        onClick() {
            console.log("hello")
            this.appStore.onMenuButtonClicked();
        }
    },
}

</script>

<style scoped>

.menu-button {
    margin: auto 12px auto 8px;
}
</style>