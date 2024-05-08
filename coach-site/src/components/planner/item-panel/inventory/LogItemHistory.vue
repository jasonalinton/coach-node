<template>
    <div class="log-item-history d-flex flex-column flex-grow-1 overflow-scroll">
        <div class="head d-flex flex-row">
            <img class="icon-button mt-auto mb-auto"
                 src='/icon/previous.png' width="20" height="20"
                 @click.prevent="$emit('back')"/>
            <div class="metric text-start ms-1">{{ logItem.metric }}</div>
            <div class="name text-start ms-1">{{ logItem.name }}</div>
            <img class="header-button me-1"
                    src='/icon/eraser-icon.png' width="16" height="16"
                    @click.prevent="fitChartContent"/>
        </div>
        <div id="log-item-chart" class="mt-2" ref="log-item-chart"></div>
        <div class="value-table d-flex flex-column flex-grow-1 overflow-scroll" :ref="'value-table'">
            <table v-if="logItem" class="table table-striped">
                <thead class="sticky-top" :ref="'table-head'">
                    <tr>
                        <th scope="col">Time</th>
                        <th v-for="field in logItem.fields" :key="field.id" 
                            scope="col">{{ field.name }}</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="entry in tableEntries" >
                        <tr :key="entry.id" 
                            :ref="`entry-${entry.time}`" :class="{ 'active': entry.isActive }"
                            @click="setSelectedEntry(entry)">
                            <th scope="row">{{ jsonToDateTimeString(entry.dateTime) }}</th>
                            <td v-for="value in entry.fieldValues" :key="value.id">{{ value.value }}</td>
                        </tr>
                        <tr v-if="entry.isSelected" :key="entry.id * -1">
                            <td :colspan="entry.fieldValues.length + 1">
                                <div  class="additional-values d-flex flex-column">
                                    <DateTimeSelector class="date-selector mt-2"
                                                    :dateTime="selectedEntry.dateTime" 
                                                    @onChange="updateEntryDateTime"/>
                                    <div class="fields d-flex flex-column">
                                        <input v-for="field in selectedEntry.fields" :key="field.id"
                                            class="textbox mt-2" type="text" :placeholder="field.name"
                                            v-model.lazy.trim="field.value" spellcheck
                                            @change="updateEntryField(field)"/>
                                    </div>
                                    <textarea id="blurb" class="textarea mt-2" 
                                            type="text"
                                            placeholder="Blurb"
                                            v-model.lazy="selectedEntry.blurb" spellcheck
                                            @change="updateEntryBlurb"></textarea>
                                    
                                    <!-- Delete -->
                                    <button v-if="!confimDelete" type="button" class="btn btn-danger mt-2" @click="confimDelete = true">Delete</button>
                                    <!-- Delete Confirmation -->
                                    <div v-if="confimDelete" class="d-flex flex-row mt-2 align-items-center">
                                        <span>Are you sure?</span>
                                        <button type="button" class="btn btn-warning ms-2" @click="confimDelete = false">Cancel</button>
                                        <button type="button" class="btn btn-danger ms-2" @click="deleteEntry(entry.id)">Delete</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

    </div>
</template>

<script>
import DateTimeSelector from '../../../controls/select/DateTimeSelector.vue'
import { useMetricStore } from '../../../../store/metricStore';
import { sortDateAsc, sortDateDesc } from '../../../../../utility';
import { jsonToDateTimeString } from '../../../../../utility/timeUtility';
import { createChart  } from "lightweight-charts";

export default {
    name: 'LogItemHistory',
    components: { DateTimeSelector },
    props: {
        logItemID: Number
    },
    data: function () {
        return {
            metricStore: undefined,
            chart: undefined,
            series: [],
            tableEntries: [],
            entryCount: 20,
            selectedEntry: undefined,
            confimDelete: false
        }
    },
    created: function() {
       this.metricStore = useMetricStore();
    },
    computed: {
        logItem() {
            if (this.metricStore) {
                return this.metricStore.getLogItem(this.logItemID)
            } else {
                return undefined;
            }
        },
        metric() {
            return (this.logItem) ? this.logItem.metric : "";
        },
        seriesData() {
            if (this.tableEntries) {
                let lastTen = sortDateAsc(this.tableEntries, 'dateTime');
                let seriesData = lastTen.map(entry => {
                    let value = entry.fieldValues[0];
                    return {
                        dateTime: new Date(entry.dateTime),
                        time: new Date(entry.dateTime) / 1000,
                        value: parseFloat(value.value)
                    }
                });
                return seriesData;
            } else {
                return [];
            }
        },
        totalEntries() {
            if (this.logItem) {
                return this.logItem.entries.length;
            } else {
                return 0
            }
        }
    },
    methods: {
        setTableEntries,
        createLogChart,
        initInfiniteScroll,
        fitChartContent,
        jsonToDateTimeString,
        getRowRef,
        selectChartPoint,
        handleChartClick,
        handleChartDoubleClick,
        setSelectedEntry,
        deselectEntries,
        updateEntryDateTime,
        updateEntryField,
        updateEntryBlurb,
        deleteEntry
    },
    watch: {
        logItem(value) {
            this.setTableEntries(value);
            this.createLogChart();
        },
        entryCount() {
            this.setTableEntries(this.logItem);
        }
    }
}

function setTableEntries(logItem) {
    if (logItem) {
        let entries = sortDateDesc(logItem.entries, 'dateTime');
        entries = entries.slice(0, this.entryCount);
        let tableEntries = entries.map(entry => {
            return {
                id: entry.id,
                dateTime: entry.dateTime,
                time: new Date(entry.dateTime) / 1000,
                fieldValues: entry.fieldValues,
                blurb: entry.reason,
                isActive: false,
                isSelected: false,
            };
        });
        this.tableEntries = tableEntries;
    } else {
        this.tableEntries = [];
    }
}

function createLogChart() {
    this.$refs['log-item-chart'].replaceChildren();
    const chart = createChart('log-item-chart', { width: 278, height: 100 });

    this.series = chart.addLineSeries();
    this.series.setData(this.seriesData);
    chart.timeScale().fitContent();
    chart.subscribeClick(this.handleChartClick);
    chart.subscribeDblClick(this.handleChartDoubleClick);
    let timeScale = chart.timeScale();
    console.log(timeScale);
    // chart.setCrosshairPosition(this.seriesData[17].value, this.seriesData[3].time, this.series);
    this.chart = chart;
    this.initInfiniteScroll();
}

function initInfiniteScroll() {
  let _this = this;

  let timeScale = this.chart.timeScale();
  let timer = null;
  
  timeScale.subscribeVisibleLogicalRangeChange(() => {
    if (timer !== null) {
      return;
    }
    timer = setTimeout(() => {
      var logicalRange = timeScale.getVisibleLogicalRange();
      if (logicalRange !== null && logicalRange.from < 5) {
            let entriesRemaining = _this.totalEntries - _this.entryCount;
            if (entriesRemaining > 0) {
                _this.entryCount += (entriesRemaining > 20) ? 20 : entriesRemaining;
                _this.series.setData(_this.seriesData);
            }
      }
      timer = null;
    }, 250);
  });
}

function fitChartContent() {
    this.chart.timeScale().fitContent();
}

function getRowRef(entry) {
    return `${new Date(entry.dateTime) / 1000}-${entry.value}`;
}

function handleChartClick(data) {
    this.selectChartPoint(data)
}

function handleChartDoubleClick() {
    let entry = this.tableEntries.find(x => x.isActive);
    this.setSelectedEntry(entry);
}

function selectChartPoint(data) {
    this.deselectEntries();
    let found = false;
    let position = 0;
    let lastHeight = this.$refs[`table-head`].getBoundingClientRect().height;
    this.tableEntries.forEach(entry => {
        if (entry.time != data.time && !found) {
            position += lastHeight;
            lastHeight = this.$refs[`entry-${data.time}`][0].getBoundingClientRect().height;
            entry.isActive = false;
        } else if (entry.time == data.time) {
            entry.isActive = true;
            found = true;
        } else {
            entry.isActive = false;
        }
    })
    let table = this.$refs['value-table'];
    table.scrollTo({
        top: position,
        left: 0,
        behavior: "smooth",
    });
}

function setSelectedEntry(entry) {
    if (entry) {
        if (this.selectedEntry && this.selectedEntry.id == entry.id) {
            this.deselectEntries();
        } else {
            this.deselectEntries();
            let selectedEntry = {
                id: entry.id,
                dateTime: entry.dateTime,
                blurb: entry.blurb,
                fields: []
            }
            entry.fieldValues.forEach(fv => {
                let field = this.logItem.fields.find(field => field.id == fv.logItemFieldID);
                selectedEntry.fields.push({
                    id: fv.logItemFieldID,
                    value: fv.value,
                    name: field.name
                });
            });
            this.selectedEntry = selectedEntry;
            entry.isActive = true;
            entry.isSelected = true;
        }
    } else {
        this.deselectEntries();
    }
}

function deselectEntries() {
    this.tableEntries.forEach(e => {
        e.isSelected = false;
        e.isActive = false;
    });
    this.selectedEntry = undefined;
}

function updateEntryDateTime(value) {
    let model = {
        logItemID: this.logItem.id,
        dateTime: this.selectedEntry.dateTime,
        updatedDateTime: value,
        isUpdated: true,
    }
    this.selectedEntry.dateTime = value;
    this.metricStore.logLogItem(model);
}

function updateEntryField(field) {
    let model = {
        logItemID: this.logItem.id,
        dateTime: this.selectedEntry.dateTime,
        fields: [{
            id: field.id,
            value: field.value,
        }],
        isUpdated: true,
    }
    this.metricStore.logLogItem(model);
}

function updateEntryBlurb() {
    let model = {
        logItemID: this.logItem.id,
        dateTime: this.selectedEntry.dateTime,
        reason: {
            value: this.selectedEntry.blurb,
            isUpdated: true
        },
        isUpdated: true,
    }
    this.metricStore.logLogItem(model);
}

function deleteEntry(entryID) {
    this.metricStore.deleteLogEntry(entryID);
    this.confimDelete = false;
}

</script>

<style scoped>
.log-item-history {
    padding: 8px;
}

.head {
    font-size: 16px;
    line-height: 20px;
}

.header-button:hover {
    background-color: rgba(60, 64, 67, .08);
}

.metric {
    font-weight: 500;
    color: #3B99FC;
}

.name {
    color: #434343;
}

thead {
    background-color: white;
}

tr.active {
    background-color: #3B99FC;
}
</style>