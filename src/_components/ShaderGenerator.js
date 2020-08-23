class Fragment {

  constructor(dest){
    this.destination = dest
    this.blocks = [{
      color: 'vec3(0., 0., 0.)',
      st: 'vUv'
    }]
    return this
  }

  float(int){
    return (int).toFixed(2)
  }

  gradient(){
    let c = []
    for(let i of arguments){
      c.push(i)
    }
    this.blocks.push({
      color: `vec3(${c.join(', ')})`,
      st: `st`
    })
    return this
  }

  repeat(x=1, y=1){
    this.blocks.push({
      color: 'color',
      st: `vec2(fract(${this.float(x)} * st.x), fract(${this.float(y)} * st.y))`
    })
    return this
  }

  blend(c=[], amt=1.0){
    this.blocks.push({
      color: `mix(color, vec3(${c.join(',')}), ${amt})`
    })
    return this
  }

  out(){
    let string = ''

    string += 'varying vec2 vUv;'
    string += '\nuniform float u_time;'
    string += '\nuniform float u_resolution;'

    string += '\nvoid main(){'

    string += '\n    vec2 st = vUv;'

    string += `\n    vec3 color = vec3(${this.float(0)});`

    string += this.blocks.map(i=>{
      let color = i.color
      let st = i.st
      let s = ''
      if(st) s += `\n    st = ${st};`
      if(color) s += `\n    color = ${color};`
      return s
    }).join('')

    string += `\n    gl_FragColor = vec4(color, ${this.float(1)});`

    string += '\n}'

    this.destination.material.fragmentShader = string
  }

}

module.exports = Fragment
