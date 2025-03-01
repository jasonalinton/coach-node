<template>
  <ul class="column-options">
      <li v-for="prop in properties.filter(x => x.text.toLowerCase() != `${itemType.toLowerCase()}s`)" :key="prop.id">
          <div class="d-flex flex-row">
              <i class="fa-solid fa-grip-dots-vertical"></i>
              <input class="form-check-input"
                     type="checkbox"
                     v-model="prop.isSelected"
                     @change="onOptionChanged"
                />
                <span>{{ prop.text }}</span>
          </div>
      </li>
  </ul>
</template>

<script>
import { sortAsc } from ' ../../../utility';

let metricProperties = [
        {
            id: 0,
            text: "Order",
            position: 1,
            isSelected: true
        },
        {
            id: 1,
            text: "ID",
            position: 2,
            isSelected: true
        },
        {
            id: 2,
            text: "Text",
            position: 3,
            isSelected: true
        },
        {
            id: 3,
            text: "Description",
            position: 4,
            isSelected: true
        },
        {
            id: 10,
            text: "Goals",
            position: 11,
            isSelected: true
        },
        {
            id: 11,
            text: "Todos",
            position: 12,
            isSelected: true
        },
        {
            id: 12,
            position: 13,
            text: "Routines",
            isSelected: true
        },
    ];

let goalProperties = [
        {
            id: 0,
            text: "Order",
            position: 1,
            isSelected: true
        },
        {
            id: 1,
            text: "ID",
            position: 2,
            isSelected: true
        },
        {
            id: 2,
            text: "Text",
            position: 3,
            isSelected: true
        },
        {
            id: 3,
            text: "Description",
            position: 4,
            isSelected: true
        },
        {
            id: 4,
            text: "Time",
            position: 5,
            isSelected: true
        },
        {
            id: 5,
            text: "Repeat",
            position: 6,
            isSelected: true
        },
        {
            id: 6,
            text: "Type",
            position: 7,
            isSelected: false
        },
        {
            id: 7,
            text: "Parents",
            position: 8,
            isSelected: true
        },
        {
            id: 8,
            text: "Children",
            position: 9,
            isSelected: true
        },
        {
            id: 9,
            text: "Metrics",
            position: 10,
            isSelected: true
        },
        {
            id: 11,
            text: "Todos",
            position: 12,
            isSelected: true
        },
        {
            id: 12,
            position: 13,
            text: "Routines",
            isSelected: true
        },
    ];

let todoProperties = [
        {
            id: 0,
            text: "Order",
            position: 1,
            isSelected: true
        },
        {
            id: 1,
            text: "ID",
            position: 2,
            isSelected: true
        },
        {
            id: 2,
            text: "Text",
            position: 3,
            isSelected: true
        },
        {
            id: 3,
            text: "Description",
            position: 4,
            isSelected: true
        },
        {
            id: 4,
            text: "Time",
            position: 5,
            isSelected: true
        },
        {
            id: 5,
            text: "Repeat",
            position: 6,
            isSelected: true
        },
        {
            id: 6,
            text: "Type",
            position: 7,
            isSelected: false
        },
        {
            id: 7,
            text: "Parents",
            position: 8,
            isSelected: true
        },
        {
            id: 8,
            text: "Children",
            position: 9,
            isSelected: true
        },
        {
            id: 9,
            text: "Metrics",
            position: 10,
            isSelected: true
        },
        {
            id: 10,
            text: "Goals",
            position: 11,
            isSelected: true
        },
        {
            id: 12,
            position: 13,
            text: "Routines",
            isSelected: true
        },
        {
            id: 13,
            position: 14,
            text: "Iterations",
            isSelected: false
        },
        {
            id: 14,
            text: "Events",
            position: 15,
            isSelected: false
        },
    ];

let routineProperties = [
        {
            id: 0,
            text: "Order",
            position: 1,
            isSelected: true
        },
        {
            id: 1,
            text: "ID",
            position: 2,
            isSelected: true
        },
        {
            id: 2,
            text: "Text",
            position: 3,
            isSelected: true
        },
        {
            id: 3,
            text: "Description",
            position: 4,
            isSelected: true
        },
        {
            id: 4,
            text: "Time",
            position: 5,
            isSelected: true
        },
        {
            id: 5,
            text: "Repeat",
            position: 6,
            isSelected: true
        },
        {
            id: 6,
            text: "Type",
            position: 7,
            isSelected: false
        },
        {
            id: 9,
            text: "Metrics",
            position: 10,
            isSelected: true
        },
        {
            id: 10,
            text: "Goals",
            position: 11,
            isSelected: true
        },
        {
            id: 11,
            text: "Todos",
            position: 12,
            isSelected: true
        },
        {
            id: 13,
            position: 14,
            text: "Iterations",
            isSelected: false
        },
        {
            id: 14,
            text: "Events",
            position: 15,
            isSelected: false
        },
    ];

let properties = {
    metricProperties,
    goalProperties,
    todoProperties,
    routineProperties
};

export default {
    name: 'ItemTableColumnOptions',
    props: {
        itemType: String,
    },
    data: function() {
        return {
            properties: null,
        }
    },
    created: function() {
        let props = properties[`${this.itemType.toLowerCase()}Properties`];
        let prop = props.filter(x => x.text.toLowerCase() != `${this.itemType.toLowerCase()}s`);
        var cookieName = `${this.itemType.toLowerCase()}-table-props-new`;
        var storedProps = localStorage.getItem(cookieName);
        if (storedProps) {
            this.properties = JSON.parse(storedProps);
        } else {
            localStorage.setItem(cookieName, JSON.stringify(prop));
            this.properties = prop;
        }

        this.onOptionChanged();
    },
    methods: {
        onOptionChanged
    }
}

    function onOptionChanged() {
        localStorage.setItem(`${this.itemType.toLowerCase()}-table-props`, JSON.stringify(this.properties));
        var props = sortAsc(this.properties.filter(x => x.isSelected == true), 'position');
        let selectedColumns = props.map(x => x.text);
        this.$emit('setColumns', selectedColumns);
    }
</script>

<style scoped>
    ul {
        list-style: none;
        padding: 0px;
        background-color: white;
        position: relative;
    }
</style>