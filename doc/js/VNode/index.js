import { h } from './h'
import render from './render'

const elementVnode = h(
  'div',
  {
    style: {
      height: '100px',
      width: '100px',
      background: 'red'
    }
  },
  h('div', {
    style: {
      height: '50px',
      width: '50px',
      background: 'green'
    },
    class: ['class-a', ['class-b', 'class-c'], {'class-e': false, 'class-f': true}]
  })
)
console.log(elementVnode);

render(elementVnode, document.getElementById('app'))
