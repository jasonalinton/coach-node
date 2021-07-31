<template>
    <div @click="click" @mouseover="hovered = true" @mouseleave="hovered = false; pressed = false" 
         @mousedown="pressed = true" @mouseup="pressed = false">
        <img v-if="!checked" class="checked" :src='`/icon/checkbox/unchecked/${state}.png`' :width="width_" :height="height_"/>
        <img v-if="checked" class="checked" :src='`/icon/checkbox/checked/${state}.png`' :width="width_" :height="height_"/>
    </div>
</template>

<script>
export default {
    name: 'ItemCheckbox',
    props: {
        width: Number,
        height: Number,
        checked: Boolean
    },
    data: function() {
        return {
            width_: (this.width) ? this.width : 40,
            height_: (this.height) ? this.height : 40,
            hovered: false,
            pressed: false,
            disabled: false,
        }
    },
    computed: {
        state() {
            if (this.disabled)
                return 'disabled';
            else if (this.pressed)
                return 'pressed';
            else if (this.hovered)
                return 'hovered';
            else
                return 'enabled';
        }
    },
    methods: {
        click,
    },
}

function click() {
    if (!this.checked)
        this.$emit('onChecked');
    else
        this.$emit("onUnchecked");
}
</script>

<style scoped>
img {
    pointer-events: none;
}
</style>