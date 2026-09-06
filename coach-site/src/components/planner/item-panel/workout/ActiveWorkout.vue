<template>
    <div class="active-workout">

        <!-- Nav Bar -->
        <div class="aw-navbar">
            <div class="aw-navbar-top">
                <button class="aw-back-btn" @click="back">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 13L5 8L10 3" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Back</span>
                </button>
                <span class="aw-title">{{ workoutName }}</span>
                <button class="aw-menu-btn" @click="settings.isShown = !settings.isShown">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="4" cy="10" r="1.5" fill="#6b7280"/>
                        <circle cx="10" cy="10" r="1.5" fill="#6b7280"/>
                        <circle cx="16" cy="10" r="1.5" fill="#6b7280"/>
                    </svg>
                </button>
            </div>
            <div class="aw-navbar-bottom">
                <div class="aw-timer-row">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="5.5" stroke="#111827" stroke-width="1.5"/>
                        <path d="M7 4.5V7l1.5 1.5" stroke="#111827" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="aw-timer-text">{{ timeSinceStart || '0:00:00' }}</span>
                </div>
                <div class="aw-status-pill" v-if="isWorkoutActive">
                    <span class="aw-status-dot"></span>
                    <span>IN PROGRESS</span>
                </div>
            </div>
        </div>

        <!-- Settings Panel -->
        <div v-if="settings.isShown" class="aw-settings-panel">
            <div class="aw-settings-inner">
                <div v-if="settings.confirmDelete" class="aw-delete-confirm">
                    <span>Delete this workout?</span>
                    <div class="aw-delete-actions">
                        <button class="aw-btn-ghost" @click="settings.confirmDelete = false">Cancel</button>
                        <button class="aw-btn-danger" @click="deleteWorkout">Delete</button>
                    </div>
                </div>
                <button v-else class="aw-btn-danger-outline" @click="settings.confirmDelete = true">Delete Workout</button>
                <button class="aw-btn-ghost" @click="settings.isShown = false">Close</button>
            </div>
        </div>

        <!-- Scroll Content -->
        <div class="aw-scroll">
            <div v-for="section in sections" :key="section.id"
                 class="aw-section"
                 :class="{ 'aw-section-complete': isSectionComplete(section) }">

                <div class="aw-section-header" @click="toggleSection(section.id)">
                    <span class="aw-section-name">{{ getSectionName(section) }}</span>
                    <div class="aw-section-toggle">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 4L6 8L10 4" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round"
                                  :transform="collapsedSections[section.id] ? 'rotate(180 6 6)' : ''"/>
                        </svg>
                    </div>
                </div>

                <template v-if="!collapsedSections[section.id]">
                    <div v-for="ex in getSectionExercises(section)" :key="ex.idWorkoutExercise"
                         class="aw-exercise-card"
                         :class="{
                             'aw-exercise-complete': isExerciseComplete(ex),
                             'aw-exercise-active': isExerciseActive(ex),
                             'aw-exercise-planned': isExercisePlanned(ex) && !isExerciseActive(ex)
                         }"
                         @click="openExercise(ex)">
                        <div class="aw-exercise-content">
                            <div class="aw-exercise-title-row">
                                <span class="aw-exercise-name" :class="{ 'aw-exercise-done': isExerciseComplete(ex) }">
                                    {{ ex.name }}
                                </span>
                                <div v-if="isExerciseComplete(ex)" class="aw-check-badge">
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path d="M2 5L4 7L8 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <div v-else-if="isExerciseActive(ex)" class="aw-active-dot"></div>
                            </div>
                            <span class="aw-exercise-meta" :class="{ 'aw-meta-accent': isExerciseActive(ex) }">
                                {{ getExerciseMeta(ex) }}
                            </span>
                        </div>
                        <div class="aw-exercise-right">
                            <span v-if="getPrimaryBadge(ex)" class="aw-badge">{{ getPrimaryBadge(ex) }}</span>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M5 3L9 7L5 11" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </template>
            </div>

            <div class="aw-add-section">+  Add Section</div>
        </div>

        <!-- Rest Timer (floating) -->
        <div v-if="restTimer.isShown" class="aw-rest-timer">
            <div class="aw-rest-header">
                <span class="aw-rest-label">RESTING</span>
                <button class="aw-rest-close" @click="skipRest">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5 5L15 15M15 5L5 15" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
            <div class="aw-timer-circle">
                <svg class="aw-ring" width="160" height="160" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#f3f4f6" stroke-width="8"/>
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#4f46e5" stroke-width="8"
                            stroke-linecap="round"
                            :stroke-dasharray="restCircumference"
                            :stroke-dashoffset="restDashOffset"
                            transform="rotate(-90 80 80)"/>
                </svg>
                <span class="aw-rest-countdown">{{ formattedRestTime }}</span>
            </div>
            <div class="aw-rest-controls">
                <button class="aw-adjust-btn" @click="adjustRest(-15)">−15s</button>
                <button class="aw-adjust-btn" @click="adjustRest(15)">+15s</button>
            </div>
            <button class="aw-skip-rest" @click="skipRest">Skip Rest</button>
        </div>

        <!-- Quick Log Bottom Sheet -->
        <div v-if="activeExercise" class="aw-quick-log">
            <div class="aw-handle"></div>
            <div class="aw-log-header">
                <p class="aw-log-title">{{ activeExercise.name }}</p>
                <p class="aw-log-set">Set {{ activeSetIndex(activeExercise) }} of {{ activeExercise.sets.length }}</p>
            </div>
            <div class="aw-log-inputs">
                <div class="aw-chip">
                    <span class="aw-chip-value">{{ quickLog.weight || '—' }}</span>
                    <span class="aw-chip-unit">kg</span>
                </div>
                <div class="aw-chip aw-chip-active">
                    <span class="aw-chip-value">{{ quickLog.duration || '—' }}</span>
                    <span class="aw-chip-unit">time</span>
                </div>
            </div>
            <div class="aw-log-buttons">
                <button class="aw-btn-primary" @click="logSet">Log Set</button>
                <button class="aw-btn-secondary" @click="logAllRemaining">Log All Remaining</button>
            </div>
            <div class="aw-log-nav">
                <button class="aw-nav-btn" @click="prevExercise">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 3L5 7L9 11" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Prev Set</span>
                </button>
                <button class="aw-nav-btn" @click="nextExercise">
                    <span>Next Exercise</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 3L9 7L5 11" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Stop Workout (when active, no active exercise shown) -->
        <div v-if="isWorkoutActive && !activeExercise" class="aw-stop-bar">
            <button class="aw-btn-stop" @click="stopWorkout">Stop Workout</button>
        </div>

    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { useWorkoutStore } from '@/store/workoutStore'
import { timeSince } from '../../../../../utility/timeUtility'
import { workoutSectionTypes } from '../../../../model/types'

export default {
    name: 'ActiveWorkout',
    data() {
        return {
            appStore: null,
            workoutStore: null,
            now: Date.now(),
            nowInterval: null,
            sectionTypes: [...workoutSectionTypes],
            collapsedSections: {},
            settings: {
                isShown: false,
                confirmDelete: false
            },
            restTimer: {
                isShown: false,
                totalSeconds: 90,
                remainingSeconds: 90,
                interval: null
            },
            quickLog: {
                weight: null,
                duration: null
            }
        }
    },
    created() {
        this.appStore = useAppStore()
        this.workoutStore = useWorkoutStore()
        this.nowInterval = setInterval(() => { this.now = Date.now() }, 1000)
    },
    beforeUnmount() {
        if (this.nowInterval) clearInterval(this.nowInterval)
        if (this.restTimer.interval) clearInterval(this.restTimer.interval)
    },
    computed: {
        id() {
            return this.appStore?.itemPanel.workout.selectedWorkoutID
        },
        workout() {
            if (this.workoutStore && this.id) {
                return this.workoutStore.getWorkout(this.id)
            }
            return null
        },
        workoutName() {
            return this.workout?.name || 'Workout'
        },
        sections() {
            return this.workout?.sections || []
        },
        startAt() {
            return this.workout?.iteration?.startAt
        },
        endAt() {
            return this.workout?.iteration?.endAt
        },
        isWorkoutActive() {
            return !!(this.startAt && !this.endAt)
        },
        timeSinceStart() {
            if (this.isWorkoutActive && this.startAt) {
                return timeSince(new Date(this.startAt), this.now)
            }
            return null
        },
        activeExerciseId() {
            return this.appStore?.itemPanel.workout.activeExerciseID
        },
        activeExercise() {
            if (!this.activeExerciseId || !this.sections.length) return null
            for (const section of this.sections) {
                const exercises = this.getSectionExercises(section)
                const ex = exercises.find(e => e.idWorkoutExercise === this.activeExerciseId)
                if (ex) return ex
            }
            return null
        },
        restCircumference() {
            return 2 * Math.PI * 70
        },
        restDashOffset() {
            const progress = this.restTimer.remainingSeconds / this.restTimer.totalSeconds
            return this.restCircumference * (1 - progress)
        },
        formattedRestTime() {
            const s = Math.max(0, this.restTimer.remainingSeconds)
            const m = Math.floor(s / 60)
            const sec = s % 60
            return `${m}:${String(sec).padStart(2, '0')}`
        }
    },
    methods: {
        back() {
            this.appStore.onBackWorkoutPanel()
        },
        openExercise(exercise) {
            this.appStore.selectExercise(exercise.idWorkoutExercise)
        },
        getSectionName(section) {
            const type = this.sectionTypes.find(x => x.id == section.id)
            return type?.text || section.name || 'Section'
        },
        getSectionExercises(section) {
            if (!this.workoutStore) return []
            return (section.exercises || []).map(x => {
                const model = this.workoutStore.getExercise(x.id)
                return { ...x, ...(model || {}) }
            })
        },
        isSectionComplete(section) {
            const exercises = this.getSectionExercises(section)
            return exercises.length > 0 && exercises.every(ex => this.isExerciseComplete(ex))
        },
        toggleSection(sectionId) {
            this.collapsedSections = {
                ...this.collapsedSections,
                [sectionId]: !this.collapsedSections[sectionId]
            }
        },
        isExerciseComplete(ex) {
            if (!ex.sets || ex.sets.length === 0) return false
            return ex.sets.every(s => s.iteration && s.iteration.completedAt)
        },
        isExerciseActive(ex) {
            return ex.idWorkoutExercise === this.activeExerciseId
        },
        isExercisePlanned(ex) {
            if (!ex.sets) return true
            return ex.sets.every(s => !s.iteration || !s.iteration.completedAt)
        },
        getExerciseMeta(ex) {
            if (!ex.sets) return ''
            const total = ex.sets.length
            const done = ex.sets.filter(s => s.iteration && s.iteration.completedAt).length
            if (this.isExerciseComplete(ex)) return `${done}/${total} sets complete`
            if (this.isExerciseActive(ex)) {
                const setNum = done + 1
                return `${done}/${total} sets · Set ${setNum} active`
            }
            if (done === 0) {
                return `0/${total} sets · Planned`
            }
            return `${done}/${total} sets`
        },
        getPrimaryBadge(ex) {
            try {
                if (ex.muscles && ex.muscles.length > 0) {
                    return ex.muscles[0]?.name || null
                }
                if (ex.muscleGroups && ex.muscleGroups.length > 0) {
                    const mg = this.workoutStore.getMuscleGroup(ex.muscleGroups[0])
                    return mg?.name || null
                }
            } catch (e) {
                return null
            }
            return null
        },
        activeSetIndex(ex) {
            if (!ex.sets) return 1
            const done = ex.sets.filter(s => s.iteration && s.iteration.completedAt).length
            return Math.min(done + 1, ex.sets.length)
        },
        activeSet(ex) {
            if (!ex.sets) return null
            return ex.sets.find(s => !s.iteration || !s.iteration.completedAt)
        },
        logSet() {
            if (!this.activeExercise) return
            const set = this.activeSet(this.activeExercise)
            if (set) {
                this.workoutStore.logSet(set.id, new Date().toISOString())
            }
        },
        logAllRemaining() {
            if (!this.activeExercise) return
            const remaining = this.activeExercise.sets.filter(s => !s.iteration || !s.iteration.completedAt)
            const now = new Date().toISOString()
            remaining.forEach(set => this.workoutStore.logSet(set.id, now))
        },
        prevExercise() {
            // Navigate to previous exercise — store doesn't expose a prev method, so move to the prev in list
            if (!this.id || !this.activeExerciseId) return
            const allExercises = this.sections.flatMap(s => this.getSectionExercises(s))
            const idx = allExercises.findIndex(e => e.idWorkoutExercise === this.activeExerciseId)
            if (idx > 0) {
                this.appStore.setActiveExercise(allExercises[idx - 1].idWorkoutExercise)
            }
        },
        nextExercise() {
            if (!this.id || !this.activeExerciseId) return
            const next = this.workoutStore.getNextWorkoutExercise(this.id, this.activeExerciseId)
            if (next) {
                this.appStore.setActiveExercise(next.idWorkoutExercise)
            }
        },
        stopWorkout() {
            // Kick off completion via the existing store flow
            const now = new Date().toISOString()
            this.workoutStore.completeWorkout(this.workout.id, this.startAt, now, true)
                .then(() => this.back())
        },
        deleteWorkout() {
            this.workoutStore.saveWorkout({ id: this.id, isDeleted: true })
            this.appStore.onDoneWorkout()
            this.back()
        },
        startRestTimer(seconds = 90) {
            if (this.restTimer.interval) clearInterval(this.restTimer.interval)
            this.restTimer.totalSeconds = seconds
            this.restTimer.remainingSeconds = seconds
            this.restTimer.isShown = true
            this.restTimer.interval = setInterval(() => {
                if (this.restTimer.remainingSeconds > 0) {
                    this.restTimer.remainingSeconds--
                } else {
                    this.skipRest()
                }
            }, 1000)
        },
        adjustRest(delta) {
            this.restTimer.remainingSeconds = Math.max(0, this.restTimer.remainingSeconds + delta)
        },
        skipRest() {
            if (this.restTimer.interval) {
                clearInterval(this.restTimer.interval)
                this.restTimer.interval = null
            }
            this.restTimer.isShown = false
        }
    },
    watch: {
        id(value) {
            if (value && this.workoutStore) {
                const ex = this.workoutStore.getActiveExercise(value)
                if (ex) this.appStore.setActiveExercise(ex.idWorkoutExercise)
            }
        }
    }
}
</script>

<style scoped>
.active-workout {
    --aw-accent: #4f46e5;
    --aw-accent-bg: rgba(79, 70, 229, 0.08);
    --aw-green: #16a34a;
    --aw-green-bg: rgba(22, 163, 74, 0.08);
    --aw-bg: #fafafa;
    --aw-surface: #ffffff;
    --aw-border: #f3f4f6;
    --aw-text: #111827;
    --aw-muted: #6b7280;
    --aw-shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.05);
    --aw-shadow-md: 0 4px 10px rgba(0, 0, 0, 0.05);

    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--aw-bg);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    position: relative;
    overflow: hidden;
}

/* ── Nav Bar ── */
.aw-navbar {
    background: var(--aw-surface);
    border-bottom: 1px solid var(--aw-border);
    flex-shrink: 0;
}

.aw-navbar-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 60px;
    position: relative;
}

.aw-back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--aw-accent);
    font-size: 13px;
    font-weight: 600;
    padding: 0;
    flex-shrink: 0;
    z-index: 1;
}

.aw-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    font-weight: 700;
    color: var(--aw-text);
    white-space: nowrap;
    pointer-events: none;
}

.aw-menu-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    z-index: 1;
}

.aw-navbar-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px 12px;
}

.aw-timer-row {
    display: flex;
    align-items: center;
    gap: 4px;
}

.aw-timer-text {
    font-size: 14px;
    font-weight: 700;
    color: var(--aw-text);
}

.aw-status-pill {
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--aw-green-bg);
    color: var(--aw-green);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 100px;
}

.aw-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--aw-green);
}

/* ── Settings Panel ── */
.aw-settings-panel {
    background: var(--aw-surface);
    border-bottom: 1px solid var(--aw-border);
    flex-shrink: 0;
    padding: 12px 16px;
}

.aw-settings-inner {
    display: flex;
    align-items: center;
    gap: 12px;
}

.aw-delete-confirm {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.aw-delete-confirm span {
    font-size: 13px;
    color: var(--aw-muted);
}

.aw-delete-actions {
    display: flex;
    gap: 8px;
}

.aw-btn-ghost {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--aw-muted);
    padding: 6px 12px;
    border-radius: 8px;
}

.aw-btn-ghost:hover {
    background: var(--aw-border);
}

.aw-btn-danger {
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}

.aw-btn-danger-outline {
    background: none;
    color: #dc2626;
    border: 1px solid #dc2626;
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}

/* ── Scroll Content ── */
.aw-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 24px 16px 240px;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

/* ── Section ── */
.aw-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.aw-section.aw-section-complete {
    opacity: 0.6;
}

.aw-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
    cursor: pointer;
}

.aw-section-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--aw-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.aw-section-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
}

/* ── Exercise Card ── */
.aw-exercise-card {
    background: var(--aw-surface);
    border: 1px solid var(--aw-border);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    box-shadow: var(--aw-shadow-sm);
    transition: box-shadow 0.15s ease, opacity 0.15s ease;
}

.aw-exercise-card:hover {
    box-shadow: var(--aw-shadow-md);
}

.aw-exercise-card.aw-exercise-complete {
    opacity: 0.6;
}

.aw-exercise-card.aw-exercise-active {
    border-color: var(--aw-accent);
    border-left-width: 4px;
    box-shadow: 0 4px 10px rgba(79, 70, 229, 0.1);
}

.aw-exercise-card.aw-exercise-planned {
    opacity: 0.7;
}

.aw-exercise-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.aw-exercise-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.aw-exercise-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--aw-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.aw-exercise-done {
    text-decoration: line-through;
    color: var(--aw-muted);
}

.aw-check-badge {
    width: 16px;
    height: 16px;
    background: var(--aw-green);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.aw-active-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--aw-accent);
    flex-shrink: 0;
}

.aw-exercise-meta {
    font-size: 13px;
    color: var(--aw-muted);
    font-weight: 400;
}

.aw-exercise-meta.aw-meta-accent {
    color: var(--aw-accent);
    font-weight: 600;
}

.aw-exercise-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.aw-badge {
    background: var(--aw-border);
    color: var(--aw-muted);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
}

.aw-add-section {
    color: #9ca3af;
    font-size: 14px;
    font-weight: 600;
    padding: 12px;
    text-align: center;
    cursor: pointer;
    user-select: none;
}

/* ── Rest Timer ── */
.aw-rest-timer {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 300px;
    width: calc(100% - 40px);
    max-width: 350px;
    background: var(--aw-surface);
    border-radius: 20px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    z-index: 10;
}

.aw-rest-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.aw-rest-label {
    font-size: 14px;
    font-weight: 700;
    color: var(--aw-accent);
    text-transform: uppercase;
}

.aw-rest-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
}

.aw-timer-circle {
    position: relative;
    width: 160px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.aw-ring {
    position: absolute;
    inset: 0;
}

.aw-rest-countdown {
    font-size: 40px;
    font-weight: 700;
    color: var(--aw-text);
    font-family: 'IBM Plex Mono', monospace;
    position: relative;
    z-index: 1;
}

.aw-rest-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.aw-adjust-btn {
    background: var(--aw-accent-bg);
    color: var(--aw-accent);
    border: none;
    border-radius: 100px;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
}

.aw-skip-rest {
    background: none;
    border: none;
    color: var(--aw-accent);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
}

/* ── Quick Log Bottom Sheet ── */
.aw-quick-log {
    position: sticky;
    bottom: 0;
    background: var(--aw-surface);
    border-radius: 24px 24px 0 0;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    padding: 12px 20px 32px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-shrink: 0;
    z-index: 5;
}

.aw-handle {
    width: 40px;
    height: 4px;
    background: var(--aw-border);
    border-radius: 2px;
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
}

.aw-log-header {
    padding-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.aw-log-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--aw-text);
    margin: 0;
    white-space: nowrap;
}

.aw-log-set {
    font-size: 14px;
    font-weight: 600;
    color: var(--aw-accent);
    margin: 0;
}

.aw-log-inputs {
    display: flex;
    gap: 12px;
}

.aw-chip {
    flex: 1;
    background: var(--aw-border);
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 2px;
}

.aw-chip.aw-chip-active {
    background: var(--aw-accent-bg);
    border: 2px solid var(--aw-accent);
}

.aw-chip-value {
    font-size: 16px;
    font-weight: 700;
    color: var(--aw-text);
}

.aw-chip.aw-chip-active .aw-chip-value {
    color: var(--aw-accent);
}

.aw-chip-unit {
    font-size: 12px;
    font-weight: 400;
    color: var(--aw-muted);
}

.aw-chip.aw-chip-active .aw-chip-unit {
    color: var(--aw-accent);
}

.aw-log-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.aw-btn-primary {
    background: var(--aw-accent);
    color: white;
    border: none;
    border-radius: 100px;
    padding: 16px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    width: 100%;
    transition: opacity 0.15s ease;
}

.aw-btn-primary:hover {
    opacity: 0.9;
}

.aw-btn-secondary {
    background: none;
    color: var(--aw-accent);
    border: 1.5px solid var(--aw-accent);
    border-radius: 100px;
    padding: 14px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: background 0.15s ease;
}

.aw-btn-secondary:hover {
    background: var(--aw-accent-bg);
}

.aw-log-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.aw-nav-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--aw-muted);
    font-size: 13px;
    font-weight: 600;
    padding: 0;
}

/* ── Stop Bar (fallback when no active exercise) ── */
.aw-stop-bar {
    position: sticky;
    bottom: 0;
    background: var(--aw-surface);
    border-top: 1px solid var(--aw-border);
    padding: 16px 20px 32px;
    flex-shrink: 0;
}

.aw-btn-stop {
    background: none;
    color: #dc2626;
    border: 1.5px solid #dc2626;
    border-radius: 100px;
    padding: 14px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
}

.aw-btn-stop:hover {
    background: rgba(220, 38, 38, 0.05);
}
</style>
