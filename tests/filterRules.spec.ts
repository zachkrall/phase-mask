describe('webpack config', ()=>{
  it('filters out tests', async ()=>{
    const rules = [
      {test: /.tsx$/i},
      {test: /.png$/i},
      {test: /.css$/i},
    ].filter(rule => {
      return !(rule.test instanceof RegExp) || !['.tsx','.css'].some(i=> (new RegExp(rule.test)).test(i))
    })

    console.log(rules)

    return expect(rules.length).toEqual(1)
  })
})