<template>
  <div class="l-header">
    <div class="l-header__container">
      l-header
    </div>
    <transition-bg></transition-bg>
  </div>
</template>

<script lang="ts">
/**
 * 特性：
 * 离开可视区域时,吸顶
 */
import { defineComponent } from 'vue'
import TransitionBg from './transition-canvas.vue'
export default defineComponent({
  name: 'LHeader',
  components: { TransitionBg },
  props: {},
  setup ():any {
    return { count: 0 }
  }
})
</script>
<style lang="stylus" >
@import './header';
</style>
