<template>
    <div class="row g-0 h-100">
        <div class="col h-100 d-flex flex-column">
            <div class="inventory d-flex flex-column flex-grow-1 overflow-hidden">
                <div class="head align-content-center">
                    <span class="label">Inventory</span>
                    <div class="d-flex flex-row justify-content-end pe-2">
                        <img class="header-button me-1"
                             src='/icon/eraser-icon.png' width="16" height="16"
                             @click.prevent="clearValues"/>
                        <img class="header-button me-1" :class="{ active: (primaryToggled == undefined) ? showPrimary : primaryToggled }"
                             src='/icon/first-icon.png' width="16" height="16"
                             @click.prevent="primaryToggled = (primaryToggled == undefined) ? !showPrimary : !primaryToggled"/>
                        <img class="header-button me-1" :class="{ active: (secondaryToggled == undefined) ? showSecondary : secondaryToggled}"
                             src='/icon/second-icon.png' width="16" height="16"
                             @click.prevent="secondaryToggled = (secondaryToggled == undefined) ? !showSecondary : !secondaryToggled"/>
                        <img class="header-button me-1" :class="{ active: (tertiaryToggled == undefined) ? showTertiary : tertiaryToggled}"
                             src='/icon/third-icon.png' width="16" height="16"
                             @click.prevent="tertiaryToggled = (tertiaryToggled == undefined) ? !showTertiary : !tertiaryToggled"/>
                    </div>
                </div>
                <div class="body d-flex flex-column flex-grow-1" :class="{ hide: selectedPanel != 'list'}">
                    <div v-for="(list, metric, index) in inventoryList" :key="index"
                         class="metric mb-2">
                         <div v-if="list.length > 0">
                             <div class="label text-start">{{ metric }}</div>
                             <LogItemView class="log-item d-flex flex-row flex-grow-1 mt-1" 
                                          v-for="(logItem, index2) in list" :key="index2"
                                          :logItem="logItem"
                                          :clearValues="clear"
                                          :clearMinutes="clearMinutes"
                                          @selectLogItem="selectLogItem"/>
                         </div>
                    </div>
                </div>
                <LogItemHistory v-if="selectedPanel == 'logItemHistory'"
                                :logItemID="selectedLogItemID"
                                @back="back"/>
            </div>
        </div>
    </div>
</template>

<script>
import LogItemView from './LogItemView.vue';
import LogItemHistory from './LogItemHistory.vue'
import { useMetricStore } from '../../../../store/metricStore';
import { CONTROL } from '../../../../model/constants'
import { clone } from '../../../../../utility';
import { subtractMinutes } from '../../../../../utility/timeUtility';

export default {
    name: 'InventoryPanel',
    components: { LogItemView, LogItemHistory },
    props: {
        
    },
    data: function () {
        return {
            metricStore: undefined,
            selectedPanel: 'list',
            selectedLogItemID: undefined,
            inventoryList: [],
            clear: 0, // Incrementor to trigger watch value component
            clearMinutes: 15,
            showPrimary: true,
            showSecondary: false,
            showTertiary: false,
            primaryToggled: undefined,
            secondaryToggled: undefined,
            tertiaryToggled: undefined
        }
    },
    created: function() {
       this.metricStore = useMetricStore();
       this.metricStore.initializeLogItems();
    },
    computed: {
        logItems() {
            if (this.metricStore) {
                let logItems = clone(this.metricStore.getLogItems());
                return logItems;
            } else {
                return [];
            }
        },
    },
    methods: {
        setInventoryList,
        clearValues,
        selectLogItem,
        back
    },
    watch: {
        logItems() {
            this.setInventoryList();
        },
        showPrimary() {
            this.setInventoryList();
        },
        showSecondary() {
            this.setInventoryList();
        },
        showTertiary() {
            this.setInventoryList();
        },
        primaryToggled() {
            this.setInventoryList();
        },
        secondaryToggled() {
            this.setInventoryList();
        },
        tertiaryToggled() {
            this.setInventoryList();
        },
    }
}

function setInventoryList() {
    let inventoryList = {};
    if (this.logItems.length > 0) {

        /* Get metrics */
        let metrics = this.logItems.map(x => x.metric);
        metrics = [... new Set(metrics)];
        metrics.forEach(metric => {
            inventoryList[metric] = [];
        })

        // /* Create inventory list object */
        // let objects = [
        //     {
        //         prop: 'Primary',
        //         items: this.logItems.filter(item => item.isPrimary)
        //     },
        //     {
        //         prop: 'Secondary',
        //         items: this.logItems.filter(item => item.isPrimary)
        //     }
        // ]

        /* Determine whether or not to show secondary & tertiary */
        let showSecondary = true;
        let showTertiary = true;
        this.logItems.forEach(x => {
            let field = x.fields[0];
            if (field.controlTypeID != CONTROL.SLIDER) {
                return;
            }
            let lastEntry = (x.entries.length > 0) 
                ? x.entries[x.entries.length-1] : undefined;
            if (lastEntry) {
                let lastEntryDateTime = new Date(lastEntry.dateTime);
                let clearCutoff = subtractMinutes(this.clearMinutes);
                if (+lastEntryDateTime < +clearCutoff) {
                    if (x.isPrimary) {
                        showSecondary = false;
                    } else if (x.isSecondary) {
                        showTertiary = false;
                    }
                }
            } else {
                if (x.isPrimary) {
                    showSecondary = false;
                } else if (x.isSecondary) {
                    showTertiary = false;
                }
            }
        });
        this.showSecondary = showSecondary;
        this.showTertiary = showTertiary;
        
        /* Add applicable items to list */
        this.logItems.forEach(x => {
            if (x.isPrimary) {
                if (this.primaryToggled != undefined) {
                    if (this.primaryToggled == true) {
                        inventoryList[x.metric].push(x);
                    }
                } else if (this.showPrimary) {
                    inventoryList[x.metric].push(x);
                }
            } else if (x.isSecondary) {
                if (this.secondaryToggled != undefined) {
                    if (this.secondaryToggled == true) {
                        inventoryList[x.metric].push(x);
                    }
                } else if (this.showSecondary) {
                    inventoryList[x.metric].push(x);
                }
            }if (x.isTertiary) {
                if (this.tertiaryToggled != undefined) {
                    if (this.tertiaryToggled == true) {
                        inventoryList[x.metric].push(x);
                    }
                } else if (this.showTertiary) {
                    inventoryList[x.metric].push(x);
                }
            }
        });
        // this.logItems.forEach(x => {
        //     if (x.isPrimary && this.showPrimary) {
        //         inventoryList[x.metric].push(x);
        //     } else if (x.isSecondary && this.showSecondary) {
        //         inventoryList[x.metric].push(x);
        //     }if (x.isTertiary && this.showTertiary) {
        //         inventoryList[x.metric].push(x);
        //     }
        // });
    }
    this.inventoryList = inventoryList;
}

function clearValues() {
    /* Reset display values */
    this.showPrimary = true;
    this.showSecondary = false;
    this.showTertiary = false;
    this.primaryToggled = undefined;
    this.secondaryToggled = undefined;
    this.tertiaryToggled = undefined;

    this.clear++;
}

function selectLogItem(id) {
    this.selectedLogItemID = id;
    this.selectedPanel = "logItemHistory"
}

function back() {
    this.selectedPanel = "list";
    this.selectedLogItemID = undefined;
}

</script>

<style scoped>
.inventory .body {
    padding: 8px;
    overflow: scroll;
}

.body.hide {
    display: none !important;
}

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

.metric .label {
    font-size: 16px;
    line-height: 19px;
    color: #3B99FC;
    font-weight: 500;
}

.log-item .name {
    font-size: 14px;
    line-height: 17px;
    color: #434343;
}
</style>