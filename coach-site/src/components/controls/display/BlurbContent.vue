<template>
    <div class="blurb-content">
        <template v-if="parsedJson">
            <span v-if="compact" class="text">{{ previewText }}</span>
            <div v-else class="rich-content">
                <template v-for="(block, index) in parsedJson.blocks" :key="block.id || index">
                    <p v-if="block.type == 'paragraph'" v-html="sanitizeInlineHtml(block.data.text)"></p>
                    <component :is="`h${headerLevel(block.data.level)}`" v-else-if="block.type == 'header'"
                               v-html="sanitizeInlineHtml(block.data.text)"></component>
                    <blockquote v-else-if="block.type == 'quote'">
                        <p v-html="sanitizeInlineHtml(block.data.text)"></p>
                        <cite v-if="block.data.caption">{{ block.data.caption }}</cite>
                    </blockquote>
                    <component :is="block.data.style == 'ordered' ? 'ol' : 'ul'" v-else-if="block.type == 'list'">
                        <BlurbListItem v-for="(item, i) in block.data.items" :key="i"
                                       :item="item" :ordered="block.data.style == 'ordered'"/>
                    </component>
                    <ul v-else-if="block.type == 'checklist'" class="checklist">
                        <li v-for="(item, i) in block.data.items" :key="i">
                            <input type="checkbox" disabled :checked="item.checked"/>
                            <span v-html="sanitizeInlineHtml(item.text)"></span>
                        </li>
                    </ul>
                    <figure v-else-if="block.type == 'image'" class="image-block">
                        <img :src="block.data.file && block.data.file.url" :alt="block.data.caption || ''"/>
                        <figcaption v-if="block.data.caption">{{ block.data.caption }}</figcaption>
                    </figure>
                    <div v-else-if="block.type == 'embed' && isSafeEmbedUrl(block.data.embed)" class="embed-block">
                        <iframe :src="block.data.embed" :width="block.data.width" :height="block.data.height"
                                frameborder="0" allowfullscreen></iframe>
                        <p v-if="block.data.caption" class="embed-caption">{{ block.data.caption }}</p>
                    </div>
                </template>
            </div>
        </template>
        <span v-else class="text">{{ blurb && blurb.text }}</span>
    </div>
</template>

<script>
import { extractPlainText, sanitizeInlineHtml } from '../../../../utility/editorjsUtility';
import BlurbListItem from './BlurbListItem.vue';

export default {
    name: 'BlurbContent',
    components: { BlurbListItem },
    props: {
        blurb: { type: Object, default: () => ({}) },
        /* Tight spaces (Kanban cards, list previews) get flattened plain text instead of full
         * rendered blocks. */
        compact: { type: Boolean, default: false },
    },
    computed: {
        parsedJson() {
            if (!this.blurb || !this.blurb.json) return null;
            try {
                let parsed = typeof this.blurb.json == 'string' ? JSON.parse(this.blurb.json) : this.blurb.json;
                return (parsed && Array.isArray(parsed.blocks)) ? parsed : null;
            } catch {
                return null;
            }
        },
        previewText() {
            return extractPlainText(this.parsedJson) || this.blurb.text || '';
        },
    },
    methods: {
        sanitizeInlineHtml,
        headerLevel(level) {
            return Math.min(6, Math.max(1, level || 2));
        },
        isSafeEmbedUrl(url) {
            return typeof url == 'string' && /^https:\/\//i.test(url);
        },
    },
}
</script>

<style scoped>
.blurb-content .text {
    white-space: pre-wrap;
}

.rich-content :deep(p),
.rich-content :deep(h1),
.rich-content :deep(h2),
.rich-content :deep(h3),
.rich-content :deep(h4),
.rich-content :deep(h5),
.rich-content :deep(h6),
.rich-content :deep(ul),
.rich-content :deep(ol),
.rich-content :deep(blockquote),
.rich-content :deep(.image-block),
.rich-content :deep(.embed-block) {
    margin: 0 0 8px 0;
}

.rich-content :deep(h1) {
    /* font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; */
    font-size: 16px;
    font-weight: bold;
    color: #B8CFE8;
}

.rich-content :deep(h2) {
    /* font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; */
    font-size: 14px;
    font-weight: bold;
    color: #76A2D3;
}

.rich-content :deep(blockquote) {
    border-left: 3px solid #e5e7eb;
    padding-left: 12px;
    color: #4b5563;
}

.rich-content :deep(.checklist) {
    list-style: none;
    padding-left: 0;
}

.rich-content :deep(.image-block img) {
    max-width: 100%;
    border-radius: 8px;
}

.rich-content :deep(.embed-block iframe) {
    max-width: 100%;
}
</style>
