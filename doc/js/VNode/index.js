import { h, Fragment, Portal } from './h'
import render from './render'

/* const elementVnode = h(
    'div',
    {
        style: {
            height: '100px',
            width: '100px',
            background: 'red'
        }
    },
    // [
    //     h('div', {
    //         style: {
    //             height: '50px',
    //             width: '50px',
    //             background: 'green'
    //         },
    //         class: ['class-a', ['class-b', 'class-c'], { 'class-e': false, 'class-f': true }]
    //     }),
    //     h('input', {
    //         class: 'cls-a',
    //         type: 'checkbox',
    //         checked: true,
    //         custom: '1'
    //     })
    // ]
    // h(Fragment, null, [
    //     h('span', null, '我是标题1......'),
    //     h('span', null, '我是标题2......')
    // ]),
    h(Portal, { target: '#portal-box' }, [
        h('span', null, '我是标题1......'),
        h('span', null, '我是标题2......')
    ])
)

class MyComponent {
    render() {
        return h(
            'div',
            {
                style: {
                    background: 'green'
                }
            },
            [
                h('span', null, '我是组件的标题1......'),
                h('span', null, '我是组件的标题2......')
            ]
        )
    }
}
console.log(elementVnode);

const compNode = h(MyComponent);
console.log(compNode);


function MyFunctionalComponent() {
    // 返回要渲染的内容描述，即 VNode
    return h(
        'div',
        {
            style: {
                background: 'blue',
                color: "#fff"
            }
        },
        [
            h('span', null, '我是组件的标题1......'),
            h('span', null, '我是组件的标题2......')
        ]
    )
}
const funNode = h(MyFunctionalComponent);
console.log(funNode);

render(funNode, document.getElementById('app')) */


// patch 更新

// 旧的 VNode
const prevVNode = h(Fragment, null, [
    h('p', null, '旧片段子节点 1'),
    h('p', null, '旧片段子节点 2')
  ])
  
  // 新的 VNode
  const nextVNode = h(Fragment, null, [
    h('p', null, '新片段子节点 1'),
    h('p', null, '新片段子节点 2')
  ])
  
  render(prevVNode, document.getElementById('app'))
  
  // 2秒后更新
  setTimeout(() => {
    // render(nextVNode, document.getElementById('app'))
  }, 2000)

