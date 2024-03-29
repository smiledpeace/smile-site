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
// const prevVNode = h(Fragment, null, [
//     h('p', null, '旧片段子节点 1'),
//     h('p', null, '旧片段子节点 2')
//   ])

//   // 新的 VNode
//   const nextVNode = h(Fragment, null, [
//     h('p', null, '新片段子节点 1'),
//     h('p', null, '新片段子节点 2')
//   ])

//   render(prevVNode, document.getElementById('app'))

//   // 2秒后更新
//   setTimeout(() => {
//     // render(nextVNode, document.getElementById('app'))
//   }, 2000)

// 有状态组件主动更新

// class MyComponent {
//     constructor() {
//         this.localState = 'hello';
//     }

//     mounted() {
//         // 两秒钟之后修改本地状态的值，并重新调用 _update() 函数更新组件
//         setTimeout(() => {
//             this.localState = 'two'
//             this._update()
//         }, 2000)
//     }

//     render() {
//         return h('div', null, this.localState)
//     }
// }

// const compNode = h(MyComponent);
// console.log(compNode);


// render(compNode, document.getElementById('app'))

// 被动更新


// 子组件类
class ChildComponent {
    render() {
        console.log(this);

        // 子组件中访问外部状态：this.$props.text
        return h('div', null, this.$props.text)
    }
}
// 父组件类
class ParentComponent {
    constructor() {
        this.localState = 'one'
    }

    mounted() {
        // 两秒钟后将 localState 的值修改为 'two'
        setTimeout(() => {
            this.localState = 'two'
            this._update()
        }, 2000)
    }
    render() {
        return h(ChildComponent, {
            // 父组件向子组件传递的 props
            text: this.localState
        })
    }
}

// 有状态组件 VNode
const compVNode = h(ParentComponent)
// render(compVNode, document.getElementById('app'))

const prevVNodeUl = h('ul', null, [
    h('li', {key: 'a'}, '1'), 
    h('li', {key: 'b'}, '2'), 
    h('li', {key: 'c'}, '3'), 
    h('li', {key: 'd'}, '4'), 
    h('li', {key: 'e'}, '5')
]);

const nextVNodeUl = h('ul', null, [
    h('li', {key: 'a'}, '1'), 
    h('li', {key: 'e'}, 'e'), 
    h('li', {key: 'd'}, 'd'),
    h('li', {key: 'c'}, 'c'),
    h('li', {key: 'b'}, 'b')
]);
render(prevVNodeUl, document.getElementById('app'));

// console.log(nextVNodeUl);

render(nextVNodeUl, document.getElementById('app'));


