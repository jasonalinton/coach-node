<template>
    <img class="icon-button" :src="src" :width="iconWidth" :height="iconHeight" @click="click" />
</template>

<script>
export default {
    name: 'MenuButton',
    props: {
        src: String,
        width: Number,
        height: Number,
    },
    data: function() {
        return {
            iconWidth: 48,
            iconHeight: 48
        }
    },
    created: function() {
        this.iconWidth = (this.width) ? this.width : this.iconWidth;
        this.iconHeight = (this.height) ? this.height : this.iconHeight;
    },
    methods: {
        click,
    }
}

function click() {
    this.$emit("click");
}
</script>

<style>
    img.icon-button:hover {
        background-color: rgba(60, 64, 67, .08);
        border-radius: 24px;
    }
</style>