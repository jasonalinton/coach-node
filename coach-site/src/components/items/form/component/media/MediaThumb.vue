<template>
    <div class="media-thumb" :style="{ width: size + 'px', height: size + 'px' }"
         :class="{ clickable: clickable }"
         @click="clickable && $emit('click')">
        <img v-if="imageSrc" :src="imageSrc" class="thumb-img" :alt="media.title || media.originalFileName || 'media'" />
        <div v-else class="thumb-placeholder"></div>

        <!-- Play badge for an inline-playable video; an external-link badge for a click-through (iCloud blocks embedding) -->
        <i v-if="media.embedProvider == 'icloud'" class="fa-solid fa-arrow-up-right-from-square badge"></i>
        <i v-else-if="media.kind == 'video' && imageSrc" class="fa-solid fa-circle-play badge"></i>

        <!-- Processing / pending overlay -->
        <div v-if="isWorking" class="overlay working">
            <SpinningLoader :isVisible="true" class="small-loader" />
            <span v-if="media.status == 'processing'">Processing…</span>
            <span v-else>Uploading…</span>
        </div>

        <!-- Failed overlay -->
        <div v-if="media.status == 'failed'" class="overlay failed" :title="media.errorMessage || 'Failed'">
            <i class="fa-solid fa-triangle-exclamation"></i>
        </div>

        <!-- Remove button -->
        <img v-if="removable" class="remove-button" src="/icon/delete-button.png" width="16" height="16"
             @click.stop="$emit('remove')" />
    </div>
</template>

<script>
import SpinningLoader from '@/components/loader/SpinningLoader.vue';

export default {
    name: 'MediaThumb',
    components: { SpinningLoader },
    props: {
        media: {
            type: Object,
            required: true,
        },
        size: {
            type: Number,
            default: () => 72,
        },
        removable: {
            type: Boolean,
            default: () => false,
        },
        clickable: {
            type: Boolean,
            default: () => true,
        },
    },
    emits: ['click', 'remove'],
    computed: {
        isWorking() {
            return this.media.status == 'pending' || this.media.status == 'processing';
        },
        imageSrc() {
            /* A poster/preview - an upload's own generated thumbnail, or a link's scraped og:image or
             * provider thumbnail - is always the lightest, most correct thing to show in a tile, so it
             * wins whenever there is one. Without one: a direct image link can show itself; a video, a
             * plain web link, or an embed with no thumbnail (e.g. Vimeo, iCloud) has nothing an <img>
             * can render, so the placeholder box covers it instead. */
            if (this.media.posterUrl) return this.media.posterUrl;
            if (this.media.kind == 'image') return this.media.url || null;
            return null;
        },
    },
}
</script>

<style scoped>
.media-thumb {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    background-color: #F5F5F5;
    flex-shrink: 0;
}

.media-thumb.clickable {
    cursor: pointer;
}

.thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.thumb-placeholder {
    width: 100%;
    height: 100%;
    background-color: #E4E4E4;
}

.badge {
    position: absolute;
    bottom: 4px;
    right: 4px;
    color: white;
    font-size: 16px;
    text-shadow: 0 0 3px rgba(0, 0, 0, .6);
    pointer-events: none;
}

.overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: 10px;
    text-align: center;
    padding: 4px;
}

.overlay.working {
    background-color: rgba(255, 255, 255, .82);
    color: #555;
}

.small-loader {
    transform: scale(.4);
    margin: -8px 0;
}

.overlay.failed {
    background-color: rgba(226, 85, 85, .12);
    color: #E25555;
    font-size: 18px;
}

.remove-button {
    position: absolute;
    top: 2px;
    right: 2px;
    background-color: rgba(255, 255, 255, .85);
    border-radius: 8px;
    padding: 2px;
    opacity: 0;
    transition: opacity .1s;
}

.media-thumb:hover .remove-button {
    opacity: 1;
}
</style>
