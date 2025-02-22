<template>
  <div class="d-flex flex-row justify-content-between">
      <span class="metric physical" :class="[{ selected: selected.physical }]" @click="selected.physical = !selected.physical">P</span>
      <span class="metric emotional" :class="[{ selected: selected.emotional }]" @click="selected.emotional = !selected.emotional">E</span>
      <span class="metric mental" :class="[{ selected: selected.mental }]" @click="selected.mental = !selected.mental">M</span>
      <span class="metric social" :class="[{ selected: selected.social }]" @click="selected.social = !selected.social">S</span>
      <span class="metric financial" :class="[{ selected: selected.financial }]" @click="selected.financial = !selected.financial">F</span>
  </div>
</template>

<script>
export default {
    name: 'MetricSelector',
    props: {
        selected: {
            type: Object,
            default: () => {
                return {
                    physical: true,
                    emotional: true,
                    mental: true,
                    social: true,
                    financial: true
                }
            }
        }
    }
}
</script>

<style scoped>
span {
    width: 34px;
    height: 32px;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    line-height: 32px;
    font-weight: 500;
    text-align: center;
    user-select: none;
}

.metric {
    border-color: #3B99FC;
    /* background-color: #EFF6FC; */
}

.metric:hover {
    background-color: rgba(59, 153, 252, .2);
}

.metric.selected {
    background-color: rgba(59, 153, 252, .2);
}

.metric.selected:hover {
    background-color: rgba(59, 153, 252, .4);
}
/* 
.physical {
    border-color: #3B99FC;
}

.physical:hover {
    background-color: rgba(59, 153, 252, .2);
}

.physical.selected {
    background-color: rgba(59, 153, 252, .2);
}

.physical.selected:hover {
    background-color: rgba(59, 153, 252, .4);
}

.emotional {
    border-color: #4C6EF5;
}

.emotional:hover {
    background-color: rgba(76, 110, 245, .2);
}

.emotional.selected {
    background-color: rgba(76, 110, 245, .2);
}

.emotional.selected:hover {
    background-color: rgba(76, 110, 245, .4);
}

.mental {
    border-color: #F4511E;
}

.mental:hover {
    background-color: rgba(244, 81, 30, .2);
}

.mental.selected {
    background-color: rgba(244, 81, 30, .2);
}

.mental.selected:hover {
    background-color: rgba(244, 81, 30, .4);
}

.social {
    border-color: #FC3B3B;
}

.social:hover {
    background-color: rgba(252, 59, 59, .2);
}

.social.selected {
    background-color: rgba(252, 59, 59, .2);
}

.social.selected:hover {
    background-color: rgba(252, 59, 59, .4);
}

.financial {
    border-color: #1EBA31;
}

.financial:hover {
    background-color: rgba(30, 186, 49, .2);
}

.financial.selected {
    background-color: rgba(30, 186, 49, .2);
}

.financial.selected:hover {
    background-color: rgba(30, 186, 49, .4);
} */
</style>