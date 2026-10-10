<template>
    <div v-if="isOpen" class="story-backdrop">
        <div class="story-header d-flex flex-row justify-content-between align-items-center">
            <div class="story-progress d-flex flex-row flex-grow-1">
                <div v-for="(item, index) in media" :key="item.id" class="story-progress-segment">
                    <div class="story-progress-fill"
                         :key="index == activeIndex ? restartToken : -1"
                         :class="{ filled: index < activeIndex, active: index == activeIndex }"
                         :style="index == activeIndex
                             ? { animationDuration: `${activeDurationMs}ms`, animationPlayState: isPaused ? 'paused' : 'running' }
                             : {}">
                    </div>
                </div>
            </div>
            <span class="story-date-label">{{ dateLabel }}</span>
            <button v-if="media.length > 0" type="button" class="story-pause-btn"
                    :aria-label="isPaused ? 'Play' : 'Pause'" @click="togglePause">
                <i class="fa-solid" :class="isPaused ? 'fa-play' : 'fa-pause'"></i>
            </button>
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
                <div class="story-tap-zone story-tap-zone-middle" @click="togglePause"></div>
                <div class="story-tap-zone story-tap-zone-next" @click="next"></div>

                <img v-if="activeMedia && activeMedia.media.kind == 'image'"
                     :src="activeMedia.media.url" class="story-media" :alt="activeMedia.media.title || 'photo'" />
                <video v-else-if="activeMedia && activeMedia.media.kind == 'video'"
                       ref="video" :src="activeMedia.media.url" class="story-media"
                       autoplay playsinline @ended="next" @loadedmetadata="onVideoLoadedMetadata"></video>
            </template>
        </div>

        <MediaPicker v-if="showPicker" header="Add to Story" @picked="onPicked" @cancel="onPickerCancel" />
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
            /* Whether the current segment is paused. Drives both the <video>/image timer logic
             * and (via the inline style binding above) the CSS progress-fill's animation-play-state. */
            isPaused: false,
            /* Image-segment bookkeeping only - a plain setTimeout can't be paused/resumed natively,
             * so we track how much time is left ourselves. Unused for video segments, since the
             * <video> element remembers its own currentTime across pause()/play(). */
            remainingMs: undefined,
            segmentStartedAt: undefined,
            /* Bumped on an in-place restart (prev() on the first slide) and used as part of the
             * active progress-fill div's :key, forcing Vue to replace that element so its CSS
             * animation actually restarts - toggling the class alone wouldn't, since nothing about
             * the active segment's index/class is actually changing in that case. */
            restartToken: 0,
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
            /* Instagram-style behavior: going "back" from the first slide restarts it instead of
             * being a no-op (goTo(-1) would otherwise just do nothing). */
            if (this.activeIndex === 0) {
                this.restartActiveSegment(false);
            } else {
                this.goTo(this.activeIndex - 1);
            }
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
        /* isNewSegment is false only for an in-place restart (prev() on the first slide) where the
         * activeIndex isn't changing, so the <video> element isn't being re-created - unlike a real
         * segment change, we have to rewind it ourselves, and activeVideoDurationMs must be left
         * alone since no src change means "loadedmetadata" won't fire again to repopulate it. */
        restartActiveSegment(isNewSegment = true) {
            this.clearTimer();
            this.isPaused = false;
            if (isNewSegment) {
                this.activeVideoDurationMs = undefined;
            } else {
                this.restartToken++;
            }
            if (this.activeMedia && this.activeMedia.media.kind == 'image') {
                this.remainingMs = this.IMAGE_DURATION_MS;
                this.startImageTimer();
            } else if (this.activeMedia && this.activeMedia.media.kind == 'video' && !isNewSegment) {
                let video = this.$refs.video;
                if (video) {
                    video.currentTime = 0;
                    video.play();
                }
            }
            /* video + isNewSegment: no timer here - onVideoLoadedMetadata sets the progress bar's
             * duration, and the video element's own "ended" event calls next() when it finishes. */
        },
        /* Starts (or resumes) the setTimeout driving the *current* image segment's auto-advance,
         * counting down whatever is left in remainingMs. Kept separate from restartActiveSegment
         * so togglePause() can resume a paused image segment from where it left off, instead of
         * restarting it from the full duration. */
        startImageTimer() {
            this.segmentStartedAt = Date.now();
            this.timer = window.setTimeout(this.next, this.remainingMs);
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
        /* Pauses/resumes the current segment in place: the CSS progress-fill (via the
         * animation-play-state binding above, which freezes/resumes a running CSS animation
         * without restarting it) plus either the <video> element (which remembers its own
         * currentTime across pause()/play()) or, for an image, the setTimeout driving
         * auto-advance (for which we have to track remaining time ourselves). */
        togglePause() {
            if (!this.activeMedia) return;
            this.isPaused = !this.isPaused;
            if (this.activeMedia.media.kind == 'video') {
                let video = this.$refs.video;
                if (!video) return;
                if (this.isPaused) video.pause();
                else video.play();
            } else if (this.isPaused) {
                let elapsed = Date.now() - this.segmentStartedAt;
                this.remainingMs = Math.max(0, this.remainingMs - elapsed);
                this.clearTimer();
            } else {
                this.startImageTimer();
            }
        },
        onKeydown(e) {
            if (!this.isOpen) return;
            if (e.key === 'Escape') this.close();
            else if (e.key === 'ArrowRight') this.next();
            else if (e.key === 'ArrowLeft') this.prev();
        },
        /* Pauses the current segment (if any) before showing the picker, so it doesn't keep
         * counting down underneath the modal; onPickerCancel resumes it from the same spot. */
        openAddPicker() {
            if (!this.isPaused) this.togglePause();
            this.showPicker = true;
        },
        onPickerCancel() {
            this.showPicker = false;
            if (this.isPaused) this.togglePause();
        },
        async onPicked(media) {
            this.showPicker = false;
            let story = await this.mediaStore.addToStory(media.id, this.mediaStore.storyDate);
            if (story) {
                /* mediaStore.addToStory already pushed it into storyMedia (same day) - jump to it. */
                this.goTo(this.media.length - 1);
            } else if (this.isPaused) {
                this.togglePause();
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
                /* Day's story hasn't been started yet - skip the empty state and jump straight to
                 * the picker. Safe unconditionally because openStory() is only ever triggered by
                 * the calendar day label's + button, which is the only entry point into stories. */
                if (this.media.length === 0) {
                    this.openAddPicker();
                }
            } else {
                this.clearTimer();
                this.showPicker = false;
                this.isPaused = false;
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

.story-pause-btn, .story-add-btn, .story-close-btn {
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

.story-tap-zone-middle {
    left: 33%;
    right: 33%;
    width: auto;
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
