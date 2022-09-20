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
import { goalProperties } from '../../../model/item/GoalModel'

let properties = goalProperties;

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
        var cookieName = `${this.itemType.toLowerCase()}-table-props`;
        var storedProps = localStorage.getItem(cookieName);
        if (storedProps) {
            this.properties = JSON.parse(storedProps);
        } else {
            localStorage.setItem(cookieName, JSON.stringify(properties));
            this.properties = properties;
        }

        this.onOptionChanged();
    },
    methods: {
        onOptionChanged
    }
}

    function onOptionChanged() {
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