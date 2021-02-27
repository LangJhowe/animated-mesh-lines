/*
 * @Descripttion:
 * @version:
 * @Author: Jhowe
 * @Date: 2020-09-21 09:22:24
 * @LastEditors: Jhowe
 * @LastEditTime: 2021-02-27 22:07:47
 */
import { SphereBufferGeometry, MeshBasicMaterial, Mesh, Object3D, Vector3 } from 'three'

import getRandomFloat from '../utils/getRandomFloat'

const starGeometry = new SphereBufferGeometry(0.5, 2, 2)
const starMaterial = new MeshBasicMaterial({
  color: 0xecf0f1,
  transparent: true,
  opacity: 0.3
})
export class Star extends Mesh {
  t:number
  position:Vector3
  constructor () {
    super(starGeometry, starMaterial)

    this.t = Math.random() * 10
    this.position.set(
      Math.random() - 0.5,
      Math.random() - 0.5,
      -Math.random() * 0.5
    ).normalize().multiplyScalar(getRandomFloat(100, 300))

    this.update = this.update.bind(this)
  }

  update ():void {
    this.t += 0.01
    this.scale.x = this.scale.y = this.scale.z = Math.sin(this.t) + 1
  }
}
/**
 * * *******************
 * * MAIN
 * * *******************
 */
export default class Starts extends Object3D {
  constructor (nbrOfStars = 300) {
    super()

    // TODO make instancied Stars
    for (let i = 0; i < nbrOfStars; i++) {
      const star = new Star()
      this.add(star)
    }
  }
}