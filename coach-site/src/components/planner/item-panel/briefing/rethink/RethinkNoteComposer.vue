<template>
    <!-- At rest -->
    <div v-if="!isWriting" class="composer-rest d-flex align-items-center" :class="variant"
         role="button" tabindex="0" @click="open()" @keydown.enter.prevent="open()">
        <template v-if="variant == 'goal'">
            <span class="placeholder">+ Add a note to this goal</span>
        </template>
        <template v-else>
            <span class="placeholder flex-grow-1">What matters today?</span>
            <span class="metric-dots d-flex">
                <span v-for="tag in METRIC_TAGS" :key="tag.id" class="dot" :title="tag.text"
                      :style="{ backgroundColor: tag.color }" @click.stop="open(tag.id)"></span>
            </span>
        </template>
    </div>

    <!-- Writing -->
    <div v-else class="composer-writing d-flex flex-column" :class="variant" @keydown.capture="onKeydown">
        <div v-if="variant == 'goal' && goal" class="linked-goal-locked d-flex align-items-center">
            <span class="new-note-on">New note on</span>
            <span class="goal-chip d-flex align-items-center">
                <img src="/icon/briefing/goal-link-accent.svg" width="12" height="12" alt="" />
                {{ goal.text }}
            </span>
        </div>

        <EditorJS ref="editor" class="editor" v-model="json"
                  :placeholder="variant == 'goal' ? 'What about this goal?' : 'What matters today?'" />

        <!-- Metric: pick one, or none -->
        <button v-if="variant == 'goal' && !showMetrics" class="link-button align-self-start" @click="showMetrics = true">
            + Add metric (optional)
        </button>
        <div v-else class="metrics d-flex flex-wrap">
            <RethinkMetricTag v-for="tag in METRIC_TAGS" :key="tag.id" :idMetric="tag.id"
                              selectable :selected="idMetric == tag.id" @select="toggleMetric" />
        </div>

        <!-- Linked goal (main composer) -->
        <div v-if="variant == 'main' && (linkedGoal || isPickingGoal)" class="goal-link-row d-flex align-items-center">
            <template v-if="linkedGoal">
                <span class="goal-chip d-flex align-items-center">
                    <img src="/icon/briefing/goal-link-accent.svg" width="12" height="12" alt="" />
                    {{ linkedGoal.text }}
                    <button class="chip-remove" title="Unlink goal" @click="idLinkedGoal = null">×</button>
                </span>
            </template>
            <select v-else class="goal-select" @change="pickGoal($event.target.value)">
                <option value="">Link a goal…</option>
                <option v-for="option in goals" :key="option.id" :value="option.id">{{ option.text }}</option>
            </select>
        </div>

        <div class="bottom d-flex align-items-center justify-content-between">
            <div class="segmented d-flex">
                <button class="seg" :class="{ active: idBlurbType == BLURBTYPE.BRIEFING }"
                        @click="idBlurbType = BLURBTYPE.BRIEFING">Brief</button>
                <button class="seg" :class="{ active: idBlurbType == BLURBTYPE.DEBRIEFING }"
                        @click="idBlurbType = BLURBTYPE.DEBRIEFING">Debrief</button>
            </div>
            <div class="actions d-flex align-items-center">
                <button v-if="variant == 'main' && !linkedGoal && goals.length" class="link-button"
                        @click="isPickingGoal = !isPickingGoal">+ Goal</button>
                <button v-if="variant == 'goal' || !plainText" class="link-button" @click="close">Cancel</button>
                <button class="save" :disabled="!canSave" @click="submit">Save&nbsp;&nbsp;⌘↵</button>
            </div>
        </div>
        <span v-if="error" class="error">{{ error }}</span>
    </div>
</template>

<script>
import RethinkMetricTag from './RethinkMetricTag.vue';
import EditorJS from '../../../../controls/input/EditorJS.vue';
import { METRIC_TAGS } from '../briefingUtility';
import { BLURBTYPE } from '../../../../../model/constants';
import { extractPlainText } from '../../../../../../utility/editorjsUtility';

export default {
    name: 'RethinkNoteComposer',
    components: { RethinkMetricTag, EditorJS },
    emits: ['open', 'close'],
    props: {
        // 'main': the notes composer; 'goal': inside an opened goal card, pre-linked to `goal`
        variant: { type: String, default: 'main' },
        goal: Object,
        // Goals the main composer can link to: [{ id, text }]
        goals: { type: Array, default: () => [] },
        // async ({ text, json, idMetric, idBlurbType, idGoal }) => void
        save: { type: Function, required: true },
    },
    data: function () {
        return {
            METRIC_TAGS,
            BLURBTYPE,
            isWriting: false,
            // Editor.js OutputData ({ time, blocks, version }), or null when empty
            json: null,
            idMetric: null,
            idBlurbType: BLURBTYPE.BRIEFING,
            idLinkedGoal: null,
            isPickingGoal: false,
            showMetrics: false,
            isSaving: false,
            error: undefined,
        }
    },
    computed: {
        linkedGoal() {
            return this.goals.find(x => x.id == this.idLinkedGoal);
        },
        plainText() {
            return extractPlainText(this.json).trim();
        },
        canSave() {
            return this.plainText.length > 0 && !this.isSaving;
        }
    },
    methods: {
        open(idMetric) {
            this.isWriting = true;
            if (idMetric) this.idMetric = idMetric;
            this.$emit('open');
            this.$nextTick(() => this.$refs.editor?.focus());
        },
        close() {
            Object.assign(this.$data, {
                isWriting: false, json: null, idMetric: null, idBlurbType: BLURBTYPE.BRIEFING,
                idLinkedGoal: null, isPickingGoal: false, showMetrics: false, error: undefined,
            });
            this.$emit('close');
        },
        toggleMetric(idMetric) {
            this.idMetric = (this.idMetric == idMetric) ? null : idMetric;
        },
        pickGoal(value) {
            this.idLinkedGoal = value ? Number(value) : null;
            this.isPickingGoal = false;
        },
        // Capture phase, so ⌘↵ saves before Editor.js turns the Enter into a new block
        onKeydown(event) {
            if (event.key == 'Enter' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                event.stopPropagation();
                this.submit();
            } else if (event.key == 'Escape' && !this.plainText) {
                // Only an empty draft closes on Escape; Editor.js also uses Escape to dismiss its popovers
                this.close();
            }
        },
        async submit() {
            // Not canSave: v-model lags Editor.js's debounced onChange, so a fresh draft can look empty here.
            // The emptiness check happens below, after flushing the editor.
            if (this.isSaving) return;
            this.isSaving = true;
            this.error = undefined;
            try {
                // onEditorChange is async; flush the latest content before reading it
                await this.$refs.editor?.editor?.isReady;
                let saved = await this.$refs.editor?.editor?.save();
                if (saved) this.json = saved;
                if (!this.plainText) return;

                await this.save({
                    text: this.plainText,
                    json: JSON.stringify(this.json),
                    idMetric: this.idMetric,
                    idBlurbType: this.idBlurbType,
                    idGoal: (this.variant == 'goal') ? this.goal?.id : this.idLinkedGoal,
                });
                this.close();
            } catch (e) {
                this.error = "Couldn't save the note. Try again.";
                console.error(e);
            } finally {
                this.isSaving = false;
            }
        },
    },
}
</script>

<style scoped>
.composer-rest {
    gap: 8px;
    padding: 12px 14px;
    border: 1px dashed var(--rt-border);
    border-radius: 12px;
    background-color: white;
    cursor: text;
}

.composer-rest.goal {
    padding: 9px 12px;
    border-radius: 10px;
    background-color: transparent;
}

.placeholder {
    font-size: 14px;
    line-height: 20px;
    color: var(--rt-text-muted);
}

.composer-rest.goal .placeholder {
    font-size: 13px;
    line-height: 18px;
}

.metric-dots {
    gap: 4px;
}

.metric-dots .dot {
    width: 7px;
    height: 7px;
    border-radius: 3.5px;
    cursor: pointer;
}

.composer-writing {
    gap: 10px;
    padding: 12px 14px;
    border: 1.5px solid var(--rt-accent);
    border-radius: 12px;
    background-color: white;
}

.composer-writing.goal {
    padding: 10px 12px 12px;
    border-radius: 10px;
    background-color: var(--rt-bg);
}

.linked-goal-locked {
    gap: 6px;
}

.new-note-on {
    font-size: 11px;
    line-height: 14px;
    color: var(--rt-text-muted);
}

.goal-chip {
    gap: 4px;
    padding: 2px 8px 2px 6px;
    border-radius: 9px;
    background-color: rgba(180, 83, 42, 0.1);
    font-size: 11px;
    font-weight: 600;
    line-height: 14px;
    color: var(--rt-accent);
    white-space: nowrap;
}

.chip-remove {
    border: none;
    background: none;
    padding: 0 0 0 2px;
    font-size: 13px;
    line-height: 14px;
    color: var(--rt-accent);
}

.editor {
    width: 100%;
    min-height: 40px;
    font-size: 14px;
    line-height: 20px;
    color: var(--rt-text);
}

/* Match the toolbar divider to the composer's warm palette */
.editor :deep(.custom-toolbar) {
    border-bottom-color: var(--rt-border);
}

.editor :deep(.ce-paragraph) {
    padding: 2px 0;
    line-height: 20px;
}

.editor :deep(.codex-editor__redactor) {
    padding-bottom: 0 !important;
}

.metrics {
    gap: 6px;
}

.goal-select {
    font-size: 12px;
    padding: 2px 6px;
    border: 1px solid var(--rt-border);
    border-radius: 8px;
    color: var(--rt-text-secondary);
    background-color: white;
}

.segmented {
    padding: 2px;
    border-radius: 8px;
    background-color: #f1ece4;
}

.composer-writing.goal .segmented {
    background-color: #efe8de;
}

.seg {
    padding: 4px 10px;
    border: none;
    border-radius: 6px;
    background: transparent;
    font-size: 12px;
    line-height: 16px;
    color: var(--rt-text-secondary);
}

.seg.active {
    background-color: white;
    font-weight: 600;
    color: var(--rt-text);
}

/* Wraps the actions under Brief/Debrief when the panel is narrow */
.bottom {
    flex-wrap: wrap;
    gap: 8px;
}

.actions {
    gap: 10px;
    margin-left: auto;
}

.link-button {
    padding: 0;
    border: none;
    background: none;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: var(--rt-text-secondary);
}

.save {
    padding: 6px 12px;
    border: none;
    border-radius: 8px;
    background-color: var(--rt-text);
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    color: white;
    white-space: nowrap;
}

.save:disabled {
    opacity: 0.5;
}

.error {
    font-size: 12px;
    color: #C0504D;
}
</style>
