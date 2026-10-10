<template>
    <li>
        <span v-html="text"></span>
        <component :is="tag" v-if="children.length">
            <BlurbListItem v-for="(child, i) in children" :key="i" :item="child" :ordered="ordered"/>
        </component>
    </li>
</template>

<script>
import { sanitizeInlineHtml } from '../../../../utility/editorjsUtility';

/* Renders one Editor.js list item, recursing into item.items for arbitrarily deep nested
 * sub-lists (editorjs-list v2's {content, items, meta} shape). Vue resolves the <BlurbListItem>
 * tag in its own template via this component's `name`, with no explicit self-registration
 * needed. */
export default {
    name: 'BlurbListItem',
    props: {
        item: { type: [String, Object], required: true },
        ordered: { type: Boolean, default: false },
    },
    computed: {
        text() {
            let content = typeof this.item == 'string' ? this.item : (this.item?.content ?? '');
            return sanitizeInlineHtml(content);
        },
        children() {
            return (this.item && typeof this.item == 'object' && Array.isArray(this.item.items)) ? this.item.items : [];
        },
        tag() {
            return this.ordered ? 'ol' : 'ul';
        },
    },
}
</script>
