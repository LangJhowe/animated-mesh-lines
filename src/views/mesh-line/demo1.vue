<template>
  <div class="demo1 demo-page" :id="'demo1'"></div>
</template>

<script lang="ts">
// style = 'transform: matrix(1, 0, 0, 1, 0, -300);'
import { defineComponent } from 'vue'
import * as THREE from 'three'
import Engine from '@/libs/three/utils/Engine'
import AnimatedText3D from '@/libs/three/AnimatedText3D'
import Stars from '@/libs/three/object/Stars.class'
import AnimatedMeshLine from '@/libs/three/AnimatedMeshLine.class'
import LineGenerator from '@/libs/three/LineGenerator.class'
import getRandomFloat from '@/libs/three/utils/getRandomFloat'
import { TimelineLite, Power2 } from 'gsap'
import FullScreenInBackground from '@/libs/three/decorators/FullScreenInBackground'
import HandleOrbitControl from '@/libs/three/decorators/HandleOrbitControl'

@FullScreenInBackground({ id: 'demo1' })
@HandleOrbitControl()
class CustomEngine extends Engine {}
class CustomLineGenerator extends LineGenerator {
  addLine (props?: Record<string, any>): AnimatedMeshLine {
    return super.addLine({
      length: getRandomFloat(10, 20),
      visibleLength: getRandomFloat(0.05, 0.2),
      speed: getRandomFloat(0.01, 0.02),
      position: new THREE.Vector3(
        getRandomFloat(-5, 10),
        getRandomFloat(-4, 5),
        getRandomFloat(-3, 5)
      )
    })
  }
}
export default defineComponent({
  name: 'Demo1',
  components: {},
  props: {},
  setup ():any {
    return { id: 'demo1' }
  },
  data () {
    return { engine: new CustomEngine() }
  },
  mounted () {

    const engine = new CustomEngine()
    engine.camera.position.y = 3
    engine.camera.position.z = 20
    this.engine = engine
    /**
     * * *******************
     * * TITLE
     * * *******************
     */
    const text = new AnimatedText3D('Shooting Stars', {
      color: '#dc2c5a',
      size: 0.8
    })
    text.position.x -= text.basePosition * 0.5
    engine.add(text)

    /**
     * * *******************
     * * LIGNES
     * * *******************
     */
    const STATIC_PROPS = {
      width: 0.05,
      nbrOfPoints: 1,
      turbulence: new THREE.Vector3(),
      orientation: new THREE.Vector3(-1, -1, 0),
      color: new THREE.Color('#e6e0e3')
    }
    const lineGenerator = new CustomLineGenerator(
      { frequency: 0.1 },
      STATIC_PROPS
    )
    engine.add(lineGenerator)

    /**
     * * *******************
     * * STARS
     * * *******************
     */
    const stars = new Stars()
    engine.add(stars)

    /**
     * * *******************
     * * START
     * * *******************
     */
    // Show
    engine.start()

    const tlShow = new TimelineLite({
      delay: 0.2,
      onStart: () => {
        lineGenerator.start()
      }
    })
    tlShow.fromTo(
      new THREE.Vector3(),
      2,
      { y: -8 },
      { y: 0, ease: Power2.easeOut },
      0
    )
    tlShow.add(text.show, '-=1')
  },
  methods: {}
})
</script>

<style lang="stylus" scoped>
gradientMargin = 800px;
.demo-page
  overflow: hidden;
.demo1{
  --color-text: #fff;
  --color-bg: #0e0e0f;
  --color-bg-2: #242635;
  --color-bg-3: #dc2c5a;
  --color-link: #dc2c5a;
  --color-link-hover: #ff0060;
  position absolute;
  top: 0;
  left: 0;
  width: 100%;
  // height: "calc(100% + %s)" % gradientMargin;
  height 100vh
  // background: linear-gradient(200deg, var(--color-bg) 0%, var(--color-bg-2) 80%, var(--color-bg-3) 150%);
  background: radial-gradient(ellipse at 200% 0%, var(--color-bg) 50%, var(--color-bg-2) 80%, var(--color-bg-3) 100%);
  // z-index: -2;
  // transform: translateY(-(gradientMargin));
}
</style>