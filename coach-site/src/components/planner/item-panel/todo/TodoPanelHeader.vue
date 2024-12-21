<template>
    <div>
        <ItemPanelHeader v-if="sort" :title="'todos'" 
                         :sort="sort"
                         @onSortChange="onSortChange">
            <div class="buttons d-flex flex-row justify-content-end pe-2 mt-auto" :class="[{['mb-auto']: isExtraSmall}]">
                <img class="header-button me-1" :class="{ active: showRepeat }"
                    src='/icon/button/repeat.png' width="24" height="24"
                    @click.prevent="setSetting('showRepeat')"/>
                <img class="header-button me-1" :class="{ active: showTimeline }"
                    src='/icon/button/timeline.png' width="24" height="24"
                    @click.prevent="setSetting('showTimeline')"/>
                <img class="header-button me-1" :class="{ active: showRecommended }"
                    src='/icon/button/thumbs-up.png' width="24" height="24"
                    @click.prevent="setSetting('showRecommended')"/>
                <img class="header-button me-1" :class="{ active: showHierarchy }"
                    src='/icon/button/hierarchy.png' width="24" height="24"
                    @click.prevent="setSetting('showHierarchy')"/>
            </div>
        </ItemPanelHeader>
    </div>
</template>

<script>
import ItemPanelHeader from '../component/ItemPanelHeader.vue';

export default {
    name: 'TodoPanelHeader',
    components: { ItemPanelHeader },
    data: function () {
        return {
            appStore: undefined,
        }
    },
    created: async function() {
        let appStore = await import(`@/store/appStore`);
        this.appStore = appStore.useAppStore();
    },
    computed: {
        sort() {
            return (this.appStore) ? this.appStore.itemPanel.todo.sort : undefined;
        },
        showRepeat() {
            return (this.appStore) ? this.appStore.itemPanel.todo.showRepeat : undefined;
        },
        showTimeline() {
            return (this.appStore) ? this.appStore.itemPanel.todo.showTimeline : undefined;
        },
        showRecommended() {
            return (this.appStore) ? this.appStore.itemPanel.todo.showRecommended : undefined;
        },
        showHierarchy() {
            return (this.appStore) ? this.appStore.itemPanel.todo.showHierarchy : undefined;
        },
        isExtraSmall() {
            if (this.appStore) {
                return this.appStore.isExtraSmall;
            }
            return true;
        },
    },
    methods: {
        setSetting(prop) {
            this.appStore.setItemPanelSetting('todo', prop, !this[prop])
        },
        onSortChange(sortBy) {
            this.appStore.setItemPanelSortBy('todo', sortBy);
        }
    },
}

</script>

<style scoped>
.buttons {
    padding-bottom: 2px;
}

.header-button {
    border-radius: 12px;
}

.header-button:hover {
    background-color: rgba(60, 64, 67, .05);
}

.header-button.active {
    background-color: rgba(60, 64, 67, .1);
}

</style>