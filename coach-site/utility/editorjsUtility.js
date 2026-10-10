/* Helpers for Editor.js OutputData - the rich-content JSON stored in Blurb.json, alongside the
 * legacy plain Blurb.text. See coach-node/coach-site/src/components/controls/input/EditorJS.vue
 * and coach-node/coach-site/src/components/controls/display/BlurbContent.vue. */

const ALLOWED_INLINE_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'A', 'BR', 'MARK', 'CODE']);

export function isEmptyOutputData(outputData) {
    return !outputData || !Array.isArray(outputData.blocks) || outputData.blocks.length === 0;
}

/** Deep-clones OutputData into a plain object/array tree with no Vue reactive Proxy wrappers.
 * Editor.js (and the browser's structuredClone, which it calls internally when composing blocks
 * from initial/rendered data) can't handle a Vue reactive Proxy - it throws DataCloneError on any
 * block whose data is more than a flat string, e.g. a list block's nested `items` arrays. Since
 * OutputData is plain JSON by definition, a JSON round-trip is a safe, lossless way to strip
 * reactivity before handing data to Editor.js. */
export function plainData(outputData) {
    if (!outputData) return undefined;
    return JSON.parse(JSON.stringify(outputData));
}

/** Converts a legacy plain-text Blurb.text into Editor.js OutputData (one paragraph block per
 * non-empty line), so opening an old text-only blurb in the new editor shows its content instead
 * of a blank editor. */
export function legacyTextToOutputData(text) {
    if (!text) return null;
    let blocks = text.split('\n')
        .filter(line => line.length > 0)
        .map(line => ({ type: 'paragraph', data: { text: line } }));
    return blocks.length ? { time: Date.now(), blocks, version: '2.31.6' } : null;
}

function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
}

/** A list/checklist item may be a plain string (legacy/simple shape) or an object with
 * `content`/`text` plus optionally nested `items` (editorjs-list v2's nested-list shape). */
function listItemText(item) {
    if (typeof item === 'string') return stripHtml(item);
    if (item && typeof item === 'object') {
        let own = stripHtml(item.content ?? item.text ?? '');
        let nested = Array.isArray(item.items) ? item.items.map(listItemText).filter(Boolean) : [];
        return [own, ...nested].filter(Boolean).join('\n');
    }
    return '';
}

/** Flattens an Editor.js OutputData document into a plain-text string: one line per block,
 * HTML inline markup stripped. Used to keep populating the legacy Blurb.text column alongside
 * Blurb.json (so search/notifications/anything not yet reading json keeps working), and to back
 * "is this blurb empty?" validation checks. */
export function extractPlainText(outputData) {
    if (isEmptyOutputData(outputData)) return '';
    return outputData.blocks
        .map(block => {
            const data = block.data || {};
            switch (block.type) {
                case 'paragraph':
                case 'header':
                case 'quote':
                    return stripHtml(data.text);
                case 'list':
                    return (data.items || []).map(listItemText).filter(Boolean).join('\n');
                case 'checklist':
                    return (data.items || []).map(item => stripHtml(item.text)).filter(Boolean).join('\n');
                case 'image':
                    return data.caption ? stripHtml(data.caption) : '';
                case 'embed':
                    return data.caption ? stripHtml(data.caption) : (data.source || '');
                default:
                    return '';
            }
        })
        .filter(Boolean)
        .join('\n');
}

/** Strips any tag Editor.js's own inline toolbar (bold/italic/link) wouldn't have produced, and
 * drops any `<a>` attribute other than an http(s) href, before a block's rich text is rendered
 * with v-html in BlurbContent.vue. This is a read-side safety net - the content is normally
 * produced by Editor.js itself, but a blurb's json can also arrive via a direct API call, so the
 * renderer doesn't trust it blindly. */
export function sanitizeInlineHtml(html) {
    if (!html) return '';
    const template = document.createElement('template');
    template.innerHTML = html;

    const clean = (parent) => {
        [...parent.childNodes].forEach(node => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;
            if (!ALLOWED_INLINE_TAGS.has(node.tagName)) {
                node.replaceWith(document.createTextNode(node.textContent));
                return;
            }
            [...node.attributes].forEach(attr => {
                if (node.tagName === 'A' && attr.name === 'href' && /^https?:\/\//i.test(attr.value)) return;
                node.removeAttribute(attr.name);
            });
            clean(node);
        });
    };
    clean(template.content);
    return template.innerHTML;
}
