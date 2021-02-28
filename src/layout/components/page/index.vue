<template>
  <div class="l-page" :class="className">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LPage',
  props: { className: String },
  setup ():any {
    return { count: 0 }
  }
})
</script>
<style lang="stylus" >
// @import '';
</style>
