<template>
  <div class="demo4 demo-page" :id="'demo4'" v-resize="handleResize"></div>
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

@FullScreenInBackground({ id: 'demo4' })
@HandleOrbitControl()
class CustomEngine extends Engine {}

const RADIUS_START = 0.3
const RADIUS_START_MIN = 0.1
const Z_MIN = -1

const Z_INCREMENT = 0.08
const ANGLE_INCREMENT = 0.025
const RADIUS_INCREMENT = 0.02

const COLORS = ['#dc202e', '#f7ed99', '#2d338b', '#76306b', '#ea8c2d'].map((col) => new THREE.Color(col))

export default defineComponent({
  name: 'Demo4',
  components: {},
  props: {},
  setup ():any {
    let { state, init } = useThree({ cameraType: 'p', alpha: true })
    return {
      id: 'demo4',
      state,
      init
    }
  },
  data () {
    return { engine: new CustomEngine() }
  },
  mounted () {

    const engine = new CustomEngine()
    engine.camera.position.z = 6
    this.engine = engine
    /**
     * * *******************
     * * TITLE
     * * *******************
     */
    const text = new AnimatedText3D('Colors', { color: '#0468ec', size: 0.4, wireframe: false, opacity: 1 })
    text.position.x = -text.basePosition * 0.55
    text.position.y = -0.9
    text.position.z = 2
    text.rotation.x = -0.1

    /**
     * * *******************
     * * LIGNES
     * * *******************
     */
    const STATIC_PROPS = { transformLineMethod: (p:any):number => p * 1.5 }
    const position = { x: 0, y: 0, z: 0 }

    class CustomLineGenerator extends LineGenerator {
      addLine (props?: Record<string, any>): any {

        if (this.lines.length > 400) return null

        let z = Z_MIN
        let radius = (Math.random() > 0.8) ? RADIUS_START_MIN : RADIUS_START
        let angle = getRandomFloat(0, Math.PI * 2)

        const points = []

        while (z < engine.camera.position.z) {
          position.x = Math.cos(angle) * radius
          position.y = Math.sin(angle) * radius
          position.z = z

          // incrementation
          z += Z_INCREMENT
          angle += ANGLE_INCREMENT
          radius += RADIUS_INCREMENT

          // push
          points.push(position.x, position.y, position.z)
        }

        // Low lines
        return super.addLine({
          visibleLength: getRandomFloat(0.1, 0.4),
          // visibleLength: 1,
          points,
          //  speed: getRandomFloat(0.001, 0.002),
          speed: getRandomFloat(0.001, 0.005),
          color: getRandomItem(COLORS),
          width: getRandomFloat(0.01, 0.06)
        })
      }
    }

    const lineGenerator = new CustomLineGenerator({ frequency: 0.9 }, STATIC_PROPS)

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
.demo4 {
  position fixed
  top 0
  left 0
  width 100vw
  height 100vh
  --color-text: #ffffff;
  --color-bg: #143261;
  --color-bg-2: #010915;
  --color-link: #F6E27F;
  --color-link-hover: #E2C391;
  background: radial-gradient(ellipse at 50% 50%, var(--color-bg) 40%, var(--color-bg-2) 150%);
}
</style>