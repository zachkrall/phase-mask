import { Vector2, ShaderMaterial, DoubleSide } from 'three'

const config = {
  uniforms: {
    tDiffuse: { value: null },
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

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`,
  fragmentShader: `
varying vec2 vUv;
uniform sampler2D tDiffuse;

uniform vec2 u_resolution;
uniform float u_time;

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution;
  vec4 pass = texture2D(tDiffuse, vUv);
  vec3 background = vec3(1.0, 0.0, 0.0);

  background = vec3(st.x, st.y, 1.0);

  vec3 color = mix( vec3(pass.r, pass.g, pass.b), background, 1.0-pass.a);
  gl_FragColor = vec4(color,1.0);
}
`
}

const BackgroundShader = new ShaderMaterial(config)

export { BackgroundShader }
