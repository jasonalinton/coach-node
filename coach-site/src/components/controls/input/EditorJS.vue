<template>
    <div class="editorjs-wrapper">
        <div v-if="!readOnly" class="custom-toolbar d-flex flex-row align-items-center">
            <!-- Text style -->
            <button type="button" class="tb-btn" :class="{ active: currentBlockName === 'paragraph' }" title="Normal"
                    @mousedown.prevent @click="convertCurrentBlock('paragraph')" v-html="icons.pilcrow"></button>
            <button type="button" class="tb-btn" :class="{ active: currentBlockName === 'header' && currentBlockLevel === 1 }" title="Heading 1"
                    @mousedown.prevent @click="convertCurrentBlock('header', { level: 1 })" v-html="icons.heading1"></button>
            <button type="button" class="tb-btn" :class="{ active: currentBlockName === 'header' && currentBlockLevel === 2 }" title="Heading 2"
                    @mousedown.prevent @click="convertCurrentBlock('header', { level: 2 })" v-html="icons.heading2"></button>
            <button type="button" class="tb-btn" :class="{ active: currentBlockName === 'header' && currentBlockLevel === 3 }" title="Heading 3"
                    @mousedown.prevent @click="convertCurrentBlock('header', { level: 3 })" v-html="icons.heading3"></button>
            <button type="button" class="tb-btn" :class="{ active: currentBlockName === 'header' && currentBlockLevel === 4 }" title="Heading 4"
                    @mousedown.prevent @click="convertCurrentBlock('header', { level: 4 })" v-html="icons.heading4"></button>
            <span class="tb-divider"></span>
            <!-- Inline formatting -->
            <button type="button" class="tb-btn" :class="{ active: marks.bold }" title="Bold"
                    @mousedown.prevent @click="toggleMark('bold')" v-html="icons.bold"></button>
            <button type="button" class="tb-btn" :class="{ active: marks.italic }" title="Italic"
                    @mousedown.prevent @click="toggleMark('italic')" v-html="icons.italic"></button>
            <button type="button" class="tb-btn" :class="{ active: marks.underline }" title="Underline"
                    @mousedown.prevent @click="toggleMark('underline')" v-html="icons.underline"></button>
            <button type="button" class="tb-btn" :class="{ active: marks.strikethrough }" title="Strikethrough"
                    @mousedown.prevent @click="toggleMark('strikeThrough')" v-html="icons.strikethrough"></button>
            <span class="tb-divider tb-divider--row"></span>
            <!-- Lists -->
            <button type="button" class="tb-btn" :class="{ active: currentBlockName === 'list' && currentBlockStyle === 'unordered' }" title="Bulleted list"
                    @mousedown.prevent @click="convertCurrentBlock('list', { style: 'unordered' })" v-html="icons.list"></button>
            <button type="button" class="tb-btn" :class="{ active: currentBlockName === 'list' && currentBlockStyle === 'ordered' }" title="Numbered list"
                    @mousedown.prevent @click="convertCurrentBlock('list', { style: 'ordered' })" v-html="icons.listOrdered"></button>
            <button type="button" class="tb-btn" :class="{ active: currentBlockName === 'checklist' }" title="Checklist"
                    @mousedown.prevent @click="convertCurrentBlock('checklist')" v-html="icons.checkbox"></button>
            <span class="tb-divider"></span>
            <!-- Indentation -->
            <button type="button" class="tb-btn" title="Decrease indent"
                    @mousedown.prevent @click="indentCurrentBlock(-1)" v-html="icons.indentDecrease"></button>
            <button type="button" class="tb-btn" title="Increase indent"
                    @mousedown.prevent @click="indentCurrentBlock(1)" v-html="icons.indentIncrease"></button>
            <!-- Move -->
            <button type="button" class="tb-btn" title="Move block up"
                    @mousedown.prevent @click="moveCurrentBlock(-1)" v-html="icons.moveUp"></button>
            <button type="button" class="tb-btn" title="Move block down"
                    @mousedown.prevent @click="moveCurrentBlock(1)" v-html="icons.moveDown"></button>
            <span class="tb-spacer"></span>
            <span class="tb-divider"></span>
            <button type="button" class="tb-btn tb-delete" title="Delete block"
                    @mousedown.prevent @click="deleteCurrentBlock" v-html="icons.trash"></button>
        </div>
        <div class="editorjs" ref="htmlelement"></div>
    </div>
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

/* Icon set: Lucide (ISC license, https://lucide.dev), matching the Figma "Compact text formatting
 * toolbar" spec (Design Elements board, node 1048:704), which names its icon layers after Lucide's
 * own icon slugs (pilcrow, heading-1..4, bold, italic, underline, strikethrough, indent-decrease/
 * increase, etc). */
const ICONS = {
    pilcrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"/></svg>',
    heading1: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="m17 12 3-2v8"/></svg>',
    heading2: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></svg>',
    heading3: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>',
    heading4: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18V6"/><path d="M17 10v3a1 1 0 0 0 1 1h3"/><path d="M21 10v8"/><path d="M4 12h8"/><path d="M4 18V6"/></svg>',
    bold: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>',
    italic: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>',
    underline: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></svg>',
    strikethrough: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/></svg>',
    list: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/></svg>',
    listOrdered: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5h10"/><path d="M11 12h10"/><path d="M11 19h10"/><path d="M4 4h1v5"/><path d="M4 9h2"/><path d="M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02"/></svg>',
    checkbox: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m16 9-5.5 5.5L8 12"/></svg>',
    indentDecrease: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 5H11"/><path d="M21 12H11"/><path d="M21 19H11"/><path d="m7 8-4 4 4 4"/></svg>',
    indentIncrease: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 5H11"/><path d="M21 12H11"/><path d="M21 19H11"/><path d="m3 8 4 4-4 4"/></svg>',
    moveUp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6L12 2L16 6"/><path d="M12 2V22"/></svg>',
    moveDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 18L12 22L16 18"/><path d="M12 2V22"/></svg>',
    trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
};

/* Editor.js core only ships Bold/Italic/Link as inline tools - Underline and Strikethrough have no
 * official package, so these two small adapters follow the same shape as core's own Bold tool
 * (see @editorjs/editorjs's internal Bold class) to make them real, sanitizer-safe inline tools
 * rather than raw execCommand calls that would get stripped back out on save. */
class UnderlineInlineTool {
    static get isInline() { return true; }
    static get title() { return 'Underline'; }
    static get sanitize() { return { u: {} }; }
    render() {
        return {
            icon: ICONS.underline,
            name: 'underline',
            onActivate: () => document.execCommand('underline'),
            isActive: () => document.queryCommandState('underline'),
        };
    }
}
class StrikethroughInlineTool {
    static get isInline() { return true; }
    static get title() { return 'Strikethrough'; }
    static get sanitize() { return { s: {}, strike: {} }; }
    render() {
        return {
            icon: ICONS.strikethrough,
            name: 'strikethrough',
            onActivate: () => document.execCommand('strikeThrough'),
            isActive: () => document.queryCommandState('strikeThrough'),
        };
    }
}

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
            icons: ICONS,
            /* Custom toolbar state: reflects whichever block/selection last had the caret, so the
             * toolbar buttons can show which style is currently active (as in the Figma spec). */
            currentBlockName: null,
            currentBlockLevel: null,
            currentBlockStyle: null,
            marks: { bold: false, italic: false, underline: false, strikethrough: false },
            refreshScheduled: false,
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
                header: { class: HeaderTool, inlineToolbar: true },
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
                underline: UnderlineInlineTool,
                strikethrough: StrikethroughInlineTool,
            },
            onChange: this.onEditorChange,
        });
        this.onSelectionChange = () => this.scheduleRefreshState();
        document.addEventListener('selectionchange', this.onSelectionChange);
        this.$refs.htmlelement.addEventListener('keyup', this.onSelectionChange);
        this.$refs.htmlelement.addEventListener('mouseup', this.onSelectionChange);
    },
    unmounted() {
        if (this.editor && this.editor.destroy) this.editor.destroy();
        document.removeEventListener('selectionchange', this.onSelectionChange);
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
        /** Custom toolbar: whichever element last had the caret within the editor, used to keep
         * clicking a toolbar button (which doesn't steal focus, see @mousedown.prevent in the
         * template) from losing the block/selection the button is meant to act on. */
        isFocusedInEditor() {
            let active = document.activeElement;
            return !!(active && this.$refs.htmlelement && this.$refs.htmlelement.contains(active));
        },
        /** Custom toolbar: converts whichever block last had the caret to the given tool/type. If
         * it's already that type (eg. toggling a header's level, or a list's bullet/number style),
         * updates its data in place instead of converting, which Editor.js only supports between
         * two different tool types. */
        async convertCurrentBlock(type, dataOverrides) {
            if (!this.editor || !this.isFocusedInEditor()) return;
            let index = this.editor.blocks.getCurrentBlockIndex();
            if (index === -1) return;
            let block = this.editor.blocks.getBlockByIndex(index);
            if (!block) return;
            try {
                let result = (block.name === type)
                    ? await this.editor.blocks.update(block.id, dataOverrides)
                    : await this.editor.blocks.convert(block.id, type, dataOverrides);
                let target = result || block;
                this.editor.caret.setToBlock(target.id, 'end');
            } catch {
                return;
            }
            this.scheduleRefreshState();
        },
        /** Custom toolbar: toggles an inline mark (bold/italic/underline/strikethrough) on the
         * current text selection. @mousedown.prevent on the button keeps that selection intact. */
        toggleMark(command) {
            if (!this.editor || !this.isFocusedInEditor()) return;
            document.execCommand(command);
            this.scheduleRefreshState();
        },
        /** Custom toolbar: indents/outdents the current list item by replaying the Tab / Shift+Tab
         * keydown the List tool already listens for - there's no public indent API, so this drives
         * it the same way a real keypress would. No-ops outside a list block. */
        indentCurrentBlock(direction) {
            if (!this.editor || !this.isFocusedInEditor()) return;
            let event = new KeyboardEvent('keydown', {
                key: 'Tab',
                code: 'Tab',
                keyCode: 9,
                which: 9,
                shiftKey: direction < 0,
                bubbles: true,
                cancelable: true,
            });
            document.activeElement.dispatchEvent(event);
        },
        /** Custom toolbar: moves the last-focused block up (-1) or down (1). */
        moveCurrentBlock(direction) {
            if (!this.editor) return;
            let index = this.editor.blocks.getCurrentBlockIndex();
            if (index === -1) return;
            let toIndex = index + direction;
            if (toIndex < 0 || toIndex >= this.editor.blocks.getBlocksCount()) return;
            this.editor.blocks.move(toIndex, index);
        },
        /** Custom toolbar: deletes whichever block last had the caret. */
        deleteCurrentBlock() {
            if (!this.editor) return;
            let index = this.editor.blocks.getCurrentBlockIndex();
            if (index === -1) return;
            this.editor.blocks.delete(index);
        },
        /** Throttles refreshState to once per animation frame - selectionchange/keyup/mouseup can
         * all fire in a burst for a single user action. */
        scheduleRefreshState() {
            if (this.refreshScheduled) return;
            this.refreshScheduled = true;
            requestAnimationFrame(() => {
                this.refreshScheduled = false;
                this.refreshState();
            });
        },
        /** Recomputes which toolbar buttons should show as active, from whichever block/selection
         * currently has the caret. */
        async refreshState() {
            if (!this.editor || !this.isFocusedInEditor()) return;
            let index = this.editor.blocks.getCurrentBlockIndex();
            let block = index > -1 ? this.editor.blocks.getBlockByIndex(index) : undefined;
            if (block) {
                this.currentBlockName = block.name;
                let saved = await block.save();
                let data = (saved && saved.data) || {};
                this.currentBlockLevel = data.level;
                this.currentBlockStyle = data.style;
            } else {
                this.currentBlockName = null;
            }
            this.marks = {
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                strikethrough: document.queryCommandState('strikeThrough'),
            };
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
.custom-toolbar {
    padding-bottom: 4px;
    margin-bottom: 2px;
    border-bottom: 1px solid #E5E5E5;
    flex-wrap: wrap;
}

.tb-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    color: #3F3F3F;
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: 4px;
}

.tb-btn:hover {
    background-color: var(--hover-gray, #F5F5F5);
}

.tb-btn.active {
    color: var(--pill-border-hover, #3B99FC);
    background-color: var(--pill-background-selected, #BAD8F1);
    border-color: var(--pill-border-hover, #3B99FC);
}

.tb-btn.tb-delete:hover {
    color: var(--workout-red, #E25555);
    background-color: rgba(226, 85, 85, .08);
}

.tb-divider {
    width: 1px;
    height: 18px;
    margin: 0 4px;
    background-color: #E5E5E5;
}

.tb-divider--row {
    height: 28px;
}

.tb-spacer {
    flex: 1 1 auto;
}

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
