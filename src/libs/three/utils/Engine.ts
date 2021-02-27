import {
  WebGLRenderer,
  PerspectiveCamera,
  Color,
  Scene,
  Object3D
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import TWEEN from '@tweenjs/tween.js'

import LineGenerator from '../LineGenerator.class'
// export interface DefEngineOpts {
//   backgroundColor:string,
//   z:number
// }
const defEngineOpt: Record<string, any> = {
  backgroundColor: '',
  z: 30
}
export default class Engine {
  width: number
  height: number
  meshCount = 0
  meshListeners: Array<any> = []
  devicePixelRatio: number
  renderer = new WebGLRenderer({ antialias: true, alpha: true })
  camera: PerspectiveCamera
  cameraControl: OrbitControls
  dom: HTMLElement
  scene = new Scene()
  constructor (param?: Record<string, any>) {
    if (param && param.w) {
      this.width = param.w
    }
    if (param && param.h) {
      this.height = param.h
    }

    let opts = { ...defEngineOpt }
    if (param) {
      opts = { ...defEngineOpt, ...param }
    }
    const { backgroundColor, z } = opts

    this.devicePixelRatio = window.devicePixelRatio
      ? Math.min(1.6, window.devicePixelRatio)
      : 1
    this.renderer.setPixelRatio(this.devicePixelRatio)
    if (backgroundColor !== undefined && backgroundColor !== '') {
      this.renderer.setClearColor(new Color(backgroundColor))
    }
    this.camera = new PerspectiveCamera(50, this.width / this.height, 1, 1000)
    this.camera.position.set(0, 0, z)

    this.dom = this.renderer.domElement

    this.update = this.update.bind(this)
    this.resize = this.resize.bind(this)
  }
  /**
   * * *******************
   * * SCENE MANAGMENT
   * * *******************
   */
  add(mesh: LineGenerator): void
  add(mesh: Object3D): void
  add (mesh: Object3D | LineGenerator): void {
    this.scene.add(mesh)
    if (mesh instanceof LineGenerator) {
      this.meshListeners.push(mesh.update)
      this.meshCount++
    }
  }

  remove(mesh: LineGenerator): void
  remove(mesh: Object3D): void
  remove (mesh: Object3D | LineGenerator): void {
    this.scene.remove(mesh)
    if (mesh instanceof LineGenerator) {
      const index = this.meshListeners.indexOf(mesh.update)
      if (index > -1) this.meshListeners.splice(index, 1)
      this.meshCount--
    }
  }

  start (): void {
    this.update()
  }

  update (): void {
    let i = this.meshCount
    while (--i >= 0) {
      this.meshListeners[i].apply(this, [null])
    }
    this.render()
    // Loop
    requestAnimationFrame(this.update)
    TWEEN.update(Date.now())
  }
  render (): void {
    this.renderer.render(this.scene, this.camera)
  }
  // Resize
  resize (w: number, h: number): void {
    this.width = w
    this.height = h
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.resizeRender()
  }
  resizeRender (): void {
    this.renderer.setSize(this.width, this.height)
  }
}
