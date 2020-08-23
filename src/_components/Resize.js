window.addEventListener('resize', ()=>{
  width = window.innerWidth
  height = window.innerHeight
  
  faceObject.material.uniforms['u_resolution'].value = new THREE.Vector2(width, height)
  background.material.uniforms['u_resolution'].value = new THREE.Vector2(width, height)
  postprocess.material.uniforms['u_resolution'].value = new THREE.Vector2(width, height)
})
