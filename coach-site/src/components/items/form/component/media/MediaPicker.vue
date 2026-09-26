<template>
    <div class="media-picker-backdrop" @click.self="$emit('cancel')">
        <div class="media-picker d-flex flex-column">
            <div class="picker-header d-flex flex-row justify-content-between">
                <span class="title">{{ headerText }}</span>
                <button type="button" class="btn-close" aria-label="Close" @click="$emit('cancel')"></button>
            </div>

            <div class="tabs d-flex flex-row">
                <span class="tab" :class="{ active: tab == 'upload' }" @click="tab = 'upload'">Upload</span>
                <span class="tab" :class="{ active: tab == 'link' }" @click="tab = 'link'">Link</span>
            </div>

            <div v-if="allowKindChoice" class="kind-row d-flex flex-row gap-2 mt-2">
                <span class="app-pill" :class="{ selected: kind == 'image' }" @click="kind = 'image'">Photo</span>
                <span class="app-pill" :class="{ selected: kind == 'video' }" @click="kind = 'video'">Video</span>
            </div>

            <!-- Upload -->
            <div v-if="tab == 'upload'" class="d-flex flex-column mt-2 gap-2">
                <input type="file" :accept="kind + '/*'" @change="onFileChange" :disabled="uploading" />
                <div v-if="uploading" class="progress-track">
                    <div class="progress-fill" :style="{ width: (progress * 100) + '%' }"></div>
                </div>
                <p v-if="uploadError" class="error">{{ uploadError }}</p>
                <button type="button" class="primary-btn" :disabled="!file || uploading" @click="doUpload">
                    {{ uploading ? 'Uploading…' : 'Upload' }}
                </button>
            </div>

            <!-- Link -->
            <div v-if="tab == 'link'" class="d-flex flex-column mt-2 gap-2">
                <input class="textbox" type="text" v-model.trim="linkUrl" placeholder="https://…" />
                <input class="textbox" type="text" v-model.trim="linkTitle" placeholder="Title (optional)" />
                <p v-if="linkError" class="error">{{ linkError }}</p>
                <button type="button" class="primary-btn" :disabled="!linkUrl || addingLink" @click="doAddLink">
                    {{ addingLink ? 'Adding…' : 'Add link' }}
                </button>
                <p class="hint">Direct .jpg/.mp4 links, YouTube and Vimeo work best. iCloud share links open in a new tab instead of playing inline.</p>
            </div>
        </div>
    </div>
</template>

<script>
import { useMediaStore } from '@/store/mediaStore';

export default {
    name: 'MediaPicker',
    props: {
        /* Preselected/fixed kind ("image" | "video"). Ignored (and pickable by the user) unless allowKindChoice is false. */
        defaultKind: {
            type: String,
            default: () => 'image',
        },
        allowKindChoice: {
            type: Boolean,
            default: () => true,
        },
        header: {
            type: String,
            default: () => 'Add media',
        },
    },
    emits: ['picked', 'cancel'],
    data() {
        return {
            mediaStore: undefined,
            tab: 'upload',
            kind: this.defaultKind,
            file: undefined,
            uploading: false,
            progress: 0,
            uploadError: undefined,
            linkUrl: '',
            linkTitle: '',
            addingLink: false,
            linkError: undefined,
        };
    },
    created() {
        this.mediaStore = useMediaStore();
    },
    computed: {
        headerText() {
            return this.header;
        },
    },
    methods: {
        onFileChange(e) {
            this.file = e.target.files[0] || undefined;
            this.uploadError = undefined;
        },
        async doUpload() {
            this.uploading = true;
            this.progress = 0;
            this.uploadError = undefined;
            try {
                let media = await this.mediaStore.upload(this.file, this.kind, (fraction) => { this.progress = fraction; });
                this.$emit('picked', media);
            } catch (error) {
                this.uploadError = error.message || 'Upload failed.';
            } finally {
                this.uploading = false;
            }
        },
        async doAddLink() {
            this.addingLink = true;
            this.linkError = undefined;
            try {
                let media = await this.mediaStore.addLink(this.linkUrl, this.kind, this.linkTitle || undefined);
                if (media) {
                    this.$emit('picked', media);
                } else {
                    this.linkError = "Couldn't add that link.";
                }
            } finally {
                this.addingLink = false;
            }
        },
    },
}
</script>

<style scoped>
.media-picker-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, .45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1060;
}

.media-picker {
    background-color: white;
    border-radius: 6px;
    padding: 14px 16px 16px;
    width: 340px;
    max-width: 90vw;
}

.picker-header {
    margin-bottom: 6px;
}

.title {
    font-size: 15px;
    font-weight: 500;
}

.tabs {
    border-bottom: 1px solid #eee;
    gap: 16px;
}

.tab {
    font-size: 13px;
    color: #747474;
    padding-bottom: 6px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
}

.tab.active {
    color: #212529;
    border-bottom-color: #3B99FC;
}

.kind-row .app-pill {
    font-size: 13px;
}

.progress-track {
    background-color: #eee;
    border-radius: 4px;
    height: 8px;
    overflow: hidden;
}

.progress-fill {
    background-color: #3B99FC;
    height: 100%;
    transition: width .15s;
}

.primary-btn {
    height: 30px;
    background-color: #BAD8F1;
    border: #3B99FC solid 1px;
    border-radius: 4px;
    font-size: 13px;
}

.primary-btn:disabled {
    opacity: .5;
}

.error {
    color: #B33939;
    font-size: 12px;
    margin: 0;
}

.hint {
    color: #9A9A9A;
    font-size: 11px;
    margin: 0;
}
</style>
