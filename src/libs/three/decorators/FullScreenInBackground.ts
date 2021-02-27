/*
 * @Descripttion:
 * @version:
 * @Author: Jhowe
 * @Date: 2020-09-21 08:32:53
 * @LastEditors: Jhowe
 * @LastEditTime: 2020-09-24 15:59:04
 */

export default function FullScreenInBackground (opts:Record<string, any>):any {
  return function (Target:any):any {
    return class FullScreenInBackground extends Target {
      constructor (props: any) {
        super(props)

        // Put automaticaly the canvas in background
        this.dom.class = 'target'
        this.dom.style.position = 'absolute'
        this.dom.style.top = '0'
        this.dom.style.left = '0'
        this.dom.style.zIndex = '1'
        if (opts.id) {
          const wrapperDom = document.getElementById(opts.id)
          if (wrapperDom) {
            wrapperDom.appendChild(this.dom)
          }
        } else {
          document.body.appendChild(this.dom)
        }

        this.resize = this.resize.bind(this)

        window.addEventListener('resize', this.resize)
        window.addEventListener('orientationchange', this.resize)
        this.resize()
      }
      resize () {
        super.resize(window.innerWidth, window.innerHeight)
      }
    }
  }
}
