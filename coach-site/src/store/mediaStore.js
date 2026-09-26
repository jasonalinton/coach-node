import { defineStore } from 'pinia';
import { getSocketConnection } from './socket';
import {
    uploadMedia, createLink, getMedia, deleteMedia,
    getMediaForTodo, attachMediaToTodo, detachMediaFromTodo, reorderTodoMedia,
    setExerciseDemoMedia, setExerciseThumbnailMedia,
} from '../api/mediaAPI';
import { replaceOrAddItem } from '../../utility';

let initialized = false;

/* Cache of MediaModel by id, kept fresh by the "SendMediaUpdate" SignalR push (see
 * CoachHub.SendMediaUpdate / MediaService in the API) so a video card flips from "processing" to
 * playable without a refresh, in whichever component happens to be showing it. */
export const useMediaStore = defineStore('media', {
    state: () => ({
        media: [],
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
