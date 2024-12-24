<template>
    <div v-show="appStore" 
         class="head align-content-center">
        <span class="label">Inventory</span>
        <div class="d-flex flex-row justify-content-end pe-2">
            <img class="header-button me-1"
                    src='/icon/button/eraser.png' width="24" height="24"
                    @click.prevent="clearValues"/>
            <img class="header-button me-1" :class="{ active: (primaryToggled == undefined) ? showPrimary : primaryToggled }"
                    src='/icon/button/one.png' width="24" height="24"
                    @click.prevent="setSetting('primaryToggled', (primaryToggled == undefined) ? !showPrimary : !primaryToggled)"/>
            <img class="header-button me-1" :class="{ active: (secondaryToggled == undefined) ? showSecondary : secondaryToggled}"
                    src='/icon/button/two.png' width="24" height="24"
                    @click.prevent="setSetting('secondaryToggled', (secondaryToggled == undefined) ? !showSecondary : !secondaryToggled)"/>
            <img class="header-button me-1" :class="{ active: (tertiaryToggled == undefined) ? showTertiary : tertiaryToggled}"
                    src='/icon/button/three.png' width="24" height="24"
                    @click.prevent="setSetting('tertiaryToggled',(tertiaryToggled == undefined) ? !showTertiary : !tertiaryToggled)"/>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '../../../store/appStore';

export default {
    name: 'InventoryPanelNavbar',
    components: {  },
    props: {
        
    },
    data: function () {
        return {
            appStore: undefined,
        }
    },
    created: function() {
       this.appStore = useAppStore();
    },
    computed: {
        showPrimary() {
            return (this.appStore) ? this.appStore.itemPanel.inventory.showPrimary : true;
        },
        showSecondary() {
            return (this.appStore) ? this.appStore.itemPanel.inventory.showSecondary : false;
        },
        showTertiary() {
            return (this.appStore) ? this.appStore.itemPanel.inventory.showTertiary : false;
        },
        primaryToggled() {
            return (this.appStore) ? this.appStore.itemPanel.inventory.primaryToggled : undefined;
        },
        secondaryToggled() {
            return (this.appStore) ? this.appStore.itemPanel.inventory.secondaryToggled : undefined;
        },
        tertiaryToggled() {
            return (this.appStore) ? this.appStore.itemPanel.inventory.tertiaryToggled : undefined;
        },
    },
    methods: {
        setSetting(prop, value) {
            this.appStore.itemPanel.inventory[prop] = value;
        },
        clearValues() {
            /* Reset display values */
            this.appStore.itemPanel.inventory.showPrimary = true;
            this.appStore.itemPanel.inventory.showSecondary = false;
            this.appStore.itemPanel.inventory.showTertiary = false;
            this.appStore.itemPanel.inventory.primaryToggled = undefined;
            this.appStore.itemPanel.inventory.secondaryToggled = undefined;
            this.appStore.itemPanel.inventory.tertiaryToggled = undefined;

            this.appStore.itemPanel.inventory.clear++;
        }
    },
}

</script>

<style scoped>
.head {
    min-height: 64px;
    border-bottom: 1px solid black;
}

.head .label {
    margin: auto;
}

.header-button:hover {
    background-color: rgba(60, 64, 67, .08);
}

.header-button.active {
    background-color: rgba(60, 64, 67, .2);
}
</style>