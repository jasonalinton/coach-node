<template>
    <div class="wdl">

        <!-- Nav Bar -->
        <div class="wdl-nav">
            <div class="wdl-nav-spacer"></div>
            <span class="wdl-nav-title">Workout</span>
            <div class="wdl-profile-icon">
                <i class="fa-regular fa-user" style="font-size:14px;color:#6b7280"></i>
            </div>
        </div>

        <!-- Scrollable content -->
        <div class="wdl-scroll">

            <!-- Active Workout Banner -->
            <div class="wdl-active-card" @click="resumeWorkout">
                <div class="wdl-active-row">
                    <div class="wdl-active-details">
                        <span class="wdl-active-label">Active Workout</span>
                        <span class="wdl-active-name">{{ activeWorkout?.name || 'Upper Body Hypertrophy' }}</span>
                        <div class="wdl-active-time">
                            <i class="fa-regular fa-clock" style="font-size:12px;color:#fff"></i>
                            <span class="wdl-timer-text">{{ elapsedFormatted }}</span>
                        </div>
                    </div>
                    <button class="wdl-resume-btn">Resume</button>
                </div>
            </div>

            <!-- Start Workout -->
            <div class="wdl-section">
                <div class="wdl-section-header">
                    <span class="wdl-section-title">Start Workout</span>
                </div>
                <div class="wdl-suggestion-card">
                    <div class="wdl-suggestion-row">
                        <div class="wdl-suggestion-thumb"></div>
                        <div class="wdl-suggestion-info">
                            <span class="wdl-suggestion-name">Full Body + Handstand</span>
                            <span class="wdl-suggestion-date">Today · Friday, Oct 24</span>
                        </div>
                        <button class="wdl-start-btn" @click="startWorkout">Start</button>
                    </div>
                </div>
                <div class="wdl-chips-row">
                    <div v-for="chip in workoutChips" :key="chip" class="wdl-chip">{{ chip }}</div>
                </div>
            </div>

            <!-- Mesocycle -->
            <div class="wdl-section">
                <div class="wdl-section-header">
                    <span class="wdl-section-title">Mesocycle</span>
                </div>
                <div class="wdl-card wdl-meso-card">
                    <div class="wdl-meso-header">
                        <div class="wdl-meso-meta">
                            <span class="wdl-meso-name">Mesocycle 1</span>
                            <span class="wdl-meso-sub">Strength + Skill</span>
                        </div>
                        <span class="wdl-meso-week">Week 3 of 6</span>
                    </div>
                    <div class="wdl-progress-track">
                        <div class="wdl-progress-fill" :style="{ width: mesoProgress + '%' }"></div>
                    </div>
                    <div class="wdl-week-dots">
                        <div v-for="i in 6" :key="i"
                             class="wdl-dot"
                             :class="i <= mesoCurrentWeek ? 'wdl-dot-filled' : 'wdl-dot-empty'">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Avatar + Stats -->
            <div class="wdl-avatar-section">
                <div class="wdl-avatar-container">
                    <img class="wdl-avatar-img" :src="avatarUrl" alt="body" />
                    <div class="wdl-heat-dot wdl-heat-sm" style="left:170px;top:100px"></div>
                    <div class="wdl-heat-dot wdl-heat-sm" style="left:210px;top:100px"></div>
                    <div class="wdl-heat-dot wdl-heat-lg" style="left:190px;top:180px"></div>
                </div>
                <div class="wdl-stats-row">
                    <div class="wdl-stat-card">
                        <span class="wdl-stat-val wdl-stat-green">92%</span>
                        <span class="wdl-stat-label">Freshness</span>
                    </div>
                    <div class="wdl-stat-card">
                        <span class="wdl-stat-val wdl-stat-dark">Stable</span>
                        <span class="wdl-stat-label">Balance</span>
                    </div>
                    <div class="wdl-stat-card">
                        <span class="wdl-stat-val wdl-stat-dark">High</span>
                        <span class="wdl-stat-label">Volume</span>
                    </div>
                </div>
            </div>

            <!-- Planning -->
            <div class="wdl-section">
                <div class="wdl-section-header">
                    <span class="wdl-section-title">Planning</span>
                </div>
                <div class="wdl-card wdl-planned-card">
                    <span class="wdl-sub-label">Planned</span>
                    <div v-for="item in plannedExercises" :key="item.name" class="wdl-plan-row">
                        <div class="wdl-plan-info">
                            <span class="wdl-plan-name">{{ item.name }}</span>
                            <span class="wdl-plan-sub">{{ item.sub }}</span>
                        </div>
                        <div class="wdl-badge wdl-badge-indigo">{{ item.badge }}</div>
                    </div>
                </div>
                <div class="wdl-card wdl-neglected-card">
                    <span class="wdl-sub-label wdl-sub-red">Neglected Goals</span>
                    <div v-for="goal in neglectedGoals" :key="goal" class="wdl-neglect-row">
                        <i class="fa-solid fa-circle-exclamation" style="font-size:14px;color:#ef4444;flex-shrink:0"></i>
                        <span class="wdl-neglect-text">{{ goal }}</span>
                    </div>
                </div>
            </div>

            <!-- Goals -->
            <div class="wdl-section">
                <div class="wdl-section-header">
                    <span class="wdl-section-title">Goals</span>
                    <button class="wdl-see-all">See All</button>
                </div>
                <div class="wdl-goals-groups">
                    <div v-for="group in goalGroups" :key="group.label" class="wdl-goal-group">
                        <span class="wdl-sub-label">{{ group.label }}</span>
                        <div class="wdl-goal-chips">
                            <div v-for="g in group.items" :key="g.name" class="wdl-goal-chip">
                                <span class="wdl-goal-dot" :style="{ background: g.color }"></span>
                                <span class="wdl-goal-name">{{ g.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Skills -->
            <div class="wdl-section">
                <div class="wdl-section-header">
                    <span class="wdl-section-title">Skills</span>
                </div>
                <div class="wdl-card">
                    <div v-for="skill in skills" :key="skill.name" class="wdl-skill-row">
                        <div class="wdl-skill-header">
                            <span class="wdl-skill-name">{{ skill.name }}</span>
                            <span class="wdl-skill-pct">{{ skill.pct }}%</span>
                        </div>
                        <div class="wdl-progress-track">
                            <div class="wdl-progress-fill" :style="{ width: skill.pct + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Exercises -->
            <div class="wdl-section">
                <div class="wdl-section-header">
                    <span class="wdl-section-title">Exercises</span>
                </div>
                <div class="wdl-ex-scroll">
                    <div v-for="ex in exercises" :key="ex.name" class="wdl-ex-card">
                        <div class="wdl-ex-thumb"></div>
                        <span class="wdl-ex-name">{{ ex.name }}</span>
                        <div class="wdl-badge wdl-badge-gray">{{ ex.muscle }}</div>
                    </div>
                </div>
            </div>

            <!-- Muscles -->
            <div class="wdl-section wdl-section-last">
                <div class="wdl-section-header">
                    <span class="wdl-section-title">Muscles</span>
                </div>
                <div class="wdl-muscle-badges">
                    <div v-for="m in muscles" :key="m.name"
                         class="wdl-badge"
                         :class="m.cls">{{ m.name }}</div>
                </div>
            </div>

        </div>

        <!-- Spacer -->
        <div class="wdl-spacer"></div>

        <!-- Footer Nav -->
        <div class="wdl-footer">
            <button class="wdl-nav-tab wdl-nav-active">
                <i class="fa-solid fa-house" style="font-size:20px"></i>
            </button>
            <button class="wdl-nav-tab">
                <i class="fa-solid fa-chart-simple" style="font-size:20px"></i>
            </button>
            <button class="wdl-nav-tab">
                <i class="fa-regular fa-circle-plus" style="font-size:20px"></i>
            </button>
            <button class="wdl-nav-tab">
                <i class="fa-regular fa-user" style="font-size:20px"></i>
            </button>
        </div>

    </div>
</template>

<script>
import bodyAvatar from '@/assets/body-avatar.png';

export default {
    name: 'WorkoutDashboardLite',
    data() {
        return {
            avatarUrl: bodyAvatar,
            activeWorkout: null,
            elapsedSeconds: 42,
            elapsedTimer: null,
            mesoCurrentWeek: 3,
            mesoTotalWeeks: 6,
            workoutChips: ['Full Body', 'Handstand', 'Tara Warmup', 'Free'],
            plannedExercises: [
                { name: 'Squat', sub: 'Legs · Tomorrow', badge: 'Primary' },
                { name: 'Shoulder Press', sub: 'Shoulders · Sunday', badge: 'Skill' },
            ],
            neglectedGoals: [
                'Have good ballet posture',
                'Build legs fit for dance',
            ],
            goalGroups: [
                {
                    label: 'Skill',
                    items: [
                        { name: 'Handstand', color: '#4f46e5' },
                        { name: 'Splits', color: '#4f46e5' },
                    ],
                },
                {
                    label: 'Mobility',
                    items: [
                        { name: 'Hamstring Stretch', color: '#10b981' },
                    ],
                },
                {
                    label: 'Progressive Overload',
                    items: [
                        { name: 'Lat Raises +2kg', color: '#f59e0b' },
                    ],
                },
            ],
            skills: [
                { name: 'Handstand', pct: 80 },
                { name: 'Ballet Posture', pct: 65 },
                { name: 'Splits', pct: 40 },
            ],
            exercises: [
                { name: 'Dips', muscle: 'Triceps' },
                { name: 'Squats', muscle: 'Quads' },
                { name: 'Pull Ups', muscle: 'Back' },
                { name: 'Lat Raises', muscle: 'Shoulders' },
            ],
            muscles: [
                { name: 'Quads · Fresh', cls: 'wdl-badge-green' },
                { name: 'Back · Fatigued', cls: 'wdl-badge-yellow' },
                { name: 'Chest · Neglected', cls: 'wdl-badge-red' },
                { name: 'Shoulders · Fresh', cls: 'wdl-badge-green' },
            ],
        };
    },
    computed: {
        mesoProgress() {
            return (this.mesoCurrentWeek / this.mesoTotalWeeks) * 100;
        },
        elapsedFormatted() {
            const mins = Math.floor(this.elapsedSeconds / 60);
            const secs = this.elapsedSeconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },
    },
    mounted() {
        this.elapsedTimer = setInterval(() => { this.elapsedSeconds++; }, 1000);
    },
    beforeUnmount() {
        clearInterval(this.elapsedTimer);
    },
    methods: {
        resumeWorkout() {},
        startWorkout() {},
    },
};
</script>

<style scoped>
/* ─── Root ─── */
.wdl {
    background: #fafafa;
    color: #111827;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* ─── Nav ─── */
.wdl-nav {
    background: #fff;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 16px;
    flex-shrink: 0;
}

.wdl-nav-spacer {
    width: 32px;
}

.wdl-nav-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
}

.wdl-profile-icon {
    background: #f3f4f6;
    border-radius: 16px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ─── Scroll ─── */
.wdl-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 28px;
}

.wdl-scroll::-webkit-scrollbar { display: none; }

/* ─── Sections ─── */
.wdl-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.wdl-section-last {
    padding-bottom: 20px;
}

.wdl-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
}

.wdl-section-title {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
}

.wdl-see-all {
    background: none;
    border: none;
    font-size: 13px;
    font-weight: 600;
    color: #4f46e5;
    cursor: pointer;
    padding: 0;
}

/* ─── Cards ─── */
.wdl-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    box-sizing: border-box;
}

/* ─── Active Workout ─── */
.wdl-active-card {
    background: #4f46e5;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    cursor: pointer;
}

.wdl-active-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.wdl-active-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.wdl-active-label {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.8);
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.wdl-active-name {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
}

.wdl-active-time {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
}

.wdl-timer-text {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
}

.wdl-resume-btn {
    background: #fff;
    border: none;
    border-radius: 100px;
    color: #4f46e5;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 16px;
    cursor: pointer;
    flex-shrink: 0;
}

/* ─── Start Workout ─── */
.wdl-suggestion-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.wdl-suggestion-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.wdl-suggestion-thumb {
    background: #f3f4f6;
    border-radius: 8px;
    width: 56px;
    height: 56px;
    flex-shrink: 0;
}

.wdl-suggestion-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.wdl-suggestion-name {
    font-size: 15px;
    font-weight: 600;
    color: #000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.wdl-suggestion-date {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
}

.wdl-start-btn {
    background: #4f46e5;
    border: none;
    border-radius: 100px;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 20px;
    cursor: pointer;
    flex-shrink: 0;
}

.wdl-chips-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.wdl-chip {
    background: #fff;
    border: 1px solid #f3f4f6;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 500;
    color: #111827;
    padding: 8px 12px;
}

/* ─── Mesocycle ─── */
.wdl-meso-card {
    gap: 12px;
}

.wdl-meso-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}

.wdl-meso-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.wdl-meso-name {
    font-size: 15px;
    font-weight: 600;
    color: #000;
}

.wdl-meso-sub {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
}

.wdl-meso-week {
    font-size: 13px;
    font-weight: 600;
    color: #4f46e5;
}

.wdl-progress-track {
    background: #f3f4f6;
    border-radius: 100px;
    height: 6px;
    overflow: hidden;
    width: 100%;
}

.wdl-progress-fill {
    background: #4f46e5;
    height: 100%;
    border-radius: 100px;
    transition: width 0.3s ease;
}

.wdl-week-dots {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.wdl-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.wdl-dot-filled { background: #4f46e5; }
.wdl-dot-empty  { background: #e5e7eb; }

/* ─── Avatar ─── */
.wdl-avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.wdl-avatar-container {
    position: relative;
    width: 100%;
    height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.wdl-avatar-img {
    height: 100%;
    width: 180px;
    object-fit: contain;
    pointer-events: none;
}

.wdl-heat-dot {
    position: absolute;
    border-radius: 50%;
}

.wdl-heat-sm {
    width: 12px;
    height: 12px;
    background: rgba(16, 185, 129, 0.7);
    box-shadow: 0 0 6px rgba(16, 185, 129, 0.5);
}

.wdl-heat-lg {
    width: 20px;
    height: 20px;
    background: rgba(239, 68, 68, 0.7);
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.wdl-stats-row {
    display: flex;
    gap: 12px;
    width: 100%;
}

.wdl-stat-card {
    background: #fff;
    border-radius: 8px;
    padding: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.wdl-stat-val {
    font-size: 13px;
    font-weight: 600;
}

.wdl-stat-green { color: #10b981; }
.wdl-stat-dark  { color: #111827; }

.wdl-stat-label {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
}

/* ─── Planning ─── */
.wdl-sub-label {
    font-size: 12px;
    font-weight: 500;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.wdl-sub-red { color: #ef4444; }

.wdl-planned-card {
    gap: 12px;
}

.wdl-plan-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.wdl-plan-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.wdl-plan-name {
    font-size: 15px;
    font-weight: 600;
    color: #000;
}

.wdl-plan-sub {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
}

.wdl-neglected-card {
    background: #fef2f2;
    gap: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.wdl-neglect-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.wdl-neglect-text {
    font-size: 14px;
    font-weight: 500;
    color: #ef4444;
}

/* ─── Badges ─── */
.wdl-badge {
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    display: inline-flex;
    align-items: center;
}

.wdl-badge-indigo {
    background: #eef2ff;
    color: #4f46e5;
}

.wdl-badge-gray {
    background: #f3f4f6;
    color: #6b7280;
}

.wdl-badge-green  { background: #ecfdf5; color: #10b981; }
.wdl-badge-yellow { background: #fffbeb; color: #f59e0b; }
.wdl-badge-red    { background: #fef2f2; color: #ef4444; }

/* ─── Goals ─── */
.wdl-goals-groups {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.wdl-goal-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.wdl-goal-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.wdl-goal-chip {
    background: #fff;
    border: 1px solid #f3f4f6;
    border-radius: 8px;
    padding: 6px 10px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.wdl-goal-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
}

.wdl-goal-name {
    font-size: 14px;
    font-weight: 500;
    color: #000;
}

/* ─── Skills ─── */
.wdl-skill-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.wdl-skill-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.wdl-skill-name {
    font-size: 13px;
    font-weight: 600;
    color: #000;
}

.wdl-skill-pct {
    font-size: 12px;
    font-weight: 500;
    color: #4f46e5;
}

/* ─── Exercises ─── */
.wdl-ex-scroll {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
}

.wdl-ex-scroll::-webkit-scrollbar { display: none; }

.wdl-ex-card {
    background: #fff;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    width: 140px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.wdl-ex-thumb {
    background: #f3f4f6;
    border-radius: 8px;
    height: 80px;
    width: 100%;
}

.wdl-ex-name {
    font-size: 13px;
    font-weight: 600;
    color: #000;
}

/* ─── Muscles ─── */
.wdl-muscle-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

/* ─── Spacer ─── */
.wdl-spacer {
    height: 20px;
    flex-shrink: 0;
}

/* ─── Footer ─── */
.wdl-footer {
    background: #fff;
    border-top: 1px solid #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 80px;
    padding-bottom: 20px;
    flex-shrink: 0;
}

.wdl-nav-tab {
    background: none;
    border: none;
    color: #9ca3af;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    height: 100%;
}

.wdl-nav-active {
    color: #4f46e5;
}
</style>
