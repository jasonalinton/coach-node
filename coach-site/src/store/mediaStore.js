import { defineStore } from 'pinia';
import { getSocketConnection } from './socket';
import {
    uploadMedia, createLink, getMedia, deleteMedia,
    getMediaForTodo, attachMediaToTodo, detachMediaFromTodo, reorderTodoMedia,
    setExerciseDemoMedia, setExerciseThumbnailMedia, saveMediaCopy,
    getStoriesInRange, addMediaToStory, getMediaLibrary,
} from '../api/mediaAPI';
import { replaceOrAddItem } from '../../utility';
import { startOfDay, endOfDay, isSameDate } from '../../utility/timeUtility';

let initialized = false;

/* Cache of MediaModel by id, kept fresh by the "SendMediaUpdate" SignalR push (see
 * CoachHub.SendMediaUpdate / MediaService in the API) so a video card flips from "processing" to
 * playable without a refresh, in whichever component happens to be showing it. */
export const useMediaStore = defineStore('media', {
    state: () => ({
        media: [],
        /* The day whose story slideshow is currently open, or null when closed. Unlike a real
         * social-media story this isn't auto-populated - storyMedia can legitimately be empty even
         * while storyDate is set, since that's the normal starting state for a day nobody has added
         * anything to yet. See StoryViewer.vue. */
        storyDate: null,
        storyMedia: [],
    }),
    getters: {
        getMedia: (state) => (id) => state.media.find(x => x.id == id),
    },
    actions: {
        initialize() {
            this.connectSocket();
            initialized = true;
        },
        cache(model) {
            if (model) replaceOrAddItem(model, this.media);
            return model;
        },
        /* Fetches a media asset if it isn't already cached (e.g. an exercise's demo/thumbnail id,
         * discovered outside of a gallery that already loaded it). */
        async ensure(id) {
            if (!id) return undefined;
            let existing = this.getMedia(id);
            if (existing) return existing;
            let response = await getMedia(id);
            return response?.status?.success ? this.cache(response.result) : undefined;
        },

        async upload(file, kind, onProgress) {
            let model = await uploadMedia(file, kind, onProgress);
            return this.cache(model);
        },
        async addLink(url, kind, title) {
            let response = await createLink(url, kind, title);
            return response?.status?.success ? this.cache(response.result) : undefined;
        },
        async remove(id) {
            let response = await deleteMedia(id);
            if (response?.status?.success) {
                let index = this.media.findIndex(x => x.id == id);
                if (index > -1) this.media.splice(index, 1);
            }
            return response?.status?.success ?? false;
        },

        async getForTodo(idTodo) {
            let response = await getMediaForTodo(idTodo);
            if (!response?.status?.success) return [];
            response.result.forEach(link => this.cache(link.media));
            return response.result;
        },
        async attachToTodo(idTodo, idMediaAsset, position) {
            let response = await attachMediaToTodo(idTodo, idMediaAsset, position);
            if (response?.status?.success) this.cache(response.result.media);
            return response?.status?.success ? response.result : undefined;
        },
        async detachFromTodo(idTodo, idMediaAsset) {
            let response = await detachMediaFromTodo(idTodo, idMediaAsset);
            return response?.status?.success ?? false;
        },
        async reorderForTodo(idTodo, orderedTodoMediaAssetIds) {
            let response = await reorderTodoMedia(idTodo, orderedTodoMediaAssetIds);
            return response?.status?.success ?? false;
        },

        async setExerciseDemo(idExercise, idMediaAsset) {
            let response = await setExerciseDemoMedia(idExercise, idMediaAsset);
            return response?.status?.success ?? false;
        },
        async setExerciseThumbnail(idExercise, idMediaAsset) {
            let response = await setExerciseThumbnailMedia(idExercise, idMediaAsset);
            return response?.status?.success ?? false;
        },

        /** Downloads a link's file into our own storage; returns the new, separate upload-sourced media. */
        async saveCopy(id) {
            let response = await saveMediaCopy(id);
            return response?.status?.success ? this.cache(response.result) : undefined;
        },

        /**
         * Opens the story viewer for `date`, fetching whatever's already been added to it. Always
         * sets storyDate (opening the viewer), even when the day turns out to have nothing in it yet -
         * StoryViewer shows an empty state with an add prompt in that case, since a day starting empty
         * is normal here (nothing is auto-populated).
         */
        async openStory(date) {
            let response = await getStoriesInRange(startOfDay(date), endOfDay(date));
            let stories = response?.status?.success ? response.result : [];
            stories.forEach(story => this.cache(story.media));
            this.storyDate = date;
            this.storyMedia = stories;
        },
        closeStory() {
            this.storyDate = null;
            this.storyMedia = [];
        },
        /**
         * Tags an existing media asset into a story day - the only way a story entry ever gets
         * created. Called both from StoryViewer's own add flow (a specific day, usually whichever
         * day's story is currently open) and from anywhere else on the site that shows a single media
         * item (MediaViewer's "Add to Story" button, no date given, defaults to today) - so it doesn't
         * assume a story viewer is even open.
         */
        async addToStory(idMediaAsset, dateTime) {
            let response = await addMediaToStory(idMediaAsset, dateTime);
            if (!response?.status?.success) return undefined;
            let story = response.result;
            this.cache(story.media);
            if (this.storyDate && isSameDate(story.dateTime, this.storyDate)) {
                this.storyMedia.push(story);
            }
            return story;
        },
        /** Distinct day-strings (toDateString()) that already have story media within [startAt, endAt] -
         * lets a calendar view show which days have a story without opening each one. */
        async getStoryDatesInRange(startAt, endAt) {
            let response = await getStoriesInRange(startAt, endAt);
            if (!response?.status?.success) return [];
            return [...new Set(response.result.map(story => new Date(story.dateTime).toDateString()))];
        },
        /** Cursor-paginated "browse everything" list for MediaPicker's Library tab. */
        async getLibrary(beforeId, pageSize) {
            let response = await getMediaLibrary(beforeId, pageSize);
            if (!response?.status?.success) return [];
            response.result.forEach(item => this.cache(item));
            return response.result;
        },

        connectSocket() {
            if (!initialized) {
                let coachConnection = getSocketConnection("coachHub");
                coachConnection.on("SendMediaUpdate", model => {
                    this.cache(model);
                });
            }
        },
    },
});
