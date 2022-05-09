const sine = (x: number) => {
  return Math.sin(x)
}

const sawtooth = (x: number, n = 1) => {
  return ((x % n) + n) % n
}

const square = (x: number, freq = 1) => {
  return Math.sign(Math.sin(x * Math.PI * freq * x))
}

const triangle = () => {
  return
}

const wave = () => {
  const fn = {
    sin: sine,
    saw: sawtooth,
    sq: square,
    tri: triangle
  }

  return fn
}

export default wave
