import * as THREE from 'three'

export default class MeshLineMaterial extends THREE.ShaderMaterial {
  type ='MeshLineMaterial'
  constructor (parameters: THREE.ShaderMaterialParameters|Record<string, any>) {
    super()

    this.uniforms = Object.assign({}, THREE.UniformsLib.fog, {
      lineWidth: { value: 1 },
      map: { value: null },
      useMap: { value: 0 },
      alphaMap: { value: null },
      useAlphaMap: { value: 0 },
      color: { value: new THREE.Color(0xffffff) },
      opacity: { value: 1 }, // Material固有属性
      resolution: { value: new THREE.Vector2(1, 1) },
      sizeAttenuation: { value: 1 },
      dashArray: { value: 0 },
      dashOffset: { value: 0 },
      dashRatio: { value: 0.5 },
      useDash: { value: 1 },
      visibility: { value: 1 },
      alphaTest: { value: 0 }, // Material固有属性
      repeat: { value: new THREE.Vector2(1, 1) }
    })

    this.vertexShader = THREE.ShaderChunk.meshline_vert
    this.fragmentShader =  THREE.ShaderChunk.meshline_frag
    this.setValues(parameters)

  }

  static get isMeshLineMaterial ():boolean {
    return true
  }
  get lineWidth ():number {
    return this.uniforms.lineWidth.value
  }
  set lineWidth (value: number) {
    this.uniforms.lineWidth.value = value
  }
  get map ():number {
    return this.uniforms.map.value
  }

  set map (value: number) {
    this.uniforms.map.value = value
  }

  get useMap (): number {
    return this.uniforms.useMap.value
  }

  set useMap (value: number) {
    this.uniforms.useMap.value = value
  }

  get alphaMap (): number {
    return this.uniforms.alphaMap.value
  }

  set alphaMap (value: number) {
    this.uniforms.alphaMap.value = value
  }

  get useAlphaMap (): number {
    return this.uniforms.useAlphaMap.value
  }

  set useAlphaMap (value: number) {
    this.uniforms.useAlphaMap.value = value
  }

  get color (): THREE.Color {
    return this.uniforms.color.value
  }

  set color (value: THREE.Color) {
    this.uniforms.color.value = value
  }
  get resolution (): THREE.Vector2 {
    return this.uniforms.resolution.value
  }

  set resolution (value: THREE.Vector2) {
    this.uniforms.resolution.value = value
  }

  get sizeAttenuation (): number {
    return this.uniforms.sizeAttenuation.value
  }

  set sizeAttenuation (value: number) {
    this.uniforms.sizeAttenuation.value = value
  }

  get dashArray (): number {
    return this.uniforms.dashArray.value
  }

  set dashArray (value: number) {
    this.uniforms.dashArray.value = value
    this.useDash = value !== 0 ? 1 : 0
  }

  get dashOffset (): number {
    return this.uniforms.dashOffset.value
  }

  set dashOffset (value: number) {
    this.uniforms.dashOffset.value = value
  }

  get dashRatio (): number {
    return this.uniforms.dashRatio.value
  }

  set dashRatio (value: number) {
    this.uniforms.dashRatio.value = value
  }

  get useDash (): number {
    return this.uniforms.useDash.value
  }

  set useDash (value: number) {
    this.uniforms.useDash.value = value
  }

  get visibility (): number {
    return this.uniforms.visibility.value
  }

  set visibility (value: number) {
    this.uniforms.visibility.value = value
  }

  get repeat (): number {
    return this.uniforms.repeat.value
  }

  set repeat (value: number) {
    this.uniforms.repeat.value = value
  }
}

THREE.ShaderChunk['meshline_vert'] = [
  '',
  THREE.ShaderChunk.logdepthbuf_pars_vertex,
  THREE.ShaderChunk.fog_pars_vertex,
  '',
  'attribute vec3 previous;',
  'attribute vec3 next;',
  'attribute float side;',
  'attribute float width;',
  'attribute float counters;',
  '',
  'uniform vec2 resolution;',
  'uniform float lineWidth;',
  'uniform vec3 color;',
  'uniform float opacity;',
  'uniform float sizeAttenuation;',
  '',
  'varying vec2 vUV;',
  'varying vec4 vColor;',
  'varying float vCounters;',
  '',
  'vec2 fix( vec4 i, float aspect ) {',
  '',
  '    vec2 res = i.xy / i.w;',
  '    res.x *= aspect;',
  '	 vCounters = counters;',
  '    return res;',
  '',
  '}',
  '',
  'void main() {',
  '',
  '    float aspect = resolution.x / resolution.y;',
  '',
  '    vColor = vec4( color, opacity );',
  '    vUV = uv;',
  '',
  '    mat4 m = projectionMatrix * modelViewMatrix;',
  '    vec4 finalPosition = m * vec4( position, 1.0 );',
  '    vec4 prevPos = m * vec4( previous, 1.0 );',
  '    vec4 nextPos = m * vec4( next, 1.0 );',
  '',
  '    vec2 currentP = fix( finalPosition, aspect );',
  '    vec2 prevP = fix( prevPos, aspect );',
  '    vec2 nextP = fix( nextPos, aspect );',
  '',
  '    float w = lineWidth * width;',
  '',
  '    vec2 dir;',
  '    if( nextP == currentP ) dir = normalize( currentP - prevP );',
  '    else if( prevP == currentP ) dir = normalize( nextP - currentP );',
  '    else {',
  '        vec2 dir1 = normalize( currentP - prevP );',
  '        vec2 dir2 = normalize( nextP - currentP );',
  '        dir = normalize( dir1 + dir2 );',
  '',
  '        vec2 perp = vec2( -dir1.y, dir1.x );',
  '        vec2 miter = vec2( -dir.y, dir.x );',
  '        //w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * width );',
  '',
  '    }',
  '',
  '    //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;',
  '    vec4 normal = vec4( -dir.y, dir.x, 0., 1. );',
  '    normal.xy *= .5 * w;',
  '    normal *= projectionMatrix;',
  '    if( sizeAttenuation == 0. ) {',
  '        normal.xy *= finalPosition.w;',
  '        normal.xy /= ( vec4( resolution, 0., 1. ) * projectionMatrix ).xy;',
  '    }',
  '',
  '    finalPosition.xy += normal.xy * side;',
  '',
  '    gl_Position = finalPosition;',
  '',
  THREE.ShaderChunk.logdepthbuf_vertex,
  THREE.ShaderChunk.fog_vertex &&
    '    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
  THREE.ShaderChunk.fog_vertex,
  '}'
].join('\n')

THREE.ShaderChunk['meshline_frag'] = [
  '',
  THREE.ShaderChunk.fog_pars_fragment,
  THREE.ShaderChunk.logdepthbuf_pars_fragment,
  '',
  'uniform sampler2D map;',
  'uniform sampler2D alphaMap;',
  'uniform float useMap;',
  'uniform float useAlphaMap;',
  'uniform float useDash;',
  'uniform float dashArray;',
  'uniform float dashOffset;',
  'uniform float dashRatio;',
  'uniform float visibility;',
  'uniform float alphaTest;',
  'uniform vec2 repeat;',
  '',
  'varying vec2 vUV;',
  'varying vec4 vColor;',
  'varying float vCounters;',
  '',
  'void main() {',
  '',
  THREE.ShaderChunk.logdepthbuf_fragment,
  '',
  '    vec4 c = vColor;',
  '    if( useMap == 1. ) c *= texture2D( map, vUV * repeat );',
  '    if( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, vUV * repeat ).a;',
  '    if( c.a < alphaTest ) discard;',
  '    if( useDash == 1. ){',
  '        c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));',
  '    }',
  '    gl_FragColor = c;',
  '    gl_FragColor.a *= step(vCounters, visibility);',
  '',
  THREE.ShaderChunk.fog_fragment,
  '}'
].join('\n')
