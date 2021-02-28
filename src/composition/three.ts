import { reactive, toRaw } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface BaseThree {
  dom: any
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera:  THREE.OrthographicCamera|THREE.PerspectiveCamera|null
  animateCallback():any;
  handleResize(e: HTMLElement):any;
  orbitControls: OrbitControls|null
}

interface UseThreeParam {
  cameraType?: string
  alpha?: boolean
  clearColor?: string|number|THREE.Color
}
const defs:UseThreeParam = { cameraType: 'o' }

function useThree (useThreeParam:UseThreeParam):any {
  const { cameraType, alpha, clearColor } = { ...defs, ...useThreeParam }
  const baseThree: BaseThree = {
    dom: null,
    renderer: new THREE.WebGLRenderer({ antialias: true, alpha }),
    scene: new THREE.Scene(),
    camera: null,
    animateCallback: () => {},
    handleResize: (e: HTMLElement) => {
      if(state.camera instanceof THREE.PerspectiveCamera) {
        state.camera.aspect = e.clientWidth / e.clientHeight
      } else if(state.camera instanceof THREE.OrthographicCamera) {
        state.camera.left = -e.clientWidth / 2
        state.camera.right = e.clientWidth / 2
        state.camera.top = e.clientHeight / 2
        state.camera.bottom = -e.clientHeight / 2
      }
      state.renderer.setSize(e.clientWidth, e.clientHeight)
    },
    orbitControls: null
  }
  const state = reactive(baseThree)

  function init (containerDom: HTMLElement) {
    state.dom = containerDom
    initRenderer()
    initCamera()
    render()
  }
  function initRenderer () {
    if (state.dom) {
      state.renderer.setSize(state.dom.clientWidth, state.dom.clientHeight)
      if(clearColor) {
        state.renderer.setClearColor(clearColor)
        state.renderer.setClearColor(clearColor)
      }

      state.dom.appendChild(state.renderer.domElement)
      // if(state.renderer.domElement) {
      // }
    }
  }
  // fov = 75, near = 1, far = 1000
  function initCamera () {
    if (state.dom) {
      if(cameraType == 'p') {
        const fov = arguments[0] || 75,
              near = arguments[1] || 1,
              far = arguments[2] || 1000
        const aspect = state.dom.clientWidth / state.dom.clientHeight
        state.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        state.camera.position.z = 20

        state.orbitControls = new OrbitControls(
          toRaw(state.camera),
          toRaw(state.dom)
        )
      } else if (cameraType == 'o') {
        const halfWidth = state.dom.clientWidth / 2,
              halfHeight = state.dom.clientHeight / 2
        state.camera = new THREE.OrthographicCamera(-halfWidth + 1, halfWidth - 1, halfHeight, -halfHeight, 0.1, 1000)
        // state.camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 1, 10)
        state.scene.add(state.camera)
        // const cameraOrthoHelper = new THREE.CameraHelper( state.camera )
        // state.scene.add( cameraOrthoHelper )
        // state.orbitControls == new OrbitControls(
        //   toRaw(state.camera),
        //   toRaw(state.dom)
        // )

      }
    }
  }
  function render () {
    animate()
  }
  function animate () {
    requestAnimationFrame(animate)
    state.animateCallback()
    if(state.camera) {
      if(cameraType == 'p' && state.orbitControls) {
        state.orbitControls.update()
      }
      state.camera.updateProjectionMatrix()
      state.renderer.render(toRaw(state.scene), toRaw(state.camera))
    }
  }
  return {
    state,
    init
  }
}
export { useThree }
