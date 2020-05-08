function loop() {
  time += 0.01

  faceObject.material.needsUpdate = true
  background.material.needsUpdate = true
  postprocess.material.needsUpdate = true

  faceObject.material.uniforms['u_time'].value = time
  background.material.uniforms['u_time'].value = time
  postprocess.material.uniforms['u_time'].value = time

  composer.render(renderer)
  window.requestAnimationFrame(loop)
}
loop()
