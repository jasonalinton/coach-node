<template>
    <div class="descendant-media d-flex flex-column">
        <div class="header d-flex flex-column"
             @click="toggle">
            <div class="d-flex flex-row justify-content-between">
                <span class="form-head text-start">{{ header }}</span>
                <img v-if="!isShown" class="caret mt-auto mb-auto me-2"
                     src='/icon/caret-right.png' width="5" height="8" />
                <img v-if="isShown" class="caret mt-auto mb-auto me-2"
                     src='/icon/caret-down.png' width="8" height="5" />
            </div>
            <hr />
        </div>

        <div v-if="isShown" class="d-flex flex-row flex-wrap gap-2">
            <div v-if="loading" class="empty-hint">Loading…</div>
            <div v-if="!loading && mediaLinks.length == 0" class="empty-hint">No media from descendants yet.</div>
            <div v-for="link in mediaLinksWithLabel" :key="`${link.itemType}-${link.id}`" class="thumb-with-source d-flex flex-column">
                <MediaThumb :media="link.media" :removable="false" @click="viewingLink = link" />
                <span class="source text-start">{{ link.label }}</span>
            </div>
        </div>

        <MediaViewer v-if="viewingLink" :media="viewingLink.media" :showRemove="false" @close="viewingLink = null" />
    </div>
</template>

<script>
import MediaThumb from './media/MediaThumb.vue';
import MediaViewer from './media/MediaViewer.vue';

export default {
    name: 'DescendantMedia',
    components: { MediaThumb, MediaViewer },
    props: {
        header: {
            type: String,
            default: () => 'From Descendants',
        },
        /* { itemType: 'goal'|'todo'|'iteration', itemId: Number, label: String } */
        descendants: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            mediaStore: undefined,
            isShown: false,
            hasExpanded: false,
            mediaLinks: [],
            loading: false,
            viewingLink: null,
        };
    },
    created: async function () {
        let mediaStore = await import('@/store/mediaStore');
        this.mediaStore = mediaStore.useMediaStore();
    },
    computed: {
        goalIds() {
            return this.descendants.filter(d => d.itemType == 'goal').map(d => d.itemId);
        },
        todoIds() {
            return this.descendants.filter(d => d.itemType == 'todo').map(d => d.itemId);
        },
        iterationIds() {
            return this.descendants.filter(d => d.itemType == 'iteration').map(d => d.itemId);
        },
        mediaLinksWithLabel() {
            return this.mediaLinks.map(link => {
                let label = this.descendants.find(d => d.itemType == link.itemType && d.itemId == link.itemId)?.label;
                let fallback = link.itemType.charAt(0).toUpperCase() + link.itemType.slice(1);
                return { ...link, label: label || fallback };
            });
        },
    },
    methods: {
        toggle() {
            this.isShown = !this.isShown;
            if (this.isShown && !this.hasExpanded) {
                this.hasExpanded = true;
                this.loadMedia();
            }
        },
        async loadMedia() {
            if (this.loading) return;
            this.loading = true;
            this.mediaLinks = await this.mediaStore.getForItems({
                goalIds: this.goalIds,
                todoIds: this.todoIds,
                iterationIds: this.iterationIds,
            });
            this.loading = false;
        },
    },
}
</script>

<style scoped>
.form-head {
    font-size: 20px;
    text-align: start;
    width: 100%;
    display: inline-block;
    font-weight: 500;
}

.header {
    cursor: default;
}

.header:hover .form-head {
    color: var(--form-header-hover);
}

.caret {
    visibility: hidden;
}

.header:hover .caret {
    visibility: visible;
}

hr {
    margin-top: 3px;
    margin-bottom: 3px;
    color: #8A8A8A;
}

.thumb-with-source {
    gap: 2px;
}

.source {
    font-size: 11px;
    color: #9A9A9A;
}

.empty-hint {
    color: #9A9A9A;
    font-size: 13px;
    padding: 8px 0;
}
</style>
