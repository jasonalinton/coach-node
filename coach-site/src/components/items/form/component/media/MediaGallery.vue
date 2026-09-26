<template>
    <div class="media-gallery d-flex flex-column">
        <div class="header d-flex flex-column"
             @click="isShown = !isShown">
            <div class="d-flex flex-row justify-content-between">
                <div class="d-flex flex-row">
                    <span class="form-head text-start">{{ header }}</span>
                    <img class="icon-button ms-1 mt-auto mb-auto" src="/icon/add-button.png" :width="14" :height="14"
                         @click.stop="showPicker = true" />
                </div>
                <img v-if="!isShown" class="caret mt-auto mb-auto me-2"
                     src='/icon/caret-right.png' width="5" height="8" />
                <img v-if="isShown" class="caret mt-auto mb-auto me-2"
                     src='/icon/caret-down.png' width="8" height="5" />
            </div>
            <hr />
        </div>

        <div v-if="isShown" class="d-flex flex-row flex-wrap gap-2">
            <div v-for="(link, index) in links" :key="link.id" class="thumb-with-controls d-flex flex-column">
                <MediaThumb :media="link.media" :removable="true"
                            @click="viewingLink = link" @remove="removeLink(link)" />
                <div v-if="links.length > 1" class="reorder-row d-flex flex-row justify-content-between">
                    <img class="icon-button" src="/icon/angle-left-button.png" width="12" height="12"
                         :class="{ disabled: index == 0 }" @click="moveLeft(index)" />
                    <img class="icon-button" src="/icon/angle-right-button.png" width="12" height="12"
                         :class="{ disabled: index == links.length - 1 }" @click="moveRight(index)" />
                </div>
            </div>
            <div v-if="!links.length" class="empty-hint">No photos or videos yet.</div>
        </div>

        <MediaPicker v-if="showPicker" header="Add photo or video"
                     @picked="onPicked" @cancel="showPicker = false" />
        <MediaViewer v-if="viewingLink" :media="viewingLink.media"
                     @close="viewingLink = null" @remove="removeLink(viewingLink); viewingLink = null" />
    </div>
</template>

<script>
import { useMediaStore } from '@/store/mediaStore';
import MediaThumb from './MediaThumb.vue';
import MediaPicker from './MediaPicker.vue';
import MediaViewer from './MediaViewer.vue';

export default {
    name: 'MediaGallery',
    components: { MediaThumb, MediaPicker, MediaViewer },
    props: {
        idTodo: {
            type: Number,
            required: true,
        },
        header: {
            type: String,
            default: () => 'Media',
        },
    },
    data() {
        return {
            mediaStore: undefined,
            links: [],
            isShown: true,
            showPicker: false,
            viewingLink: null,
        };
    },
    created() {
        this.mediaStore = useMediaStore();
        this.load();
    },
    methods: {
        async load() {
            this.links = await this.mediaStore.getForTodo(this.idTodo);
        },
        async onPicked(media) {
            this.showPicker = false;
            let link = await this.mediaStore.attachToTodo(this.idTodo, media.id);
            if (link) this.links.push(link);
        },
        async removeLink(link) {
            let index = this.links.findIndex(x => x.id == link.id);
            if (index > -1) this.links.splice(index, 1);
            await this.mediaStore.remove(link.media.id);
        },
        async moveLeft(index) {
            if (index == 0) return;
            [this.links[index - 1], this.links[index]] = [this.links[index], this.links[index - 1]];
            await this.mediaStore.reorderForTodo(this.idTodo, this.links.map(x => x.id));
        },
        async moveRight(index) {
            if (index == this.links.length - 1) return;
            [this.links[index], this.links[index + 1]] = [this.links[index + 1], this.links[index]];
            await this.mediaStore.reorderForTodo(this.idTodo, this.links.map(x => x.id));
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

.icon-button {
    border-radius: 8px;
}

.icon-button:hover {
    background-color: rgba(60, 64, 67, .10);
}

.icon-button.disabled {
    opacity: .25;
    pointer-events: none;
}

hr {
    margin-top: 3px;
    margin-bottom: 3px;
    color: #8A8A8A;
}

.thumb-with-controls {
    gap: 2px;
}

.reorder-row {
    width: 72px;
}

.empty-hint {
    color: #9A9A9A;
    font-size: 13px;
    padding: 8px 0;
}
</style>
