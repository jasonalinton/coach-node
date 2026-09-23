<template>
    <div class="media-upload-test">
        <h1>Media upload test</h1>
        <p class="hint">
            Dev-only harness for phase 2 (upload API + browser upload). Not linked from the app nav -
            remove this route once phase 5 wires a real gallery into the todo form.
        </p>

        <section>
            <h2>1. Upload a file</h2>
            <label>
                Kind
                <select v-model="kind">
                    <option value="image">image</option>
                    <option value="video">video</option>
                </select>
            </label>
            <input type="file" :accept="kind + '/*'" @change="onFileChange" />
            <button :disabled="!file || uploading" @click="doUpload">Upload</button>

            <div v-if="uploading" class="progress">
                <div class="progress-bar" :style="{ width: (progress * 100) + '%' }"></div>
                <span>{{ Math.round(progress * 100) }}%</span>
            </div>
            <p v-if="uploadError" class="error">{{ uploadError }}</p>
            <pre v-if="uploadResult">{{ uploadResult }}</pre>
        </section>

        <section>
            <h2>2. Add a link</h2>
            <input v-model="linkUrl" placeholder="https://..." size="50" />
            <select v-model="linkKind">
                <option value="image">image</option>
                <option value="video">video</option>
            </select>
            <input v-model="linkTitle" placeholder="Title (optional)" />
            <button :disabled="!linkUrl" @click="doCreateLink">Add link</button>
            <p v-if="linkError" class="error">{{ linkError }}</p>
            <pre v-if="linkResult">{{ linkResult }}</pre>
        </section>

        <section>
            <h2>3. Attach to a todo</h2>
            <p class="hint">Uses the media from step 1 or 2, whichever ran last.</p>
            <input v-model.number="todoId" type="number" placeholder="Todo ID" />
            <button :disabled="!todoId" @click="loadTodoMedia">Load media</button>
            <button :disabled="!todoId || !lastMedia" @click="attach">Attach last media</button>
            <p v-if="todoMediaError" class="error">{{ todoMediaError }}</p>
            <ul>
                <li v-for="link in todoMedia" :key="link.id">
                    #{{ link.id }} - media {{ link.media.id }} ({{ link.media.kind }}, {{ link.media.status }})
                    <a v-if="link.media.url" :href="link.media.url" target="_blank">open</a>
                    <button @click="detach(link.media.id)">Detach</button>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
import { uploadMedia, createLink, getMediaForTodo, attachMediaToTodo, detachMediaFromTodo } from '@/api/mediaAPI';

export default {
    name: 'MediaUploadTest',
    data() {
        return {
            kind: 'image',
            file: null,
            uploading: false,
            progress: 0,
            uploadResult: null,
            uploadError: null,

            linkUrl: '',
            linkKind: 'image',
            linkTitle: '',
            linkResult: null,
            linkError: null,

            todoId: null,
            todoMedia: [],
            todoMediaError: null,
        };
    },
    computed: {
        lastMedia() {
            return this.uploadResult || this.linkResult;
        },
    },
    methods: {
        onFileChange(event) {
            this.file = event.target.files[0] || null;
        },
        async doUpload() {
            this.uploading = true;
            this.progress = 0;
            this.uploadError = null;
            this.uploadResult = null;
            try {
                this.uploadResult = await uploadMedia(this.file, this.kind, (fraction) => {
                    this.progress = fraction;
                });
            } catch (error) {
                this.uploadError = error.message;
            } finally {
                this.uploading = false;
            }
        },
        async doCreateLink() {
            this.linkError = null;
            this.linkResult = null;
            const response = await createLink(this.linkUrl, this.linkKind, this.linkTitle || null);
            if (response?.status?.success) {
                this.linkResult = response.result;
            } else {
                this.linkError = response?.status?.exception?.message || 'Could not add the link.';
            }
        },
        async loadTodoMedia() {
            this.todoMediaError = null;
            const response = await getMediaForTodo(this.todoId);
            if (response?.status?.success) {
                this.todoMedia = response.result;
            } else {
                this.todoMediaError = response?.status?.exception?.message || 'Could not load media for this todo.';
            }
        },
        async attach() {
            await attachMediaToTodo(this.todoId, this.lastMedia.id, null);
            await this.loadTodoMedia();
        },
        async detach(idMediaAsset) {
            await detachMediaFromTodo(this.todoId, idMediaAsset);
            await this.loadTodoMedia();
        },
    },
};
</script>

<style scoped>
.media-upload-test {
    max-width: 640px;
    margin: 24px auto;
    font-family: system-ui, sans-serif;
}
.hint {
    color: #666;
    font-size: 13px;
}
section {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 16px;
    margin-bottom: 16px;
}
.progress {
    position: relative;
    background: #eee;
    border-radius: 4px;
    height: 20px;
    margin: 8px 0;
    overflow: hidden;
}
.progress-bar {
    background: #0b6e73;
    height: 100%;
    transition: width 0.2s;
}
.progress span {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}
.error {
    color: #b00020;
}
pre {
    background: #f6f6f6;
    padding: 8px;
    overflow-x: auto;
    font-size: 12px;
}
</style>
