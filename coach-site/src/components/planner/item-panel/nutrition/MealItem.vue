<template>
    <div class="meal d-flex flex-column">
        <div class="d-flex flex-row align-items-center ps-1">
            <span class="name">{{ meal.name }}</span>
            <img class="icon-button ms-1" src="/icon/add-button.png" :width="15" :height="15" 
                 @click="addFood" />
        </div>
        <div v-if="infoExpanded" class="d-flex flex-row justify-content-between p-1"
             @click="itemsExpanded = !itemsExpanded">
            <!-- Calories -->
            <div class="calories d-flex flex-column position-relative align-items-center">
                <div class="amount d-flex flex-row">
                    <span class="consumed">{{ floatString(meal.calories,0) }}</span>
                    <span class="recommended">/{{ caloriesRecommeded }} cal</span>
                </div>
                <img class="flame" src="/icon/nutrition/calorie-flame.png" width="33" height="45"/>
                <div class="percent d-flex flex-row">
                    <span>{{ caloriePercentage }}</span>
                    <span>%</span>
                </div>
            </div>
            <!-- Macros -->
            <div class="macros d-flex flex-column justify-content-end">
                <div class="recommended d-flex flex-row mb-1">
                    <div class="carbs d-flex flex-column">
                        <span >Carbs</span>
                        <span class="percent">50%</span>
                    </div>
                    <div class="protein d-flex flex-column">
                        <span >Prot</span>
                        <span class="percent">25%</span>
                    </div>
                    <div class="fat d-flex flex-column">
                        <span >Fat</span>
                        <span class="percent">25%</span>
                    </div>
                </div>
                <div class="consumed d-flex flex-row">
                    <span class="carbs" :style="{width: `${meal.macros.carbs}%`}">{{ meal.macros.carbs }}%</span>
                    <span class="protein" :style="{width: `${meal.macros.protein}%`}">{{ meal.macros.protein }}%</span>
                    <span class="fat" :style="{width: `${meal.macros.fat}%`}">{{ meal.macros.fat }}%</span>
                </div>
            </div>
            <!-- Water -->
            <div class="water d-flex flex-column position-relative align-items-center">
                <div class="amount d-flex flex-row">
                    <span class="consumed">{{ floatString(this.meal.water,0) }}</span>
                    <span class="recommended">/{{ waterRecommeded }} oz</span>
                </div>
                <img class="droplet" src="/icon/nutrition/water-droplet.png" width="28" height="45"/>
                <div class="percent d-flex flex-row">
                    <span>{{ waterPercentage }}</span>
                    <span>%</span>
                </div>
            </div>
        </div>
        <div v-if="itemsExpanded" class="d-flex flex-column">
            <!-- Time -->
            <div v-if="meal.iteration" class="time mt-1">
                <div v-if="!editTime" class="display d-flex flex-row"
                     @click="editTime = true">
                    <span v-if="startAt" class="start ms-1">{{ toShortTimeString(startAt) }}</span>
                    <span v-if="endAt" class="end ms-2">{{ toShortTimeString(endAt) }}</span>
                </div>
                <div v-else-if="editTime" class="d-flex flex-column">
                    <DateTimeSelector class="date-selector" :class="{ 'invalid': !isTimeValid }"
                                        :dateTime="startAt.toJSON()" @onChange="setTime($event, 'start')"/>
                    <DateTimeSelector class="date-selector mt-2" :class="{ 'invalid': !isTimeValid }"
                                        :dateTime="endAt.toJSON()" @onChange="setTime($event, 'end')"/>
                    <!-- Time Buttons -->
                    <div class="d-flex flex-row mt-2">
                        <button type="button" class="btn btn-sm btn-primary mb-1" @click="saveTime">Done</button>
                        <button type="button" class="btn btn-sm btn-warning mb-1 ms-1" @click="refreshTimes">Cancel</button>
                    </div>
                </div>
            </div>
            <!-- Food Item Table -->
            <FoodItemTable :meal="meal" />
        </div>
    </div>
</template>

<script>
import { usePhysicalStore } from '@/store/physicalStore'
import DateTimeSelector from '../../../controls/select/DateTimeSelector.vue'
import FoodItemTable from './FoodItemTable.vue';
import { floatString } from '../../../../../utility';
import { toShortTimeString } from '../../../../../utility/timeUtility';

export default {
    name: '',
    components: { FoodItemTable, DateTimeSelector },
    props: {
        meal: Object
    },
    data: function () {
        return {
            physicalStore: undefined,
            infoExpanded: false,
            itemsExpanded: false,
            caloriesRecommeded: 400,
            waterRecommeded: 28,
            isTimeValid: true,
            editTime: false,
            startAt: undefined,
            endAt: undefined
        }
    },
    created: function() {
        this.physicalStore = usePhysicalStore();
        this.refresh();
    },
    computed: {
        caloriePercentage() {
            return this.floatString((this.meal.calories / this.caloriesRecommeded) * 100, 0);
        },
        waterPercentage() {
            return this.floatString((this.meal.water / this.waterRecommeded) * 100, 0);
        },
    },
    methods: {
        floatString,
        toShortTimeString,
        addFood,
        refresh,
        refreshTimes,
        setTime,
        validateTimes,
        saveTime
    },
    watch: {
        meal() {
            this.refresh();
        }
    }
}

function addFood() {
    this.$emit('searchFoodItems', this.meal);
}

function refresh() {
    this.infoExpanded = (this.meal.foodItems.length > 0) ? true : false;
    if (!this.infoExpanded) {
        this.itemsExpanded = false;
    }
    this.refreshTimes();
}

function refreshTimes() {
    this.editTime = false;

    if (this.meal.iteration && this.meal.iteration.startAt) {
        this.startAt = new Date(this.meal.iteration.startAt);
    } else {
        this.startAt = undefined;
    }

    if (this.meal.iteration && this.meal.iteration.endAt) {
        this.endAt = new Date(this.meal.iteration.endAt);
    } else {
        this.endAt = undefined;
    }
}

function setTime(value, endpoint) {
    if (value) {
        if (endpoint == "start") {
            this.startAt = new Date(value);
        } else if (endpoint == "end") {
            this.endAt = new Date(value);
        }
        this.validateTimes();
    }
}

function validateTimes() {
    let iteration = this.meal.iteration || undefined;
    if (iteration) {
        if (this.startAt && this.endAt) {
            if (+this.startAt > +this.endAt) {
                this.isTimeValid = false;
            } else if (+this.startAt <= +this.endAt) {
                this.isTimeValid = true;
            }
        } else if (!this.endAt) {
            this.isTimeValid = false;
        } else {
            this.isTimeValid = true;
        }
    }
}

function saveTime() {
    if (this.isTimeValid) {
        this.physicalStore.setMealTime(this.meal.id, this.startAt, this.endAt);
    }
}

</script>

<style scoped>
.meal {
    min-height: 30px;
    border-radius: 6px;
    background-color: #F5F5F5;
}

.meal:hover {
}

.icon-button {
    visibility: hidden;
}

.meal:hover .icon-button {
    visibility: visible;
}

.meal .name {
    font-size: 20px;
}

.calories .amount {
    position: absolute;
    left: 29px;
    top: -6px;
}

.calories .consumed {
    color: #EA8919;
    font-size: 14px;
    font-weight: 500;
}

.calories .recommended {
    font-size: 10px;
    margin-top: 8px;
    width: max-content;
}

.calories .percent {
    color: #EA8919;
    font-size: 16px;
    font-weight: 500;
}

.water .amount {
    position: absolute;
    right: 22px;
    top: -6px;
}

.water .consumed {
    color: #3B99FC;
    font-size: 14px;
    font-weight: 500;
}

.water .recommended {
    font-size: 10px;
    margin-top: 8px;
    width: max-content;
}

.water .percent {
    color: #3B99FC;
    font-size: 16px;
    font-weight: 500;
}

.macros {
    width: 130px;
}

.macros .recommended {
    font-size: 10px;
    line-height: 18px;
}

.macros .recommended .carbs {
    width: 50%;
}
.macros .recommended .protein {
    width: 25%;
}
.macros .recommended .fat {
    width: 25%;
}

.macros .recommended .percent {
    height: 18px;
    opacity: .3;
}

.macros .recommended .carbs .percent {
    color: white;
    background-color: #3B99FC;
}

.macros .recommended .protein .percent {
    color: white;
    background-color: #FC3B3B;
}

.macros .recommended .fat .percent {
    background-color: #3BFC62;
}

.macros .consumed {
    font-size: 10px;
    line-height: 18px;
    height: 18px;
}

.macros .consumed .carbs {
    background-color: #3B99FC;
    color: white;
}
.macros .consumed .protein {
    background-color: #FC3B3B;
    color: white;
}
.macros .consumed .fat {
    background-color: #3BFC62;
}

.flame, .droplet {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

.time .display {
    font-size: 12px;
}

.date-selector.invalid {
    border: solid 1px red;
}
</style>