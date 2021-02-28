/*
 * @Descripttion:
 * @version:
 * @Author: Jhowe
 * @Date: 2020-09-21 17:28:52
 * @LastEditors: Jhowe
 * @LastEditTime: 2021-02-27 23:08:20
 */
import Engine from '../../libs/three/utils/Engine'
// import Engine from '@/libs/three/utils/Engine'// @?
import { Clock } from 'three'
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass
} from 'postprocessing'

export default class demo5Engine extends Engine {
    clock: Clock = new Clock()
    currentPass = false
    effects: any = {}
    passes: Array<any> = []
    composer: any
    constructor (
      param?:Record<string, any>
    ) {
      super(param)
      this.composer = new EffectComposer(this.renderer, {
        // stencilBuffer: true,
        // depthTexture: true,
      })
      this.effects.render = new RenderPass(this.scene, this.camera)
      this.addPass(this.effects.render)
    }

    /**
     * * *******************
     * * ADD EFFECTS
     * * *******************
     */
    addBloomEffect (props: any, opacity: any):void {
      this.effects.bloom = new BloomEffect(props)
      this.effects.bloom.blendMode.opacity.value = opacity
      this.addPass(new EffectPass(this.camera, this.effects.bloom))
    }

    /**
     * * *******************
     * * GLOBAL
     * * *******************
     */

    addPass (passe: any):void {
      if (this.passes.length)
        this.passes[this.passes.length - 1].renderToScreen = false
      this.passes.push(passe)
      this.composer.addPass(passe)
      this.passes[this.passes.length - 1].renderToScreen = true
    }
    /**
     * * *******************
     * * OVERWRITED FUNCTIONS
     * * *******************
     */
    render ():void {
      this.composer.render(this.clock.getDelta())
    }
    resizeRender () :void {
      if (this.composer) this.composer.setSize(this.width, this.height)
    }
}