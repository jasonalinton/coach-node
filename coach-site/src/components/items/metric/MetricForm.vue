<template>
    <div class="wrapper">
        <div class="d-flex flex-row justify-content-between">
            <span>{{ metric.id }} - {{ metric.text }}</span>
            <i class="btn btn-sm fas fa-times" @click="close"></i>
        </div>
        <form id="metric-form">
            <div class="form-floating">
                <input class="form-control form-control-lg" type="text" v-model="metric.text"/>
                <label>Title</label>
            </div>
        </form>
    </div>
</template>

<script>
export default {
  name: 'MetricForm',
  props: {
      metric: Object
  },
  methods: {
      close
  }
}

function close() {
    this.$emit('closeForm');
}
</script>

<style scoped>
.wrapper {
    padding-right: 10px
}
</style>