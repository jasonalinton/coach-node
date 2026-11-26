<template>
    <div class="sheet-layer" @click.self="$emit('cancel')">
        <form class="sheet d-flex flex-column" @submit.prevent="$emit('save', draft)">
            <span class="grabber"></span>
            <div class="d-flex flex-column">
                <span class="title">{{ bulk ? `Edit ${count} iterations` : 'Edit iteration' }}</span>
                <span v-if="subtitle" class="subtitle">{{ subtitle }}</span>
            </div>
            <label class="field d-flex flex-column">
                <span>Text</span>
                <input class="input" type="text" v-model="draft.text" :placeholder="bulk ? 'No change' : ''" spellcheck="true"/>
            </label>
            <div v-if="!bulk" class="row-fields d-flex flex-row">
                <label class="field d-flex flex-column">
                    <span>Planned</span>
                    <input class="input" type="date" v-model="draft.planned"/>
                </label>
                <label class="field d-flex flex-column">
                    <span>Window ends</span>
                    <input class="input" type="date" v-model="draft.windowEnd" :min="draft.planned"/>
                </label>
            </div>
            <div class="row-fields d-flex flex-row">
                <label class="field points d-flex flex-column">
                    <span>Points</span>
                    <input class="input" type="number" min="0" v-model="draft.points" :placeholder="bulk ? '—' : ''"/>
                </label>
                <label class="field d-flex flex-column">
                    <span>Status</span>
                    <select class="input" v-model="draft.status">
                        <option v-if="bulk" value="">No change</option>
                        <option value="done">Done</option>
                        <option value="attempted">Attempted</option>
                        <option value="notdone">Not done</option>
                    </select>
                </label>
            </div>
            <label v-if="!bulk && draft.status != 'notdone'" class="field d-flex flex-column">
                <span>{{ draft.status == 'attempted' ? 'Attempted' : 'Completed' }}</span>
                <input class="input" type="datetime-local" v-model="draft.completed"/>
            </label>
            <div class="actions d-flex flex-row align-items-center">
                <button v-if="!bulk" type="button" class="delete" @click="$emit('delete')">Delete</button>
                <span class="flex-grow-1"></span>
                <button type="button" class="form-btn outline" @click="$emit('cancel')">Cancel</button>
                <button type="submit" class="form-btn primary">Save</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'IterationEditSheet',
    props: {
        initial: Object,  // { text, planned, windowEnd, points, status, completed }
        bulk: Boolean,
        count: Number,
        subtitle: String
    },
    emits: ['save', 'cancel', 'delete'],
    data: function() {
        return {
            draft: { ...this.initial }
        }
    }
}
</script>

<style scoped>
.sheet-layer {
    position: fixed;
    inset: 0;
    z-index: 1060;
    background-color: rgba(0, 0, 0, .4);
}

.sheet {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    gap: 14px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 8px 16px 28px;
    border-radius: 16px 16px 0 0;
    background-color: white;
    text-align: start;
}

.grabber {
    width: 36px;
    height: 5px;
    margin: 0 auto;
    border-radius: 3px;
    background-color: #CED4DA;
}

.title {
    font-size: 18px;
    font-weight: 600;
    color: #212529;
}

.subtitle {
    font-size: 13px;
    color: #6C757D;
}

.row-fields {
    gap: 12px;
}

.field {
    flex: 1;
    gap: 6px;
    min-width: 0;
    font-size: 13px;
    font-weight: 500;
    color: #495057;
}

.field.points {
    flex: 0 0 100px;
}

/* 16px stops iOS zooming into the field */
.input {
    height: 40px;
    padding: 0 12px;
    border: 1px solid #CED4DA;
    border-radius: 6px;
    background-color: white;
    font-size: 16px;
    font-weight: 400;
    color: #212529;
}

.input:focus {
    outline: none;
    border-color: #86B7FE;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, .25);
}

.actions {
    gap: 8px;
    padding-top: 6px;
}

.actions .form-btn {
    height: 40px;
}

.delete {
    border: none;
    background: none;
    padding: 0;
    font-size: 15px;
    font-weight: 500;
    color: #DC3545;
}
</style>
