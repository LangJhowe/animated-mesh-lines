/*
 * @Descripttion:
 * @version:
 * @Author: Jhowe
 * @Date: 2020-09-15 22:51:39
 * @LastEditors: Jhowe
 * @LastEditTime: 2021-03-02 00:03:24
 */
import * as THREE from 'three'
export default class ThreeScene {
  dom: HTMLElement
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  constructor (parameters: { dom: HTMLElement; clearColor: THREE.Color }) {
    const { dom, clearColor } = parameters
    this.dom = dom
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.setClearColor(clearColor)
    window.addEventListener('resize', this.onWindowResize, false)
    this.init()
  }

  private init () {
    this.camera.position.set(50, 50, 50)
    this.camera.lookAt(0, 0, 0)
    this.renderer.setClearColor(0xffffff)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    if (this.dom) {
      this.dom.appendChild(this.renderer.domElement)

    }
    this.scene.add(new THREE.AxesHelper(10))
    // this.scene.add(new THREE.AmbientLight(0x444444))
    this.animate()
  }
  private onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
  private render () {
    this.renderer.render(this.scene, this.camera)
  }
  private animate = () => {
    requestAnimationFrame(this.animate)
    this.render()
  }

  // Scene
  setClearColor (clearColor: THREE.Color): void {
    this.renderer.setClearColor(clearColor)
  }

  // add
  add (mesh: THREE.Object3D): void {
    this.scene.add(mesh)
  }
}
