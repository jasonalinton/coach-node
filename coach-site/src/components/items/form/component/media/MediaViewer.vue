<template>
    <div class="media-viewer-backdrop" @click.self="$emit('close')">
        <div class="media-viewer d-flex flex-column">
            <div class="viewer-header d-flex flex-row justify-content-between">
                <span class="title text-start">{{ media.title || media.originalFileName || (media.kind == 'video' ? 'Video' : 'Photo') }}</span>
                <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')"></button>
            </div>

            <div class="viewer-body d-flex align-items-center justify-content-center">
                <video v-if="media.kind == 'video' && media.status == 'ready'"
                       controls preload="metadata" :poster="media.posterUrl" class="viewer-media">
                    <source :src="media.url" />
                </video>
                <img v-else-if="media.kind == 'image' && media.status == 'ready'"
                     :src="media.url" class="viewer-media" :alt="media.title || 'photo'" />

                <div v-else-if="isWorking" class="viewer-status">
                    <SpinningLoader :isVisible="true" />
                    <span>{{ media.status == 'processing' ? 'Still processing this video…' : 'Still uploading…' }}</span>
                </div>
                <div v-else-if="media.status == 'failed'" class="viewer-status failed">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span>{{ media.errorMessage || 'This failed to process.' }}</span>
                    <button v-if="media.kind == 'video'" type="button" class="retry-btn" @click="$emit('retry')">Retry</button>
                </div>
            </div>

            <div class="viewer-footer d-flex flex-row justify-content-between">
                <span class="meta text-start">
                    <template v-if="media.width && media.height">{{ media.width }}×{{ media.height }}</template>
                    <template v-if="media.durationSeconds"> · {{ formattedDuration }}</template>
                    <template v-if="media.sizeBytes"> · {{ formattedSize }}</template>
                </span>
                <button v-if="showRemove" type="button" class="remove-btn" @click="$emit('remove')">Remove</button>
            </div>
        </div>
    </div>
</template>

<script>
import SpinningLoader from '@/components/loader/SpinningLoader.vue';

export default {
    name: 'MediaViewer',
    components: { SpinningLoader },
    props: {
        media: {
            type: Object,
            required: true,
        },
        showRemove: {
            type: Boolean,
            default: () => true,
        },
    },
    emits: ['close', 'remove', 'retry'],
    computed: {
        isWorking() {
            return this.media.status == 'pending' || this.media.status == 'processing';
        },
        formattedDuration() {
            let total = Math.round(this.media.durationSeconds);
            let minutes = Math.floor(total / 60);
            let seconds = total % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        },
        formattedSize() {
            let mb = this.media.sizeBytes / 1024 / 1024;
            return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(this.media.sizeBytes / 1024)} KB`;
        },
    },
    created() {
        this._onKeydown = (e) => { if (e.key === 'Escape') this.$emit('close'); };
        window.addEventListener('keydown', this._onKeydown);
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this._onKeydown);
    },
}
</script>

<style scoped>
.media-viewer-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, .75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
}

.media-viewer {
    background-color: white;
    border-radius: 6px;
    max-width: min(90vw, 900px);
    max-height: 90vh;
    overflow: hidden;
}

.viewer-header {
    padding: 10px 14px;
    border-bottom: 1px solid #eee;
}

.title {
    font-size: 15px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.viewer-body {
    background-color: #111;
    min-height: 200px;
    max-height: 72vh;
}

.viewer-media {
    max-width: min(90vw, 900px);
    max-height: 72vh;
    display: block;
}

.viewer-status {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 40px;
    font-size: 14px;
}

.viewer-status.failed {
    color: #ff9d9d;
}

.viewer-status.failed i {
    font-size: 28px;
}

.retry-btn, .remove-btn {
    height: 28px;
    background-color: #BAD8F1;
    border: #3B99FC solid 1px;
    border-radius: 4px;
    font-size: 13px;
    padding: 0 10px;
}

.remove-btn {
    background-color: #FBE1E1;
    border-color: #E25555;
    color: #B33939;
}

.viewer-footer {
    padding: 8px 14px;
    font-size: 12px;
    color: #747474;
}
</style>
