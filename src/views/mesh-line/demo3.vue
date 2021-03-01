<template>
  <div class="demo3 demo-page" :id="'demo3'" v-resize="handleResize"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as THREE from 'three'
import Engine from '@/libs/three/utils/Engine'
import AnimatedText3D from '@/libs/three/AnimatedText3D'
import Stars from '@/libs/three/object/Stars.class'
import AnimatedMeshLine from '@/libs/three/AnimatedMeshLine.class'
import LineGenerator from '@/libs/three/LineGenerator.class'
import { useThree } from '@/composition/three'
import getRandomFloat from '@/libs/three/utils/getRandomFloat'
import getRandomItem from '@/libs/three/utils/getRandomItem'
import { TimelineLite, Power2, Power3 } from 'gsap'
import FullScreenInBackground from '@/libs/three/decorators/FullScreenInBackground'
import HandleOrbitControl from '@/libs/three/decorators/HandleOrbitControl'

@FullScreenInBackground({ id: 'demo3' })
@HandleOrbitControl()
class CustomEngine extends Engine {}
class CustomAnimatedText3D extends AnimatedText3D {
  t:number
  constructor (text:string, opts:Record<string, any>) {
    super(text, opts)
    this.t = 0
    this.update = this.update.bind(this)
  }

  update () {
    this.t += 0.05
    this.position.y += (Math.sin(this.t)) * 0.0025
  }
}
const POSITION_X =  -3.2

const LENGTH_MIN =  5
const LENGTH_MAX =  7
const COLORS = ['#FDFFFC', '#FDFFFC', '#FDFFFC', '#FDFFFC', '#EA526F', '#71b9f2'].map((col) => new THREE.Color(col))
class CustomLineGenerator extends LineGenerator {
  start () {
    const currentFreq = this.frequency
    this.frequency = 1
    setTimeout(() => {
      this.frequency = currentFreq
    }, 500)
    super.start()
  }

  addLine (props?: Record<string, any>): any {

    const line = super.addLine({
      width: getRandomFloat(0.1, 0.3),
      length: getRandomFloat(LENGTH_MIN, LENGTH_MAX),
      visibleLength: getRandomFloat(0.05, 0.8),
      position: new THREE.Vector3(
        POSITION_X,
        0.3,
        getRandomFloat(-1, 1)
      ),
      color: getRandomItem(COLORS)
    })
    line.rotation.x = getRandomFloat(0, Math.PI * 2)

    if (Math.random() > 0.1) {
      const line = super.addLine({
        width: getRandomFloat(0.05, 0.1),
        length: getRandomFloat(5, 10),
        visibleLength: getRandomFloat(0.05, 0.5),
        speed: 0.05,
        position: new THREE.Vector3(
          getRandomFloat(-9, 5),
          getRandomFloat(-5, 5),
          getRandomFloat(-10, 6)
        ),
        color: getRandomItem(COLORS)
      })
      line.rotation.x = getRandomFloat(0, Math.PI * 2)
    }
    return line
  }
}
export default defineComponent({
  name: 'Demo1',
  components: {},
  props: {},
  setup ():any {
    let { state, init } = useThree({ cameraType: 'p', alpha: true })
    return {
      id: 'demo1',
      state,
      init
    }
  },
  data () {
    return { engine: new CustomEngine() }
  },
  mounted () {

    const engine = new CustomEngine()

    this.engine = engine
    /**
     * * *******************
     * * TITLE
     * * *******************
     */
    const text = new CustomAnimatedText3D('Energy', { color: '#0f070a', size: 0.8 })
    text.position.x -= text.basePosition * 0.5
    text.position.y += 0.15

    /**
     * * *******************
     * * LIGNES
     * * *******************
     */
    const STATIC_PROPS = {
      nbrOfPoints: 4,
      speed: 0.03,
      turbulence: new THREE.Vector3(1, 0.8, 1),
      orientation: new THREE.Vector3(1, 0, 0),
      transformLineMethod: (p:any):number => {
        const a = ((0.5 - Math.abs(0.5 - p)) * 3)
        return a
      }
    }
    const lineGenerator = new CustomLineGenerator({ frequency: 0.1 }, STATIC_PROPS)
    engine.add(lineGenerator)

    /**
     * * *******************
     * * START
     * * *******************
     */
    // Show
    engine.start()

    const tlShow = new TimelineLite({ delay: 0.2 })
    // tlShow.to('.overlay', 0.6, { autoAlpha: 0 });
    tlShow.fromTo(new THREE.Vector3(), 3, { y: -4 }, { y: 0, ease: Power3.easeOut }, 0)
    tlShow.add(lineGenerator.start, '-=2.5')
    tlShow.add(() => {
      engine.add(text)
      text.show()
    }, '-=1.6')
  },
  methods: {
    handleResize (e: HTMLElement):void {

    }
  }
})
</script>

<style lang="stylus" scoped>
gradientMargin = 800px;
// @import 'demo1';
.demo-page
  height 100%
.demo3
  position fixed
  top 0
  left 0
  width 100vw
  height 100vh
  --color-text: #0f070a;
  --color-bg: #fabd69;
  --color-bg-2: #f98e4a;
  --color-link: #317bd0;
  --color-link-hover: #317bd0;
  background: radial-gradient(ellipse at 100% 0%, #fed96f 0%, var(--color-bg) 50%, var(--color-bg-2) 115%);
</style>