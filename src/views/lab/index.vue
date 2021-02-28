<template>
  <l-page class-name="index">
    <!-- <l-header style="position:relative;z-index:10;"></l-header>
    <div style="position:relative;top:-35px;background:green;z-index:5;">1</div>
    index{{ count }} -->
    <tetrahedron></tetrahedron>
    <antialias></antialias>
  <!-- <shader-draw-board></shader-draw-board> -->
  </l-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LHeader from '@/components/header/index.vue'
import LPage from '@/layout/components/page/index.vue'
import Tetrahedron from './demo-shadertoy/tetrahedron.vue'
import Antialias from './demo-antialias/index.vue'
// import ShaderDrawBoard from '@/components/shader-draw-board/index.vue'
export default defineComponent({
  components: {
    // LHeader,
    LPage,
    Tetrahedron,
    Antialias
    // ShaderDrawBoard
  },
  props: {},
  setup ():any {
    return { count: 0 }
  }

})
</script>

<style lang="stylus">
@import './index.styl';
</style>