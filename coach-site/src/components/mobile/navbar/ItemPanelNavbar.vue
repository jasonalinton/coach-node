<template>
    <div class="item-panel-navbar" :class="selectedPanel">
        <ItemPanelHeader v-if="sort" :title="`${selectedPanel}s`" 
                         :sort="sort"
                         @onSortChange="onSortChange">
            <div v-if="appStore" class="buttons d-flex flex-row justify-content-end pe-2 mt-auto" :class="[{['mb-auto']: isExtraSmall}]">
                <template v-if="selectedPanel == 'todo'">
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
                </template>
                <template v-if="selectedPanel == 'goal'">
                    <img class="header-button me-1" :class="{ active: showReverse }"
                        src='/icon/button/reverse.png' width="24" height="24"
                        @click.prevent="setSetting('showReverse')"/>
                    <img class="header-button me-1" :class="{ active: showTimeline }"
                        src='/icon/button/timeline.png' width="24" height="24"
                        @click.prevent="setSetting('showTimeline')"/>
                    <img class="header-button me-1" :class="{ active: showHierarchy }"
                        src='/icon/button/hierarchy.png' width="24" height="24"
                        @click.prevent="setSetting('showHierarchy')"/>
                </template>
            </div>
        </ItemPanelHeader>
    </div>
</template>

<script>
import ItemPanelHeader from '../../planner/item-panel/component/ItemPanelHeader.vue';

export default {
    name: 'ItemPanelNavbar',
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
        selectedPanel() {
            return (this.appStore) ? this.appStore.itemPanel.selected : "todo";
        },
        sort() {
            return (this.appStore && this.appStore.itemPanel[this.selectedPanel]) 
            ? this.appStore.itemPanel[this.selectedPanel].sort : undefined;
        },
        showReverse() {
            return (this.appStore) ? this.appStore.itemPanel[this.selectedPanel].showReverse : undefined;
        },
        showRepeat() {
            return (this.appStore) ? this.appStore.itemPanel[this.selectedPanel].showRepeat : undefined;
        },
        showTimeline() {
            return (this.appStore) ? this.appStore.itemPanel[this.selectedPanel].showTimeline : undefined;
        },
        showRecommended() {
            return (this.appStore) ? this.appStore.itemPanel[this.selectedPanel].showRecommended : undefined;
        },
        showHierarchy() {
            return (this.appStore) ? this.appStore.itemPanel[this.selectedPanel].showHierarchy : undefined;
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
            this.appStore.setItemPanelSetting(this.selectedPanel, prop, !this[prop])
        },
        onSortChange(sortBy) {
            this.appStore.setItemPanelSortBy(this.selectedPanel, sortBy);
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