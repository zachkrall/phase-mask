faceObject.material.vertexShader = `
varying vec2 vUv;
uniform float u_time;
uniform float u_amp;
void main() {
  vUv = uv;
//  float amp = sin(u_time)*10.;
  float amp = 10.;
  vec3 newPosition = position + vec3(0., 0., sin(u_time + position.x)*amp);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
`

faceObject.material.fragmentShader = `
varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 st = vUv;
  vec3 color = vec3(st.y);
  st = fract(100. * st);
  //float stepx = step(0.5,st.x);
  //float stepy = step(0.6,st.y);
  //color = vec3(stepx, stepx+stepy, stepy);
  color = vec3(step(0.9, st.y));
  float center = distance(st, vec2(0.5, 0.6));
  gl_FragColor = vec4(color,1.0);
}
`

background.material.fragmentShader = `
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 st = gl_FragCoord.xy/u_resolution;
  vec4 pass = texture2D(tDiffuse, vUv);
  vec3 background = vec3(fract(1. * st.y +u_time*20.));
  st = fract(10. * st+u_time*90.);
  float color = step(0.8,st.x);
  float colorY = step(0.1,st.y);
  background = vec3(color);
  vec3 finalColor = mix( vec3(pass.r, pass.g, pass.b), background, 1.0-pass.a);
  gl_FragColor = vec4(vec3(0.0),1.0);
}
`

postprocess.material.fragmentShader = `
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 u_resolution;
uniform float u_time;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main(){
float amount = sin(u_time*2.0)*0.2;
float angle = u_time*20.;
vec2 st = fract(1. * vUv);
vec2 offset = amount * vec2( cos(angle), sin(angle));
vec4 cr = texture2D(tDiffuse, st + offset);
vec4 cga = texture2D(tDiffuse, st);
vec4 cb = texture2D(tDiffuse, st - offset);
vec3 color = vec3(cr.r, cga.g, cb.b);
//color -= vec3(fract(40.0 * vUv.y+u_time*20.0));
color = vec3(0.0, cr.g, cga.r);
//color += vec3(1.0-rand(vUv+u_time), 0.0, 0.);
gl_FragColor = vec4(cga.rgb, cga.a);
}
`
