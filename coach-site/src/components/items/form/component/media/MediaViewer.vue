<template>
    <div class="media-viewer-backdrop" @click.self="$emit('close')">
        <div class="media-viewer d-flex flex-column">
            <div class="viewer-header d-flex flex-row justify-content-between">
                <span class="title text-start">{{ media.title || media.originalFileName || (media.kind == 'video' ? 'Video' : 'Photo') }}</span>
                <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')"></button>
            </div>

            <div class="viewer-body d-flex align-items-center justify-content-center">
                <!-- YouTube / Vimeo: play inline -->
                <div v-if="media.embedUrl" class="embed-wrap">
                    <iframe :src="media.embedUrl" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen></iframe>
                </div>

                <!-- iCloud: it blocks embedding, so this is a click-through, not a player -->
                <div v-else-if="media.embedProvider == 'icloud'" class="viewer-status">
                    <i class="fa-solid fa-cloud"></i>
                    <span>iCloud links can't play here</span>
                    <a :href="media.url" target="_blank" rel="noopener" class="retry-btn link-btn">Open in iCloud</a>
                </div>

                <!-- A direct video file - an upload, or a link that points straight at an .mp4 etc. -->
                <video v-else-if="media.kind == 'video' && media.status == 'ready' && isDirectFile"
                       controls preload="metadata" :poster="media.posterUrl" class="viewer-media">
                    <source :src="media.url" />
                </video>
                <!-- A direct image file - an upload, or a link that points straight at a .jpg etc. -->
                <img v-else-if="media.kind == 'image' && media.status == 'ready' && isDirectFile"
                     :src="media.url" class="viewer-media" :alt="media.title || 'photo'" />

                <!-- A bookmarked page: no file to play, just a preview and a way in -->
                <div v-else-if="media.source == 'link' && !isDirectFile" class="link-preview">
                    <img v-if="media.posterUrl" :src="media.posterUrl" class="link-preview-image" alt="" />
                    <i v-else class="fa-solid fa-link link-preview-icon"></i>
                    <span class="link-preview-title">{{ media.title || media.url }}</span>
                    <a :href="media.url" target="_blank" rel="noopener" class="retry-btn link-btn">Open link</a>
                </div>

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
                <div class="d-flex flex-row gap-2">
                    <button v-if="canSaveCopy" type="button" class="save-copy-btn" @click="$emit('saveCopy')">
                        Save a copy
                    </button>
                    <button v-if="showRemove" type="button" class="remove-btn" @click="$emit('remove')">Remove</button>
                </div>
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
    emits: ['close', 'remove', 'retry', 'saveCopy'],
    computed: {
        isWorking() {
            return this.media.status == 'pending' || this.media.status == 'processing';
        },
        /* True when Url itself is a playable file (an upload, or a link that points straight at an
         * image/video) rather than a bookmarked page that only has a scraped preview. MimeType is
         * only ever set server-side for exactly this case - see MediaService.CreateLinkAsync. */
        isDirectFile() {
            return this.media.source == 'upload' ||
                (!!this.media.mimeType && (this.media.mimeType.startsWith('image/') || this.media.mimeType.startsWith('video/')));
        },
        /* "Save a copy" only makes sense when there's an actual file at Url to download - not a
         * YouTube/Vimeo page (their real video isn't at that URL) or a bookmarked page. */
        canSaveCopy() {
            return this.media.source == 'link' && this.isDirectFile;
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

.viewer-status i {
    font-size: 28px;
}

.viewer-status.failed {
    color: #ff9d9d;
}

.retry-btn, .remove-btn, .save-copy-btn {
    height: 28px;
    background-color: #BAD8F1;
    border: #3B99FC solid 1px;
    border-radius: 4px;
    font-size: 13px;
    padding: 0 10px;
}

.link-btn {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: #16456e;
}

.remove-btn {
    background-color: #FBE1E1;
    border-color: #E25555;
    color: #B33939;
}

.embed-wrap {
    width: min(90vw, 900px);
    aspect-ratio: 16 / 9;
}

.embed-wrap iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
}

.link-preview {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 40px;
    max-width: min(90vw, 500px);
    text-align: center;
}

.link-preview-image {
    max-width: 320px;
    max-height: 240px;
    border-radius: 4px;
    object-fit: cover;
}

.link-preview-icon {
    font-size: 32px;
    color: rgba(255, 255, 255, .6);
}

.link-preview-title {
    font-size: 14px;
    overflow-wrap: anywhere;
}

.viewer-footer {
    padding: 8px 14px;
    font-size: 12px;
    color: #747474;
}
</style>
