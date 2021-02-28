
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