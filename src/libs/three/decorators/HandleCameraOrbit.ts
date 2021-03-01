/*
 * @Descripttion:
 * @version:
 * @Author: Jhowe
 * @Date: 2020-09-17 15:49:51
 * @LastEditors: Jhowe
 * @LastEditTime: 2021-03-02 00:04:18
 */
import { Vector3 } from 'three'
import ThreeScene from '@/libs/three/scene'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// import app from 'App';
// 装饰器工厂
function HandleCameraOrbit (
  cameraAmpl = { x: 5, y: 5 },
  velocity = 0.1,
  lookAt = new Vector3()
): any {
  return function (Target: any): any {
    return class HandleCameraOrbit extends Target {
      enableScale: boolean
      worldDirection: Vector3
      mousedownEvent: MouseEvent
      // cameraControl: OrbitControls

      constructor (props: any) {

        super(props)
        this.enableScale = false

        this.cameraAmpl = cameraAmpl
        this.cameraVelocity = velocity
        this.lookAt = lookAt

        this.mousePosition = { x: 0, y: 0 }
        this.normalizedOrientation = new Vector3()

        this.update = this.update.bind(this)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleOrientationMove = this.handleOrientationMove.bind(this)
        this.handleMouseWheel = this.handleMouseWheel.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)

        // this.cameraControl = new OrbitControls(
        //   this.camera,
        //   this.renderer.domElement
        // )

        // this.cameraControl.addEventListener('change', this.render)
        // this.cameraControl.update()
        // if (app.isMobile) {
        //   window.addEventListener(
        //     'deviceorientation',
        //     this.handleOrientationMove
        //   )
        // } else {

        // 鼠标事件
        // window.addEventListener('mousemove', this.handleMouseMove)
        // window.addEventListener('mousedown', this.handleMouseDown)
        // window.addEventListener('mouseup', this.handleMouseUp)
        // document.addEventListener('mouseleave', this.handleMouseLeave)

        // 鼠标滚动事件
        // if (document.addEventListener) {
        //   /*Firefox注册事件*/
        //   document.addEventListener(
        //     'DOMMouseScroll',
        //     this.handleMouseWheel,
        //     false
        //   )
        // } else {
        // window.addEventListener('onmousewheel', this.handleMouseWheel)
        // }
        // window.onmousewheel = this.handleMouseWheel //IE/Opera/Chrome

        // 键盘事件
        // window.onkeydown = this.handleKeyDown //IE/Opera/Chrome

        // }
      }
      handleMouseDown (event: any) {
        console.log('handleMouseDown')
        this.mousedownEvent = event
        this.enableScale = true
      }
      handleMouseMove (event: any) {
        if (this.enableScale) {
          const worldDirection = this.worldDirection

          const curCameraPosition = this.camera.position.clone()
        } else {
          // this.mousePosition.x =
          //   event.clientX ||
          //   (event.touches && event.touches[0].clientX) ||
          //   this.mousePosition.x
          // this.mousePosition.y =
          //   event.clientY ||
          //   (event.touches && event.touches[0].clientY) ||
          //   this.mousePosition.y
          // this.normalizedOrientation.set(
          //   -(this.mousePosition.x / this.width - 0.5) * this.cameraAmpl.x,
          //   (this.mousePosition.y / this.height - 0.5) * this.cameraAmpl.y,
          //   0.5
          // )
        }
      }
      handleMouseUp (event: any) {
        console.log('handleMouseUp')
        this.enableScale = false
      }
      handleMouseLeave () {
        console.log('mouse leave window')
        this.enableScale = false
      }

      handleOrientationMove (event: any) {
        // https://stackoverflow.com/questions/40716461/how-to-get-the-angle-between-the-horizon-line-and-the-device-in-javascript
        const rad = Math.atan2(event.gamma, event.beta)
        if (Math.abs(rad) > 1.5) return
        this.normalizedOrientation.x = -rad * this.cameraAmpl.y
        // TODO handle orientation.y
      }

      /**
       * 缩放画面
       * @param event
       */
      handleMouseWheel (event: any) {
        console.log('handleMouseWheel')
        // const near = this.camera.near
        // const delta = event.deltaY / 10
        // const newNear = near + delta
        // console.log(newNear)
        // this.camera.near = newNear
        // this.camera.updateMatrixWorld()
      }

      handleKeyDown (event: any) {
        // 按lookAt 推进camera
        const { keyCode } = event
        const { x, y, z } = this.camera.position
        if (keyCode === 38) {
          // ↑
          this.camera.position.z = z - 1
        } else if (keyCode === 39) {
          // →
          this.camera.position.x =
            x - 1
          // this.camera.rotateY(-0.01)
        } else if (keyCode === 40) {
          // ↓
          this.camera.position.z = z + 1
        } else if (keyCode === 37) {
          // ←
          // this.camera.rotateY(0.01)
          this.camera.position.x =
            x + 1
        }
      }

      update () {
        console.log('du')

        super.update()

        this.camera.position.x +=
          (this.normalizedOrientation.x - this.camera.position.x) *
          this.cameraVelocity
        this.camera.position.y +=
          (this.normalizedOrientation.y - this.camera.position.y) *
          this.cameraVelocity
        this.camera.lookAt(this.lookAt)
      }
    }
  }
}

export default HandleCameraOrbit
