import { postEndpoint } from "./api";
import { BlockBlobClient } from "@azure/storage-blob";

/* Media assets: photos/videos uploaded to Azure Blob Storage, or links to media hosted elsewhere.
 * See coach-node/coach-site/CLAUDE.md and Data/SQL/Scripts/Migration/Add Media Tables.sql. */

export async function createUpload(fileName, contentType, kind) {
    return postEndpoint('Media', 'CreateUpload', { fileName, contentType, kind });
}

export async function completeUpload(id) {
    return postEndpoint('Media', 'CompleteUpload', { id });
}

export async function createLink(url, kind, title) {
    return postEndpoint('Media', 'CreateLink', { url, kind, title });
}

export async function getMedia(id) {
    return postEndpoint('Media', 'GetMedia', { id });
}

export async function deleteMedia(id) {
    return postEndpoint('Media', 'DeleteMedia', { id });
}

export async function getMediaForTodo(idTodo) {
    return postEndpoint('Media', 'GetMediaForTodo', { idTodo });
}

export async function attachMediaToTodo(idTodo, idMediaAsset, position) {
    return postEndpoint('Media', 'AttachMediaToTodo', { idTodo, idMediaAsset, position });
}

export async function detachMediaFromTodo(idTodo, idMediaAsset) {
    return postEndpoint('Media', 'DetachMediaFromTodo', { idTodo, idMediaAsset });
}

export async function reorderTodoMedia(idTodo, orderedTodoMediaAssetIds) {
    return postEndpoint('Media', 'ReorderTodoMedia', { idTodo, orderedTodoMediaAssetIds });
}

export async function setExerciseDemoMedia(idExercise, idMediaAsset) {
    return postEndpoint('Media', 'SetExerciseDemoMedia', { idExercise, idMediaAsset });
}

export async function setExerciseThumbnailMedia(idExercise, idMediaAsset) {
    return postEndpoint('Media', 'SetExerciseThumbnailMedia', { idExercise, idMediaAsset });
}

/** Downloads a link's file into our own storage and runs it through the normal upload pipeline - protection against the original link rotting. */
export async function saveMediaCopy(id) {
    return postEndpoint('Media', 'SaveMediaCopy', { id });
}

/**
 * Uploads a File straight to Blob Storage - the file's bytes never pass through the Coach API -
 * then tells the API the upload finished. Returns the finished media (kind: "image" | "video").
 *
 * onProgress(fraction) is called repeatedly with a number from 0 to 1 while the upload runs.
 * Throws if the API rejects the request or the upload itself fails; the caller should catch this
 * and show it, since a dropped multi-GB upload is exactly the kind of failure a user needs to see.
 */
export async function uploadMedia(file, kind, onProgress) {
    const created = await createUpload(file.name, file.type || 'application/octet-stream', kind);
    if (!created?.status?.success) {
        throw new Error(created?.status?.exception?.message || 'Could not start the upload.');
    }
    const media = created.result;

    const blockBlobClient = new BlockBlobClient(media.uploadUrl);
    await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: { blobContentType: file.type || 'application/octet-stream' },
        concurrency: 4,
        onProgress: (progress) => {
            if (onProgress) onProgress(Math.min(1, progress.loadedBytes / file.size));
        },
    });

    const completed = await completeUpload(media.id);
    if (!completed?.status?.success) {
        throw new Error(completed?.status?.exception?.message || 'Upload finished, but the server could not confirm it.');
    }
    if (completed.result.status === 'failed') {
        throw new Error(completed.result.errorMessage || 'Upload finished, but processing failed.');
    }
    return completed.result;
}
