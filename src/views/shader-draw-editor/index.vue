<template>
  <div class="demo page">
    <h2>抗锯齿一</h2>
    <shader-draw-editor class="editor-1" :text="editText1"></shader-draw-editor>
    <h2>抗锯齿二</h2>
    <shader-draw-editor class="editor-2" :text="editText2"></shader-draw-editor>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ShaderDrawEditor from '@/components/shader-draw-editor/index.vue'
export default defineComponent({
  name: 'ShaderDrawBoardDemoPage',
  components: { ShaderDrawEditor },
  props: {},
  setup ():any {
    return {}
  },
  data () {
    return{
      editText1: `//https://www.shadertoy.com/view/4tB3zm
#define pi 3.14159265358979
#define sqrt3_divide_6.289
#define sqrt6_divide_12.204
precision mediump float;

varying vec3 vPosition;
uniform float time;
uniform float shaderWidth;
uniform float shaderHeight;
uniform float iResolutionX;
uniform float iResolutionY;

uniform float iMouseX;
uniform float iMouseY;
float _CircleRadius=.05;
vec4 _OutlineColor=vec4(0.,0.,0.,0.);
float _OutlineWidth=.02;
float _LineWidth=.01;
vec4 _LineColor=vec4(186./256.,42./256.,42./256.,0.);
float _Antialias=.01;
vec3 _BackgroundColor=vec3(227./256.,206./256.,178./256.);
/**
*
*/
float line(vec2 pos,vec2 point1,vec2 point2,float width){
  vec2 dir0=point2-point1;
  vec2 dir1=pos-point1;
  float h=clamp(dot(dir0,dir1)/dot(dir0,dir0),0.,1.);
  return(length(dir1-dir0*h)-width*.5);
}
float circle(vec2 pos,vec2 center,float radius){
  float d=length(pos-center)-radius;
  return d;
}
void main(){
  float iTime=0.;//time;
  vec2 pos=vPosition.xy;
  // 背景
  vec3 col=_BackgroundColor*(1.-.5*length(vPosition));
  
  // 分割点
  vec2 split=vec2(iMouseX,iMouseY);
  vec3 iResolution=vec3(shaderWidth,shaderHeight,1.);
  
  //
  float xSpeed=0.;
  float ySpeed=.5;
  float zSpeed=.7;
  mat3 matrix=mat3(1.,0.,0.,
    0.,cos(xSpeed*iTime),sin(xSpeed*iTime),
    0.,-sin(xSpeed*iTime),cos(xSpeed*iTime));
    matrix=mat3(cos(ySpeed*iTime),0.,-sin(ySpeed*iTime),
    0.,1.,0.,
    sin(ySpeed*iTime),0.,cos(ySpeed*iTime))*matrix;
    matrix=mat3(cos(zSpeed*iTime),sin(zSpeed*iTime),0.,
    -sin(zSpeed*iTime),cos(zSpeed*iTime),0.,
  0.,0.,0.)*matrix;
  
  float l=.5;
  vec3 p0=vec3(0.,0.,sqrt6_divide_12*3.)*l;
  vec3 p1=vec3(-.5,-sqrt3_divide_6,-sqrt6_divide_12)*l;
  vec3 p2=vec3(.5,-sqrt3_divide_6,-sqrt6_divide_12)*l;
  vec3 p3=vec3(0,sqrt3_divide_6*2.,-sqrt6_divide_12)*l;
  
  p0=matrix*p0;
  p1=matrix*p1;
  p2=matrix*p2;
  p3=matrix*p3;
  
  vec2 point0=p0.xy;
  vec2 point1=p1.xy;
  vec2 point2=p2.xy;
  vec2 point3=p3.xy;
  
  float d=line(pos,point0,point1,_LineWidth);
  d=min(d,line(pos,point1,point2,_LineWidth));
  d=min(d,line(pos,point2,point3,_LineWidth));
  d=min(d,line(pos,point0,point2,_LineWidth));
  d=min(d,line(pos,point0,point3,_LineWidth));
  d=min(d,line(pos,point1,point3,_LineWidth));
  d=min(d,circle(pos,point0,_CircleRadius));
  d=min(d,circle(pos,point1,_CircleRadius));
  d=min(d,circle(pos,point2,_CircleRadius));
  d=min(d,circle(pos,point3,_CircleRadius));
  
  if(vPosition.x<split.x){
    col=mix(_OutlineColor.rgb,col,step(0.,d-_OutlineWidth));
    col=mix(_LineColor.rgb,col,step(0.,d));
  }else if(vPosition.y>split.y){
    float w=_Antialias;
    col=mix(_OutlineColor.rgb,col,smoothstep(-w,w,d-_OutlineWidth));
    col=mix(_LineColor.rgb,col,smoothstep(-w,w,d));
  }else{
    float w=fwidth(.5*d)*2.;
    col=mix(_OutlineColor.rgb,col,smoothstep(-w,w,d-_OutlineWidth));
    col=mix(_LineColor.rgb,col,smoothstep(-w,w,d));
  }
  
  // 分割线
  col=mix(vec3(0),col,smoothstep(.005,.007,abs(vPosition.x-split.x)));
  col=mix(col,vec3(0),(1.-smoothstep(.005,.007,abs(vPosition.y-split.y)))*step(split.x,vPosition.x));
  gl_FragColor=vec4(col,1.);
}`,
      editText2: `
varying vec3 vPosition;
uniform float shaderWidth;
uniform float shaderHeight;
uniform float iResolutionX;
uniform float iResolutionY;
vec3 _BackgroundColor=vec3(227./256.,206./256.,178./256.);

// 计算点到point1-point2线段距离是否在width内
float line(vec2 pos,vec2 point1,vec2 point2,float width){
  vec2 dir0=point2-point1;
  vec2 dir1=pos-point1;
  float h=clamp(dot(dir0,dir1)/dot(dir0,dir0),0.,1.);// dir1在dir0上的映射长度/dir0的长度
  return(length(dir1-dir0*h)-width*.5);
}
float linearstep(float edge0,float edge1,float x){
  float t=(x-edge0)/(edge1-edge0);
  return clamp(t,0.,1.);
}
float smootherstep(float edge0,float edge1,float x){
  float t=(x-edge0)/(edge1-edge0);
  float t1=t*t*t*(t*(t*6.-15.)+10.);
  return clamp(t1,0.,1.);
}
void main(){
  vec2 r=.2*vec2(vPosition.xy);
  vec2 center1=vec2(-.05,0);
  vec2 center2=vec2(.05,0);
  
  vec3 bgcol=vec3(1.,.5,.5);//bg color
  vec3 col1=vec3(.4,.6,.6);//circle1
  vec3 col2=vec3(.4,.2,.5);//circle2
  vec3 pixel;
  
  pixel=bgcol;
  if(length(r-center1)<.03)
  pixel=col2;
  
  float m=.029;
  // circle 0
  // 未处理
  // if(length(r-center2)<.03)
  // pixel=col2;
  
  // circle 1
  // step处理，等同于未经任何处理的circle 0
  // if(length(r-center2)<.03){
    //   m=step(m,length(r-center2));
    //   pixel=mix(col2,bgcol,m);
  // }
  
  // circle 2
  // linearstep处理
  if(length(r-center2)<.03){
    m=linearstep(m-.001,m+.001,length(r-center2));
    pixel=mix(col2,bgcol,m);
  }
  
  // circle 3
  // linearstep处理
  // if(length(r-center2)<.03){
    //   m=smoothstep(m-.001,m+.001,length(r-center2));
    //   pixel=mix(col2,bgcol,m);
  // }
  // circle 4
  // linearstep处理
  // if(length(r-center2)<.03){
    //   m=smootherstep(m-.001,m+.001,length(r-center2));
    //   pixel=mix(col2,bgcol,m);
  // }
  vec2 pos = vPosition.xy,
       point0 = vec2(-.5,-0.5)*0.5,
      point1 = vec2(.5,-0.5)*0.5;

  float d=line(pos,point0,point1,0.05);
  pixel=mix(vec3(1.0,1.0,0.0),pixel,step(0.,d));

  gl_FragColor=vec4(pixel,1.);
}
    `
    }
  }
})
</script>

<style lang="stylus">
/* @import 'shader-draw-board demo page'; */
</style>