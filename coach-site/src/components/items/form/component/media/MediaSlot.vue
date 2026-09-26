<template>
    <div class="media-slot d-flex flex-column">
        <span class="label text-start">{{ label }}</span>
        <div class="d-flex flex-row align-items-start gap-2">
            <MediaThumb v-if="media" :media="media" :size="size" :removable="true"
                        @click="viewing = true" @remove="$emit('clear')" />
            <div v-else class="empty-slot d-flex align-items-center justify-content-center"
                 :style="{ width: size + 'px', height: size + 'px' }"
                 @click="showPicker = true">
                <i class="fa-solid fa-plus"></i>
            </div>
            <button v-if="media" type="button" class="change-btn" @click="showPicker = true">Change</button>
        </div>

        <MediaPicker v-if="showPicker" :header="pickerHeader" :defaultKind="defaultKind" :allowKindChoice="allowKindChoice"
                     @picked="onPicked" @cancel="showPicker = false" />
        <MediaViewer v-if="viewing && media" :media="media" :showRemove="true"
                     @close="viewing = false" @remove="viewing = false; $emit('clear')"
                     @saveCopy="onSaveCopy" />
    </div>
</template>

<script>
import { useMediaStore } from '@/store/mediaStore';
import MediaThumb from './MediaThumb.vue';
import MediaPicker from './MediaPicker.vue';
import MediaViewer from './MediaViewer.vue';

export default {
    name: 'MediaSlot',
    components: { MediaThumb, MediaPicker, MediaViewer },
    props: {
        media: {
            type: Object,
            default: () => null,
        },
        label: {
            type: String,
            required: true,
        },
        defaultKind: {
            type: String,
            default: () => 'image',
        },
        allowKindChoice: {
            type: Boolean,
            default: () => false,
        },
        size: {
            type: Number,
            default: () => 72,
        },
    },
    emits: ['set', 'clear'],
    data() {
        return {
            mediaStore: undefined,
            showPicker: false,
            viewing: false,
        };
    },
    created() {
        this.mediaStore = useMediaStore();
    },
    computed: {
        pickerHeader() {
            return `Set ${this.label.toLowerCase()}`;
        },
    },
    methods: {
        onPicked(media) {
            this.showPicker = false;
            this.$emit('set', media);
        },
        /* A single slot has room for one item, so a saved copy replaces the link outright rather than
         * sitting alongside it (unlike the gallery's multi-item case). */
        async onSaveCopy() {
            let copy = await this.mediaStore.saveCopy(this.media.id);
            if (copy) {
                this.viewing = false;
                this.$emit('set', copy);
            }
        },
    },
}
</script>

<style scoped>
.label {
    font-size: 12px;
    color: rgba(0, 0, 0, .55);
    margin-bottom: 2px;
}

.empty-slot {
    border: 1px dashed #ccc;
    border-radius: 4px;
    color: #aaa;
    cursor: pointer;
    flex-shrink: 0;
}

.empty-slot:hover {
    border-color: #3B99FC;
    color: #3B99FC;
}

.change-btn {
    height: 24px;
    align-self: center;
    background-color: transparent;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 12px;
    padding: 0 8px;
}

.change-btn:hover {
    border-color: #3B99FC;
    color: #3B99FC;
}
</style>
