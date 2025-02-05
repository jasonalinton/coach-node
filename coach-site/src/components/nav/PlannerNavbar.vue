<template>
    <nav id="navbar" class="navbar navbar-expand-sm navbar-light">
        <div class="container-fluid d-flex flex-row">
            <div class="d-flex flex-row">
                <div class="d-flex flex-row">
                    <IconButton class="icon menu-button float-left" src="/icon/menu-button.png" :width="48" :height="48"></IconButton>
                    <img class="icon calendar-button float-left" src="/icon/planner-icon.png" :width="36" :height="36"
                         @click="$emit('toggleLeftPanel')"/>
                    <a class="navbar-brand float-left" href="#">Inventory Planner</a>
                </div>
                <div class="d-flex flex-row">
                    <button class="btn btn-sm" type="button" @click="$emit('showPage', 'planner')">Planner</button>
                    <button class="btn btn-sm" type="button" @click="$emit('showPage', 'items')">Items</button>
                    <button class="btn btn-sm" type="button" @click="$emit('showPage', 'physical')">Physical</button>
                </div>
            </div>
            <div v-if="selectedPage == 'planner'" class="d-flex flex-row me-5">
                <IconButton class="arrow" src="/icon/previous.png" :width="24" :height="24"
                            @click="previous" />
                <IconButton class="arrow" src="/icon/next.png" :width="24" :height="24"
                            @click="next" />
                <select v-model="view">
                    <option v-for="_view in views" :key="_view.id" :value="_view.id">{{ _view.text }}</option>
                </select>
                <select v-if="view == 1" v-model="dayCountt">
                    <option v-for="weekView in weekViews" :key="weekView.id" :value="weekView.id">{{ weekView.text }}</option>
                </select>
            </div>
        </div>
    </nav>
</template>

<script>
import IconButton from '../controls/button/IconButton.vue';
import { addDay, subtractDay, today } from '../../../utility';

let views = [
    { id: 1, text: 'Week', view: 'weekView'},
    { id: 2, text: 'Month', view: 'monthView' },
]

let weekViews = [
    { id: 1, text: 'One'},
    { id: 2, text: 'Two'},
    { id: 3, text: 'Three'},
    { id: 4, text: 'Four'},
    { id: 5, text: 'Five'},
    { id: 7, text: 'Week'},
]

export default {
    name: "PlannerNavbar",
    components: { IconButton },
    props: {
        dayCount: Number,
        selectedView: String,
        selectedPage: String,
    },
    data: function() {
        return {
            plannerStore: undefined,
            dayCountt: this.dayCount,
            views,
            view: null,
            weekViews,
        }
    },
    created: async function() {
        this.view = views.find(_view => _view.view == this.selectedView).id;

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
    },
    methods: {
        previous() {
            this.plannerStore.selectDate(subtractDay(this.selectedDate, this.dayCount));
        },
        next() {
            this.plannerStore.selectDate(addDay(this.selectedDate, this.dayCount));
        },
    },
    watch: {
        dayCountt(value) { this.$emit('dayCountChange', value) },
        view(value) { this.$emit('viewChange', views.find(view => view.id == value).view) },
    }
};
</script>

<style scoped>
.navbar {
    border-bottom: 1px solid rgba(220, 220, 220, .5);
    padding-bottom: 7px;
    line-height: 38px;
}

.icon {
    margin: auto 12px auto 0px;
}

.menu-button {
    margin-right: 12px;
}

select {
    font-size: 14px;
    line-height: 14px;
    padding: 0px 4px;
    height: 32px;
    /* border: 1px solid #BCBCBC; */
    border: none;
    border-radius: 4px;
    color: #343434;
    background-color: white;
    margin: 0px 2px;
    margin-top: -1px;
}

select:hover {
    background-color: rgba(60, 64, 67, .08);
}

.arrow {
    margin-top: 2px;
}
</style>