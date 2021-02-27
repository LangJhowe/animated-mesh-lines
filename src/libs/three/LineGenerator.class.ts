/*
 * @Descripttion:
 * @version:
 * @Author: Jhowe
 * @Date: 2020-09-16 15:05:16
 * @LastEditors: Jhowe
 * @LastEditTime: 2021-02-27 17:30:39
 */
import { Object3D } from 'three'
import AnimatedMeshLine, { AnimatedMeshLineOpts } from './AnimatedMeshLine.class'
export default class LineGenerator extends Object3D {
  frequency:number
  lineStaticProps:Record<string, any>

  isStarted=false

  i=0
  lines:Array<AnimatedMeshLine>=[]

  nbrOfLines=-1
  constructor ({ frequency = 0.1 } = {}, lineProps:Record<string, any>) {
    super()
    this.frequency = frequency
    this.lineStaticProps = lineProps

    this.update = this.update.bind(this)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
  }

  /**
   * * *******************
   * * ANIMATION
   * * *******************
   */
  start ():void {
    this.isStarted = true
  }

  stop (callback:(n: any) => any):void {
    this.isStarted = false
    // TODO callback when all lines are hidden
  }

  /**
   * * *******************
   * * LINES
   * * *******************
   */
  addLine (props?:Record<string, any>):any {
    const line = new AnimatedMeshLine(<AnimatedMeshLineOpts>Object.assign({}, this.lineStaticProps, props))
    this.lines.push(line)

    this.add(line)
    this.nbrOfLines++

    return line
  }

  removeLine (line:AnimatedMeshLine):void {
    this.remove(line)
    this.nbrOfLines--
  }

  /**
   * * *******************
   * * UPDATE
   * * *******************
   */
  update ():void {
    // Add lines randomly
    if (this.isStarted && Math.random() < this.frequency) this.addLine()

    // Update current Lines
    for (this.i = this.nbrOfLines; this.i >= 0; this.i--) {
      this.lines[this.i].update()
    }

    // Filter and remove died lines
    const filteredLines = []
    for (this.i = this.nbrOfLines; this.i >= 0; this.i--) {
      if (this.lines[this.i].isDied()) {
        this.removeLine(this.lines[this.i])
      } else {
        filteredLines.push(this.lines[this.i])
      }
    }
    this.lines = filteredLines
  }
}