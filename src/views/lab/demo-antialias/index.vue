<template>
  <div class="demo-antialias" :id="id" v-resize="handleResize">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as THREE from 'three'
import { useThree } from '@/composition/three'
import fs from './t.fs?raw'
import vs from './t.vs?raw'
export default defineComponent({
  name: 'DemoAntialias',
  components: {},
  props: {},
  setup ():any {
    let { state, init } = useThree({ cameraType: 'o' })
    return {
      id: 'antialias',
      state,
      init
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
      this.state.handleResize(e)
      if(this.plane) {
        this.plane.scale.set(e.clientWidth, e.clientHeight, 1)
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
            time: { value: 0 },
            x: { value: 0 },
            ratio: { value: dom.clientWidth / dom.clientHeight },
            shaderWidth: { value: dom.clientWidth },
            shaderHeight: { value: dom.clientHeight },
            iMouseX: { value: 0 },
            iMouseY: { value: 0 },
            iResolutionX: { value: window.screen.width },
            iResolutionY: { value: window.screen.height }
          },
          vertexShader: vs,
          fragmentShader: fs
        })

        this.material = material
        let mesh = new THREE.Mesh(geometry, material)
        mesh.position.z = -0.1
        this.plane = mesh
        this.state.scene.add(mesh)
      }
    },
    animate () {
      this.material.uniforms.time.value += 0.005
    }
  }
})
</script>

<style lang="stylus">
// @import 'demo-antialias';
.demo-antialias{
  width 500px
  height 500px
}
</style>