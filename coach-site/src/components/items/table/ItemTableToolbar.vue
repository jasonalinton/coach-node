<template>
    <div class="toolbar d-flex flex-row justify-content-between align-content-center">
      <div class="left d-flex align-content-center">
          <input class="search textbox" type="text" placeholder="Search" v-model="searchTerm" />
      </div>
      <div class="right d-flex flex-row">
          <div class="column-options">
              <span class="d-block"
                  @click="showColumnOptions = !showColumnOptions">Column Options</span>
              <ItemTableColumnOptions v-show="showColumnOptions" 
                                      :itemType="itemType"
                                      @setColumns="$emit('setColumns', $event)">
              </ItemTableColumnOptions>
          </div>
          <select v-model="sortBy" class="select ms-2">
              <option disabled>Sort By</option>
              <option v-for="option in sortOptions" :key="option.id" :value="option.text">{{ option.text }}</option>
          </select>
          <button class="add-btn my-auto" type="button" @click="$emit('addItem', itemType)">
              <img class="m-auto" src="/icon/button/add.png" width="10" height="10"/>
          </button>
      </div>
  </div>
  </template>
  
  <script>
import ItemTableColumnOptions from '../component/ItemTableColumnOptions.vue'
  
  let sortOptions = [
      {
          id: 1,
          text: "None"
      },
      {
          id: 2,
          text: "Metric"
      },
      {
          id: 3,
          text: "Timeframe"
      },
      {
          id: 4,
          text: "Type"
      },
  ]
  
  export default {
      components: { ItemTableColumnOptions },
      name: 'ItemTableToolbar',
      props: {
        itemType: String
      },
      data: function() {
          return {
              sortBy: null,
              sortOptions,
              showColumnOptions: false,
              searchTerm: ""
          }
      },
      created: function() {
          this.sortBy = "None";
      },
      watch: {
          sortBy(value) {
              this.$emit('setSortBy', value);
          },
          searchTerm(value) {
            this.$emit('setSearchTerm', value);
          }
      }
  }
  
  </script>
  
  <style scoped>
      .toolbar {
          /* background-color: #F5F5F5; */
          height: 32px;
          padding: 0 8px;
      }
  
      .search.textbox, .select {
          height: 28px;
          margin-top: 2px;
      }
  
      .column-options span {
          line-height: 32px;
      }
  
      /* Textbox */
      .textbox, .textarea, select {
          width: 100%;
          font-size: 14px;
          line-height: 14px;
          padding: 2px 8px;
          /* padding-top: 4px; */
          /* color: #343434; */
          color: #212529;
          /* background-color: #F5F5F5; */
      }
  
      .textbox:not(.accissible), .textarea:not(.accissible), .select:not(.accissible) {
          outline-style: none;
          -webkit-appearance: none;
          border: 1px solid rgba(0, 0, 0, .08);
          resize: none;
      }
  
      .textbox:not(.accissible):focus, .textarea:not(.accissible):focus {
          border: 1px solid #039BE5;
          transition-property: border-color;
          transition-duration: 0.15s;
          transition-timing-function: ease-in-out;
          transition-delay: 0s;
          resize: vertical;
      }
  
      .textbox:not(.accissible):hover:not(:focus), .textarea:not(.accissible):hover:not(:focus) {
          /* border: 1px solid rgba(0, 0, 0, .08); */
          border: 1px solid rgba(0, 0, 0, .2);
          resize: vertical;
      }
      /* End - Textbox */
  </style>