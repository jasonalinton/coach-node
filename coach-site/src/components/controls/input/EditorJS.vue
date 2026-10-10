<template>
    <div class="editorjs" ref="htmlelement"></div>
</template>

<script>
import EditorJS from '@editorjs/editorjs';
import HeaderTool from '@editorjs/header';
import ListTool from '@editorjs/list';
import ChecklistTool from '@editorjs/checklist';
import QuoteTool from '@editorjs/quote';
import EmbedTool from '@editorjs/embed';
import ImageTool from '@editorjs/image';
import { useMediaStore } from '@/store/mediaStore';
import { plainData } from '../../../../utility/editorjsUtility';

export default {
    name: 'EditorJS',
    props: {
        /* Editor.js's own OutputData shape ({ time, blocks, version }), or null when empty. */
        modelValue: {
            type: Object,
            default: null,
        },
        placeholder: String,
        readOnly: Boolean,
    },
    emits: ['update:modelValue'],
    data: function () {
        return {
            mediaStore: undefined,
            editor: undefined,
            /* The last OutputData this component itself emitted. When modelValue changes back to
             * this (the normal v-model round trip), we skip re-rendering - re-rendering the editor's
             * own content back into itself would blow away the user's cursor/selection mid-edit. */
            lastEmitted: null,
        }
    },
    created() {
        this.mediaStore = useMediaStore();
    },
    mounted() {
        this.editor = new EditorJS({
            holder: this.$refs.htmlelement,
            data: plainData(this.modelValue),
            placeholder: this.placeholder,
            readOnly: this.readOnly,
            tools: {
                header: HeaderTool,
                list: { class: ListTool, inlineToolbar: true },
                checklist: { class: ChecklistTool, inlineToolbar: true },
                quote: { class: QuoteTool, inlineToolbar: true },
                embed: EmbedTool,
                image: {
                    class: ImageTool,
                    config: {
                        uploader: {
                            uploadByFile: this.uploadByFile,
                            uploadByUrl: this.uploadByUrl,
                        },
                    },
                },
            },
            onChange: this.onEditorChange,
        });
    },
    unmounted() {
        if (this.editor && this.editor.destroy) this.editor.destroy();
    },
    methods: {
        /** Public: focuses the caret at the end of the editor's content (mirrors a plain
         * textarea's .focus(), for callers migrating from one). */
        async focus() {
            if (!this.editor) return;
            await this.editor.isReady;
            this.editor.caret.setToLastBlock('end');
        },
        /** Public: mirrors a plain textarea's .blur(). Editor.js has no direct API for this, so it
         * just blurs whichever element inside the editor currently has focus. */
        blur() {
            let active = document.activeElement;
            if (active && this.$refs.htmlelement && this.$refs.htmlelement.contains(active)) {
                active.blur();
            }
        },
        async onEditorChange() {
            if (!this.editor) return;
            let data = await this.editor.save();
            this.lastEmitted = data;
            this.$emit('update:modelValue', data);
        },
        /** Editor.js image tool's uploadByFile override - reuses the app's existing SAS-based
         * media pipeline (mediaStore.upload) instead of a plain multipart endpoint. */
        async uploadByFile(file) {
            try {
                let media = await this.mediaStore.upload(file, 'image');
                if (!media) return { success: 0 };
                return { success: 1, file: { url: media.url } };
            } catch {
                return { success: 0 };
            }
        },
        /** Editor.js image tool's uploadByUrl override - reuses mediaStore.addLink. */
        async uploadByUrl(url) {
            try {
                let media = await this.mediaStore.addLink(url, 'image');
                if (!media) return { success: 0 };
                return { success: 1, file: { url: media.url } };
            } catch {
                return { success: 0 };
            }
        },
    },
    watch: {
        async modelValue(newValue) {
            if (!this.editor) return;
            if (this.lastEmitted && JSON.stringify(newValue) === JSON.stringify(this.lastEmitted)) return;
            await this.editor.isReady;
            let data = plainData(newValue);
            await this.editor.render(data && data.blocks && data.blocks.length ? data : { blocks: [] });
        },
        async readOnly(value) {
            if (!this.editor) return;
            await this.editor.isReady;
            this.editor.readOnly.toggle(value);
        },
    },
}
</script>

<style scoped>
.editorjs :deep(.codex-editor__redactor) {
    text-align: left;
    padding-bottom: 60px !important;
}

.editorjs :deep(.cdx-block) {
    padding: 2px 0px;
}

.editorjs :deep(.cdx-list) {
    padding-top: 2px !important;
    padding-bottom: 2px !important;
}
</style>
