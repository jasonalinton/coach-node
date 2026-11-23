<template>
    <div class="workout-exercise-2 d-flex flex-column flex-grow-1 position-relative overflow-hidden">
    <div class="exercise-scroll d-flex flex-column flex-grow-1 overflow-scroll">
        <!-- Header -->
        <div class="header d-flex flex-row align-items-center pt-2 pb-2 sticky-top">
            <img class="icon-button me-2" src="/icon/previous.png" width="20" height="20" @click.prevent="back" />
            <span class="fw-semibold">{{ name }}</span>
            <span v-if="localCircuit != null" class="ms-auto me-1 text-muted small">C{{ localCircuit }}</span>
            <span v-if="localPosition != null" class="me-2 text-muted small">P{{ localPosition }}</span>
        </div>

        <!-- Media -->
        <div class="media position-relative">
            <img class="chart-icon position-absolute bottom-0 end-0 mb-2 me-2"
                 src="/icon/chart-line-solid.png" width="28" height="28"
                 @click.prevent="showHistory" />
        </div>

        <!-- Toolbar -->
        <div class="toolbar d-flex flex-row justify-content-around align-items-center pt-2 pb-1 border-top border-bottom">
            <div class="toolbar-item d-flex flex-column align-items-center gap-1" @click.prevent="showHistory">
                <img src="/icon/exercise-history.svg" width="22" height="22" />
                <span class="toolbar-label">History</span>
            </div>
            <div class="toolbar-item d-flex flex-column align-items-center gap-1">
                <img src="/icon/time.png" width="22" height="22" />
                <span class="toolbar-label">Rest</span>
            </div>
            <div class="toolbar-item d-flex flex-column align-items-center gap-1">
                <img src="/icon/reverse.png" width="22" height="22" />
                <span class="toolbar-label">Replace</span>
            </div>
            <div class="toolbar-item d-flex flex-column align-items-center gap-1">
                <img src="/icon/briefing.png" width="22" height="22" />
                <span class="toolbar-label">Notes</span>
            </div>
            <div class="toolbar-item d-flex flex-column align-items-center gap-1" @click.prevent="editExercise">
                <img src="/icon/slider-icon.png" width="22" height="22" />
                <span class="toolbar-label">Edit</span>
            </div>
            <div class="toolbar-item d-flex flex-column align-items-center gap-1" @click.prevent="showSettings = !showSettings">
                <img src="/icon/dots-vertical.png" width="22" height="22" />
                <span class="toolbar-label">More</span>
            </div>
        </div>

        <!-- Tempo Display -->
        <div v-if="tempoDisplay" class="tempo-display-row d-flex align-items-center justify-content-center gap-3 py-2">
            <div v-if="tempoPhases.length" class="d-flex align-items-center">
                <template v-for="(phase, i) in tempoPhases" :key="i">
                    <span class="tempo-phase fw-bold fs-5"
                          :class="{ 'tempo-phase-active': isTempoPlaying && tempoPhase === i }">
                        {{ isTempoPlaying && tempoPhase === i ? tempoPhaseRemaining : phase }}
                    </span>
                    <span v-if="i < tempoPhases.length - 1" class="tempo-sep mx-2">-</span>
                </template>
            </div>
            <span v-else class="tempo-display fw-bold fs-5">{{ tempoDisplay }}</span>
            <div v-if="tempoPhases.length" class="d-flex flex-column align-items-center gap-1">
                <span v-if="(isTempoPlaying || tempoPaused) && loopsTotal > rotationsPerRep" class="loop-counter">
                    {{ Math.floor((loopsTotal - loopsRemaining) / rotationsPerRep) + 1 }} / {{ loopsTotal / rotationsPerRep }}
                </span>
                <span v-if="(isTempoPlaying || tempoPaused) && rotationsPerRep > 1" class="loop-counter">
                    Rotation {{ currentRotation }} / {{ rotationsPerRep }}
                </span>
                <button class="btn-tempo" @click="toggleTempo">
                    {{ isTempoPlaying ? '■' : '▶' }}
                </button>
            </div>
        </div>

        <!-- Sets -->
        <div class="exercise-sets d-flex flex-column mx-3 mt-1">
            <ExerciseSet v-for="(set, index) in sets" :key="set.id"
                         :set="set" :isActive="set.id == activeSetID"
                         :setNumber="index + 1" :idExercise="exercise && exercise.id"
                         variationSheet
                         @openVariations="variationSetID = $event"
                         @removeActiveSet="activeSetID = undefined"
                         @click="activeSetID = set.id" />
            <button class="btn btn-link add-set-btn text-start ps-0 mt-2" type="button" @click="addSet">
                + Add Set
            </button>
        </div>

        <!-- Rest Timer -->
        <div v-if="restRemaining" class="rest-timer-card mx-3 mt-3 position-sticky bottom-0">
            <div class="d-flex flex-row justify-content-between align-items-center mb-2">
                <span class="resting-label">RESTING</span>
                <span class="pause-icon">|||</span>
            </div>
            <div class="d-flex justify-content-center mb-3">
                <div class="circle-container position-relative">
                    <svg width="180" height="180" viewBox="0 0 180 180">
                        <circle cx="90" cy="90" r="78" fill="none" stroke="#e4e4f0" stroke-width="4" />
                        <circle cx="90" cy="90" r="78" fill="none" stroke="#4f46e5" stroke-width="4"
                                :stroke-dasharray="circleCircumference"
                                :stroke-dashoffset="circleDashoffset"
                                stroke-linecap="round"
                                transform="rotate(-90 90 90)" />
                    </svg>
                    <div class="time-display position-absolute top-50 start-50 translate-middle fw-bold">
                        {{ restFormatted }}
                    </div>
                </div>
            </div>
            <div class="d-flex flex-row justify-content-between align-items-center px-2 pb-1">
                <button class="btn btn-adjust" @click="adjustRest(-15)">-15s</button>
                <a class="skip-rest-link" href="#" @click.prevent="resetRest">Skip Rest</a>
                <button class="btn btn-adjust" @click="adjustRest(15)">+15s</button>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="isProcessing" class="d-flex flex-row mt-auto mb-2 justify-content-center position-sticky bottom-0">
            <div class="loader"></div>
        </div>

        <!-- Log Buttons -->
        <div v-if="!isProcessing && !restRemaining"
             class="log-buttons d-flex flex-row mt-auto ps-3 pe-3 pb-3 pt-2 gap-2 position-sticky bottom-0">
            <button type="button" class="btn btn-log-set flex-grow-1" @click="logSet">Log Set</button>
            <button type="button" class="btn btn-log-all flex-grow-1" @click="logAllSets">Log All Sets</button>
        </div>
    </div>

        <!-- Settings Sheet -->
        <div v-if="showSettings" class="sheet-scrim d-flex flex-column justify-content-end" @click.self="cancelSettings">
            <div class="settings-sheet d-flex flex-column">
                <div class="sheet-handle align-self-center"></div>
                <div class="d-flex flex-row justify-content-between align-items-center">
                    <span class="sheet-title">Exercise settings</span>
                    <span class="sheet-done" @click.prevent="saveSettings">Done</span>
                </div>
                <span class="sheet-eyebrow">TEMPO</span>
                <div class="tempo-type d-flex flex-row">
                    <span v-for="option in tempoTypeOptions" :key="option.id"
                          class="tempo-type-option flex-fill text-center"
                          :class="{ selected: tempoType == option.id }"
                          @click="tempoType = option.id">{{ option.text }}</span>
                </div>
                <div v-for="(group, groupIndex) in stepperGroups" :key="groupIndex" class="stepper-grid">
                    <div v-for="stepper in group" :key="stepper.label"
                         class="stepper d-flex flex-column align-items-center" :class="{ full: stepper.isFull }">
                        <span class="stepper-label">{{ stepper.label }}</span>
                        <div class="d-flex flex-row align-items-center w-100">
                            <button type="button" class="stepper-button" @click="stepValue(stepper, -1)">−</button>
                            <div class="d-flex flex-row align-items-baseline justify-content-center flex-fill">
                                <input class="stepper-input" type="number" min="0"
                                       v-model="stepper.obj[stepper.key]"
                                       :style="{ width: inputWidth(stepper.obj[stepper.key]) }" />
                                <span v-if="stepper.unit" class="stepper-unit">{{ stepper.unit }}</span>
                            </div>
                            <button type="button" class="stepper-button" @click="stepValue(stepper, 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Variation Sheet -->
        <div v-if="variationSet" class="sheet-scrim d-flex flex-column justify-content-end" @click.self="variationSetID = undefined">
            <div class="settings-sheet d-flex flex-column">
                <div class="sheet-handle align-self-center"></div>
                <div class="d-flex flex-row justify-content-between align-items-center">
                    <div class="d-flex flex-column text-start">
                        <span class="sheet-title">Variations</span>
                        <span class="sheet-subtitle">Set {{ variationSetNumber }}</span>
                    </div>
                    <span class="sheet-done" @click.prevent="variationSetID = undefined">Done</span>
                </div>
                <div v-if="potentialVariations.length > 0" class="variation-list d-flex flex-column">
                    <div v-for="variation in potentialVariations" :key="variation.id"
                         class="variation-option d-flex flex-row justify-content-between align-items-center"
                         :class="{ selected: isVariationSelected(variation) }"
                         @click="toggleVariation(variation)">
                        <span>{{ variation.name }}</span>
                        <span class="variation-check">{{ isVariationSelected(variation) ? '✓' : '' }}</span>
                    </div>
                </div>
                <span v-else class="sheet-empty">This exercise has no variations yet. Add them from Edit.</span>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore';
import { useWorkoutStore } from '@/store/workoutStore';
import ExerciseSet from './ExerciseSet.vue';
import { clone } from '../../../../../utility';

export default {
    name: 'WorkoutExercise2',
    components: { ExerciseSet },
    data() {
        return {
            appStore: undefined,
            workoutStore: undefined,
            activeSetID: undefined,
            restRemaining: undefined,
            restTotal: undefined,
            restIntervalID: undefined,
            isProcessing: false,
            showSettings: false,
            variationSetID: undefined,
            tempoType: undefined,
            TEMPTYPES: { FOURDIGIT: 1, CONTRACTRELAX: 2, BPM: 3 },
            localTempoCR: { contract: 1, relax: 1 },
            localTempoBPM: 120,
            isTempoPlaying: false,
            tempoPaused: false,
            tempoPhase: 0,
            tempoPhaseRemaining: 0,
            tempoIntervalID: undefined,
            loopsTotal: 1,
            loopsRemaining: 1,
            localCircuit: undefined,
            localPosition: undefined,
            localTempo: { eccentric: 1, bottomIso: 1, concentric: 1, topIso: 1 },
            localRest: undefined,
            audioContext: null,
        };
    },
    created() {
        this.appStore = useAppStore();
        this.workoutStore = useWorkoutStore();
    },
    beforeUnmount() {
        this.stopTempo();
        this.resetRest();
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    },
    mounted() {
        if (this.workoutExercise) {
            this.initLocalSettings();
        }
    },
    computed: {
        id() {
            return this.appStore?.itemPanel.workout.selectedExerciseID;
        },
        idWorkout() {
            return this.appStore?.itemPanel.workout.selectedWorkoutID;
        },
        name() {
            return this.exercise?.name ?? 'Loading...';
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
        restFormatted() {
            if (!this.restRemaining) return '0:00';
            const mins = Math.floor(this.restRemaining / 60);
            const secs = this.restRemaining % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        tempoStartIndex() {
            const id = this.exercise?.idTempoStart;
            if (id === 196) return 1; // bottomIso
            if (id === 195) return 2; // concentric
            if (id === 194) return 3; // topIso
            return 0;                 // eccentric (default)
        },
        rotationsPerRep() {
            return this.exercise?.idLaterality === 198 ? 2 : 1; // 198 = UNILATERAL
        },
        currentRotation() {
            return ((this.loopsTotal - this.loopsRemaining) % this.rotationsPerRep) + 1;
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
        circleCircumference() {
            return 2 * Math.PI * 78;
        },
        circleDashoffset() {
            if (!this.restTotal || !this.restRemaining) return 0;
            return this.circleCircumference * (1 - this.restRemaining / this.restTotal);
        },
        sets() {
            if (this.workoutExercise) {
                return this.workoutStore.getSets(this.workoutExercise.idWorkoutExercise);
            }
            return [];
        },
        tempoTypeOptions() {
            return [
                { id: this.TEMPTYPES.FOURDIGIT, text: '4-phase' },
                { id: this.TEMPTYPES.CONTRACTRELAX, text: 'Contract / relax' },
                { id: this.TEMPTYPES.BPM, text: 'BPM' },
            ];
        },
        stepperGroups() {
            let tempo = [];
            if (this.tempoType === this.TEMPTYPES.FOURDIGIT) {
                tempo = [['LOWER', 'eccentric'], ['PAUSE', 'bottomIso'], ['RAISE', 'concentric'], ['HOLD', 'topIso']]
                    .map(([label, key]) => ({ label, obj: this.localTempo, key, step: 1 }));
            } else if (this.tempoType === this.TEMPTYPES.CONTRACTRELAX) {
                tempo = [['CONTRACT', 'contract'], ['RELAX', 'relax']]
                    .map(([label, key]) => ({ label, obj: this.localTempoCR, key, step: 1 }));
            } else if (this.tempoType === this.TEMPTYPES.BPM) {
                tempo = [{ label: 'BPM', obj: this, key: 'localTempoBPM', step: 5, isFull: true }];
            }
            const order = [
                { label: 'REST', obj: this, key: 'localRest', step: 15, unit: 's', isFull: true },
                { label: 'CIRCUIT', obj: this, key: 'localCircuit', step: 1 },
                { label: 'ORDER', obj: this, key: 'localPosition', step: 1 },
            ];
            return [tempo, order];
        },
        variationSet() {
            return this.sets.find(s => s.id == this.variationSetID);
        },
        variationSetNumber() {
            return this.sets.findIndex(s => s.id == this.variationSetID) + 1;
        },
        potentialVariations() {
            if (this.exercise) {
                return this.workoutStore.getExercise(this.exercise.id)?.variations ?? [];
            }
            return [];
        },
    },
    watch: {
        workoutExercise(val) {
            if (val && this.localCircuit === undefined) {
                this.initLocalSettings();
            }
        },
        restRemaining(value) {
            if (value != null && value === 0) {
                this.resetRest();
            }
        },
        sets(value) {
            if (value.length > 0) {
                this.setActiveSet();
            }
        },
    },
    methods: {
        back() {
            this.appStore.onBackWorkoutPanel();
        },
        editExercise() {
            if (this.workoutExercise) {
                this.appStore.selectExerciseForm(this.workoutExercise.idExercise);
            }
        },
        showHistory() {
            if (this.exercise) {
                this.appStore.selectExerciseHistory(this.exercise.id, []);
            }
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
            } else if (we.tempo_BPM) {
                this.tempoType = this.TEMPTYPES.BPM;
                this.localTempoBPM = we.tempo_BPM;
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
        toggleTempo() {
            if (this.isTempoPlaying) {
                this.stopTempo();
            } else {
                this.startTempo();
            }
        },
        startTempo() {
            if (!this.tempoPhases.length) return;
            if (!this.tempoPaused) {
                const activeSet = this.sets.find(s => s.id === this.activeSetID);
                const reps = (activeSet?.reps && Number(activeSet.reps) > 0) ? Number(activeSet.reps) : 1;
                this.loopsTotal = reps * this.rotationsPerRep;
                this.loopsRemaining = reps * this.rotationsPerRep;
            }
            this.tempoPaused = false;
            const startIdx = (this.tempoType === this.TEMPTYPES.FOURDIGIT) ? this.tempoStartIndex : 0;
            this.tempoPhase = startIdx;
            this.tempoPhaseRemaining = this.tempoPhases[startIdx];
            this.isTempoPlaying = true;
            const _this = this;
            this.tempoIntervalID = setInterval(() => {
                _this.tempoPhaseRemaining--;
                if (_this.tempoPhaseRemaining === 0) {
                    _this.playPhaseEnd();
                } else if (_this.tempoPhaseRemaining > 0) {
                    _this.playTick();
                } else {
                    if (!_this.isTempoPlaying) return;
                    const nextPhase = _this.tempoPhase + 1;
                    if (nextPhase >= _this.tempoPhases.length) {
                        _this.loopsRemaining--;
                        if (_this.loopsRemaining <= 0) {
                            _this.playComplete();
                            _this.stopTempo();
                            _this.logSet();
                        } else if (_this.rotationsPerRep > 1 && _this.loopsRemaining % (_this.loopsTotal / _this.rotationsPerRep) === 0) {
                            _this.playRotationPause();
                            _this.pauseTempo();
                        } else {
                            _this.playPhaseTransition();
                            _this.tempoPhase = 0;
                            _this.tempoPhaseRemaining = _this.tempoPhases[0];
                        }
                    } else {
                        _this.playPhaseTransition();
                        _this.tempoPhase = nextPhase;
                        _this.tempoPhaseRemaining = _this.tempoPhases[nextPhase];
                    }
                }
            }, 1000);
        },
        getAudioContext() {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            return this.audioContext;
        },
        playBeep(frequency, duration, volume = 0.25, type = 'sine') {
            try {
                const ctx = this.getAudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = type;
                osc.frequency.value = frequency;
                gain.gain.setValueAtTime(volume, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + duration);
            } catch (e) {}
        },
        playTick() {
            this.playBeep(880, 0.06, 0.2);
        },
        playPhaseEnd() {
            this.playBeep(660, 0.12, 0.3);
        },
        playPhaseTransition() {
            this.playBeep(1046, 0.1, 0.35);
        },
        playRotationPause() {
            this.playBeep(880, 0.08, 0.3);
            setTimeout(() => this.playBeep(660, 0.12, 0.3), 120);
        },
        playComplete() {
            this.playBeep(523, 0.12, 0.3);
            setTimeout(() => this.playBeep(659, 0.12, 0.3), 150);
            setTimeout(() => this.playBeep(784, 0.2, 0.35), 300);
        },
        pauseTempo() {
            clearInterval(this.tempoIntervalID);
            this.tempoIntervalID = undefined;
            this.isTempoPlaying = false;
            this.tempoPaused = true;
            this.tempoPhase = 0;
            this.tempoPhaseRemaining = 0;
        },
        stopTempo() {
            clearInterval(this.tempoIntervalID);
            this.tempoIntervalID = undefined;
            this.isTempoPlaying = false;
            this.tempoPaused = false;
            this.tempoPhase = 0;
            this.tempoPhaseRemaining = 0;
            this.loopsTotal = 1;
            this.loopsRemaining = 1;
        },
        stepValue(stepper, direction) {
            const value = Number(stepper.obj[stepper.key]) || 0;
            stepper.obj[stepper.key] = Math.max(0, value + direction * stepper.step);
        },
        inputWidth(value) {
            const length = String(value ?? '').length || 1;
            return `${length + 1}ch`;
        },
        isVariationSelected(variation) {
            return this.variationSet.variations.some(x => x.id == variation.id);
        },
        toggleVariation(variation) {
            /* Same save shape as ExerciseSet.variationClicked: removals send only the removed ID */
            const set = this.variationSet;
            if (this.isVariationSelected(variation)) {
                const index = set.variations.findIndex(x => x.id == variation.id);
                set.variations.splice(index, 1);
                this.workoutStore.saveSet({
                    ...set,
                    variations: [{ id: variation.id, isRemoved: true }]
                });
            } else {
                set.variations.push({ id: variation.id, name: variation.name });
                this.workoutStore.saveSet(set);
            }
        },
        cancelSettings() {
            this.stopTempo();
            this.initLocalSettings();
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
                tempo4, tempoCR, tempoBPM, this.localRest
            );
            this.stopTempo();
            this.showSettings = false;
        },
        addSet() {
            const setIDs = this.sets.map(s => s.id).sort((a, b) => a - b);
            const nextID = (setIDs.length === 0 || setIDs[0] - 1 > -1) ? -1 : setIDs[0] - 1;
            if (this.sets.length > 0) {
                const newSet = clone(this.sets.at(-1));
                newSet.iteration = null;
                newSet.id = nextID;
                this.workoutStore.saveSet(newSet);
            } else {
                this.workoutStore.saveSet({
                    id: nextID,
                    idWorkoutSectionExercise: this.workoutExercise.idWorkoutExercise,
                });
            }
        },
        setActiveSet() {
            if (this.activeSetID) return;
            let activeSetID;
            this.sets.forEach(set => {
                if (!set.iteration && !activeSetID) activeSetID = set.id;
            });
            this.activeSetID = activeSetID;
            this.setRest();
        },
        logSet() {
            this.isProcessing = true;
            const set = this.sets.find(s => s.id === this.activeSetID);
            const completedAt = set?.iteration ? undefined : new Date();

            if (this.localRest) {
                const setIndex = this.sets.findIndex(s => s.id === this.activeSetID);
                if (setIndex < this.sets.length - 1) {
                    this.restTotal = Number(this.localRest);
                    this.restRemaining = Number(this.localRest);
                    const _this = this;
                    this.restIntervalID = setInterval(() => { _this.restRemaining--; }, 1000);
                }
            }

            this.activeSetID = undefined;
            this.workoutStore.logSet(set.id, completedAt).then(() => { this.isProcessing = false; });
        },
        logAllSets() {
            this.isProcessing = true;
            this.activeSetID = undefined;
            this.workoutStore.logAllSets(this.workoutExercise.idWorkoutExercise)
                .then(() => { this.isProcessing = false; });
        },
        setRest() {
            if (this.localRest && this.activeSetID) {
                const lastSetIndex = this.sets.findIndex(s => s.id === this.activeSetID) - 1;
                if (lastSetIndex === -1) return;
                const lastSet = this.sets[lastSetIndex];
                if (lastSet.iteration?.completedAt) {
                    const elapsed = (new Date() - new Date(lastSet.iteration.completedAt)) / 1000;
                    const remaining = Number(this.localRest) - parseInt(elapsed);
                    if (remaining > 0) {
                        this.resetRest();
                        this.restTotal = Number(this.localRest);
                        this.restRemaining = remaining;
                        const _this = this;
                        this.restIntervalID = setInterval(() => { _this.restRemaining--; }, 1000);
                    }
                }
            }
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
    },
};
</script>

<style scoped>
.header {
    background-color: var(--background-color);
}

.media {
    min-height: 300px;
    background-color: #f0efdf;
}

.chart-icon {
    opacity: 0.75;
    cursor: pointer;
}

.tempo-display {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #555;
}

.tempo-phase {
    min-width: 24px;
    text-align: center;
    color: #555;
    transition: color 0.2s;
}

.tempo-phase-active {
    color: #4f46e5;
}

.tempo-sep {
    color: #aaa;
}

.btn-tempo {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid #4f46e5;
    background: #fff;
    color: #4f46e5;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
}

.btn-tempo:hover {
    background: #4f46e5;
    color: #fff;
}

.loop-counter {
    font-size: 11px;
    font-weight: 600;
    color: #4f46e5;
    letter-spacing: 0.05em;
}

.toolbar {
    background-color: var(--background-color);
}

.toolbar-item {
    cursor: pointer;
    color: #555;
}

.toolbar-label {
    font-size: 11px;
}

.exercise-scroll {
    min-height: 0;
}

/* Settings Sheet */
.sheet-scrim {
    position: absolute;
    inset: 0;
    z-index: 20;
    background-color: rgba(24, 24, 27, 0.45);
}

.settings-sheet {
    max-height: 90%;
    overflow-y: auto;
    gap: 16px;
    padding: 10px 20px 20px;
    background-color: #fff;
    border-radius: 24px 24px 0 0;
}

.sheet-handle {
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background-color: #e4e4e7;
}

.sheet-title {
    font-size: 18px;
    font-weight: 700;
    color: #18181b;
}

.sheet-done {
    font-size: 15px;
    font-weight: 600;
    color: #0f766e;
    cursor: pointer;
}

.sheet-subtitle {
    font-size: 13px;
    color: #71717a;
}

.sheet-empty {
    padding: 8px 0 12px;
    text-align: start;
    font-size: 14px;
    color: #71717a;
}

.variation-list {
    gap: 8px;
}

.variation-option {
    padding: 12px 14px;
    font-size: 15px;
    font-weight: 500;
    color: #18181b;
    background-color: #f4f4f0;
    border: 1px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    user-select: none;
}

.variation-option.selected {
    color: #0f766e;
    background-color: #ccfbf1;
    border-color: #0f766e;
}

.variation-check {
    width: 16px;
    font-weight: 700;
    text-align: center;
}

.sheet-eyebrow {
    text-align: start;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #71717a;
}

.tempo-type {
    gap: 2px;
    padding: 3px;
    background-color: #f4f4f0;
    border-radius: 10px;
}

.tempo-type-option {
    padding: 7px 0;
    font-size: 13px;
    font-weight: 500;
    color: #71717a;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
}

.tempo-type-option.selected {
    font-weight: 600;
    color: #18181b;
    background-color: #fff;
}

.stepper-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.stepper {
    gap: 8px;
    padding: 12px;
    background-color: #f4f4f0;
    border-radius: 16px;
}

.stepper.full {
    grid-column: 1 / -1;
}

.stepper-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #71717a;
}

.stepper-button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    padding: 0;
    font-size: 18px;
    line-height: 1;
    color: #18181b;
    background-color: #fff;
    border: 1px solid #e4e4e7;
    border-radius: 16px;
}

.stepper-input {
    min-width: 2ch;
    max-width: 100%;
    padding: 0;
    text-align: center;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 34px;
    font-weight: 600;
    color: #18181b;
    background: transparent;
    border: none;
    outline: none;
    -moz-appearance: textfield;
}

.stepper-input::-webkit-outer-spin-button,
.stepper-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.stepper-unit {
    margin-left: 3px;
    font-size: 12px;
    font-weight: 500;
    color: #71717a;
}

.sets-header {
    font-size: 12px;
    font-weight: 600;
    color: #888;
    letter-spacing: 0.05em;
}

.set-num-spacer {
    width: 34px;
    flex-shrink: 0;
}

.col-label {
    flex: 1;
    text-align: center;
}

.add-set-btn {
    font-size: 14px;
    font-weight: 600;
    color: #555;
    text-decoration: none;
}

.log-buttons {
    background-color: var(--background-color);
}

.btn-log-set {
    font-weight: 600;
    border: 2px solid #d97706;
    color: #d97706;
    background-color: #fff;
    border-radius: 8px;
}

.btn-log-all {
    font-weight: 600;
    background-color: #3b82f6;
    color: #fff;
    border-radius: 8px;
}

.rest-timer-card {
    background-color: #fff;
    border-radius: 16px;
    border: 1px solid #e8e8f4;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    padding: 16px;
}

.resting-label {
    font-size: 13px;
    font-weight: 700;
    color: #4f46e5;
    letter-spacing: 0.08em;
}

.pause-icon {
    font-size: 16px;
    color: #aaa;
    letter-spacing: 2px;
}

.circle-container {
    width: 180px;
    height: 180px;
}

.time-display {
    font-size: 32px;
    letter-spacing: -1px;
    color: #1a1a2e;
    white-space: nowrap;
}

.btn-adjust {
    font-size: 13px;
    font-weight: 600;
    color: #555;
    background-color: #f0f0f5;
    border-radius: 20px;
    padding: 6px 16px;
    border: none;
}

.btn-adjust:hover {
    background-color: #e0e0ee;
}

.skip-rest-link {
    font-size: 14px;
    font-weight: 600;
    color: #4f46e5;
    text-decoration: underline;
}

/* Loader */
.loader {
    width: 30px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 4px solid var(--workout-red);
    animation: l20-1 0.8s infinite linear alternate, l20-2 1.6s infinite linear;
}

@keyframes l20-1 {
    0%    { clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0%) }
    12.5% { clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0%) }
    25%   { clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100%) }
    50%   { clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100%) }
    62.5% { clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100%) }
    75%   { clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100%) }
    100%  { clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100%) }
}

@keyframes l20-2 {
    0%     { transform: scaleY(1)  rotate(0deg) }
    49.99% { transform: scaleY(1)  rotate(135deg) }
    50%    { transform: scaleY(-1) rotate(0deg) }
    100%   { transform: scaleY(-1) rotate(-135deg) }
}
</style>
