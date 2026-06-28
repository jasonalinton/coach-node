<template>
    <div class="we3">

        <!-- ===== MAIN SCROLL CONTENT ===== -->
        <div class="we3-main">

            <!-- Exercise name + info button -->
            <div class="we3-name-row">
                <button class="we3-icon-btn we3-back-btn" @click="back">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h1 class="we3-exercise-name">{{ name }}</h1>
                <button class="we3-icon-btn" @click="showInfo = true">
                    <i class="fa-regular fa-circle-question"></i>
                </button>
            </div>

            <!-- Demo image -->
            <div class="we3-demo-wrap position-relative mx-3 mb-3">
                <div class="we3-demo-img">
                    <img v-if="exercise && exercise.imageUrl" :src="exercise.imageUrl"
                         class="w-100 h-100" style="object-fit:cover" alt="" />
                    <div v-else class="we3-demo-placeholder"></div>
                </div>
                <button class="we3-info-badge" @click="showInfo = true">
                    <i class="fa-solid fa-circle-info me-1" style="font-size:10px"></i>Info
                </button>
            </div>

            <!-- Toolbar (inline pills) -->
            <div class="we3-toolbar-pills">
                <button class="we3-pill" @click="openHistory">
                    <i class="fa-solid fa-clock-rotate-left we3-pill-icon"></i>History
                </button>
                <button class="we3-pill" @click="startRest">
                    <i class="fa-solid fa-hourglass-half we3-pill-icon"></i>Rest
                </button>
                <button class="we3-pill">
                    <i class="fa-solid fa-right-left we3-pill-icon"></i>Replace
                </button>
                <button class="we3-pill">
                    <i class="fa-regular fa-note-sticky we3-pill-icon"></i>Notes
                </button>
                <button class="we3-pill">
                    <i class="fa-solid fa-weight-scale we3-pill-icon"></i>Units
                </button>
                <button class="we3-pill" @click="openSettings">
                    <i class="fa-solid fa-ellipsis we3-pill-icon"></i>More
                </button>
            </div>

            <!-- Tempo display -->
            <div v-if="tempoDisplay" class="we3-tempo-bar">
                <div class="we3-tempo-sep"></div>
                <div class="we3-tempo-content">
                    <div class="we3-tempo-left">
                        <!-- Label row -->
                        <div class="we3-tempo-label-row">
                            <i class="fa-solid fa-music we3-tempo-icon-sm"></i>
                            <span class="we3-tempo-label">TEMPO</span>
                            <span class="we3-tempo-type-badge">{{ tempoTypeName }}</span>
                        </div>
                        <!-- Phase values -->
                        <div class="we3-tempo-values">
                            <template v-for="(val, i) in tempoPhases" :key="i">
                                <span class="we3-tempo-val"
                                      :class="{ 'we3-tempo-val-active': isTempoPlaying && tempoPhase === i }">
                                    {{ isTempoPlaying && tempoPhase === i ? tempoPhaseRemaining : val }}
                                </span>
                                <span v-if="i < tempoPhases.length - 1" class="we3-tempo-sep-char"> - </span>
                            </template>
                            <span v-if="!tempoPhases.length" class="we3-tempo-val">{{ tempoDisplay }}</span>
                        </div>
                        <!-- Phase labels -->
                        <div v-if="tempoPhaseLabels.length" class="we3-tempo-phase-labels">
                            <span v-for="(lbl, i) in tempoPhaseLabels" :key="i"
                                  :class="{ 'we3-phase-lbl-active': isTempoPlaying && tempoPhase === i }">
                                {{ lbl }}
                            </span>
                        </div>
                    </div>
                    <button class="we3-tempo-play-circle" @click="toggleTempo">
                        <i class="fa-solid" :class="isTempoPlaying ? 'fa-stop' : 'fa-play'"></i>
                    </button>
                </div>
                <div class="we3-tempo-sep"></div>
            </div>

            <!-- Sets table -->
            <div class="we3-sets-section">
                <!-- Header row -->
                <div class="we3-sets-header d-flex align-items-center">
                    <span class="we3-col-set">Set</span>
                    <span class="we3-col-prev">Previous</span>
                    <span class="we3-col-unit text-center">{{ unit }}</span>
                    <span class="we3-col-reps text-center">Reps</span>
                    <span class="we3-col-check text-center">✓</span>
                </div>

                <!-- Set rows -->
                <div v-for="(set, index) in sets" :key="set.id"
                     class="we3-set-row d-flex align-items-center"
                     :class="setRowClass(set)"
                     @click="setActive(set.id)">
                    <span class="we3-col-set we3-set-num" :class="setNumClass(set)">{{ index + 1 }}</span>
                    <span class="we3-col-prev we3-prev-text">{{ previousText(index) }}</span>
                    <div class="we3-col-unit d-flex justify-content-center">
                        <div class="we3-input-wrap">
                            <input class="we3-set-input" type="number" min="0"
                                   v-model="set.weight"
                                   :class="{ 'we3-input-dim': !isActive(set) && !isComplete(set) }"
                                   @blur="saveSet(set)"
                                   @click.stop />
                        </div>
                    </div>
                    <div class="we3-col-reps d-flex justify-content-center">
                        <div class="we3-input-wrap">
                            <input class="we3-set-input" type="number" min="0"
                                   v-model="set.reps"
                                   :class="{ 'we3-input-dim': !isActive(set) && !isComplete(set) }"
                                   @blur="saveSet(set)"
                                   @click.stop />
                        </div>
                    </div>
                    <div class="we3-col-check d-flex justify-content-center align-items-center">
                        <i v-if="isComplete(set)" class="fa-solid fa-circle-check we3-check-icon"></i>
                        <button v-else-if="isActive(set)" class="we3-log-btn" @click.stop="logSet">LOG</button>
                        <div v-else class="we3-check-empty"></div>
                    </div>
                </div>

                <!-- Log All Sets -->
                <div class="px-3 pt-4 pb-3">
                    <button class="we3-log-all-btn" @click="logAllSets">Log All Sets</button>
                </div>
            </div>
        </div>

        <!-- Rest timer -->
        <div v-if="restRemaining" class="we3-rest-bar mx-3 mb-2">
            <div class="d-flex align-items-center gap-3">
                <div class="we3-rest-ring-wrap position-relative flex-shrink-0">
                    <svg width="44" height="44" viewBox="0 0 44 44">
                        <circle cx="22" cy="22" r="19" fill="none" stroke="#2c2c2e" stroke-width="3"/>
                        <circle cx="22" cy="22" r="19" fill="none" stroke="#00e5ff" stroke-width="3"
                                :stroke-dasharray="restCircumference"
                                :stroke-dashoffset="restDashoffset"
                                stroke-linecap="round"
                                transform="rotate(-90 22 22)"/>
                    </svg>
                    <div class="we3-rest-ring-center position-absolute top-50 start-50 translate-middle">
                        <i class="fa-regular fa-clock" style="font-size:12px;color:#00e5ff"></i>
                    </div>
                </div>
                <div class="flex-grow-1">
                    <span class="we3-rest-time">{{ restFormatted }}</span>
                    <span class="we3-rest-label ms-2">Resting</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button class="we3-rest-adj" @click="adjustRest(-15)">-15s</button>
                    <button class="we3-skip-btn" @click="resetRest">SKIP</button>
                </div>
            </div>
        </div>

        <!-- Home indicator -->
        <div class="d-flex justify-content-center pb-2 pt-1">
            <div class="we3-home-bar"></div>
        </div>


        <!-- ===== INFO PANEL OVERLAY ===== -->
        <transition name="we3-slide">
            <div v-if="showInfo" class="we3-overlay we3-info-overlay">
                <div class="we3-info-panel d-flex flex-column">

                    <!-- Toolbar placeholder (same as main) -->
                    <div class="we3-info-toolbar d-flex justify-content-between px-3 py-2">
                        <div class="we3-tool-icon sm"><i class="fa-solid fa-clock-rotate-left"></i></div>
                        <div class="we3-tool-icon sm"><i class="fa-regular fa-clock"></i></div>
                        <div class="we3-tool-icon sm"><i class="fa-solid fa-right-left"></i></div>
                        <div class="we3-tool-icon sm"><i class="fa-regular fa-note-sticky"></i></div>
                        <div class="we3-tool-icon sm"><i class="fa-solid fa-weight-scale"></i></div>
                        <div class="we3-tool-icon sm"><i class="fa-solid fa-ellipsis"></i></div>
                    </div>

                    <!-- Info header -->
                    <div class="d-flex align-items-center justify-content-between px-3 py-2">
                        <div class="d-flex align-items-center gap-2">
                            <button class="we3-icon-btn" @click="showInfo = false">
                                <i class="fa-solid fa-arrow-left"></i>
                            </button>
                            <span class="we3-info-label">INFO</span>
                        </div>
                        <button class="we3-icon-btn" @click="showInfo = false">
                            <i class="fa-regular fa-circle-xmark"></i>
                        </button>
                    </div>
                    <h2 class="we3-info-title px-3 mb-3">{{ name }}</h2>

                    <!-- Scrollable content -->
                    <div class="we3-info-scroll px-3 pb-5">

                        <!-- Media card -->
                        <div class="we3-media-card mb-2 position-relative">
                            <img v-if="exercise && exercise.imageUrl" :src="exercise.imageUrl"
                                 class="we3-media-img" alt="" />
                            <div v-else class="we3-media-placeholder"></div>
                            <div class="we3-play-overlay d-flex align-items-center justify-content-center">
                                <i class="fa-regular fa-circle-play we3-play-icon"></i>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <span class="we3-source-text">Source: <span class="we3-source-val">Auto-selected</span></span>
                            <button class="we3-find-alt-btn">
                                <i class="fa-solid fa-rotate me-1" style="font-size:11px"></i>Find alternatives
                            </button>
                        </div>

                        <!-- Target Muscles -->
                        <div class="we3-section-label mb-2">TARGET MUSCLES</div>
                        <div class="we3-muscles-card mb-4">
                            <div class="we3-muscles-diagram mb-3"></div>
                            <div class="mb-3">
                                <div class="we3-group-label mb-2">PRIMARY</div>
                                <div class="d-flex flex-wrap gap-2">
                                    <span class="we3-muscle-primary">Quadriceps</span>
                                    <span class="we3-muscle-primary">Glutes</span>
                                </div>
                            </div>
                            <div>
                                <div class="we3-group-label mb-2">SECONDARY</div>
                                <div class="d-flex flex-wrap gap-2">
                                    <span class="we3-muscle-secondary">Hamstrings</span>
                                    <span class="we3-muscle-secondary">Erector Spinae</span>
                                    <span class="we3-muscle-secondary">Core</span>
                                </div>
                            </div>
                        </div>

                        <!-- Equipment -->
                        <div class="we3-section-label mb-2">EQUIPMENT</div>
                        <div class="mb-4">
                            <div class="d-flex flex-wrap gap-2 mb-2">
                                <div class="we3-equip-tag">
                                    <i class="fa-solid fa-dumbbell me-2" style="font-size:12px"></i>Barbell
                                </div>
                                <div class="we3-equip-tag">
                                    <i class="fa-solid fa-table-cells me-2" style="font-size:12px"></i>Squat Rack
                                </div>
                                <div class="we3-equip-tag">
                                    <i class="fa-regular fa-circle me-2" style="font-size:12px"></i>Weight Plates
                                </div>
                            </div>
                            <p class="we3-equip-note">
                                Used in workout planning — only exercises matching your available equipment will be suggested.
                            </p>
                        </div>

                        <!-- Instruction -->
                        <div class="we3-section-label mb-2">INSTRUCTION</div>
                        <p class="we3-instruction mb-3">
                            A compound lower-body movement targeting the quadriceps, glutes, and hamstrings.
                            Stand with feet shoulder-width apart, bar resting on upper traps. Descend until
                            thighs are parallel to the floor, keeping chest up and knees tracking over toes.
                            Drive through the heels to return to standing.
                        </p>
                        <div class="we3-group-label mb-2">FORM CUES</div>
                        <div class="d-flex flex-wrap gap-2">
                            <span class="we3-cue-tag">• Chest up</span>
                            <span class="we3-cue-tag">• Knees over toes</span>
                            <span class="we3-cue-tag">• Heels grounded</span>
                            <span class="we3-cue-tag">• Bar over mid-foot</span>
                        </div>
                    </div>

                    <!-- Got it -->
                    <div class="we3-got-it-wrap">
                        <button class="we3-got-it-btn" @click="showInfo = false">Got it</button>
                    </div>
                </div>
            </div>
        </transition>


        <!-- ===== HISTORY BOTTOM SHEET ===== -->
        <transition name="we3-sheet">
            <div v-if="showHistorySheet" class="we3-backdrop" @click.self="showHistorySheet = false">
                <div class="we3-sheet we3-history-sheet">
                    <div class="we3-handle mx-auto mb-4"></div>

                    <div class="d-flex align-items-center justify-content-between mb-4">
                        <h3 class="we3-sheet-title mb-0">{{ name }} History</h3>
                        <button class="we3-icon-btn" @click="showHistorySheet = false">
                            <i class="fa-regular fa-square-xmark"></i>
                        </button>
                    </div>

                    <!-- Tabs -->
                    <div class="we3-seg-control mb-4">
                        <button v-for="tab in historyTabs" :key="tab"
                                class="we3-seg-btn" :class="{ active: historyTab === tab }"
                                @click="historyTab = tab">{{ tab }}</button>
                    </div>

                    <!-- Chart -->
                    <div class="we3-chart-card mb-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="we3-chart-label">{{ historyTab.toUpperCase() }} PROGRESSION</span>
                            <span class="we3-chart-delta">+15% 30d</span>
                        </div>
                        <div class="we3-chart-area">
                            <svg width="100%" height="120" viewBox="0 0 314 120" preserveAspectRatio="none">
                                <polyline points="10,108 60,92 110,75 145,83 185,62 225,44 268,28 305,12"
                                          fill="none" stroke="#00e5ff" stroke-width="2" stroke-linejoin="round"
                                          stroke-linecap="round"/>
                                <circle cx="10" cy="108" r="4" fill="#00e5ff"/>
                                <circle cx="60" cy="92" r="4" fill="#0d0d0d" stroke="#00e5ff" stroke-width="2"/>
                                <circle cx="110" cy="75" r="4" fill="#0d0d0d" stroke="#00e5ff" stroke-width="2"/>
                                <circle cx="145" cy="83" r="4" fill="#0d0d0d" stroke="#00e5ff" stroke-width="2"/>
                                <circle cx="185" cy="62" r="4" fill="#0d0d0d" stroke="#00e5ff" stroke-width="2"/>
                                <circle cx="225" cy="44" r="4" fill="#0d0d0d" stroke="#00e5ff" stroke-width="2"/>
                                <circle cx="268" cy="28" r="4" fill="#0d0d0d" stroke="#00e5ff" stroke-width="2"/>
                                <circle cx="305" cy="12" r="4" fill="#00e5ff"/>
                            </svg>
                        </div>
                    </div>

                    <!-- Session logs -->
                    <div class="we3-history-label mb-2">SESSION LOGS</div>
                    <div v-if="history && history.length">
                        <div v-for="(day, i) in history" :key="i"
                             class="we3-session-row d-flex align-items-center justify-content-between">
                            <div>
                                <div class="we3-session-date">{{ dateString(day.date) }}</div>
                                <div class="we3-session-summary">{{ sessionSummary(day) }}</div>
                            </div>
                            <i class="fa-solid fa-chevron-right we3-session-arrow"></i>
                        </div>
                    </div>
                    <p v-else class="we3-empty-state">No history yet.</p>
                </div>
            </div>
        </transition>


        <!-- ===== SETTINGS BOTTOM SHEET ===== -->
        <transition name="we3-sheet">
            <div v-if="showSettings" class="we3-backdrop" @click.self="cancelSettings">
                <div class="we3-sheet">
                    <div class="we3-handle mx-auto mb-4"></div>

                    <div class="d-flex align-items-center justify-content-between mb-4">
                        <h3 class="we3-sheet-title mb-0">Exercise Settings</h3>
                        <button class="we3-tempo-play" @click="toggleTempo" :class="{ playing: isTempoPlaying }">
                            <i class="fa-solid" :class="isTempoPlaying ? 'fa-circle-stop' : 'fa-circle-play'"
                               style="font-size:14px;color:#0d0d0d"></i>
                        </button>
                    </div>

                    <!-- Tempo section -->
                    <div class="mb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <span class="we3-setting-lbl">Tempo</span>
                        </div>
                        <div class="we3-seg-control mb-3">
                            <button class="we3-seg-btn" :class="{ active: tempoType === TEMPTYPES.FOURDIGIT }"
                                    @click="tempoType = TEMPTYPES.FOURDIGIT">4-Digit</button>
                            <button class="we3-seg-btn" :class="{ active: tempoType === TEMPTYPES.CONTRACTRELAX }"
                                    @click="tempoType = TEMPTYPES.CONTRACTRELAX">Contract-Relax</button>
                            <button class="we3-seg-btn" :class="{ active: tempoType === TEMPTYPES.BPM }"
                                    @click="tempoType = TEMPTYPES.BPM">BPM</button>
                        </div>

                        <!-- 4-Digit steppers -->
                        <div v-if="tempoType === TEMPTYPES.FOURDIGIT">
                            <div class="row g-3 mb-3">
                                <div class="col-6">
                                    <div class="we3-stepper-field">
                                        <div class="we3-stepper-lbl">ECCENTRIC</div>
                                        <div class="we3-stepper">
                                            <button @click="localTempo.eccentric = Math.max(0, localTempo.eccentric - 1)">
                                                <i class="fa-solid fa-minus"></i>
                                            </button>
                                            <span>{{ localTempo.eccentric }}</span>
                                            <button @click="localTempo.eccentric++">
                                                <i class="fa-solid fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="we3-stepper-field">
                                        <div class="we3-stepper-lbl">BOTTOM ISO</div>
                                        <div class="we3-stepper">
                                            <button @click="localTempo.bottomIso = Math.max(0, localTempo.bottomIso - 1)">
                                                <i class="fa-solid fa-minus"></i>
                                            </button>
                                            <span>{{ localTempo.bottomIso }}</span>
                                            <button @click="localTempo.bottomIso++">
                                                <i class="fa-solid fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-3">
                                <div class="col-6">
                                    <div class="we3-stepper-field">
                                        <div class="we3-stepper-lbl">CONCENTRIC</div>
                                        <div class="we3-stepper">
                                            <button @click="localTempo.concentric = Math.max(0, localTempo.concentric - 1)">
                                                <i class="fa-solid fa-minus"></i>
                                            </button>
                                            <span>{{ localTempo.concentric }}</span>
                                            <button @click="localTempo.concentric++">
                                                <i class="fa-solid fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="we3-stepper-field">
                                        <div class="we3-stepper-lbl">TOP ISO</div>
                                        <div class="we3-stepper">
                                            <button @click="localTempo.topIso = Math.max(0, localTempo.topIso - 1)">
                                                <i class="fa-solid fa-minus"></i>
                                            </button>
                                            <span>{{ localTempo.topIso }}</span>
                                            <button @click="localTempo.topIso++">
                                                <i class="fa-solid fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Contract-Relax steppers -->
                        <div v-else-if="tempoType === TEMPTYPES.CONTRACTRELAX" class="row g-3">
                            <div class="col-6">
                                <div class="we3-stepper-field">
                                    <div class="we3-stepper-lbl">CONTRACT</div>
                                    <div class="we3-stepper">
                                        <button @click="localTempoCR.contract = Math.max(0, localTempoCR.contract - 1)">
                                            <i class="fa-solid fa-minus"></i>
                                        </button>
                                        <span>{{ localTempoCR.contract }}</span>
                                        <button @click="localTempoCR.contract++">
                                            <i class="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="we3-stepper-field">
                                    <div class="we3-stepper-lbl">RELAX</div>
                                    <div class="we3-stepper">
                                        <button @click="localTempoCR.relax = Math.max(0, localTempoCR.relax - 1)">
                                            <i class="fa-solid fa-minus"></i>
                                        </button>
                                        <span>{{ localTempoCR.relax }}</span>
                                        <button @click="localTempoCR.relax++">
                                            <i class="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- BPM stepper -->
                        <div v-else-if="tempoType === TEMPTYPES.BPM">
                            <div class="we3-stepper-field">
                                <div class="we3-stepper-lbl">BPM</div>
                                <div class="we3-stepper">
                                    <button @click="localTempoBPM = Math.max(0, localTempoBPM - 5)">
                                        <i class="fa-solid fa-minus"></i>
                                    </button>
                                    <span>{{ localTempoBPM }}</span>
                                    <button @click="localTempoBPM += 5">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="we3-divider my-4"></div>

                    <!-- Rest Time -->
                    <div class="mb-4">
                        <div class="we3-setting-lbl mb-3">Rest Time</div>
                        <div class="we3-stepper-field">
                            <div class="we3-stepper-lbl">SECONDS</div>
                            <div class="we3-stepper">
                                <button @click="localRest = Math.max(0, (localRest || 0) - 15)">
                                    <i class="fa-solid fa-minus"></i>
                                </button>
                                <span>{{ localRest || 0 }}<small class="we3-unit-label">s</small></span>
                                <button @click="localRest = (localRest || 0) + 15">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="we3-divider mb-4"></div>

                    <!-- Circuit Position -->
                    <div class="d-flex align-items-center justify-content-between mb-5">
                        <span class="we3-setting-lbl">Circuit Position</span>
                        <div class="we3-circuit-badge">{{ circuitPosition }}</div>
                    </div>

                    <!-- Cancel / Done -->
                    <div class="d-flex gap-3 pt-2">
                        <button class="we3-cancel-btn flex-grow-1" @click="cancelSettings">Cancel</button>
                        <button class="we3-done-btn flex-grow-1" @click="saveSettings">Done</button>
                    </div>
                </div>
            </div>
        </transition>

    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { clone } from '../../../../../utility';
import { getMonthDateYearShort } from '../../../../../utility/timeUtility';

export default {
    name: 'WorkoutExercise3',
    data() {
        return {
            appStore: undefined,
            workoutStore: undefined,
            activeSetID: undefined,
            restRemaining: undefined,
            restTotal: undefined,
            restIntervalID: undefined,
            showInfo: false,
            showSettings: false,
            showHistorySheet: false,
            unit: 'kg',
            historyTab: 'Weight',
            historyTabs: ['Reps', 'Weight', 'Time', 'Volume'],
            TEMPTYPES: { FOURDIGIT: 1, CONTRACTRELAX: 2, BPM: 3 },
            tempoType: undefined,
            localTempo: { eccentric: 1, bottomIso: 1, concentric: 1, topIso: 1 },
            localTempoCR: { contract: 1, relax: 1 },
            localTempoBPM: 120,
            localRest: undefined,
            localCircuit: undefined,
            localPosition: undefined,
            isTempoPlaying: false,
            tempoPhase: 0,
            tempoPhaseRemaining: 0,
            tempoIntervalID: undefined,
            loopsTotal: 1,
            loopsRemaining: 1,
        };
    },
    created() {
        this.appStore = useAppStore();
        this.workoutStore = useWorkoutStore();
    },
    mounted() {
        if (this.workoutExercise) {
            this.initLocalSettings();
        }
    },
    beforeUnmount() {
        this.stopTempo();
        this.resetRest();
    },
    computed: {
        id() {
            return this.appStore?.itemPanel.workout.selectedExerciseID;
        },
        idWorkout() {
            return this.appStore?.itemPanel.workout.selectedWorkoutID;
        },
        workoutExercise() {
            if (this.workoutStore && this.id) {
                return this.workoutStore.getWorkoutExercise(this.id, this.idWorkout);
            }
            return undefined;
        },
        exercise() {
            if (this.workoutExercise) {
                return {
                    ...this.workoutExercise,
                    ...this.workoutStore.getExercise(this.workoutExercise.idExercise),
                };
            }
            return undefined;
        },
        name() {
            return this.exercise?.name ?? 'Loading...';
        },
        sets() {
            if (this.workoutExercise) {
                return this.workoutExercise.sets.map(set => ({
                    idWorkoutSectionExercise: this.workoutExercise.idWorkoutExercise,
                    ...set,
                }));
            }
            return [];
        },
        history() {
            if (this.exercise?.id) {
                return this.workoutStore.getExerciseHistory(this.exercise.id, []) || [];
            }
            return [];
        },
        circuitPosition() {
            const c = this.localCircuit;
            const p = this.localPosition || 1;
            const letter = typeof c === 'number' && c > 0
                ? String.fromCharCode(64 + c)
                : (c ? String(c).toUpperCase() : 'A');
            return `${letter}${p}`;
        },
        restFormatted() {
            if (!this.restRemaining) return '0:00';
            const mins = Math.floor(this.restRemaining / 60);
            const secs = this.restRemaining % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },
        restCircumference() {
            return 2 * Math.PI * 19;
        },
        restDashoffset() {
            if (!this.restTotal || !this.restRemaining) return 0;
            return this.restCircumference * (1 - this.restRemaining / this.restTotal);
        },
        tempoPhases() {
            if (!this.tempoType) return [];
            if (this.tempoType === this.TEMPTYPES.FOURDIGIT) {
                return [
                    Number(this.localTempo.eccentric) || 0,
                    Number(this.localTempo.bottomIso) || 0,
                    Number(this.localTempo.concentric) || 0,
                    Number(this.localTempo.topIso) || 0,
                ];
            }
            if (this.tempoType === this.TEMPTYPES.CONTRACTRELAX) {
                return [Number(this.localTempoCR.contract) || 0, Number(this.localTempoCR.relax) || 0];
            }
            return [];
        },
        tempoTypeName() {
            if (this.tempoType === this.TEMPTYPES.FOURDIGIT) return '4-Digit';
            if (this.tempoType === this.TEMPTYPES.CONTRACTRELAX) return 'Contract-Relax';
            if (this.tempoType === this.TEMPTYPES.BPM) return 'BPM';
            return '';
        },
        tempoPhaseLabels() {
            if (this.tempoType === this.TEMPTYPES.FOURDIGIT) return ['Ecc', 'Bot', 'Con', 'Top'];
            if (this.tempoType === this.TEMPTYPES.CONTRACTRELAX) return ['Con', 'Rel'];
            return [];
        },
        tempoDisplay() {
            if (!this.tempoType) return null;
            if (this.tempoType === this.TEMPTYPES.FOURDIGIT) {
                const t = this.localTempo;
                return `${t.eccentric} - ${t.bottomIso} - ${t.concentric} - ${t.topIso}`;
            }
            if (this.tempoType === this.TEMPTYPES.CONTRACTRELAX) {
                return `${this.localTempoCR.contract} - ${this.localTempoCR.relax}`;
            }
            if (this.tempoType === this.TEMPTYPES.BPM) {
                return `${this.localTempoBPM} BPM`;
            }
            return null;
        },
    },
    watch: {
        workoutExercise(val) {
            if (val && this.localCircuit === undefined) {
                this.initLocalSettings();
            }
        },
        restRemaining(val) {
            if (val != null && val === 0) {
                this.resetRest();
            }
        },
        sets(val) {
            if (val.length > 0) {
                this.autoSetActive();
            }
        },
    },
    methods: {
        back() {
            this.appStore.onBackWorkoutPanel();
        },
        isActive(set) { return set.id === this.activeSetID; },
        isComplete(set) { return !!set.iteration; },
        setRowClass(set) {
            return {
                'we3-row-active': this.isActive(set),
                'we3-row-complete': this.isComplete(set),
                'we3-row-pending': !this.isActive(set) && !this.isComplete(set),
            };
        },
        setNumClass(set) {
            if (this.isActive(set)) return 'color-accent';
            if (this.isComplete(set)) return 'color-white';
            return 'color-muted';
        },
        previousText(index) {
            const day = this.history?.[0];
            if (day?.sets?.[index]) {
                const s = day.sets[index];
                const parts = [];
                if (s.weight) parts.push(`${s.weight}kg`);
                if (s.reps) parts.push(`x ${s.reps}`);
                return parts.join(' ') || '—';
            }
            return '—';
        },
        setActive(id) {
            this.activeSetID = id;
        },
        autoSetActive() {
            if (this.activeSetID) return;
            let nextID;
            this.sets.forEach(set => {
                if (!set.iteration && !nextID) nextID = set.id;
            });
            this.activeSetID = nextID;
            if (this.activeSetID) this.checkRestOnLoad();
        },
        checkRestOnLoad() {
            if (!this.localRest) return;
            const idx = this.sets.findIndex(s => s.id === this.activeSetID);
            if (idx <= 0) return;
            const prev = this.sets[idx - 1];
            if (prev?.iteration?.completedAt) {
                const elapsed = (new Date() - new Date(prev.iteration.completedAt)) / 1000;
                const remaining = Number(this.localRest) - parseInt(elapsed);
                if (remaining > 0) {
                    this.restTotal = Number(this.localRest);
                    this.restRemaining = remaining;
                    const _this = this;
                    this.restIntervalID = setInterval(() => { _this.restRemaining--; }, 1000);
                }
            }
        },
        openHistory() {
            this.showHistorySheet = true;
        },
        openSettings() {
            this.showSettings = true;
        },
        startRest() {
            if (!this.localRest) return;
            this.resetRest();
            this.restTotal = Number(this.localRest);
            this.restRemaining = Number(this.localRest);
            const _this = this;
            this.restIntervalID = setInterval(() => { _this.restRemaining--; }, 1000);
        },
        adjustRest(delta) {
            const next = (this.restRemaining ?? 0) + delta;
            this.restRemaining = Math.max(0, next);
            if (this.restTotal !== undefined) {
                this.restTotal = Math.max(this.restTotal, this.restRemaining);
            }
        },
        resetRest() {
            clearInterval(this.restIntervalID);
            this.restIntervalID = undefined;
            this.restRemaining = undefined;
            this.restTotal = undefined;
        },
        logSet() {
            const set = this.sets.find(s => s.id === this.activeSetID);
            if (!set) return;
            const completedAt = set.iteration ? undefined : new Date();

            if (this.localRest) {
                const setIndex = this.sets.findIndex(s => s.id === this.activeSetID);
                if (setIndex < this.sets.length - 1) {
                    this.resetRest();
                    this.restTotal = Number(this.localRest);
                    this.restRemaining = Number(this.localRest);
                    const _this = this;
                    this.restIntervalID = setInterval(() => { _this.restRemaining--; }, 1000);
                }
            }

            this.activeSetID = undefined;
            this.workoutStore.logSet(set.id, completedAt);
        },
        logAllSets() {
            if (!this.workoutExercise) return;
            this.activeSetID = undefined;
            this.workoutStore.logAllSets(this.workoutExercise.idWorkoutExercise);
        },
        saveSet(set) {
            this.workoutStore.saveSet(set);
        },
        initLocalSettings() {
            const we = this.workoutExercise;
            this.localCircuit = we.circuit;
            this.localPosition = we.position;
            this.localRest = we.restSeconds;
            if (we.tempo_CR) {
                this.tempoType = this.TEMPTYPES.CONTRACTRELAX;
                const parts = we.tempo_CR.split('-').map(Number);
                this.localTempoCR = { contract: parts[0], relax: parts[1] };
            } else if (we.tempo_bpm) {
                this.tempoType = this.TEMPTYPES.BPM;
                this.localTempoBPM = we.tempo_bpm;
            } else {
                this.tempoType = this.TEMPTYPES.FOURDIGIT;
                if (we.tempo_4DigitCode) {
                    const parts = we.tempo_4DigitCode.split('-').map(Number);
                    this.localTempo = { eccentric: parts[0], bottomIso: parts[1], concentric: parts[2], topIso: parts[3] };
                } else {
                    this.localTempo = { eccentric: 1, bottomIso: 1, concentric: 1, topIso: 1 };
                }
            }
        },
        cancelSettings() {
            if (this.workoutExercise) this.initLocalSettings();
            this.stopTempo();
            this.showSettings = false;
        },
        saveSettings() {
            let tempo4 = null, tempoCR = null, tempoBPM = null;
            if (this.tempoType === this.TEMPTYPES.FOURDIGIT) {
                tempo4 = `${this.localTempo.eccentric}-${this.localTempo.bottomIso}-${this.localTempo.concentric}-${this.localTempo.topIso}`;
            } else if (this.tempoType === this.TEMPTYPES.CONTRACTRELAX) {
                tempoCR = `${this.localTempoCR.contract}-${this.localTempoCR.relax}`;
            } else if (this.tempoType === this.TEMPTYPES.BPM) {
                tempoBPM = this.localTempoBPM;
            }
            this.workoutStore.saveWorkoutExercise(
                this.id, this.localCircuit, this.localPosition,
                tempo4, tempoCR, tempoBPM, this.localRest,
            );
            this.stopTempo();
            this.showSettings = false;
        },
        toggleTempo() {
            if (this.isTempoPlaying) {
                this.stopTempo();
            } else {
                this.startTempo();
            }
        },
        startTempo() {
            if (!this.tempoPhases.length) return;
            const activeSet = this.sets.find(s => s.id === this.activeSetID);
            const reps = (activeSet?.reps && Number(activeSet.reps) > 0) ? Number(activeSet.reps) : 1;
            this.loopsTotal = reps;
            this.loopsRemaining = reps;
            this.tempoPhase = 0;
            this.tempoPhaseRemaining = this.tempoPhases[0];
            this.isTempoPlaying = true;
            const _this = this;
            this.tempoIntervalID = setInterval(() => {
                _this.tempoPhaseRemaining--;
                if (_this.tempoPhaseRemaining === 0) {
                    setTimeout(() => {
                        if (!_this.isTempoPlaying) return;
                        const nextPhase = _this.tempoPhase + 1;
                        if (nextPhase >= _this.tempoPhases.length) {
                            _this.loopsRemaining--;
                            if (_this.loopsRemaining <= 0) {
                                _this.stopTempo();
                                _this.logSet();
                            } else {
                                _this.tempoPhase = 0;
                                _this.tempoPhaseRemaining = _this.tempoPhases[0];
                            }
                        } else {
                            _this.tempoPhase = nextPhase;
                            _this.tempoPhaseRemaining = _this.tempoPhases[nextPhase];
                        }
                    }, 0);
                }
            }, 1000);
        },
        stopTempo() {
            clearInterval(this.tempoIntervalID);
            this.tempoIntervalID = undefined;
            this.isTempoPlaying = false;
            this.tempoPhase = 0;
            this.tempoPhaseRemaining = 0;
            this.loopsTotal = 1;
            this.loopsRemaining = 1;
        },
        dateString(date) {
            return getMonthDateYearShort(new Date(date));
        },
        sessionSummary(day) {
            const count = day.sets?.length || 0;
            const w = day.sets?.[0]?.weight;
            return w ? `${count} × ${w}kg` : `${count} sets`;
        },
    },
};
</script>

<style scoped>
/* ─── Root ─── */
.we3 {
    background: #0d0d0d;
    color: #fff;
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow: hidden;
    position: relative;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.we3-main {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
}

/* ─── Colors ─── */
.color-accent { color: #00e5ff; }
.color-white  { color: #fff; }
.color-muted  { color: #8e8e93; }

/* ─── Name row ─── */
.we3-name-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 12px;
}

.we3-exercise-name {
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin: 0;
    line-height: 1.1;
}

.we3-icon-btn {
    background: none;
    border: none;
    color: #8e8e93;
    font-size: 20px;
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.we3-back-btn {
    color: #fff;
    margin-right: 8px;
}

/* ─── Demo image ─── */
.we3-demo-img {
    height: 120px;
    border-radius: 10px;
    overflow: hidden;
}

.we3-demo-placeholder {
    height: 100%;
    background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
}

.we3-info-badge {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.55);
    border: none;
    border-radius: 13px;
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    padding: 4px 10px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
}

/* ─── Toolbar toggle ─── */
/* ─── Toolbar pills ─── */
.we3-toolbar-pills {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 20px 16px;
    scrollbar-width: none;
}

.we3-toolbar-pills::-webkit-scrollbar { display: none; }

.we3-pill {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #262626;
    border: none;
    border-radius: 999px;
    color: #fff;
    font-size: 13px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 500;
    padding: 10px 14px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s;
}

.we3-pill:hover { background: #303030; }

.we3-pill-icon {
    font-size: 13px;
    color: #fff;
}

/* ─── Tempo display bar ─── */
.we3-tempo-bar {
    display: flex;
    flex-direction: column;
}

.we3-tempo-sep {
    height: 1px;
    background: #29292e;
    width: 100%;
}

.we3-tempo-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #19191c;
    padding: 14px 20px;
    min-height: 72px;
    gap: 12px;
}

.we3-tempo-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
}

.we3-tempo-label-row {
    display: flex;
    align-items: center;
    gap: 5px;
}

.we3-tempo-icon-sm {
    font-size: 10px;
    color: #8e8e93;
}

.we3-tempo-label {
    font-size: 10px;
    font-weight: 700;
    color: #8e8e93;
    letter-spacing: 0.08em;
}

.we3-tempo-type-badge {
    background: #002125;
    border-radius: 4px;
    color: #00e5ff;
    font-size: 9px;
    font-weight: 700;
    padding: 2px 6px;
}

.we3-tempo-values {
    display: flex;
    align-items: baseline;
    white-space: nowrap;
}

.we3-tempo-val {
    font-size: 18px;
    font-weight: 800;
    color: #fff;
    min-width: 16px;
    transition: color 0.2s;
}

.we3-tempo-val-active {
    color: #00e5ff;
}

.we3-tempo-sep-char {
    font-size: 18px;
    font-weight: 800;
    color: #fff;
    padding: 0 1px;
}

.we3-tempo-phase-labels {
    display: flex;
    gap: 10px;
}

.we3-tempo-phase-labels span {
    font-size: 9px;
    font-weight: 500;
    color: #66666b;
    transition: color 0.2s;
}

.we3-phase-lbl-active {
    color: #00e5ff !important;
}

.we3-tempo-play-circle {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #00e5ff;
    border: none;
    color: #0d0d0d;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
    box-shadow: 0 0 16px rgba(0, 229, 255, 0.35);
}

.we3-tempo-play-circle:hover { background: #00cfee; }

/* kept for info panel toolbar */
.we3-tool-icon {
    background: none;
    border-radius: 0;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #8e8e93;
}

.we3-tool-label {
    font-size: 11px;
    color: #8e8e93;
    font-weight: 500;
}

/* ─── Sets table ─── */

.we3-sets-header {
    background: #262626;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 700;
    color: #8e8e93;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    gap: 12px;
}

.we3-col-set  { width: 40px; flex-shrink: 0; }
.we3-col-prev { flex: 1; min-width: 0; }
.we3-col-unit { width: 64px; flex-shrink: 0; }
.we3-col-reps { width: 64px; flex-shrink: 0; }
.we3-col-check{ width: 40px; flex-shrink: 0; }

/* ─── Set rows ─── */
.we3-set-row {
    padding: 12px 16px;
    gap: 12px;
    cursor: pointer;
    border-left: 4px solid transparent;
    transition: background 0.15s;
}

.we3-row-active {
    background: rgba(0, 229, 255, 0.08);
    border-left-color: #00e5ff;
}

.we3-set-num {
    font-size: 14px;
    font-weight: 700;
}

.we3-prev-text {
    font-size: 14px;
    color: #8e8e93;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* ─── Set inputs ─── */
.we3-input-wrap {
    background: #262626;
    border-radius: 6px;
    width: 64px;
    padding: 8px;
    display: flex;
    justify-content: center;
}

.we3-set-input {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Inter', system-ui, sans-serif;
    text-align: center;
    width: 100%;
    outline: none;
}

.we3-set-input.we3-input-dim { color: #8e8e93; }

.we3-set-input::-webkit-inner-spin-button,
.we3-set-input::-webkit-outer-spin-button { -webkit-appearance: none; appearance: none; }

.we3-set-input[type=number] { -moz-appearance: textfield; appearance: textfield; }

/* ─── Set actions ─── */
.we3-check-icon {
    color: #30d158;
    font-size: 22px;
}

.we3-check-empty {
    width: 20px;
    height: 20px;
    border: 2px solid #2c2c2e;
    border-radius: 4px;
}

.we3-log-btn {
    background: #00e5ff;
    border: none;
    border-radius: 4px;
    color: #0d0d0d;
    font-size: 11px;
    font-weight: 800;
    font-family: 'Inter', system-ui, sans-serif;
    padding: 4px 8px;
    cursor: pointer;
    white-space: nowrap;
}

/* ─── Log All Sets ─── */
.we3-log-all-btn {
    background: #262626;
    border: 1px solid #2c2c2e;
    border-radius: 12px;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Outfit', system-ui, sans-serif;
    padding: 14px;
    cursor: pointer;
    width: 100%;
    transition: background 0.15s;
}

.we3-log-all-btn:hover { background: #303030; }

/* ─── Rest timer ─── */
.we3-rest-bar {
    background: #1a1a1a;
    border-radius: 20px;
    padding: 12px 16px;
    flex-shrink: 0;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.5);
}

.we3-rest-ring-wrap {
    width: 44px;
    height: 44px;
}


.we3-rest-time {
    font-size: 18px;
    font-weight: 800;
    color: #fff;
}

.we3-rest-label {
    font-size: 14px;
    font-weight: 500;
    color: #8e8e93;
}

.we3-rest-adj {
    background: none;
    border: none;
    color: #00e5ff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
}

.we3-skip-btn {
    background: #262626;
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    padding: 8px 12px;
    cursor: pointer;
}

/* ─── Home indicator ─── */
.we3-home-bar {
    background: #fff;
    width: 134px;
    height: 5px;
    border-radius: 100px;
    opacity: 0.5;
}

/* ─── Overlays ─── */
.we3-overlay {
    position: absolute;
    inset: 0;
    z-index: 200;
    overflow: hidden;
}

.we3-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: flex-end;
    z-index: 100;
}

/* ─── Info Panel ─── */
.we3-info-overlay {
    background: #0d0d0d;
}

.we3-info-panel {
    height: 100%;
}

.we3-info-toolbar {
    border-bottom: 1px solid #1a1a1a;
}

.we3-info-label {
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.05em;
}

.we3-info-title {
    font-size: 24px;
    font-weight: 800;
    color: #fff;
    padding: 0 20px;
    margin: 0;
}

.we3-info-scroll {
    flex: 1;
    overflow-y: auto;
}

/* Media card */
.we3-media-card {
    border-radius: 12px;
    overflow: hidden;
    aspect-ratio: 16/9;
}

.we3-media-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.we3-media-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a1a, #333);
    min-height: 200px;
}

.we3-play-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}

.we3-play-icon {
    font-size: 56px;
    color: #fff;
    opacity: 0.9;
}

/* Source / find alt */
.we3-source-text {
    font-size: 13px;
    color: #6b7280;
}

.we3-source-val {
    font-weight: 600;
    color: #9ca3af;
}

.we3-find-alt-btn {
    background: none;
    border: none;
    color: #00f0ff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
    display: inline-flex;
    align-items: center;
}

/* Section label */
.we3-section-label {
    font-size: 12px;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Muscles card */
.we3-muscles-card {
    background: #1a1a1a;
    border: 1px solid #262626;
    border-radius: 16px;
    padding: 16px;
}

.we3-muscles-diagram {
    height: 180px;
    border-radius: 12px;
    background: linear-gradient(135deg, #262626, #1a1a1a);
}

.we3-group-label {
    font-size: 11px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.we3-muscle-primary {
    background: rgba(0, 240, 255, 0.15);
    border: 1px solid #00f0ff;
    border-radius: 8px;
    color: #00f0ff;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 10px;
}

.we3-muscle-secondary {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 10px;
}

/* Equipment */
.we3-equip-tag {
    background: #1a1a1a;
    border: 1px solid #262626;
    border-radius: 12px;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 12px;
    display: inline-flex;
    align-items: center;
}

.we3-equip-note {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.4;
    margin: 0;
}

/* Instruction */
.we3-instruction {
    font-size: 15px;
    color: #d1d5db;
    line-height: 1.5;
    margin: 0;
}

.we3-cue-tag {
    border: 1px solid #262626;
    border-radius: 100px;
    color: #9ca3af;
    font-size: 13px;
    font-weight: 500;
    padding: 8px 12px;
}

/* Got it */
.we3-got-it-wrap {
    display: flex;
    justify-content: center;
    padding-bottom: 32px;
    position: sticky;
    bottom: 0;
}

.we3-got-it-btn {
    background: #00f0ff;
    border: none;
    border-radius: 100px;
    color: #0d0d0d;
    font-size: 16px;
    font-weight: 800;
    font-family: 'Inter', system-ui, sans-serif;
    padding: 16px 32px;
    cursor: pointer;
    box-shadow: 0 12px 12px rgba(0, 240, 255, 0.25);
}

/* ─── Bottom sheets ─── */
.we3-sheet {
    background: #1a1a1a;
    border-radius: 32px 32px 0 0;
    padding: 12px 24px 24px;
    width: 100%;
    max-height: 90%;
    overflow-y: auto;
}

.we3-history-sheet {
    background: #0d0d0d;
}

.we3-handle {
    width: 40px;
    height: 4px;
    background: #2c2c2e;
    border-radius: 2px;
}

.we3-sheet-title {
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
}

/* ─── Segmented control ─── */
.we3-seg-control {
    background: #262626;
    border-radius: 10px;
    padding: 4px;
    display: flex;
    gap: 4px;
}

.we3-seg-btn {
    flex: 1;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: #8e8e93;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', system-ui, sans-serif;
    padding: 8px 4px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}

.we3-seg-btn.active {
    background: #1a1a1a;
    color: #fff;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
}

/* ─── Settings ─── */
.we3-setting-lbl {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
}

.we3-stepper-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.we3-stepper-lbl {
    font-size: 12px;
    font-weight: 600;
    color: #8e8e93;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.we3-stepper {
    background: #262626;
    border-radius: 8px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
}

.we3-stepper button {
    background: none;
    border: none;
    color: #8e8e93;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 13px;
    padding: 0;
}

.we3-stepper button:hover { color: #00e5ff; }

.we3-stepper > span {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
}

.we3-unit-label {
    font-size: 12px;
    font-weight: 500;
    color: #8e8e93;
    margin-left: 2px;
}

.we3-divider {
    height: 1px;
    background: #2c2c2e;
}

.we3-circuit-badge {
    background: #262626;
    border-radius: 8px;
    color: #00e5ff;
    font-size: 16px;
    font-weight: 800;
    padding: 10px 16px;
}

.we3-tempo-play {
    background: #00e5ff;
    border: none;
    border-radius: 16px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.we3-tempo-play.playing {
    background: #ff453a;
}

.we3-cancel-btn {
    background: #262626;
    border: 1px solid #2c2c2e;
    border-radius: 12px;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Outfit', system-ui, sans-serif;
    padding: 14px;
    cursor: pointer;
}

.we3-done-btn {
    background: #00e5ff;
    border: none;
    border-radius: 12px;
    color: #0d0d0d;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Outfit', system-ui, sans-serif;
    padding: 14px;
    cursor: pointer;
}

/* ─── History ─── */
.we3-chart-card {
    background: #1a1a1a;
    border-radius: 16px;
    padding: 20px;
}

.we3-history-sheet .we3-chart-card {
    background: #1a1a1a;
}

.we3-chart-label {
    font-size: 13px;
    font-weight: 600;
    color: #8e8e93;
    letter-spacing: 0.03em;
}

.we3-chart-delta {
    font-size: 13px;
    font-weight: 700;
    color: #00e5ff;
}

.we3-chart-area {
    overflow: hidden;
}

.we3-history-label {
    font-size: 13px;
    font-weight: 600;
    color: #8e8e93;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.we3-session-row {
    border-bottom: 1px solid #2c2c2e;
    padding: 16px 0;
}

.we3-session-date {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
}

.we3-session-summary {
    font-size: 13px;
    color: #8e8e93;
    font-weight: 400;
}

.we3-session-arrow {
    color: #8e8e93;
    font-size: 13px;
}

.we3-empty-state {
    color: #8e8e93;
    font-size: 14px;
    text-align: center;
    padding: 24px 0;
}

/* ─── Transitions ─── */
.we3-slide-enter-active,
.we3-slide-leave-active {
    transition: transform 0.3s ease;
}

.we3-slide-enter-from,
.we3-slide-leave-to {
    transform: translateY(100%);
}

.we3-sheet-enter-active,
.we3-sheet-leave-active {
    transition: opacity 0.25s ease;
}

.we3-sheet-enter-active .we3-sheet,
.we3-sheet-leave-active .we3-sheet {
    transition: transform 0.3s ease;
}

.we3-sheet-enter-from,
.we3-sheet-leave-to {
    opacity: 0;
}

.we3-sheet-enter-from .we3-sheet,
.we3-sheet-leave-to .we3-sheet {
    transform: translateY(100%);
}
</style>
