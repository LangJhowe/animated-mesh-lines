<template>
  <div class="demo5 demo-page" :id="'demo5'" v-resize="handleResize"></div>
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
import Demo5Engine from './demo5Engine'

@FullScreenInBackground({ id: 'demo5' })
@HandleOrbitControl()
class CustomEngine extends Demo5Engine {}

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
    engine.camera.position.z = 2

    engine.addBloomEffect({
      resolutionScale: 0.5,
      kernelSize: 4,
      distinction: 0.01
    }, 1)
    /**
     * * *******************
     * * TITLE
     * * *******************
     */
    const text = new AnimatedText3D('Boreal Sky', { color: '#ffffff', size: 0.1, wireframe: true, opacity: 1 })
    text.position.x -= text.basePosition * 0.5
    engine.add(text)

    /**
     * * *******************
     * * LIGNES
     * * *******************
     */
    const radius = 4
    const origin = new THREE.Vector3()
    const direction = new THREE.Vector3()
    const raycaster = new THREE.Raycaster()
    const geometry = new THREE.SphereBufferGeometry(radius, 32, 32, 0, 3.2, 4, 2.1)
    const material = new THREE.MeshBasicMaterial({ wireframe: true, visible: false })
    // const material = new MeshBasicMaterial({ color:new Color('#723bb7') });

    const sphere = new THREE.Mesh(geometry, material)
    engine.add(sphere)
    sphere.position.z = 2

    const COLORS = ['#FFFAFF', '#0A2463', '#3E92CC', '#723bb7', '#efd28e', '#3f9d8c'].map((col) => new THREE.Color(col))
    const STATIC_PROPS = { transformLineMethod: (p:any):number => p }

    class CustomLineGenerator extends LineGenerator {
      addLine () {
        // V1 Regular and symetric lines ---------------------------------------------
        // i += 0.1;
        // let a = i;
        // let y = 12;
        // let incrementation = 0.1;
        // V2 ---------------------------------------------
        let incrementation = 0.1
        let y = getRandomFloat(-radius * 0.6, radius * 1.8)
        let a = Math.PI * (-25) / 180
        let aMax = Math.PI * (200) / 180

        const points = []
        while (a < aMax) {
          a += 0.2
          y -= incrementation
          origin.set(radius * Math.cos(a), y, radius * Math.sin(a))
          direction.set(-origin.x, 0, -origin.z)
          direction.normalize()
          raycaster.set(origin, direction)

          // save the points
          const intersect = raycaster.intersectObject(sphere, true)
          if (intersect.length) {
            points.push(intersect[0].point.x, intersect[0].point.y, intersect[0].point.z)
          }
        }

        if (points.length === 0) return

        if (Math.random() > 0.5) {
          // Low lines
          super.addLine({
            visibleLength: getRandomFloat(0.01, 0.2),
            points,
            speed: getRandomFloat(0.003, 0.008),
            color: getRandomItem(COLORS),
            width: getRandomFloat(0.01, 0.1)
          })
        } else {
          // Fast lines
          super.addLine({
            visibleLength: getRandomFloat(0.05, 0.2),
            points,
            speed: getRandomFloat(0.01, 0.1),
            color: COLORS[0],
            width: getRandomFloat(0.01, 0.01)
          })
        }
      }
    }
    const lineGenerator = new CustomLineGenerator({ frequency: 0.99 }, STATIC_PROPS)
    engine.add(lineGenerator)

    /**
     * * *******************
     * * START
     * * *******************
     */
    // Show
    engine.start()
    lineGenerator.start()

    const tlShow = new TimelineLite({
      delay: 0.2, onStart: () => {
        lineGenerator.start()

      }
    })
    tlShow.fromTo(new THREE.Vector3(), 3, { y: -4 }, { y: 0, ease: Power3.easeOut }, '-=2')
    tlShow.add(text.show, '-=2')
  },
  methods: {
    handleResize (e: HTMLElement):void {

    }
  }
})
</script>

<style lang="stylus">
gradientMargin = 800px;
// @import 'demo1';
.demo-page
  height 100%
.demo5
  position fixed
  top 0
  left 0
  width 100vw
  height 100vh
  --color-text: #ffffff;
  --color-bg: #1f174e;
  --color-bg-2: #151436;
  --color-bg-3: #000000;
  --color-link: #8596df;
  --color-link-hover: #723bb7;
  background: radial-gradient(ellipse at 30% 48%, var(--color-bg) 0%, var(--color-bg-2) 45%, var(--color-bg-3) 150%);
</style>