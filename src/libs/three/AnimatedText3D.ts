/*
 * @Descripttion:
 * @version:
 * @Author: Jhowe
 * @Date: 2020-09-16 11:07:20
 * @LastEditors: Jhowe
 * @LastEditTime: 2021-02-27 21:31:59
 */
// https://github.com/Jeremboo/animated-mesh-lines/blob/master/app/objects/AnimatedText3D.js
import {
  Object3D,
  ShapeGeometry,
  MeshBasicMaterial,
  Mesh,
  FontLoader,
  Material
} from 'three'
import { TimelineLite, Back } from 'gsap'
import fontJson from '@/assets/three/fonts/fontFile.json'

const fontLoader = new FontLoader()
const font = fontLoader.parse(fontJson)

export default class AnimatedText3D extends Object3D {
  basePosition: number
  size: number
  tm: TimelineLite
  constructor (
    text: string,
    {
      size = 0.8,
      letterSpacing = 0.03,
      color = '#000000',
      duration = 0.6,
      opacity = 1,
      wireframe = false
    } = {}
  ) {
    super()

    this.basePosition = 0
    this.size = size

    const letters = [...text]
    letters.forEach(letter => {
      if (letter === ' ') {
        this.basePosition += size * 0.5
      } else {
        const geom = new ShapeGeometry(
          font.generateShapes(letter, size)
        )
        geom.computeBoundingBox()
        const mat = new MeshBasicMaterial({
          color,
          opacity: 0,
          transparent: true,
          wireframe
        })
        const mesh = new Mesh(geom, mat)

        mesh.position.x = this.basePosition

        if (geom && geom.boundingBox && letterSpacing) {
          this.basePosition +=
            geom.boundingBox.max.x + letterSpacing
        }
        this.add(mesh)
      }
    })

    // Timeline
    this.tm = new TimelineLite({ paused: true })
    this.tm.set({}, {}, `+=${duration * 1.1}`)
    this.children.forEach(letter => {
      const data = {
        opacity: 1,
        position: -0.5
      }
      this.tm.to(
        data,
        duration,
        {
          opacity,
          position: 0,
          ease: Back.easeOut.config(2),
          onUpdate: () => {
            const meshLetter: Mesh = <Mesh>letter
            const materialLetter: MeshBasicMaterial = <MeshBasicMaterial>(meshLetter.material)
            meshLetter.material = materialLetter
            meshLetter.material.opacity = data.opacity
            meshLetter.position.y = data.position
            meshLetter.position.z = data.position * 2
            meshLetter.rotation.x = data.position * 2
          }
        },
        `-=${duration - 0.03}`
      )
    })

    // Bind
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
  }

  show (): void {
    this.tm.play()
  }

  hide (): void {
    this.tm.reverse()
  }
}