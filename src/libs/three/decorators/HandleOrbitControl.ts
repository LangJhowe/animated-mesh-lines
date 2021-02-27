/*
 * @Descripttion:
 * @version:
 * @Author: Jhowe
 * @Date: 2020-09-18 18:04:19
 * @LastEditors: Jhowe
 * @LastEditTime: 2020-09-18 18:09:26
 */
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

function HandleOrbitControl ():any {
  return function (Target: any):any {
    return class HandleOrbitControl extends Target {
      cameraControl: OrbitControls

      constructor (props: any) {
        super(props)

        this.cameraControl = new OrbitControls(
          this.camera,
          this.renderer.domElement
        )
      }

      animate () {
        super.animate()
        this.cameraControl.update()
      }
    }
  }
}
export default HandleOrbitControl