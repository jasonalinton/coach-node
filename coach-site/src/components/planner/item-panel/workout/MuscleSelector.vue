<template>
    <div class="muscle-selector d-flex flex-column">
        <img class="icon-button"
                 src='/icon/previous.png' width="20" height="20"
                 @click.prevent="$emit('back')"/>
        <div class="label d-flex flex-column flex-grow-1 mb-2">
            <span class="mb-2">Muscle Groups</span>
            <div class="d-flex flex-row flex-wrap gap-1">
                <div v-for="(muscleGroup, index) in muscleGroups.filter(x => x.isMain)" :key="index"
                     class="muscle-group d-flex flex-column" :class="{ 'selected': muscleGroup.isSelected}"
                     @click="muscleGroupClicked(muscleGroup)">
                        <div class="level d-flex justify-content-end">
                            <div v-if="muscleGroup.isSelected">{{ muscleGroup.isPrimary ? 'P' : 'S' }}</div>
                        </div>
                        <span>{{ muscleGroup.name }}</span>
                    </div>
            </div>
        </div>
        <div class="label d-flex flex-column flex-grow-1 mb-4">
            <span class="mb-2">Accessory Muscle Groups</span>
            <div class="d-flex flex-row flex-wrap gap-1">
                <div v-for="(muscleGroup, index) in muscleGroups.filter(x => x.isMain == false)" :key="index"
                     class="muscle-group d-flex flex-column" :class="{ 'selected': muscleGroup.isSelected}"
                     @click="muscleGroupClicked(muscleGroup)">
                        <div class="level d-flex justify-content-end">
                            <div v-if="muscleGroup.isSelected">{{ muscleGroup.isPrimary ? 'P' : 'S' }}</div>
                        </div>
                        <span>{{ muscleGroup.name }}</span>
                    </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary" @click="save()">Done</button>
    </div>
</template>

<script>
import { useWorkoutStore } from '../../../../store/workoutStore';
import { clone } from '../../../../../utility';

export default {
    name: 'MuscleSelector',
    components: {  },
    props: {
        selectedGroups: {
            type: Array,
            default: function() { return [] }
        }
    },
    data: function () {
        return {
            workoutStore: null,
            muscleGroups: [],
        }
    },
    created: function() {
        this.workoutStore = useWorkoutStore();
        this.setItems();
    },
    methods: {
        setItems() {
            if (this.workoutStore) {
                let muscleGroups = clone(this.workoutStore.getMuscleGroups());
                muscleGroups.forEach(mg => {
                    let selectedGroup = this.selectedGroups.find(x => x.id == mg.id);
                    if (selectedGroup) {
                        mg.isSelected = true;
                        mg.isPrimary = selectedGroup.isPrimary;
                        mg.isSecondary = selectedGroup.isSecondary;
                    } else {
                        mg.isSelected = false;
                    }
                })
                this.muscleGroups = muscleGroups;
            } else {
                this.muscleGroups = [];
            }
        },
        muscleGroupClicked(item) {
            if (item.isSelected) {
                if (item.isPrimary) {
                    item.isPrimary = false;
                    item.isSecondary = true;
                } else {
                    item.isSecondary = false;
                    item.isSelected = false;
                }
            } else {
                item.isSelected = true;
                item.isPrimary = true;
            }       
        },
        save() {
            let selectedGroups = this.muscleGroups.filter(x => x.isSelected);
            this.$emit("setMuscleGroups", selectedGroups);
        }
    },
}

</script>

<style scoped>
.muscle-selector {
    padding: 12px;
}

.label {
    font-size: 14px;
    margin: 8px 0;
    text-align: start;
    overflow: hidden;
}

.muscle-group {
    width: 85px;
    height: 85px;
    background-color: #D8D8D8;
    user-select: none;
}

.muscle-group.selected {
    border: #000000 1px solid;
}

.muscle-group span {
    margin-top: auto;
    text-align: center;
    width: 85px;
    /* height: 85px; */
    display: block;
}

.level {
    margin: 4px 4px 0 0;
}

.level div {
    background-color: green;
    border-radius: 12px;
    width: 21px;
    text-align: center;
    color: white;
}

</style>