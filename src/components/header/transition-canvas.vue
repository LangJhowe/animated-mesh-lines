<template>
  <div class="transition-canvas" :id="id" v-resize="handleResize">
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRaw } from 'vue'
import * as THREE from 'three'
import { useThree } from '@/composition/three'
import HeaderFs from './header.fs?raw'
import HeaderVs from './header.vs?raw'
export default defineComponent({
  name: 'TransitionCanvas',
  setup () {
    let { state, init } = useThree({ alpha: true })
    return {
      id: 'TRANSITION_CANVAS',
      state,
      init
    }
  },
  data () {
    return {
      material: new THREE.ShaderMaterial(),
      plane: new THREE.Mesh()
    }
  },
  mounted () {
    let containerDom = document.getElementById(this.id)
    if(containerDom) {
      this.init(containerDom)
      this.insertObj()
      this.state.animateCallback = this.animate
    }
  },
  methods: {
    handleResize (e: HTMLElement):void {
      console.log(e)
      this.state.handleResize(e)
      if(this.plane) {
        this.plane.scale.set(e.clientWidth, e.clientHeight, 1)
        this.material.uniforms.ratio.value = e.clientWidth / e.clientHeight
        this.material.uniforms.shaderWidth.value = e.clientWidth
        this.material.uniforms.shaderHeight.value = e.clientHeight

      }
    },
    insertObj ():void {
      let dom = this.state.dom
      if(dom) {
        let geometry = new THREE.PlaneBufferGeometry(1, 1)

        let material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 2.5 },
            x: { value: 0 },
            ratio: { value: dom.clientWidth / dom.clientHeight },
            shaderWidth: { value: dom.clientWidth },
            shaderHeight: { value: dom.clientHeight }
          },
          vertexShader: HeaderVs,
          fragmentShader: HeaderFs
        })
        this.material = material
        let mesh = new THREE.Mesh(geometry, material)
        mesh.position.z = -0.1
        this.plane = mesh
        this.state.scene.add(mesh)
      }
    },
    animate () {
      // this.material.uniforms.time.value -= 0.03
    }
  }
})
</script>

<style lang="stylus">
// @import '';
.transition-canvas
  position absolute
  top 0
  left 0
  height 100%
  width 100%

</style>