<template>
  <div class="layout">

    <github-corner class="github-link" :link="'https://github.com/LangJhowe/animated-mesh-lines'"></github-corner>
    <div class="header-nav">
      <router-link class="nav-item" :class="{'nav-item--active':isActive('demo1')}" to="/mesh-line/demo1">Demo1</router-link>
      <router-link class="nav-item" :class="{'nav-item--active':isActive('demo2')}" to="/mesh-line/demo2">Demo2</router-link>
      <router-link class="nav-item" :class="{'nav-item--active':isActive('demo3')}" to="/mesh-line/demo3">Demo3</router-link>
      <router-link class="nav-item" :class="{'nav-item--active':isActive('demo4')}" to="/mesh-line/demo4">Demo4</router-link>
      <router-link class="nav-item" :class="{'nav-item--active':isActive('demo5')}" to="/mesh-line/demo5">Demo5</router-link>
      <router-link class="nav-item" :class="{'nav-item--active':isActive('demo5')}" to="/shader-draw-editor/index">Shader-Draw-Editor</router-link>

      <p class="saysomething">
        使用vite+vue3 +typescript实现国外一个好看的<a class="three-link" href="https://github.com/Jeremboo/animated-mesh-lines" target="_Blank">three.js项目</a>
      </p>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GithubCorner from '@/components/github-corner/right.vue'
export default defineComponent({
  name: 'Layout',
  components: { GithubCorner },
  props: {},
  setup ():any {
    return {}
  },
  computed: {
    isActive () {
      return (str:string):boolean => {
        let reg = new RegExp(`${str}$`)
        return reg.test(this.$route.path)
      }
    }
  }
})
</script>

<style lang="stylus">
.layout
  height 100%
  .header-nav
    position relative
    z-index 1000
    color rgba(255,255,255,.8)
    background rgba(0,0,0,.5)
    padding 10px
    .nav-item
      display inline-block
      padding 6px
      color #fff
      font-size 28px
      &--active{
        color #FDEE17
      }
    .saysomething
      color #fff
      font-size 24px
      .three-link
        text-decoration  none
  .github-link
    position absolute
    z-index 2000
    right 0
</style>
