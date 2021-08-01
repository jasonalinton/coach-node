<template>
    <div> 
        <div class="iteration d-flex flex-row justify-content-between align-items-center" :class="[{ complete: checked}]">
            <ItemCheckbox class="checkbox" :checked="checked" 
                @onChecked="markComplete" 
                @onUnchecked="markIncomplete"
                @onDelete="onDelete"></ItemCheckbox>
            <span class="flex-fill">{{ iteration.text }}</span>
            <div class="button-group d-flex flex-column justify-content-between">
                <!-- <img class="icon-button" src='/icon/add-button.png' width="16" height="16"/> -->
                <img class="icon-button" src='/icon/edit-button.png' width="16" height="16"/>
                <img class="icon-button" src='/icon/delete-button.png' @click="onDelete" width="16" height="16"/>
            </div>
        </div>
    </div>
</template>

<script>
import ItemCheckbox from './ItemCheckbox.vue';
export default {
    name: 'ListItem',
    components: { 
        ItemCheckbox
    },
    props: {
        iteration: Object
    },
    computed: {
        checked() {
            if (this.iteration.attemptedAt) {
                return true;
            } else {
                return false
            }
        }
    },
    methods: {
        markComplete,
        markIncomplete,
        onDelete
    }
}

function markComplete() {
    let now = new Date();
    this.iteration.attemptedAt = now;
    this.iteration.completedAt = now;

    this.$emit('markComplete', this.iteration);
}

function markIncomplete() {
    this.iteration.attemptedAt = null;
    this.iteration.completedAt = null;

    this.$emit('markIncomplete', this.iteration);
}

function onDelete() {
    this.$emit('onDelete', this.iteration);
}
</script>

<style scoped>
.iteration {
    background-color: white;
    max-height: 40px;
    user-select: none;
}

.complete span {
    text-decoration: line-through;
}

 /* .box-shadow {
    box-shadow: 0px -3px 5px 4px rgba(0,0,0,.5);
    width: 100%;
    height: 40px;
    position: absolute;
    bottom: 0;
} */

.checkbox:hover {
    background-color: rgba(248, 248, 248, 1);
    border-radius: 24px;
}

.icon-button {
    border-radius: 8px;
    width: 16px;
}

.icon-button:hover {
    background-color: rgba(60, 64, 67, .10);
}

.button-group {
    width: 16px;
    margin: 0px 8px;
    visibility: hidden;
    /* margin-top: -4px; */
    z-index: 5;
    /* max-height: 40px; */
}

.iteration:hover .button-group {
    visibility: visible;
    margin-right: 10px;
}

.iteration:hover {
    background-color: #F5F5F5;
    /* border-top: 1px solid #DCDCDC; */
    /* box-shadow: 0px -3px 5px 4px rgba(0,0,0,.5); */
    /* box-shadow: 0px -3px 5px 2px rgba(0,0,0,.5); */
}

.iteration:active:hover {
    box-shadow: 0px -3px 5px 2px rgba(0,0,0,.5);
}

.iteration span {
    height: 14px;
    line-height: 15px;
}
</style>