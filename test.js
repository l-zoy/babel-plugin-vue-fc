const { transform } = require('@babel/core')

const code = `
  function SFC(){
    return <div>hello setup</div>
  }
`

const res = transform(code, {
  plugins: ['./index.js'],
  parserOpts: { plugins: ['jsx'], sourceType: 'module' }
})

console.log(res.code)
