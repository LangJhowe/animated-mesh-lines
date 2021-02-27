<template>
  <div class="page-404">
    OOPS,A DEAD LINK.
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: '404',
  components: {},
  props: {},
  setup ():any {
    return {}
  }
})
</script>

<style lang="stylus">
.page-404
  position fixed
  top 50%
  left 50%
  color red
  font-family 'Rhyder'
  font-size 30px
</style>