const { transform } = require('@babel/core')

const code = `
  function SFC(hello){
    return <div>hello setup</div>
  }

  export default function SFC1(hello){
    return <div>hello setup</div>
  }

  export function SFC3(hello){
    return <div>hello setup</div>
  }

  const SFC4 = (hello) => {
    return <div>hello setup</div> 
  }

  export const SFC5 = (hello) => {
    return <div>hello setup</div> 
  }

  export const SFC6 = function(hello){
    return <div>hello setup</div>
  }
`

const res = transform(code, {
  plugins: ['./index.js'],
  parserOpts: { plugins: ['jsx'], sourceType: 'module' }
})

console.log(res.code)
