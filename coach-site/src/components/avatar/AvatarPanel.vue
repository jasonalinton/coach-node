<template>
    <div class="avatar-panel d-flex flex-column align-items-center mt-2">
        <div class="d-flex justify-content-center mb-2 gap-1">
            <span v-for="(panel, index) in panels" :key="index"
                  class="app-pill" :class="{'selected': selectedPanel == panel.text}"
                  @click="selectedPanel = panel.text">{{ panel.name }}</span>
            <!-- <span class="app-pill" :class="{'selected': selectedPanel == 'mood'}"
                  @click="selectedPanel = 'mood'">Mood</span>
            <span class="app-pill" :class="{'selected': selectedPanel == 'energy'}"
                  @click="selectedPanel = 'energy'">Energy</span>
            <span class="app-pill" :class="{'selected': selectedPanel == 'mental'}"
                  @click="selectedPanel = 'mental'">Mental</span>
            <span class="app-pill" :class="{'selected': selectedPanel == 'body'}"
                  @click="selectedPanel = 'body'">Body</span> -->
        </div>
        <AvatarMood v-if="selectedPanel == 'mood'"/>
        <AvatarEnergy v-if="selectedPanel == 'energy'"/>
        <AvatarMental v-if="selectedPanel == 'mental'"/>
        <AvatarBody v-if="selectedPanel == 'body'"/>
    </div>
</template>

<script>
import AvatarMood from './AvatarMood.vue';
import AvatarEnergy from './AvatarEnergy.vue';
import AvatarMental from './AvatarMental.vue';
import AvatarBody from './AvatarBody.vue';


export default {
    name: 'AvatarPanel',
    components: { AvatarMood, AvatarEnergy, AvatarBody, AvatarMental },
    props: {
        
    },
    data: function () {
        return {
            selectedPanel: "mood",
            panels: [ 
                {
                    text: "mood",
                    name: "Mood",
                    view: AvatarMood
                },
                {
                    text: "energy",
                    name: "Energy",
                    view: AvatarEnergy
                },
                {
                    text: "mental",
                    name: "Mental",
                    view: AvatarMental
                },
                {
                    text: "body",
                    name: "Body",
                    view: AvatarBody
                },
            ]
        }
    },
    created: function() {
       
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>