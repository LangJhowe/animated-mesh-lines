/*
 * @Descripttion:
 * @version:
 * @Author: Jhowe
 * @Date: 2020-09-16 16:28:16
 * @LastEditors: Jhowe
 * @LastEditTime: 2021-02-27 17:57:51
 */
import {
  Matrix4,
  BufferGeometry,
  Matrix3,
  Geometry,
  Vector3,
  BufferAttribute,
  Line
} from 'three'
import * as THREE from 'three'

export default class MeshLineGeometry extends BufferGeometry {
  type = 'MeshLine'
  positions: Array<number> = []

  previous: Array<number> = []
  side: Array<number> = []
  width: Array<number> = []
  uvs: Array<number> = []
  counters: Array<number> = []

  indices_array: Array<number> = []
  next: Array<number> = []
  _attributes: Record<string, BufferAttribute>
  _points:Array<Vector3>|Array<number> = []
  _geom = null
  widthCallback?: (n: any) => any | boolean
  constructor () {
    super()
  }
  get geometry (): BufferGeometry {
    return this
  }
  get points ():Array<any> {
    return this._points
  }
  set points (value:Array<any>) {
    this.setPoints(value, this.widthCallback)
  }

  setGeometry(g: Geometry, wcb?: (n: any) => any | boolean): void
  setGeometry(g: Array<Vector3>, wcb?: (n: any) => any | boolean): void
  setGeometry (g: Array<Vector3> | Geometry, wcb?: (n: any) => any | boolean): void {

    if (g instanceof Geometry) {
      this.setPoints(g.vertices, wcb)
    } else {
      this.setPoints(g, wcb)
    }
  }

  setPoints(points: Array<number>, wcb?: (n: any) => any | boolean): void;
  setPoints(points: Array<Vector3>, wcb?: (n: any) => any | boolean): void;
  setPoints (points: Array<Vector3>|Array<number>, wcb?: (n: any) => any | boolean): void {
    this._points = points
    this.widthCallback = wcb
    this.positions = []
    this.counters = []
    if (points.length && points[0] instanceof Vector3) {
      for (let j = 0; j < points.length; j++) {
        const p = <Vector3>points[j]
        const c = j / points.length
        this.positions.push(p.x, p.y, p.z)
        this.positions.push(p.x, p.y, p.z)
        this.counters.push(c)
        this.counters.push(c)
      }
    } else {
      for (let j = 0; j < points.length; j += 3) {
        const c = j / points.length
        this.positions.push(<number>points[j], <number>points[j + 1], <number>points[j + 2])
        this.positions.push(<number>points[j], <number>points[j + 1], <number>points[j + 2])
        this.counters.push(c)
        this.counters.push(c)
      }
    }
    this.process()
  }

  process (): void {

    const l = this.positions.length / 6 // ？？除6

    this.previous = []
    this.next = []
    this.side = []
    this.width = []
    this.indices_array = []
    this.uvs = []

    let w

    let v: Array<number>

    // initial previous points
    if (this.compareV3(0, l - 1)) {
      v = this.copyV3(l - 2)
    } else {
      v = this.copyV3(0)
    }
    // ？？push 两次
    this.previous.push(v[0], v[1], v[2])
    this.previous.push(v[0], v[1], v[2])

    for (let j = 0; j < l; j++) {
      // sides ??
      this.side.push(1)
      this.side.push(-1)

      // widths
      if (this.widthCallback) w = this.widthCallback(j / (l - 1))
      else w = 1

      this.width.push(w) // ?? width指什么
      this.width.push(w)

      // uvs
      this.uvs.push(j / (l - 1), 0) // ?? uvs指什么
      this.uvs.push(j / (l - 1), 1)

      if (j < l - 1) {
        // points previous to poisitions
        v = this.copyV3(j)
        this.previous.push(v[0], v[1], v[2])
        this.previous.push(v[0], v[1], v[2])

        // indices
        const n = j * 2
        this.indices_array.push(n, n + 1, n + 2)
        this.indices_array.push(n + 2, n + 1, n + 3)
      }
      if (j > 0) {
        // points after poisitions
        v = this.copyV3(j)
        this.next.push(v[0], v[1], v[2])
        this.next.push(v[0], v[1], v[2])
      }
    }

    // last next point
    if (this.compareV3(l - 1, 0)) {
      v = this.copyV3(1)
    } else {
      v = this.copyV3(l - 1)
    }
    this.next.push(v[0], v[1], v[2])
    this.next.push(v[0], v[1], v[2])

    // redefining the attribute seems to prevent range errors
    // if the user sets a differing number of vertices
    if (
      !this._attributes ||
      this._attributes.position.count !== this.positions.length
    ) {
      this._attributes = {
        position: new BufferAttribute(
          new Float32Array(this.positions),
          3
        ),
        previous: new BufferAttribute(new Float32Array(this.previous), 3),
        next: new BufferAttribute(new Float32Array(this.next), 3),
        side: new BufferAttribute(new Float32Array(this.side), 1),
        width: new BufferAttribute(new Float32Array(this.width), 1),
        uv: new BufferAttribute(new Float32Array(this.uvs), 2),
        index: new BufferAttribute(
          new Uint16Array(this.indices_array),
          1
        ),
        counters: new BufferAttribute(new Float32Array(this.counters), 1)
      }
    } else {
      this._attributes.position.copyArray(new Float32Array(this.positions))
      this._attributes.position.needsUpdate = true
      this._attributes.previous.copyArray(new Float32Array(this.previous))
      this._attributes.previous.needsUpdate = true
      this._attributes.next.copyArray(new Float32Array(this.next))
      this._attributes.next.needsUpdate = true
      this._attributes.side.copyArray(new Float32Array(this.side))
      this._attributes.side.needsUpdate = true
      this._attributes.width.copyArray(new Float32Array(this.width))
      this._attributes.width.needsUpdate = true
      this._attributes.uv.copyArray(new Float32Array(this.uvs))
      this._attributes.uv.needsUpdate = true
      this._attributes.index.copyArray(new Uint16Array(this.indices_array))
      this._attributes.index.needsUpdate = true
    }
    this.setAttribute('position', this._attributes.position)
    this.setAttribute('previous', this._attributes.previous)
    this.setAttribute('next', this._attributes.next)
    this.setAttribute('side', this._attributes.side)
    this.setAttribute('width', this._attributes.width)
    this.setAttribute('uv', this._attributes.uv)
    this.setAttribute('counters', this._attributes.counters)

    this.setIndex(this._attributes.index)

    this.computeBoundingSphere()
    this.computeBoundingBox()
  }

  // 比较向量 是否是同一点
  compareV3 (a: number, b: number): boolean {
    const aa = a * 6
    const ab = b * 6
    return (
      this.positions[aa] === this.positions[ab] &&
      this.positions[aa + 1] === this.positions[ab + 1] &&
      this.positions[aa + 2] === this.positions[ab + 2]
    )
  }

  // 复制a位置向量
  copyV3 (a: number): Array<number> {
    const aa = a * 6
    return [this.positions[aa], this.positions[aa + 1], this.positions[aa + 2]]
  }
}
