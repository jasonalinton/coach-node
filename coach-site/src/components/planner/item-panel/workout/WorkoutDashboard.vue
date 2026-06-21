<template>
    <div class="workout-dashboard" :class="{ 'light-theme': isLightTheme }">

        <!-- Header -->
        <div class="dashboard-header">
            <span class="fitness-title">Fitness</span>
            <div class="header-actions">
                <button class="theme-toggle" @click="toggleTheme" :title="isLightTheme ? 'Switch to dark' : 'Switch to light'">
                    <!-- Sun icon: shown in dark mode to switch to light -->
                    <svg v-if="!isLightTheme" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="3.5" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M9 1.5v1.5M9 15v1.5M1.5 9H3M15 9h1.5M3.4 3.4l1.06 1.06M13.54 13.54l1.06 1.06M3.4 14.6l1.06-1.06M13.54 4.46l1.06-1.06" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <!-- Moon icon: shown in light mode to switch to dark -->
                    <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M14.5 9.8A5.8 5.8 0 1 1 8.2 3.5a4.3 4.3 0 0 0 6.3 6.3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="avatar-circle">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <circle cx="11" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M3 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Active Workout Card -->
        <div class="active-card mb-3" v-if="activeWorkout">
            <div class="active-card-content">
                <div class="active-badge">
                    <span class="active-dot"></span>
                    <span class="active-label">ACTIVE WORKOUT</span>
                </div>
                <div class="active-name">{{ activeWorkout.name }}</div>
                <div class="active-stats">
                    <div class="active-stat">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 3.5h10M2 7h10M2 10.5h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        <span>{{ activeExerciseDone }} of {{ activeExerciseTotal }}</span>
                    </div>
                    <div class="active-stat">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M7 4.5V7l1.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>{{ activeTimer }}</span>
                    </div>
                </div>
            </div>
            <button class="btn-accent" @click="resumeWorkout">Resume</button>
        </div>

        <!-- Start Workout Section -->
        <div class="section mb-3">
            <div class="section-label">START WORKOUT</div>
            <div class="card-surface" v-if="suggestedWorkout">
                <div class="suggestion-row">
                    <div class="suggestion-info">
                        <div class="card-title">{{ suggestedWorkout.name }}</div>
                        <div class="badge-row mt-2">
                            <span class="badge-accent-outline">Mesocycle: Week 3</span>
                            <span class="badge-chip">Today's Plan</span>
                        </div>
                    </div>
                    <button class="btn-accent btn-tall" @click="startWorkout(suggestedWorkout)">Start</button>
                </div>
                <div class="card-subtitle mt-2">Based on mesocycle focus · {{ suggestedExerciseCount }} exercises planned</div>
            </div>
            <div class="card-surface" v-else>
                <div class="card-title mb-2">No workout planned</div>
                <button class="btn-accent" @click="createWorkout">Create Workout</button>
            </div>
        </div>

        <!-- Mesocycle Section -->
        <div class="section mb-3">
            <div class="section-label">MESOCYCLE</div>
            <div class="card-surface">
                <div class="card-title mb-1">Hypertrophy Block</div>
                <div class="card-subtitle mb-3">Week 3 of 6 · Upper/Lower Split</div>
                <div class="progress-track mb-1">
                    <div class="progress-fill" style="width: 50%"></div>
                </div>
                <div class="progress-labels mb-3">
                    <span class="text-secondary-sm">Progress: 50%</span>
                    <span class="text-secondary-sm">3 of 6 weeks</span>
                </div>
                <div class="badge-row flex-wrap">
                    <span class="badge-chip">Strength Block</span>
                    <span class="badge-chip">Deload</span>
                    <span class="badge-chip">Hypertrophy I</span>
                </div>
            </div>
        </div>

        <!-- Muscle Status Section -->
        <div class="section mb-3">
            <div class="section-label">MUSCLE STATUS</div>
            <div class="card-surface">
                <div class="anatomy-placeholder">
                    <svg width="110" height="100" viewBox="0 0 110 100" fill="none">
                        <ellipse cx="55" cy="14" rx="9" ry="11" class="body-stroke"/>
                        <path d="M46 25 Q36 30 34 52 Q32 62 38 68" class="body-stroke"/>
                        <path d="M64 25 Q74 30 76 52 Q78 62 72 68" class="body-stroke"/>
                        <path d="M46 25 Q48 52 51 72 M64 25 Q62 52 59 72" class="body-stroke"/>
                        <path d="M51 72 Q49 87 47 98 M59 72 Q61 87 63 98" class="body-stroke"/>
                        <ellipse cx="55" cy="42" rx="11" ry="20" fill="#EF4444" fill-opacity="0.2" stroke="#EF4444" stroke-width="1"/>
                        <ellipse cx="51" cy="76" rx="7" ry="14" fill="#F59E0B" fill-opacity="0.2" stroke="#F59E0B" stroke-width="1"/>
                        <ellipse cx="59" cy="76" rx="7" ry="14" fill="#F59E0B" fill-opacity="0.2" stroke="#F59E0B" stroke-width="1"/>
                        <ellipse cx="37" cy="46" rx="5" ry="9" fill="#00C8FF" fill-opacity="0.2" stroke="#00C8FF" stroke-width="1"/>
                        <ellipse cx="73" cy="46" rx="5" ry="9" fill="#00C8FF" fill-opacity="0.2" stroke="#00C8FF" stroke-width="1"/>
                    </svg>
                    <svg width="110" height="100" viewBox="0 0 110 100" fill="none">
                        <ellipse cx="55" cy="14" rx="9" ry="11" class="body-stroke"/>
                        <path d="M46 25 Q36 30 34 52 Q32 62 38 68" class="body-stroke"/>
                        <path d="M64 25 Q74 30 76 52 Q78 62 72 68" class="body-stroke"/>
                        <path d="M46 25 Q48 52 51 72 M64 25 Q62 52 59 72" class="body-stroke"/>
                        <path d="M51 72 Q49 87 47 98 M59 72 Q61 87 63 98" class="body-stroke"/>
                        <ellipse cx="55" cy="46" rx="13" ry="20" fill="#EF4444" fill-opacity="0.2" stroke="#EF4444" stroke-width="1"/>
                        <ellipse cx="51" cy="76" rx="7" ry="14" fill="#00C8FF" fill-opacity="0.2" stroke="#00C8FF" stroke-width="1"/>
                        <ellipse cx="59" cy="76" rx="7" ry="14" fill="#00C8FF" fill-opacity="0.2" stroke="#00C8FF" stroke-width="1"/>
                    </svg>
                </div>
                <div class="legend-row">
                    <div class="legend-item">
                        <span class="status-dot cyan"></span>
                        <span class="text-primary-sm">5 Fresh</span>
                    </div>
                    <div class="legend-item">
                        <span class="status-dot amber"></span>
                        <span class="text-primary-sm">3 Moderate</span>
                    </div>
                    <div class="legend-item">
                        <span class="status-dot red"></span>
                        <span class="text-primary-sm">2 Fatigued</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Planning Section -->
        <div class="section mb-3">
            <div class="section-label">PLANNING</div>
            <div class="two-col-grid">
                <div class="card-surface">
                    <div class="planning-header mb-2">
                        <span class="text-primary-sm fw-semibold">Planned ({{ plannedExercises.length || 4 }})</span>
                        <button class="btn-icon" @click="addWorkout">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="planned-list" v-if="plannedExercises.length">
                        <div class="planned-item" v-for="ex in plannedExercises.slice(0, 3)" :key="ex.id">
                            <span class="planned-bar"></span>
                            <span class="text-secondary-sm text-truncate">{{ ex.name }}</span>
                        </div>
                        <span class="text-secondary-sm" v-if="plannedExercises.length > 3">+{{ plannedExercises.length - 3 }} more</span>
                    </div>
                    <div class="planned-list" v-else>
                        <div class="planned-item">
                            <span class="planned-bar"></span>
                            <span class="text-secondary-sm">Bench Press</span>
                        </div>
                        <div class="planned-item">
                            <span class="planned-bar"></span>
                            <span class="text-secondary-sm">Overhead Press</span>
                        </div>
                        <div class="planned-item">
                            <span class="planned-bar"></span>
                            <span class="text-secondary-sm">Pull-ups</span>
                        </div>
                        <span class="text-secondary-sm">+1 more</span>
                    </div>
                </div>
                <div class="card-surface">
                    <div class="planning-header mb-2">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1.5L1.5 12.5h11L7 1.5z" stroke="#F59E0B" stroke-width="1.5" stroke-linejoin="round"/>
                            <path d="M7 5.5v3" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
                            <circle cx="7" cy="10" r="0.75" fill="#F59E0B"/>
                        </svg>
                        <span class="text-amber fw-semibold">Unplanned (2)</span>
                    </div>
                    <div class="unplanned-list">
                        <div class="unplanned-item">
                            <span class="status-dot amber dot-sm"></span>
                            <span class="text-secondary-sm">Improve Squat Depth</span>
                        </div>
                        <div class="unplanned-item">
                            <span class="status-dot amber dot-sm"></span>
                            <span class="text-secondary-sm">Hip Flexor Mobility</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Goals Section -->
        <div class="section mb-3">
            <div class="section-label">GOALS</div>
            <div class="two-col-grid">
                <div class="goal-card card-surface" v-for="goal in goalCategories" :key="goal.label" @click="viewGoals">
                    <div class="goal-header mb-1">
                        <span class="goal-icon" v-html="goal.icon"></span>
                        <span class="goal-count">{{ goal.count }}</span>
                    </div>
                    <div class="card-subtitle">{{ goal.label }}</div>
                </div>
            </div>
        </div>

        <!-- Exercises Section -->
        <div class="section mb-3">
            <div class="section-label">EXERCISES</div>
            <div class="exercise-scroll">
                <div class="exercise-card"
                     v-for="(ex, i) in displayExercises"
                     :key="ex.id"
                     @click="openExercise(ex)">
                    <div class="exercise-image"></div>
                    <div class="exercise-info">
                        <div class="exercise-name">{{ ex.name }}</div>
                        <div class="exercise-tag">{{ exerciseTags[i % exerciseTags.length] }}</div>
                    </div>
                </div>
                <template v-if="!displayExercises.length">
                    <div class="exercise-card" v-for="ex in defaultExercises" :key="ex.name">
                        <div class="exercise-image"></div>
                        <div class="exercise-info">
                            <div class="exercise-name">{{ ex.name }}</div>
                            <div class="exercise-tag">{{ ex.tag }}</div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Muscles Section -->
        <div class="section mb-4">
            <div class="section-label">MUSCLES</div>
            <div class="muscle-pills">
                <div class="muscle-pill" v-for="m in displayMuscles" :key="m.id">
                    <span class="status-dot dot-sm" :class="muscleStatusColor(m)"></span>
                    <span class="text-primary-sm">{{ m.name }}</span>
                </div>
                <template v-if="!displayMuscles.length">
                    <div class="muscle-pill" v-for="m in defaultMuscles" :key="m.name">
                        <span class="status-dot dot-sm" :class="m.color"></span>
                        <span class="text-primary-sm">{{ m.name }}</span>
                    </div>
                </template>
            </div>
            <div class="heatmap-link" @click="viewHeatMap">View Heat Map</div>
        </div>

    </div>
</template>

<script>
import { useWorkoutStore } from '@/store/workoutStore'
import { useAppStore } from '@/store/appStore'

const GOAL_ICONS = {
    overload: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 14l4-4 3 3 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 6h3v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    mobility: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="4.5" r="2" stroke="currentColor" stroke-width="1.5"/><path d="M6.5 8.5h7M10 8.5v6M7.5 17l2.5-2 2.5 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    skill:    `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="3.5" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="1" fill="currentColor"/></svg>`,
    maint:    `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 10h3l2-5 3 10 2-7 2 3 2-1h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

export default {
    name: 'WorkoutDashboard',
    data() {
        return {
            workoutStore: undefined,
            appStore: undefined,
            isLightTheme: localStorage.getItem('workout-dashboard-theme') === 'light',
            timerTick: 0,
            timerInterval: null,
            exerciseTags: ['Priority', 'Recent', 'Recommended'],
            defaultExercises: [
                { name: 'Barbell Back Squat', tag: 'Priority' },
                { name: 'Romanian Deadlift', tag: 'Recent' },
                { name: 'Pull-up', tag: 'Recommended' },
            ],
            defaultMuscles: [
                { name: 'Quadriceps', color: 'red' },
                { name: 'Glutes', color: 'red' },
                { name: 'Chest', color: 'amber' },
                { name: 'Shoulders', color: 'cyan' },
                { name: 'Back', color: 'cyan' },
                { name: 'Core', color: 'cyan' },
            ],
            goalCategories: [
                { label: 'Progressive Overload', count: 3, icon: GOAL_ICONS.overload },
                { label: 'Mobility',             count: 2, icon: GOAL_ICONS.mobility },
                { label: 'Skill',                count: 1, icon: GOAL_ICONS.skill },
                { label: 'Maintenance',          count: 2, icon: GOAL_ICONS.maint },
            ]
        }
    },
    created() {
        this.workoutStore = useWorkoutStore();
        this.appStore = useAppStore();
        this.workoutStore.fill();
    },
    mounted() {
        if (this.activeWorkout) this.startTimer();
    },
    beforeUnmount() {
        this.stopTimer();
    },
    computed: {
        activeWorkout() {
            return this.workoutStore?.getActiveWorkouts()?.[0] || null;
        },
        activeExerciseDone() {
            if (!this.activeWorkout) return 0;
            let done = 0;
            this.activeWorkout.sections?.forEach(s => {
                s.exercises?.forEach(ex => { if (ex.completedAt) done++; });
            });
            return done;
        },
        activeExerciseTotal() {
            if (!this.activeWorkout) return 0;
            let total = 0;
            this.activeWorkout.sections?.forEach(s => { total += s.exercises?.length || 0; });
            return total;
        },
        activeTimer() {
            void this.timerTick;
            if (!this.activeWorkout?.iteration?.startAt) return '00:00';
            const start = new Date(this.activeWorkout.iteration.startAt);
            const diffSec = Math.max(0, Math.floor((Date.now() - start.getTime()) / 1000));
            const m = Math.floor(diffSec / 60);
            const s = diffSec % 60;
            return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        },
        suggestedWorkout() {
            const activeId = this.activeWorkout?.id;
            return this.workoutStore?.workouts?.find(w => w.id !== activeId) || null;
        },
        suggestedExerciseCount() {
            if (!this.suggestedWorkout) return 0;
            let n = 0;
            this.suggestedWorkout.sections?.forEach(s => { n += s.exercises?.length || 0; });
            return n;
        },
        plannedExercises() {
            if (!this.suggestedWorkout) return [];
            const result = [];
            this.suggestedWorkout.sections?.forEach(section => {
                section.exercises?.forEach(ex => {
                    const exId = ex.exercise?.id ?? ex.idExercise;
                    const exercise = this.workoutStore.getExercise(exId);
                    if (exercise) result.push(exercise);
                });
            });
            return result;
        },
        displayExercises() {
            return this.workoutStore?.exercises?.slice(0, 3) || [];
        },
        displayMuscles() {
            return this.workoutStore?.muscles?.slice(0, 6) || [];
        }
    },
    methods: {
        toggleTheme() {
            this.isLightTheme = !this.isLightTheme;
            localStorage.setItem('workout-dashboard-theme', this.isLightTheme ? 'light' : 'dark');
        },
        resumeWorkout() {
            if (this.activeWorkout) this.appStore.selectWorkout(this.activeWorkout.id);
        },
        startWorkout(workout) {
            this.appStore.selectWorkout(workout.id);
        },
        createWorkout() {
            this.appStore.selectWorkoutView('workoutForm');
        },
        addWorkout() {
            this.appStore.selectWorkoutView('workoutForm');
        },
        openExercise(exercise) {
            this.appStore.selectExercise(exercise.id);
        },
        viewGoals() {
            this.appStore.selectWorkoutView('fitnessGoals');
        },
        viewHeatMap() {
            this.appStore.selectWorkoutView('workoutList');
        },
        muscleStatusColor(muscle) {
            const idx = this.displayMuscles.indexOf(muscle);
            if (idx < 2) return 'red';
            if (idx < 3) return 'amber';
            return 'cyan';
        },
        startTimer() {
            this.timerInterval = setInterval(() => { this.timerTick++; }, 1000);
        },
        stopTimer() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        }
    },
    watch: {
        activeWorkout(val) {
            if (val && !this.timerInterval) this.startTimer();
            else if (!val) this.stopTimer();
        }
    }
}
</script>

<style scoped>
/* ── CSS Variables (dark defaults) ─────────────────────────── */
.workout-dashboard {
    --db-bg:           #0D0D0D;
    --db-surface:      #1A1A1A;
    --db-surface-hover:#222222;
    --db-chip:         #262626;
    --db-active-card:  #0A2429;
    --db-anatomy-bg:   #141414;
    --db-body-stroke:  #444444;
    --db-accent:       #00C8FF;
    --db-accent-border:rgba(0, 200, 255, 0.4);
    --db-text-primary: #FFFFFF;
    --db-text-secondary:#8E8E93;
    --db-progress-track:#262626;
    --db-exercise-img: #262626;
    --db-avatar-bg:    #262626;
    --db-icon-color:   #8E8E93;

    background-color: var(--db-bg);
    color: var(--db-text-primary);
    min-height: 100%;
    overflow-y: auto;
    padding: 0 20px 60px;
    text-align: left;
    transition: background-color 0.2s, color 0.2s;
}

/* ── Light theme overrides ──────────────────────────────────── */
.workout-dashboard.light-theme {
    --db-bg:           #F2F2F7;
    --db-surface:      #FFFFFF;
    --db-surface-hover:#F5F5F5;
    --db-chip:         #E1E1E4;
    --db-active-card:  #DCF2FF;
    --db-anatomy-bg:   #EFEFF1;
    --db-body-stroke:  #C5C5CC;
    --db-accent:       #007AFF;
    --db-accent-border:rgba(0, 122, 255, 0.4);
    --db-text-primary: #0D0D0D;
    --db-text-secondary:#6B6B6E;
    --db-progress-track:#E1E1E4;
    --db-exercise-img: #EFEFF1;
    --db-avatar-bg:    #E1E1E4;
    --db-icon-color:   #6B6B6E;
}

/* ── Header ─────────────────────────────────────────────────── */
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
}

.fitness-title {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.5px;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.theme-toggle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: var(--db-surface);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--db-text-secondary);
    transition: background-color 0.15s;
}

.theme-toggle:hover {
    background-color: var(--db-chip);
}

.avatar-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: var(--db-avatar-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--db-text-secondary);
    flex-shrink: 0;
}

/* ── Section label ──────────────────────────────────────────── */
.section-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--db-text-secondary);
    letter-spacing: 0.6px;
    text-transform: uppercase;
    margin-bottom: 8px;
}

/* ── Active workout card ─────────────────────────────────────── */
.active-card {
    background-color: var(--db-active-card);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.active-card-content {
    flex: 1;
    min-width: 0;
}

.active-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
}

.active-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--db-accent);
    flex-shrink: 0;
}

.active-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--db-accent);
    letter-spacing: 0.5px;
}

.active-name {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
    line-height: 1.25;
}

.active-stats {
    display: flex;
    gap: 14px;
    color: var(--db-text-secondary);
}

.active-stat {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    color: var(--db-text-secondary);
}

/* SVG icons inside active-stat use currentColor */
.active-stat svg { color: var(--db-text-secondary); }

/* ── Generic surface card ────────────────────────────────────── */
.card-surface {
    background-color: var(--db-surface);
    border-radius: 12px;
    padding: 16px;
    transition: background-color 0.2s;
}

.card-title {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.25;
}

.card-subtitle {
    font-size: 13px;
    color: var(--db-text-secondary);
    line-height: 1.4;
}

/* ── Buttons ─────────────────────────────────────────────────── */
.btn-accent {
    background-color: var(--db-accent);
    color: #0D0D0D;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    line-height: 1;
    transition: opacity 0.15s;
}

.btn-accent:hover { opacity: 0.85; }
.btn-tall { padding: 12px 16px; }

.btn-icon {
    background: none;
    border: none;
    color: var(--db-icon-color);
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ── Suggestion card ─────────────────────────────────────────── */
.suggestion-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.suggestion-info {
    flex: 1;
    min-width: 0;
}

/* ── Badges ──────────────────────────────────────────────────── */
.badge-row {
    display: flex;
    gap: 6px;
    align-items: center;
}

.badge-row.flex-wrap { flex-wrap: wrap; }

.badge-accent-outline {
    font-size: 11px;
    color: var(--db-accent);
    border: 1px solid var(--db-accent-border);
    border-radius: 4px;
    padding: 3px 8px;
    font-weight: 500;
    white-space: nowrap;
}

.badge-chip {
    font-size: 11px;
    color: var(--db-text-secondary);
    background-color: var(--db-chip);
    border-radius: 4px;
    padding: 3px 8px;
    white-space: nowrap;
}

/* ── Progress bar ────────────────────────────────────────────── */
.progress-track {
    height: 6px;
    background-color: var(--db-progress-track);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background-color: var(--db-accent);
    border-radius: 4px;
}

.progress-labels {
    display: flex;
    justify-content: space-between;
}

/* ── Text utilities ──────────────────────────────────────────── */
.text-primary-sm   { font-size: 13px; color: var(--db-text-primary); }
.text-secondary-sm { font-size: 13px; color: var(--db-text-secondary); }
.text-amber        { color: #F59E0B; font-size: 13px; }
.fw-semibold       { font-weight: 600; }
.text-truncate     { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ── Anatomy placeholder ─────────────────────────────────────── */
.anatomy-placeholder {
    width: 100%;
    height: 160px;
    background-color: var(--db-anatomy-bg);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 4px;
    transition: background-color 0.2s;
}

/* SVG body outline strokes respond to theme */
.body-stroke {
    stroke: var(--db-body-stroke);
    stroke-width: 1.5px;
    fill: none;
    stroke-linecap: round;
}

/* ── Status dots ─────────────────────────────────────────────── */
.status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.status-dot.dot-sm { width: 6px; height: 6px; }
.status-dot.cyan   { background-color: #00C8FF; }
.status-dot.amber  { background-color: #F59E0B; }
.status-dot.red    { background-color: #EF4444; }

.legend-row {
    display: flex;
    gap: 16px;
    margin-top: 12px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

/* ── Two-column grid ─────────────────────────────────────────── */
.two-col-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

/* ── Planning ────────────────────────────────────────────────── */
.planning-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.planned-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.planned-item {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
}

.planned-bar {
    width: 2px;
    height: 14px;
    background-color: var(--db-accent);
    border-radius: 1px;
    flex-shrink: 0;
}

.unplanned-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.unplanned-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

/* ── Goals ───────────────────────────────────────────────────── */
.goal-card { cursor: pointer; }

.goal-card:hover { background-color: var(--db-surface-hover) !important; }

.goal-header {
    display: flex;
    align-items: center;
    gap: 8px;
}

.goal-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    color: var(--db-accent);  /* SVGs use currentColor */
}

.goal-count {
    font-size: 22px;
    font-weight: 700;
    line-height: 1;
}

/* ── Exercises horizontal scroll ─────────────────────────────── */
.exercise-scroll {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}

.exercise-scroll::-webkit-scrollbar { display: none; }

.exercise-card {
    min-width: 140px;
    width: 140px;
    background-color: var(--db-surface);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color 0.15s;
}

.exercise-card:hover { background-color: var(--db-surface-hover); }

.exercise-image {
    width: 100%;
    height: 80px;
    background-color: var(--db-exercise-img);
    transition: background-color 0.2s;
}

.exercise-info { padding: 10px 12px; }

.exercise-name {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 4px;
    line-height: 1.3;
}

.exercise-tag {
    font-size: 11px;
    color: var(--db-accent);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

/* ── Muscles ─────────────────────────────────────────────────── */
.muscle-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.muscle-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: var(--db-surface);
    border-radius: 20px;
    padding: 6px 12px;
    transition: background-color 0.2s;
}

.heatmap-link {
    font-size: 15px;
    color: var(--db-accent);
    cursor: pointer;
    margin-top: 14px;
    text-align: center;
    font-weight: 500;
}

.heatmap-link:hover { text-decoration: underline; }

/* ── Spacing helpers ─────────────────────────────────────────── */
.mb-1 { margin-bottom: 4px !important; }
.mb-2 { margin-bottom: 8px !important; }
.mb-3 { margin-bottom: 16px !important; }
.mb-4 { margin-bottom: 24px !important; }
.mt-2 { margin-top: 8px !important; }
</style>
