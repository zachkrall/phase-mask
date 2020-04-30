import { Vector2, ShaderMaterial, DoubleSide } from 'three'

const config = {
  uniforms: {
    u_time: {
      value: 0.0
    },
    u_resolution: {
      value: new Vector2()
    },
    u_amp: {
      value: 1.0
    }
  },
  defines: {
    // This makes PI an accessible variable in our frag and vert shaders
    PI: Math.PI,
    HALF_PI: Math.PI * 0.5
  },
  side: DoubleSide,
  wireframe: false,
  vertexShader: `
varying vec2 vUv;
uniform float u_time;
uniform float u_amp;

void main() {
  vUv = uv;
  vec3 newPosition = position + vec3(0., 0., sin(u_time + position.x)*u_amp);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
`,
  fragmentShader: `
varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  // vec2 st = gl_FragCoord.xy/u_resolution;
  vec2 st = vUv;
  vec3 color = vec3(st.y);
  gl_FragColor = vec4(color,1.0);
}
`
}

const BasicShader = new ShaderMaterial(config)

export { BasicShader }
