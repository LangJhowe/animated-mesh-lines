<template>
  <div class="shader-draw-editor"

       :id="id" v-resize="handleResize">
    <div class="sde__options">
      <button @click="run">RUN</button>
    </div>
    <div class="sde__panel" :style="{height:height+'px'}">
      <div class="sde__panel-editor" ref="container">
      </div>
      <div class="sde__panel-previewer">
        <div class="sde-canvas-container" ref="canvasContainer">

        </div>
        <div v-if="threeError.length!=0" class="sde__error">
          <p v-for="(l,i) in threeError" :key="i">{{ l }}</p>
        </div>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw, onMounted } from 'vue'
import * as THREE from 'three'
import event from '@/utils/event-bus'
import * as Monaco from 'monaco-editor'
import { useThree } from '@/composition/three'

function addLineNumbers ( string:string ) {
  const lines = string.split( '\n' )
  for ( let i = 0; i < lines.length; i++ ) {
    lines[ i ] = ( i + 1 ) + ': ' + lines[ i ]
  }
  return lines.join( '\n' )

}
export default defineComponent({
  name: 'ShaderDrawBoard',
  components: {},
  props: {
    id: String,
    height: { type: Number, default: 500 },
    text: String,
    uniform: { type: Object, default: () => {return {}} }
  },
  setup () {
    let { state, init } = useThree({ alpha: true, cameraType: 'o' })
    onMounted(() => {
    })
    return {
      state,
      init
    }
  },
  data () {
    return {
      errorTag: '',
      editor: Monaco.editor.create(document.createElement('i'), {}),
      material: new THREE.ShaderMaterial(),
      plane: new THREE.Mesh(),
      vs: 'varying vec3 vPosition;\nvoid main(){\n\tvPosition=position;\n\tgl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);\n}',
      fs: this.text,
      //       text: `void aa (){\n\tlet a.n=b;\n}\nfloat down(){\n\tif() {\n\t} else {\n\t}\n\treturn 0.;\n\t}\n\tvoid main(){\n\tfloat unitW=1./shaderWidth;\n\tvec3 fColor=vec3(1.,1.,0.);\n\tvec3 bColor=vec3(0.,0.,0.);\n\tvec3 color=vec3(0.,0.,0.);\n\tfloat unitH=unitW*ratio;\n\tfloat halfAngleWidth=10.*unitW;\n\tfloat halfAngleHeight=10.*unitH;
      // \n\tfloat y=vPosition.y/ratio;\n\t// float w=-0.1*unitH;
      // \n\tfloat d=angle(\n\t\n\tvec2(50.*unitW,0.),\n\t\n\tvec2(10.*unitW,20.*unitH),\n\t\n\tvec2(0.,-20.*unitH),\n\t\n\tvPosition.xy\n\t);\n\t// float d = min(d,line(vPosition.xy,vec2(-50.*unitW,0.),vec2(10.*unitW,20.*unitH)));\n\t// float d=line(vPosition.xy,vec2(-50.*unitW,0.),vec2(10.*unitW,20.*unitH),.01);\n\t// float d=min(d,angle(\n\t//     vec2(10.*unitW,0.),\n\t//     vec2(-10.*unitW,0.),\n\t//     vec2(20.*unitW,10.*unitH),\n\t//     vPosition.xy\n\t//   ));\n\t// float w=fwidth(.9*d)*1.;\n\t// color=mix(fColor,bColor,smoothstep(-w,+w,d));\n\tgl_FragColor=vec4(color,1.);\n}
      //       `,
      threeError: [] as String[]
    }
  },
  computed: {},
  created () {
    this.errorTag = 'SHADER_ERROR_TAG-' + Date.now()

    event.on('sde__error', (params) => {
      if(this.errorTag == params.tag) {
        let threeError = []
        if(params.errorData[0].indexOf('shader error') > -1) {
          let codeArr = params.errorData.pop().split(/\s\d*:\s/).map((str:string, index:number) => {
            return `${index}:\t${str}`
          })
          console.log(3, this.errorTag)
          threeError = [params.errorData.join(''), ...codeArr]
          this.threeError = threeError
          event.emit('sde__error_tag', '')
        }

      }
    })
  },
  mounted () {

    this.initEditor()
    this.initCanvas()
  },
  methods: {
    initEditor () {

      this.editor = Monaco.editor.create(toRaw(this.$refs.container) as HTMLElement, {
        value: this.fs,
        language: 'glsl',
        wordWrap: 'on',
        theme: 'glslTheme', // vs, hc-black, or vs-dark
        automaticLayout: true
      })
      this.editor.onDidChangeModelContent(() => {
        // 更新fragment时只能用新的ShaderMaterial,直接改变原ShaderMaterial的fragment并不会触发更新

        // 更新fragment时只能用新的ShaderMaterial,直接改变原ShaderMaterial的fragment并不会触发更新

        // 不好做都动态同步
        // 如果按照three源码校验会很麻烦,没有暴露出内置变量函数的方法
        // 方法二 拦截console.error，设置标记 传递error值  但是清除是个问题,只能设计成手动run
        //
        event.emit('sde__error_tag', this.errorTag)
      })
    },
    initCanvas () {
      if(this.$refs.canvasContainer) {
        let containerDom = this.$refs.canvasContainer as HTMLElement
        if(containerDom) {
          this.init(containerDom)
          this.insertObj()
          this.state.animateCallback = this.animate
        }
      }
    },
    handleResize (e: HTMLElement):void {
      let editor = toRaw(this.editor) // 用vue的proxy对象 会很卡
      editor.layout({
        width: e.clientWidth / 2,
        // 如果用e.clientHeight,当宽度变小时,e的高度会一直变化,导致
        // height: this.height
        height: e.clientHeight
      })
      let vE = {
        clientWidth: e.clientWidth / 2,
        // 如果用e.clientHeight,当宽度变小时,e的高度会一直变化,导致
        // height: this.height
        clientHeight: e.clientHeight
      } as HTMLElement

      this.handleCanvasResize(vE)
    },
    handleCanvasResize (e: HTMLElement) :void {
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
          vertexShader: this.vs,
          fragmentShader: this.fs
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
    },
    jsCodeDecorade (value:string) {
      return '```javascript\n' + value + '\n```'
    },
    run () {
      this.threeError = []
      this.fs = toRaw(this.editor).getValue()
      this.updateFs(this.fs as string)
    },
    handleThreeError () {

    },
    getShaderErrors ( gl:any, shader:any, type:any) {

      const status = gl.getShaderParameter( shader, 35713 )
      const log = gl.getShaderInfoLog( shader ).trim()

      if ( status && log === '' ) return ''

      // --enable-privileged-webgl-extension
      // console.log( '**' + type + '**', gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( shader ) );

      const source = gl.getShaderSource( shader )
      // console.log();
      let ll = log.length

      return 'THREE.WebGLShader: gl.getShaderInfoLog() ' + type + '\n' + log.substring(0, ll - 2) + '\n' + addLineNumbers( source )

    },
    updateFs (fs:string) {
      let dom = this.$refs.canvasContainer as HTMLElement
      let material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 2.5 },
          x: { value: 0 },
          ratio: { value: dom.clientWidth / dom.clientHeight },
          shaderWidth: { value: dom.clientWidth },
          shaderHeight: { value: dom.clientHeight }
        },
        vertexShader: this.vs,
        fragmentShader: fs
      })
      this.plane.material = material
    }
  },
  watch: {
    text (nv) {
      this.fs = nv
      this.updateFs(nv)
    }
  }
})
</script>

<style lang="stylus">
@import 'shader-draw-editor'
</style>