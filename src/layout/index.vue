<template>
  <div class="layout">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Layout',
  components: {},
  props: {},
  setup ():any {
    return {}
  }
})
</script>

<style lang="stylus">
.layout
  height 100%
</style>
