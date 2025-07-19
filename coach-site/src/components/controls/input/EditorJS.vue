<template>
    <div class="editorjs" ref="htmlelement"></div>
</template>

<script>
import EditorJS from '@editorjs/editorjs';
import EmbedTool from '@editorjs/embed';
import ListTool from '@editorjs/list';
import ImageTool from '@editorjs/image';
import VideoTool from './editorjs/video.js';

export default {
    name: '',
    components: {  },
    props: {
        modelValue: {
            type: [Object, String],
            default: null,
        },
        placeholder: String,
        readOnly: Boolean,
    },
    data: function () {
        return {
            htmlelement: null,
            editor: undefined,
            updatingModel: false
        }
    },
    mounted() {

    },
    unmounted() {
       
    },
    methods: {
        
    },
    watch() {

    }
}

</script>

<style scoped>

</style>