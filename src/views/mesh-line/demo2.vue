<template>
  <div class="demo2 demo-page" :id="'demo2'" v-resize="handleResize"></div>
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

const COLORS = ['#4062BB', '#52489C', '#59C3C3', '#F45B69', '#F45B69'].map((col) => new THREE.Color(col))


@FullScreenInBackground({ id: 'demo2' })
@HandleOrbitControl()
class CustomEngine extends Engine {}
class CustomLineGenerator extends LineGenerator {
  addLine (props?: Record<string, any>): AnimatedMeshLine {
    // return super.addLine({
    //   length: getRandomFloat(5, 10),
    //   visibleLength: getRandomFloat(0.05, 0.2),
    //   speed: getRandomFloat(0.01, 0.02),
    //   position: new Vector3(
    //     getRandomFloat(-4, 8),
    //     getRandomFloat(-3, 5),
    //     getRandomFloat(-2, 5)
    //   ),
    // })
    return super.addLine({
      length: getRandomFloat(8, 15),
      visibleLength: getRandomFloat(0.05, 0.2),
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        Math.random() - 1,
        (Math.random() - 0.5) * 2
      ).multiplyScalar(getRandomFloat(5, 20)),
      turbulence: new THREE.Vector3(
        getRandomFloat(-2, 2),
        getRandomFloat(0, 2),
        getRandomFloat(-2, 2)
      ),
      orientation: new THREE.Vector3(
        getRandomFloat(-0.8, 0.8),
        1,
        1
      ),
      speed: getRandomFloat(0.004, 0.008),
      color: getRandomItem(COLORS)
    })
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
    const text = new AnimatedText3D('Confetti', {
      // color: '#0f070a',
      color: '#000000',
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
  methods: {
    handleResize (e: HTMLElement):void {

    }
  }
})
</script>

<style lang="stylus" scoped>
.demo2 {
  position fixed
  top 0
  left 0
  width 100vw
  height 100vh
  --color-text: #0f070a;
	--color-bg: #ffffff;
	--color-bg-2: #ecc7d5;
	--color-link: #4062BB;
	--color-link-hover: #52489C;
	background: radial-gradient(ellipse at 75% 0%, var(--color-bg) 50%, var(--color-bg-2) 250%);
}
</style>