varying vec3 vPosition;
uniform float time;
uniform float ratio;
uniform float shaderWidth;
uniform float shaderHeight;

float line(vec2 pos,vec2 point1,vec2 point2,float width){
  vec2 dir0=point2-point1;
  vec2 dir1=pos-point1;
  float h=clamp(dot(dir0,dir1)/dot(dir0,dir0),0.,1.);
  return(length(dir1-dir0*h)-width*.5);
}
float linePointDir(vec2 s,vec2 e,vec2 p){
  return((p.x-s.x)*(e.y-s.y)-(e.x-s.x)*(p.y-s.y));
}
float lineAa(vec2 pos,vec2 point1,vec2 point2,float width){
  vec2 dir0=point2-point1;
  vec2 dir1=pos-point1;
  float h=clamp(dot(dir0,dir1)/dot(dir0,dir0),0.,1.);
  return(length(dir1-dir0*h)-width);
}
float angle(vec2 p1,vec2 p2,vec2 p3,vec2 pos){
  float unitW=1./shaderWidth;
  float lineDir1=linePointDir(p1,p2,pos),
  lineDir2=linePointDir(p2,p3,pos),
  lineDir3=linePointDir(p3,p1,pos);
  bool b1=lineDir1>=0.&&lineDir2>=0.&&lineDir3>=0.,
  b2=lineDir1<=0.&&lineDir2<=0.&&lineDir3<=0.;
  float l1=lineAa(pos,p1,p2,.01);
  float l2=lineAa(pos,p2,p3,.01);
  float l3=lineAa(pos,p3,p1,.01);
  float minl=min(l1,min(l2,l3));
  // return minl;
  if(b1||b2){
    return clamp(minl,0.,.1);
  }else{
    return-(.1-clamp(minl,0.,.1));
    
    // // 边缘 抗锯齿,点距边的最短的距离
    // float width=.5;
    
    // if(minl>unitW){
      //   return-1.;
    // }else{
      //   return clamp(minl,0.,unitW);
    // }
  }
}
// 判断点与矢量的位置关系
// https://www.cnblogs.com/itsone/p/10728560.html
float linearstep(float edge0,float edge1,float x){
  float t=(x-edge0)/(edge1-edge0);
  return clamp(t,0.,1.);
}

float linePointDistance(vec2 s,vec2 e,vec2 p){
  float y=(e.y-s.y)/(e.x-e.y)*(p.x-s.x)+e.y,
  cosAngle=(p.x-s.x)/length(e-s);
  float l=(y-p.y)*cosAngle;
  return l;
}

float down(){
  return 0.;
}
void main(){
  float unitW=1./shaderWidth;
  
  vec3 fColor=vec3(1.,1.,0.);
  vec3 bColor=vec3(0.,0.,0.);
  vec3 color=vec3(0.,0.,0.);
  float unitH=unitW*ratio;
  float halfAngleWidth=10.*unitW;
  float halfAngleHeight=10.*unitH;
  
  float y=vPosition.y/ratio;
  // float w=-0.1*unitH;
  
  float d=angle(
    vec2(50.*unitW,0.),
    vec2(10.*unitW,20.*unitH),
    vec2(0.,-20.*unitH),
    vPosition.xy
  );
  // float d = min(d,line(vPosition.xy,vec2(-50.*unitW,0.),vec2(10.*unitW,20.*unitH)));
  // float d=line(vPosition.xy,vec2(-50.*unitW,0.),vec2(10.*unitW,20.*unitH),.01);
  // float d=min(d,angle(
      //     vec2(10.*unitW,0.),
      //     vec2(-10.*unitW,0.),
      //     vec2(20.*unitW,10.*unitH),
      //     vPosition.xy
    //   ));
    // float w=fwidth(.9*d)*1.;
    // color=mix(fColor,bColor,smoothstep(-w,+w,d));
    gl_FragColor=vec4(color,1.);
  }