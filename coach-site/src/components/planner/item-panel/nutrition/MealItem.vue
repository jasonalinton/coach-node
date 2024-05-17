<template>
    <div class="meal d-flex flex-column">
        <div class="d-flex flex-row align-items-center">
            <span class="name ms-1">{{ meal.name }}</span>
            <img class="icon-button ms-1" src="/icon/add-button.png" :width="20" :height="20" 
                 @click="addFood" />
        </div>
        <div class="d-flex flex-row">
            <div class="d-flex flex-column">
                <div class="d-flex flex-row">
                    <span>{{ meal.calaries }}</span>
                    <span>/400 cal</span>
                </div>
                <img src="/icon/nutrition/calorie-flame.png" width="33" height="45"/>
                <div class="d-flex flex-row">
                    <span>{{ meal.macros.carbs }}</span>
                    <span>%</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: '',
    components: {  },
    props: {
        meal: Object
    },
    data: function () {
        return {
            
        }
    },
    created: function() {
       
    },
    methods: {
        addFood
    },
}

function addFood() {
    this.$emit('searchFoodItems', this.meal);
}

</script>

<style scoped>
.meal {
    min-height: 30px;
    border-radius: 6px;
}

.meal:hover {
    background-color: #F5F5F5;
}

.meal .name {
    font-size: 20px;
}
</style>