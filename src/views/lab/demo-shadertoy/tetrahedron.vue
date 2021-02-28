<template>
  <div class="tetrahedron" :id="id" v-resize="handleResize"
       @mousedown="handleMousedown">
  </div>
</template>

<script lang="ts">
import * as THREE from 'three'
import { useThree } from '@/composition/three'
import fs from './t.fs?raw'
import vs from './t.vs?raw'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Tetrahedron',
  components: {},
  props: {},
  setup ():any {
    let { state, init } = useThree({})
    return {
      id: 'tetrahedron',
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
      this.state.handleResize(e)
      if(this.plane) {
        this.plane.scale.set(e.clientWidth, e.clientHeight, 1)
        this.material.uniforms.shaderWidth.value = e.clientWidth
        this.material.uniforms.shaderHeight.value = e.clientHeight
      }
    },
    handleMousedown (e:MouseEvent) {
      let cW = this.state.dom.clientWidth,
          cH = this.state.dom.clientHeight,
          cLeft = this.state.dom.offsetLeft,
          cTop = this.state.dom.offsetTop
      let x = -(cW / 2 - (e.clientX - cLeft) ) / cW,
          y = (cH / 2 - (e.clientY - cTop)) / cH
      this.material.uniforms.iMouseX.value = x
      this.material.uniforms.iMouseY.value = y

      // 为什么不行？
      window.onmousemove = (me:MouseEvent) => {
        let x = -(cW / 2 - (me.clientX - cLeft) ) / cW,
            y = (cH / 2 - (me.clientY - cTop)) / cH
        this.material.uniforms.iMouseX.value = x
        this.material.uniforms.iMouseY.value = y
      }
      window.onmouseup = () => {
        this.material.uniforms.iMouseX.value = 0
        this.material.uniforms.iMouseY.value = 0
        window.onmousemove = null
        window.onmouseup = null
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
// @import 'tetrahedron';
.tetrahedron{
  width 600px
  height 600px
}
</style>