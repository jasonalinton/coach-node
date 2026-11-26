<template>
    <div class="todo-planning d-flex flex-column">
        <div class="top d-flex">
            <!-- Heat map -->
            <section class="heat d-flex flex-column">
                <div class="section-head">
                    <span>Planned days</span>
                    <hr/>
                </div>
                <div class="range-bar d-flex flex-row align-items-center">
                    <button type="button" class="nav" aria-label="Previous month" @click="shiftRange(-1)">‹</button>
                    <span class="range wide">{{ rangeTitle }}</span>
                    <span class="range narrow">{{ middleMonthTitle }}</span>
                    <button type="button" class="nav" aria-label="Next month" @click="shiftRange(1)">›</button>
                    <span class="flex-grow-1"></span>
                    <label class="show-missed d-flex flex-row align-items-center">
                        Show missed
                        <input type="checkbox" role="switch" class="switch" v-model="showMissed"/>
                    </label>
                    <span class="legend d-flex flex-row align-items-center">
                        Less <i class="level-0"></i><i class="level-1"></i><i class="level-2"></i><i class="level-3"></i> More
                    </span>
                </div>
                <div class="months d-flex flex-row">
                    <PlanningMonth v-for="(month, index) in months" :key="+month" :class="`month-${index}`"
                                   :month="month" :levels="heat.levels" :highlighted="heat.highlighted" :dimmed="heat.dimmed"/>
                </div>
            </section>
            <!-- Repeats + time pairs -->
            <section class="sources d-flex flex-column">
                <div class="source-group d-flex flex-column">
                    <div class="section-head">
                        <span>Repetition</span>
                        <hr/>
                    </div>
                    <PlanningSourceCard v-for="source in repeatSources" :key="source.key"
                                        kind="Repeat" :lines="source.lines" :statuses="statusesFor(source)"
                                        :isSelected="isSelectedSource(source)"
                                        @hover="hoverSource(source, $event)" @toggle="toggleSource(source)"/>
                    <span v-if="!repeatSources.length" class="empty">No repeats in this range</span>
                    <span v-if="hiddenRepeatCount" class="empty">
                        {{ hiddenRepeatCount }} {{ hiddenRepeatCount == 1 ? 'repeat' : 'repeats' }} outside these months hidden
                    </span>
                </div>
                <div class="source-group d-flex flex-column">
                    <div class="section-head">
                        <span>Time</span>
                        <hr/>
                    </div>
                    <PlanningSourceCard v-for="source in timePairSources" :key="source.key"
                                        kind="Time pair" :lines="source.lines" :statuses="statusesFor(source)"
                                        :isSelected="isSelectedSource(source)"
                                        @hover="hoverSource(source, $event)" @toggle="toggleSource(source)"/>
                    <span v-if="!timePairSources.length" class="empty">No time pairs</span>
                </div>
            </section>
        </div>

        <!-- Iterations -->
        <section class="iterations d-flex flex-column">
            <div class="section-head">
                <span>Iterations</span>
                <hr/>
            </div>
            <!-- Bulk edit (wider screens) -->
            <div v-if="selectedIDs.length" class="bulk-bar d-flex flex-row align-items-center">
                <span class="selected-count">{{ selectedIDs.length }} selected</span>
                <span class="separator"></span>
                <label class="bulk-field text d-flex flex-row align-items-center">
                    Text
                    <input class="control" type="text" v-model="bulk.text" placeholder="Rename…"/>
                </label>
                <label class="bulk-field d-flex flex-row align-items-center">
                    Status
                    <select class="control status" v-model="bulk.status">
                        <option value="">No change</option>
                        <option value="done">Done</option>
                        <option value="attempted">Attempted</option>
                        <option value="notdone">Not done</option>
                    </select>
                </label>
                <label class="bulk-field d-flex flex-row align-items-center">
                    Points
                    <input class="control points" type="number" min="0" v-model="bulk.points"/>
                </label>
                <button type="button" class="form-btn outline sm" ref="rescheduleButton" @click="openReschedule">Reschedule…</button>
                <button type="button" class="form-btn primary sm" :disabled="!bulkHasChanges" @click="applyBulk()">Apply</button>
                <button type="button" class="link danger" @click="deleteSelected">Delete</button>
                <button type="button" class="link clear" aria-label="Clear selection" @click="clearSelection">✕</button>
            </div>
            <div v-else class="summary d-flex flex-row align-items-center">
                <button v-if="selectedSource" type="button" class="filter-chip" @click="selectedSource = undefined">
                    {{ selectedSourceLabel }} <span aria-hidden="true">✕</span>
                </button>
                <span>{{ summary }}</span>
            </div>

            <!-- Table (wider screens) -->
            <table class="iteration-table">
                <thead>
                    <tr>
                        <th class="select">
                            <input type="checkbox" class="form-check-input" :checked="allSelected"
                                   :indeterminate.prop="someSelected" aria-label="Select all" @change="toggleSelectAll"/>
                        </th>
                        <th class="planned">Planned</th>
                        <th class="text">Text</th>
                        <th class="window">Window</th>
                        <th class="source">Source</th>
                        <th class="points">Points</th>
                        <th class="status">Status</th>
                        <th class="completed">Completed</th>
                        <th class="actions"></th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="row in shownRows" :key="row.id">
                        <tr v-if="editing && editing.id == row.id && !sheet" class="editing"
                            @keyup.enter="saveEdit(editing)" @keyup.esc.stop="cancelEdit">
                            <td class="select"><input type="checkbox" class="form-check-input" :checked="isSelected(row)" @change="toggleSelect(row.id)"/></td>
                            <td class="planned"><input class="control" type="date" v-model="editing.planned"/></td>
                            <td class="text"><input class="control" type="text" v-model="editing.text" ref="editText" spellcheck="true"/></td>
                            <td class="window"><input class="control" type="date" v-model="editing.windowEnd" :min="editing.planned"/></td>
                            <td class="source">{{ row.sourceLabel }}</td>
                            <td class="points"><input class="control" type="number" min="0" v-model="editing.points"/></td>
                            <td class="status">
                                <select class="control" v-model="editing.status">
                                    <option value="done">Done</option>
                                    <option value="attempted">Attempted</option>
                                    <option value="notdone">Not done</option>
                                </select>
                            </td>
                            <td class="completed">
                                <input v-if="editing.status != 'notdone'" class="control" type="datetime-local" v-model="editing.completed"/>
                            </td>
                            <td class="actions">
                                <button type="button" class="icon save" aria-label="Save" @click="saveEdit(editing)">✓</button>
                                <button type="button" class="icon" aria-label="Cancel" @click="cancelEdit">✕</button>
                            </td>
                        </tr>
                        <tr v-else :class="[rowState(row), { selected: isSelected(row) }]" @dblclick="startEdit(row)">
                            <td class="select"><input type="checkbox" class="form-check-input" :checked="isSelected(row)" @change="toggleSelect(row.id)"/></td>
                            <td class="planned">{{ row.plannedText }}</td>
                            <td class="text" :title="row.iteration.text">{{ row.iteration.text }}</td>
                            <td class="window">{{ row.windowText }}</td>
                            <td class="source">{{ row.sourceLabel }}</td>
                            <td class="points">{{ row.iteration.points ?? '—' }}</td>
                            <td class="status"><span class="status-pill" :class="row.status">{{ statusText[row.status] }}</span></td>
                            <td class="completed">{{ row.completedText }}</td>
                            <td class="actions">
                                <button type="button" class="icon edit" aria-label="Edit iteration" @click="startEdit(row)">
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5l2 2L5 13H3v-2l8.5-8.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
                                </button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>

            <!-- List (phones) -->
            <div class="iteration-list d-flex flex-column">
                <div v-for="row in shownRows" :key="row.id" class="item d-flex flex-row align-items-center"
                     :class="{ selected: isSelected(row) }"
                     @pointerdown="startLongPress(row)" @pointerup="cancelLongPress" @pointerleave="cancelLongPress"
                     @click="onItemClick(row)" @contextmenu.prevent>
                    <input v-if="selecting" type="checkbox" class="form-check-input" :checked="isSelected(row)" tabindex="-1"/>
                    <div class="content d-flex flex-column">
                        <div class="d-flex flex-row justify-content-between align-items-center">
                            <span class="planned">{{ row.plannedText }}</span>
                            <span class="status-pill" :class="row.status">{{ statusText[row.status] }}</span>
                        </div>
                        <span class="text">{{ row.iteration.text }}</span>
                        <span class="meta">{{ row.metaText }}</span>
                    </div>
                </div>
            </div>

            <div class="table-foot d-flex flex-row">
                <span v-if="!visibleRows.length">Nothing planned for this todo in {{ rangeTitle }}</span>
                <template v-else>
                    <span>Showing {{ shownRows.length }} of {{ visibleRows.length }}</span>
                    <button v-if="shownRows.length < visibleRows.length" type="button" class="link" @click="showAll = true">Show all</button>
                </template>
            </div>
        </section>

        <!-- Selection actions (phones) -->
        <div v-if="selecting" class="select-bar d-flex flex-column">
            <div class="d-flex flex-row align-items-center">
                <span class="selected-count flex-grow-1">{{ selectedIDs.length }} selected</span>
                <button type="button" class="link" @click="selectAll">Select all</button>
                <button type="button" class="link muted" @click="clearSelection">Done</button>
            </div>
            <div class="d-flex flex-row">
                <button type="button" class="form-btn outline" :disabled="!selectedIDs.length" @click="sheet = 'bulk'">Edit…</button>
                <button type="button" class="form-btn outline" :disabled="!selectedIDs.length" @click="openReschedule">Reschedule…</button>
                <button type="button" class="form-btn danger" :disabled="!selectedIDs.length" @click="deleteSelected">Delete</button>
            </div>
        </div>

        <IterationEditSheet v-if="sheet == 'edit' && editing" :initial="editing" :subtitle="editingSubtitle"
                            @save="saveEdit" @cancel="cancelEdit" @delete="deleteEditing"/>
        <IterationEditSheet v-if="sheet == 'bulk'" bulk :count="selectedIDs.length"
                            :initial="{ text: '', points: '', status: '' }"
                            @save="applyBulk" @cancel="sheet = undefined"/>
        <DayPickerPopover v-if="reschedule.isOpen" :anchor="reschedule.anchor" placement="below"
                          title="Move to…" hint="Earliest selected moves here; the rest keep their spacing"
                          @pick="rescheduleSelected" @close="reschedule.isOpen = false"/>
    </div>
</template>

<script>
import moment from 'moment'
import PlanningMonth from './PlanningMonth.vue'
import PlanningSourceCard from './PlanningSourceCard.vue'
import IterationEditSheet from './IterationEditSheet.vue'
import DayPickerPopover from '../../component/DayPickerPopover.vue'
import { ITERATION_ACTION } from '../../../../../model/constants'
import { timeModelToString } from '../../../../../../utility/timeUtility'
import { STATUS, STATUS_TEXT, toDate, dayKey, iterationStatus, iterationPoints, isFromSource, repeatLines,
         repeatLabel, repeatIDOf, repeatOverlaps, repeatDates, timePairTimeframe, timePairLabel, formatPlanned, formatWindow, formatDateTime,
         toDateInput, toDateTimeInput, withDay } from './planningUtility'

const ROW_LIMIT = 8;
const isPhone = () => window.matchMedia('(max-width: 575.98px)').matches;

export default {
    name: 'TodoPlanning',
    components: { PlanningMonth, PlanningSourceCard, IterationEditSheet, DayPickerPopover },
    props: {
        todo: Object,
        repeats: Array,
        timePairs: Array
    },
    data: function() {
        return {
            iterationStore: undefined,
            rangeStart: moment().subtract(1, 'month').startOf('month').toDate(),
            now: new Date(),
            hoveredSource: undefined,
            selectedSource: undefined,
            showAll: false,
            selectedIDs: [],
            selecting: false, // phones: long-press selection mode
            editing: undefined,
            sheet: undefined, // 'edit' | 'bulk'
            bulk: { text: '', status: '', points: '' },
            reschedule: { isOpen: false, anchor: undefined },
            // Shared by every todo's planning tab
            showMissed: localStorage.getItem('todo-planning-show-missed') != 'false',
            statusText: STATUS_TEXT,
            longPress: { timer: undefined, fired: false }
        }
    },
    created: async function() {
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
        this.loadRange();
    },
    computed: {
        months() {
            return [0, 1, 2].map(i => moment(this.rangeStart).add(i, 'month').toDate());
        },
        rangeEnd() {
            return moment(this.rangeStart).add(2, 'month').endOf('month').toDate();
        },
        rangeTitle() {
            let start = moment(this.rangeStart), end = moment(this.rangeEnd);
            return (start.year() == end.year())
                ? `${start.format("MMM")} – ${end.format("MMM YYYY")}`
                : `${start.format("MMM YYYY")} – ${end.format("MMM YYYY")}`;
        },
        middleMonthTitle() {
            return moment(this.months[1]).format("MMM YYYY");
        },
        /* Repeats running during the visible months, or that planned something in them (older repeats are hidden) */
        repeatSources() {
            return (this.repeats || []).filter(x => x.id > 0)
                .filter(repeat => repeatOverlaps(repeat, this.rangeStart, this.rangeEnd) || this.planned.repeatIDs.has(repeat.id))
                .map(repeat => ({
                    key: `repeat-${repeat.id}`, type: 'repeat', id: repeat.id,
                    lines: [...repeatLines(repeat), repeatDates(repeat)].filter(x => x), label: repeatLabel(repeat)
                }));
        },
        hiddenRepeatCount() {
            return (this.repeats || []).filter(x => x.id > 0).length - this.repeatSources.length;
        },
        /* Repeat / time pair ids that have iterations in the visible months */
        planned() {
            let repeatIDs = new Set(), timePairIDs = new Set();
            this.rangeIterations.forEach(({ iteration }) => {
                if (repeatIDOf(iteration)) repeatIDs.add(repeatIDOf(iteration));
                if (iteration.idTodoTimePair) timePairIDs.add(iteration.idTodoTimePair);
            });
            return { repeatIDs, timePairIDs };
        },
        timePairSources() {
            return (this.timePairs || []).filter(x => x.id > 0).map(timePair => ({
                key: `timePair-${timePair.id}`, type: 'timePair', id: timePair.id,
                lines: [timePairTimeframe(timePair),
                        timePair.startTime ? `Start ${timeModelToString(timePair.startTime)}` : null,
                        timePair.endTime ? `End ${timeModelToString(timePair.endTime)}` : null].filter(x => x),
                label: timePairLabel(timePair)
            }));
        },
        sources() {
            return [...this.repeatSources, ...this.timePairSources];
        },
        /* This todo's iterations planned in the visible months, newest first */
        rangeIterations() {
            if (!this.iterationStore || !this.todo) return [];
            let start = +this.rangeStart, end = +this.rangeEnd;
            return this.iterationStore.getIterationsForTodo(this.todo.id)
                .filter(x => x.id > 0 && x.startAt)
                .map(iteration => ({ iteration, startAt: toDate(iteration.startAt), endAt: toDate(iteration.endAt) }))
                .filter(x => +x.startAt >= start && +x.startAt <= end)
                .sort((a, b) => b.startAt - a.startAt);
        },
        rows() {
            return this.rangeIterations.map(({ iteration, startAt, endAt }) => {
                    let source = this.sources.find(s => isFromSource(iteration, s));
                    let status = iterationStatus(iteration, this.now);
                    let doneAt = toDate(iteration.completedAt) || toDate(iteration.attemptedAt);
                    let sourceLabel = source ? source.label : '—';
                    return {
                        id: iteration.id, iteration, startAt, endAt, source, status, sourceLabel,
                        plannedText: formatPlanned(startAt),
                        windowText: formatWindow(startAt, endAt),
                        completedText: iteration.completedAt ? formatDateTime(doneAt) : '—',
                        metaText: [sourceLabel, `${iteration.points ?? '—'} pts`, doneAt ? formatDateTime(doneAt) : null]
                            .filter(x => x).join(' · ')
                    };
                });
        },
        visibleRows() {
            if (!this.selectedSource) return this.rows;
            return this.rows.filter(row => isFromSource(row.iteration, this.selectedSource));
        },
        shownRows() {
            return (this.showAll) ? this.visibleRows : this.visibleRows.slice(0, ROW_LIMIT);
        },
        summary() {
            let parts = [`${this.visibleRows.length} planned`];
            [STATUS.DONE, STATUS.ATTEMPTED, STATUS.MISSED, STATUS.UPCOMING].forEach(status => {
                let count = this.visibleRows.filter(x => x.status == status).length;
                if (count) parts.push(`${count} ${STATUS_TEXT[status].toLowerCase()}`);
            });
            return parts.join(' · ');
        },
        selectedSourceLabel() {
            return this.sources.find(x => this.isSelectedSource(x))?.label;
        },
        /* Day shading = total points planned that day, in 3 steps relative to the busiest day */
        heat() {
            let points = new Map(), fromHovered = new Set();
            let rows = (this.showMissed) ? this.visibleRows : this.visibleRows.filter(row => row.status != STATUS.MISSED);
            rows.forEach(row => {
                let key = dayKey(row.startAt);
                points.set(key, (points.get(key) || 0) + iterationPoints(row.iteration, this.todo));
                if (this.hoveredSource && isFromSource(row.iteration, this.hoveredSource)) fromHovered.add(key);
            });
            let max = Math.max(0, ...points.values());
            let levels = new Map(), highlighted = new Set(), dimmed = new Set();
            points.forEach((total, key) => {
                if (total > 0) levels.set(key, Math.min(3, Math.ceil(total / max * 3)));
                if (this.hoveredSource) (fromHovered.has(key) ? highlighted : dimmed).add(key);
            });
            return { levels, highlighted, dimmed };
        },
        allSelected() {
            return this.shownRows.length > 0 && this.shownRows.every(row => this.isSelected(row));
        },
        someSelected() {
            return this.selectedIDs.length > 0 && !this.allSelected;
        },
        bulkHasChanges() {
            return this.bulk.text.trim() != '' || this.bulk.status != '' || this.bulk.points !== '';
        },
        editingSubtitle() {
            let row = this.rows.find(x => x.id == this.editing?.id);
            return row?.source ? row.sourceLabel : undefined;
        }
    },
    methods: {
        // GetAllIterationsInRange, since GetIterationsInRange leaves out iterations mapped to a routine
        loadRange() {
            if (this.iterationStore) this.iterationStore.getAllIterationsInRange(this.rangeStart, this.rangeEnd);
        },
        shiftRange(count) {
            this.rangeStart = moment(this.rangeStart).add(count, 'month').toDate();
        },
        statusesFor(source) {
            return this.rows.filter(row => isFromSource(row.iteration, source)).map(row => row.status);
        },
        isSelectedSource(source) {
            return this.selectedSource?.type == source.type && this.selectedSource?.id == source.id;
        },
        hoverSource(source, isHovered) {
            this.hoveredSource = (isHovered) ? source : undefined;
        },
        toggleSource(source) {
            this.selectedSource = this.isSelectedSource(source) ? undefined : { type: source.type, id: source.id };
            this.showAll = false;
        },
        rowState(row) {
            if (!this.hoveredSource) return '';
            return isFromSource(row.iteration, this.hoveredSource) ? 'highlight' : 'dim';
        },

        /* Editing */
        startEdit(row, asSheet = isPhone()) {
            let iteration = row.iteration;
            let doneAt = toDate(iteration.completedAt) || toDate(iteration.attemptedAt);
            let status = { [STATUS.DONE]: 'done', [STATUS.ATTEMPTED]: 'attempted' }[row.status] || 'notdone';
            this.editing = {
                id: iteration.id,
                text: iteration.text,
                planned: toDateInput(row.startAt),
                windowEnd: toDateInput(row.endAt || row.startAt),
                points: iteration.points ?? '',
                status,
                completed: toDateTimeInput(doneAt),
                original: { status, completed: toDateTimeInput(doneAt) }
            };
            this.sheet = (asSheet) ? 'edit' : undefined;
            if (!asSheet) this.$nextTick(() => this.$refs.editText?.[0]?.focus());
        },
        cancelEdit() {
            this.editing = undefined;
            this.sheet = undefined;
        },
        saveEdit(draft) {
            let iteration = this.iterationStore.getIteration(draft.id);
            if (!iteration) return this.cancelEdit();
            let startAt = withDay(toDate(iteration.startAt), draft.planned);
            let endAt = withDay(toDate(iteration.endAt) || toDate(iteration.startAt), draft.windowEnd || draft.planned);
            if (endAt < startAt) endAt = startAt;
            let original = this.editing?.original || {};
            let statusChanged = draft.status != original.status || draft.completed != original.completed;
            let { action, actionAt } = (statusChanged) ? this.statusAction(draft.status, draft.completed) : {};
            let points = (draft.points === '' || draft.points == null) ? null : Number(draft.points);

            this.iterationStore.updateIteration(iteration.id, draft.text?.trim() || iteration.text, points,
                startAt, endAt, iteration.idTimeframe, action, actionAt);
            this.cancelEdit();
        },
        statusAction(status, at) {
            let actionAt = at ? new Date(at) : new Date();
            if (status == 'done') return { action: ITERATION_ACTION.COMPLETE, actionAt };
            if (status == 'attempted') return { action: ITERATION_ACTION.ATTEMPT, actionAt };
            return { action: ITERATION_ACTION.INCOMPLETE };
        },
        deleteEditing() {
            if (confirm("Delete this iteration?")) {
                this.iterationStore.deleteIteration(this.editing.id);
                this.cancelEdit();
            }
        },

        /* Selection + bulk edit */
        isSelected(row) {
            return this.selectedIDs.includes(row.id);
        },
        toggleSelect(id) {
            this.selectedIDs = this.selectedIDs.includes(id)
                ? this.selectedIDs.filter(x => x != id)
                : [...this.selectedIDs, id];
        },
        toggleSelectAll() {
            if (this.allSelected) this.clearSelection();
            else this.selectAll();
        },
        selectAll() {
            this.selectedIDs = this.shownRows.map(row => row.id);
        },
        clearSelection() {
            this.selectedIDs = [];
            this.selecting = false;
            this.bulk = { text: '', status: '', points: '' };
        },
        selectedIterations() {
            return this.selectedIDs.map(id => this.iterationStore.getIteration(id)).filter(x => x);
        },
        applyBulk(values = this.bulk) {
            let text = values.text?.trim();
            let points = (values.points === '' || values.points == null) ? undefined : Number(values.points);
            let { action, actionAt } = (values.status) ? this.statusAction(values.status) : {};
            this.selectedIterations().forEach(iteration => {
                this.iterationStore.updateIteration(iteration.id, text || iteration.text,
                    (points === undefined) ? iteration.points : points,
                    iteration.startAt, iteration.endAt, iteration.idTimeframe, action, actionAt);
            });
            this.sheet = undefined;
            this.clearSelection();
        },
        openReschedule() {
            let button = this.$refs.rescheduleButton;
            this.reschedule.anchor = (button && !isPhone()) ? button.getBoundingClientRect() : undefined;
            this.reschedule.isOpen = true;
        },
        /* The earliest selected iteration moves to the picked day; the rest keep their spacing */
        rescheduleSelected(date) {
            let iterations = this.selectedIterations().filter(x => x.startAt);
            if (iterations.length) {
                let earliest = moment.min(iterations.map(x => moment(toDate(x.startAt)))).clone().startOf('day');
                let days = moment(date).diff(earliest, 'days');
                iterations.forEach(iteration => {
                    let startAt = moment(toDate(iteration.startAt)).add(days, 'days').toDate();
                    let endAt = iteration.endAt ? moment(toDate(iteration.endAt)).add(days, 'days').toDate() : startAt;
                    this.iterationStore.rescheduleIteration(iteration.id, startAt, endAt);
                });
            }
            this.reschedule.isOpen = false;
            this.clearSelection();
        },
        deleteSelected() {
            let count = this.selectedIDs.length;
            if (!confirm(`Delete ${count} ${count == 1 ? 'iteration' : 'iterations'}?`)) return;
            this.selectedIDs.forEach(id => this.iterationStore.deleteIteration(id));
            this.clearSelection();
        },

        /* Phones: tap to edit, long-press to start selecting */
        startLongPress(row) {
            this.longPress.fired = false;
            clearTimeout(this.longPress.timer);
            this.longPress.timer = setTimeout(() => {
                this.longPress.fired = true;
                this.selecting = true;
                if (!this.isSelected(row)) this.toggleSelect(row.id);
            }, 500);
        },
        cancelLongPress() {
            clearTimeout(this.longPress.timer);
        },
        onItemClick(row) {
            if (this.longPress.fired) {
                this.longPress.fired = false;
                return;
            }
            if (this.selecting) this.toggleSelect(row.id);
            else this.startEdit(row, true);
        }
    },
    watch: {
        rangeStart() {
            this.loadRange();
            this.showAll = false;
        },
        todo() {
            this.clearSelection();
            this.selectedSource = undefined;
        },
        showMissed(value) {
            localStorage.setItem('todo-planning-show-missed', value);
        }
    },
    unmounted() {
        clearTimeout(this.longPress.timer);
    }
}
</script>

<style scoped>
.todo-planning {
    gap: 24px;
    padding: 16px 16px 0;
    text-align: start;
}

.top {
    flex-direction: row;
    gap: 24px;
}

.heat {
    flex: 0 0 auto;
    gap: 8px;
}

.sources {
    flex: 1;
    gap: 16px;
    min-width: 0;
}

.source-group {
    flex: 1;
    gap: 8px;
    min-width: 0;
}

.section-head {
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
}

.section-head hr {
    margin: 3px 0 4px 0;
}

.empty {
    font-size: 13px;
    color: #6C757D;
}

/* Heat map */
.range-bar {
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #343434;
}

.range.narrow {
    display: none;
}

.nav {
    width: 22px;
    height: 22px;
    border: none;
    border-radius: 4px;
    background: none;
    color: #5F6368;
    font-size: 18px;
    line-height: 18px;
}

.nav:hover {
    background-color: rgba(60, 64, 67, .08);
}

.show-missed {
    gap: 6px;
    margin-right: 8px;
    font-size: 12px;
    font-weight: 400;
    color: #6C757D;
    cursor: pointer;
    white-space: nowrap;
}

.switch {
    appearance: none;
    position: relative;
    width: 28px;
    height: 16px;
    margin: 0;
    border-radius: 8px;
    background-color: #CED4DA;
    cursor: pointer;
    transition: background-color .15s;
}

.switch::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background-color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
    transition: transform .15s;
}

.switch:checked {
    background-color: #0D6EFD;
}

.switch:checked::after {
    transform: translateX(12px);
}

.switch:focus-visible {
    outline: 2px solid #86B7FE;
    outline-offset: 2px;
}

.legend {
    gap: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #6C757D;
}

.legend i {
    width: 12px;
    height: 12px;
    border-radius: 6px;
}

.legend .level-0 { background-color: #F1F3F4; }
.legend .level-1 { background-color: #D2E3FC; }
.legend .level-2 { background-color: #8AB4F8; }
.legend .level-3 { background-color: #1A73E8; }

.months {
    gap: 16px;
}

/* Iterations */
.iterations {
    gap: 0;
}

.summary {
    gap: 12px;
    padding: 4px 0 8px;
    font-size: 13px;
    color: #6C757D;
}

.filter-chip {
    padding: 2px 10px;
    border: 1px solid #1A73E8;
    border-radius: 12px;
    background-color: #E8F0FE;
    color: #1A73E8;
    font-size: 12px;
    font-weight: 500;
}

.bulk-bar {
    gap: 12px;
    margin: 4px 0 8px;
    padding: 6px 10px 6px 12px;
    border-radius: 6px;
    background-color: #E8F0FE;
    font-size: 13px;
    color: #495057;
}

.selected-count {
    font-weight: 600;
    color: #0B5ED7;
    white-space: nowrap;
}

.separator {
    width: 1px;
    height: 20px;
    background-color: #B6D4FE;
}

.bulk-field {
    gap: 6px;
    white-space: nowrap;
}

.bulk-field.text {
    flex: 1;
    min-width: 0;
}

.bulk-field.text .control {
    flex: 1;
    min-width: 0;
}

.control {
    height: 28px;
    padding: 0 8px;
    border: 1px solid #CED4DA;
    border-radius: 4px;
    background-color: white;
    font-size: 13px;
    color: #212529;
}

.control:focus {
    outline: none;
    border-color: #86B7FE;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, .25);
}

.control.status { width: 120px; }
.control.points { width: 56px; }

.link {
    border: none;
    background: none;
    padding: 0;
    font-size: 13px;
    font-weight: 500;
    color: #0D6EFD;
}

.link.danger { color: #DC3545; }
.link.muted, .link.clear { color: #6C757D; }

.iteration-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    font-size: 14px;
}

.iteration-table th {
    height: 30px;
    padding: 0 6px;
    background-color: #F8F9FA;
    border-bottom: 1px solid #DEE2E6;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .04em;
    text-transform: uppercase;
    color: #6C757D;
}

.iteration-table td {
    height: 36px;
    padding: 0 6px;
    border-bottom: 1px solid #DEE2E6;
    color: #495057;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity .15s, background-color .15s;
}

.iteration-table .select { width: 32px; }
.iteration-table .planned { width: 110px; color: #212529; font-weight: 500; }
.iteration-table .text { color: #212529; }
.iteration-table .window { width: 90px; }
.iteration-table .source { width: 150px; }
.iteration-table .points { width: 60px; text-align: right; }
.iteration-table .status { width: 110px; }
.iteration-table .completed { width: 140px; }
.iteration-table .actions { width: 56px; text-align: right; }

.iteration-table tbody tr:hover { background-color: #F8F9FA; }
.iteration-table tr.highlight { background-color: #E8F0FE; }
.iteration-table tr.dim { opacity: .35; }
.iteration-table tr.selected { background-color: #EEF4FF; }
.iteration-table tr.editing { background-color: #F8F9FA; }
.iteration-table tr.editing td { height: 44px; }
.iteration-table tr.editing .control { width: 100%; }

.icon {
    border: none;
    background: none;
    padding: 0 4px;
    color: #6C757D;
    font-size: 14px;
}

.icon.save {
    color: #0D6EFD;
    font-weight: 700;
}

.icon.edit {
    visibility: hidden;
}

.iteration-table tr:hover .icon.edit,
.icon.edit:focus {
    visibility: visible;
}

.status-pill {
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 500;
}

.status-pill.done { color: #198754; background-color: #D1E7DD; }
.status-pill.attempted { color: #B35C00; background-color: #FFE5D0; }
.status-pill.missed { color: #B02A37; background-color: #F8D7DA; }
.status-pill.upcoming { color: #495057; background-color: #E9ECEF; }

.iteration-list {
    display: none !important;
}

.item {
    gap: 12px;
    padding: 10px 4px;
    border-bottom: 1px solid #DEE2E6;
    cursor: pointer;
    user-select: none;
    -webkit-touch-callout: none;
}

.item.selected {
    background-color: #EEF4FF;
}

.item .form-check-input {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin: 0;
}

.item .content {
    flex: 1;
    gap: 2px;
    min-width: 0;
}

.item .planned {
    font-size: 14px;
    font-weight: 600;
    color: #212529;
}

.item .text {
    font-size: 14px;
    color: #212529;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.item .meta {
    font-size: 12px;
    color: #6C757D;
}

.table-foot {
    gap: 8px;
    padding-top: 8px;
    font-size: 13px;
    color: #6C757D;
}

.select-bar {
    position: sticky;
    bottom: 0;
    gap: 10px;
    margin: 0 -16px;
    padding: 12px 16px 16px;
    border-top: 1px solid #DEE2E6;
    background-color: white;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, .08);
}

.select-bar .d-flex {
    gap: 8px;
}

.select-bar .form-btn {
    flex: 1;
    height: 40px;
}

/* Tablet: cards side by side under the calendar, fewer table columns */
@container (max-width: 64rem) {
    .top {
        flex-direction: column;
    }

    .sources {
        flex-direction: row;
    }

    .iteration-table .window,
    .iteration-table .completed {
        display: none;
    }

    .iteration-table .planned { width: 90px; }
    .iteration-table .source { width: 120px; }
}

/* Phones: one month, stacked cards, list instead of table */
@container (max-width: 36rem) {
    .sources {
        flex-direction: column;
    }

    .month-0, .month-2,
    .range.wide {
        display: none !important;
    }

    .range.narrow {
        display: inline;
    }

    .months, .months > * {
        width: 100%;
    }

    .summary {
        flex-wrap: wrap;
    }

    .bulk-bar,
    .iteration-table {
        display: none !important;
    }

    .iteration-list {
        display: flex !important;
    }
}
</style>
