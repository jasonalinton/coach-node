<template>
    <div class="row g-0 h-100">
        <div class="col h-100 d-flex flex-column">
            <div class="briefing-panel d-flex flex-column flex-grow-1 overflow-hidden">
                <ItemPanelHeader v-show="showHead" title="Briefing" :sort="sort" @onSortChange="onSortChange">
                    <div v-if="designVariant == 'BriefingRethink' && appStore" class="buttons d-flex flex-row justify-content-end pe-2 mt-auto"
                         :class="[{ ['mb-auto']: isExtraSmall }]">
                        <!-- Brief / Debrief filter: all -> brief -> debrief -->
                        <button class="header-button me-1" :class="{ active: noteFilter != 'all' }"
                                :title="noteFilterTitle" @click.prevent="cycleNoteFilter">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5f6368" stroke-width="1.6" stroke-linecap="round">
                                <path d="M6 8h12M8 12h8M10 16h4" />
                            </svg>
                            <span v-if="noteFilter != 'all'" class="filter-badge">{{ noteFilter == 'brief' ? 'B' : 'D' }}</span>
                        </button>
                        <!-- Show reasons -->
                        <button class="header-button me-1" :class="{ active: showReasons }"
                                title="Show reasons" @click.prevent="toggleSetting('showReasons')">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368">
                                <path d="M7.5 8.5c-1.7 0-2.5 1.3-2.5 2.8 0 1.4 1 2.4 2.3 2.4-.1 1.2-.8 2-2 2.4l.4 1c2.6-.6 3.9-2.6 3.9-5 0-2.2-.9-3.6-2.1-3.6zm8 0c-1.7 0-2.5 1.3-2.5 2.8 0 1.4 1 2.4 2.3 2.4-.1 1.2-.8 2-2 2.4l.4 1c2.6-.6 3.9-2.6 3.9-5 0-2.2-.9-3.6-2.1-3.6z" />
                            </svg>
                        </button>
                        <!-- Show points -->
                        <button class="header-button me-1" :class="{ active: showPoints }"
                                title="Show points" @click.prevent="toggleSetting('showPoints')">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368">
                                <rect x="6" y="12" width="3" height="6" rx="1" />
                                <rect x="10.5" y="8" width="3" height="10" rx="1" />
                                <rect x="15" y="10" width="3" height="8" rx="1" />
                            </svg>
                        </button>
                        <!-- Collapse / expand all note sections -->
                        <button class="header-button me-1" :title="sectionsCollapsed ? 'Expand all' : 'Collapse all'"
                                @click.prevent="toggleAllSections">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5f6368" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                                <path v-if="sectionsCollapsed" d="M8 9.5l4-4 4 4M8 14.5l4 4 4-4" />
                                <path v-else d="M8 6l4 4 4-4M8 18l4-4 4 4" />
                            </svg>
                        </button>
                        <!-- Jump to today -->
                        <button class="header-button me-1" title="Jump to today" @click.prevent="jumpToToday">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5f6368" stroke-width="1.6">
                                <rect x="5.5" y="6.5" width="13" height="12" rx="2" />
                                <path d="M5.5 10h13M9 5v3M15 5v3" stroke-linecap="round" />
                                <circle cx="12" cy="14.2" r="1.6" fill="#5f6368" stroke="none" />
                            </svg>
                        </button>
                    </div>
                </ItemPanelHeader>
                <BriefingClassic v-if="designVariant == 'BriefingClassic'" />
                <BriefingRethink v-if="designVariant == 'BriefingRethink'" ref="rethink" />
            </div>
        </div>
    </div>
</template>

<script>
import ItemPanelHeader from '../component/ItemPanelHeader.vue';
import BriefingClassic from './BriefingClassic.vue';
import BriefingRethink from './rethink/BriefingRethink.vue';
import { useAppStore } from '@/store/appStore';
import { today } from '../../../../../utility';

const DESIGN_VARIANT_KEY = 'briefing-panel-design-variant';
const DESIGN_VARIANTS = [ 'BriefingClassic', 'BriefingRethink' ];
const NOTE_FILTERS = [ 'all', 'brief', 'debrief' ];

export default {
    name: 'BriefingPanel',
    components: { ItemPanelHeader, BriefingClassic, BriefingRethink },
    props: {
        showHead: {
            type: Boolean,
            default: true
        }
    },
    data: function () {
        return {
            appStore: undefined,
            plannerStore: undefined,
            designVariant: 'BriefingRethink',
            // Whether the last "Collapse all" collapsed the note sections (sets the button's icon and title)
            sectionsCollapsed: false,
        }
    },
    created: async function() {
        this.appStore = useAppStore();

        let savedVariant = localStorage.getItem(DESIGN_VARIANT_KEY);
        if (DESIGN_VARIANTS.includes(savedVariant)) {
            this.designVariant = savedVariant;
        }

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
    },
    computed: {
        sort() {
            return {
                by: this.designVariant,
                items: DESIGN_VARIANTS.map((text, index) => ({ id: index + 1, text }))
            };
        },
        isExtraSmall() {
            return (this.appStore) ? this.appStore.isExtraSmall : true;
        },
        settings() {
            return (this.appStore) ? this.appStore.itemPanel.briefing : {};
        },
        noteFilter() {
            return this.settings.noteFilter ?? 'all';
        },
        noteFilterTitle() {
            return { all: "Showing briefs & debriefs", brief: "Showing briefs", debrief: "Showing debriefs" }[this.noteFilter];
        },
        showReasons() {
            return this.settings.showReasons;
        },
        showPoints() {
            return this.settings.showPoints;
        },
    },
    methods: {
        onSortChange(sortBy) {
            if (!DESIGN_VARIANTS.includes(sortBy)) return;
            this.designVariant = sortBy;
            localStorage.setItem(DESIGN_VARIANT_KEY, sortBy);
        },
        toggleSetting(prop) {
            this.appStore.setItemPanelSetting('briefing', prop, !this.settings[prop]);
        },
        cycleNoteFilter() {
            let next = NOTE_FILTERS[(NOTE_FILTERS.indexOf(this.noteFilter) + 1) % NOTE_FILTERS.length];
            this.appStore.setItemPanelSetting('briefing', 'noteFilter', next);
        },
        toggleAllSections() {
            this.sectionsCollapsed = this.$refs.rethink?.toggleAllSections() ?? false;
        },
        jumpToToday() {
            this.plannerStore?.selectDate(today());
            this.$refs.rethink?.resetTimeframe();
        },
    },
}
</script>

<style scoped>
.buttons {
    padding-bottom: 2px;
}

.header-button {
    position: relative;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    border-radius: 12px;
}

.header-button:hover {
    background-color: rgba(60,64,67,.05);
}

.header-button.active {
    background-color: rgba(60,64,67,.1);
}

.filter-badge {
    position: absolute;
    right: -2px;
    bottom: -2px;
    font-size: 9px;
    font-weight: 600;
    line-height: 12px;
    width: 12px;
    border-radius: 6px;
    color: white;
    background-color: #B5532F;
}
</style>
