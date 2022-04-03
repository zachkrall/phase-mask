import waves from './waves'

const values: number[] = []

for (let i = 0; i < 10; i += 0.1) {
  values.push(i)
}

describe('sine', () => {
  it('oscillates between -1 and 1', () => {
    const output = values.map(x => waves().sin(x))

    const max = Math.max(...output)
    const min = Math.min(...output)

    expect(max).toBeLessThanOrEqual(1)
    expect(min).toBeGreaterThanOrEqual(-1)
  })
})

describe('saw', () => {
  it('oscillates between 0 and 2', () => {
    const output = values.map(x => waves().saw(x, 2))

    const max = Math.max(...output)
    const min = Math.min(...output)

    expect(max).toBeLessThanOrEqual(2)
    expect(min).toBeGreaterThanOrEqual(0)
  })
})

describe('square', () => {
  it('oscillates between 0 and 2', () => {
    const output = values.map(x => waves().saw(x, 2))

    const max = Math.max(...output)
    const min = Math.min(...output)

    expect(max).toBeLessThanOrEqual(2)
    expect(min).toBeGreaterThanOrEqual(0)
  })
})
