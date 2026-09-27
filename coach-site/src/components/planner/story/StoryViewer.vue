<template>
    <div v-if="isOpen" class="story-backdrop">
        <div class="story-header d-flex flex-row justify-content-between align-items-center">
            <div class="story-progress d-flex flex-row flex-grow-1">
                <div v-for="(item, index) in media" :key="item.id" class="story-progress-segment">
                    <div class="story-progress-fill"
                         :class="{ filled: index < activeIndex, active: index == activeIndex }"
                         :style="index == activeIndex ? { animationDuration: `${activeDurationMs}ms` } : {}">
                    </div>
                </div>
            </div>
            <span class="story-date-label">{{ dateLabel }}</span>
            <button type="button" class="story-add-btn" aria-label="Add to story" @click="openAddPicker">
                <i class="fa-solid fa-plus"></i>
            </button>
            <button type="button" class="story-close-btn" aria-label="Close" @click="close">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <div class="story-body">
            <!-- Empty state: nothing has been added to this day yet -->
            <div v-if="media.length == 0" class="story-empty">
                <i class="fa-solid fa-images"></i>
                <span>No stories yet for this day</span>
                <button type="button" class="story-empty-add-btn" @click="openAddPicker">Add to Story</button>
            </div>

            <template v-else>
                <div class="story-tap-zone story-tap-zone-prev" @click="prev"></div>
                <div class="story-tap-zone story-tap-zone-next" @click="next"></div>

                <img v-if="activeMedia && activeMedia.media.kind == 'image'"
                     :src="activeMedia.media.url" class="story-media" :alt="activeMedia.media.title || 'photo'" />
                <video v-else-if="activeMedia && activeMedia.media.kind == 'video'"
                       ref="video" :src="activeMedia.media.url" class="story-media"
                       autoplay playsinline @ended="next" @loadedmetadata="onVideoLoadedMetadata"></video>
            </template>
        </div>

        <MediaPicker v-if="showPicker" header="Add to Story" @picked="onPicked" @cancel="showPicker = false" />
    </div>
</template>

<script>
import { useMediaStore } from '@/store/mediaStore';
import { isToday, toShortWeekdayString } from '../../../../utility/timeUtility';
import MediaPicker from '@/components/items/form/component/media/MediaPicker.vue';

export default {
    name: 'StoryViewer',
    components: { MediaPicker },
    data() {
        return {
            mediaStore: undefined,
            activeIndex: 0,
            timer: undefined,
            IMAGE_DURATION_MS: 5000,
            activeVideoDurationMs: undefined,
            showPicker: false,
        };
    },
    created() {
        this.mediaStore = useMediaStore();
        this._onKeydown = this.onKeydown;
        window.addEventListener('keydown', this._onKeydown);
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this._onKeydown);
        this.clearTimer();
    },
    computed: {
        media() {
            return this.mediaStore ? this.mediaStore.storyMedia : [];
        },
        isOpen() {
            return !!(this.mediaStore && this.mediaStore.storyDate);
        },
        activeMedia() {
            return this.media[this.activeIndex];
        },
        activeDurationMs() {
            if (this.activeMedia && this.activeMedia.media.kind == 'video') {
                return this.activeVideoDurationMs || 1;
            }
            return this.IMAGE_DURATION_MS;
        },
        dateLabel() {
            if (!this.mediaStore.storyDate) return '';
            return isToday(this.mediaStore.storyDate) ? 'Today' : toShortWeekdayString(this.mediaStore.storyDate, true);
        },
    },
    methods: {
        close() {
            this.clearTimer();
            this.mediaStore.closeStory();
        },
        prev() {
            this.goTo(this.activeIndex - 1);
        },
        next() {
            this.goTo(this.activeIndex + 1);
        },
        goTo(index) {
            if (index < 0) return;
            if (index >= this.media.length) {
                this.close();
                return;
            }
            this.activeIndex = index;
        },
        restartActiveSegment() {
            this.clearTimer();
            this.activeVideoDurationMs = undefined;
            if (this.activeMedia && this.activeMedia.media.kind == 'image') {
                this.timer = window.setTimeout(this.next, this.IMAGE_DURATION_MS);
            }
            /* video: no timer here - onVideoLoadedMetadata sets the progress bar's duration, and the
             * video element's own "ended" event calls next() when it actually finishes playing. */
        },
        onVideoLoadedMetadata(e) {
            this.activeVideoDurationMs = Math.max(1, e.target.duration * 1000);
        },
        clearTimer() {
            if (this.timer) {
                window.clearTimeout(this.timer);
                this.timer = undefined;
            }
        },
        onKeydown(e) {
            if (!this.isOpen) return;
            if (e.key === 'Escape') this.close();
            else if (e.key === 'ArrowRight') this.next();
            else if (e.key === 'ArrowLeft') this.prev();
        },
        openAddPicker() {
            this.clearTimer();
            this.showPicker = true;
        },
        async onPicked(media) {
            this.showPicker = false;
            let story = await this.mediaStore.addToStory(media.id, this.mediaStore.storyDate);
            if (story) {
                /* mediaStore.addToStory already pushed it into storyMedia (same day) - jump to it. */
                this.goTo(this.media.length - 1);
            }
        },
    },
    watch: {
        activeIndex() {
            this.restartActiveSegment();
        },
        isOpen(value) {
            if (value) {
                this.activeIndex = 0;
                this.restartActiveSegment();
            } else {
                this.clearTimer();
                this.showPicker = false;
            }
        },
    },
}
</script>

<style scoped>
.story-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, .9);
    z-index: 1100;
    display: flex;
    flex-direction: column;
}

.story-header {
    padding: 10px 12px;
    gap: 10px;
    z-index: 2;
}

.story-progress {
    gap: 4px;
}

.story-progress-segment {
    flex: 1;
    height: 3px;
    background-color: rgba(255, 255, 255, .35);
    border-radius: 2px;
    overflow: hidden;
}

.story-progress-fill {
    height: 100%;
    width: 0%;
    background-color: white;
}

.story-progress-fill.filled {
    width: 100%;
}

.story-progress-fill.active {
    animation-name: story-progress-fill;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
}

@keyframes story-progress-fill {
    from { width: 0%; }
    to { width: 100%; }
}

.story-date-label {
    color: white;
    font-size: 13px;
    white-space: nowrap;
}

.story-add-btn, .story-close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    padding: 2px 6px;
    flex-shrink: 0;
}

.story-body {
    position: relative;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.story-media {
    max-width: 100vw;
    max-height: 100%;
    object-fit: contain;
}

.story-tap-zone {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 33%;
    z-index: 1;
    cursor: pointer;
}

.story-tap-zone-prev {
    left: 0;
}

.story-tap-zone-next {
    right: 0;
}

.story-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: white;
}

.story-empty i {
    font-size: 40px;
    color: rgba(255, 255, 255, .5);
}

.story-empty-add-btn {
    height: 32px;
    background-color: #BAD8F1;
    border: #3B99FC solid 1px;
    border-radius: 4px;
    font-size: 13px;
    padding: 0 14px;
}
</style>
