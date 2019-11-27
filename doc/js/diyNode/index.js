import { h, Fragment, Portal } from './h';
import { render } from './render'
console.log(h('div', null, '我是文本'));
console.log(h(Fragment, null, [h('td', {}, '文本'), h('td', {}, '文本')]));
console.log(h(Portal, {target: '#root-box'}, [h('td', {}, '文本'), h('td', {}, '文本')]));

class Component {
    render() {
        h('div', null, '我是有状态组件')
    }
}

console.log(h(Component));

function MyFunctionalComponent() {}

// 传递给 h 函数的第一个参数就是组件函数本身
const functionalComponentVNode = h(MyFunctionalComponent, null, h('div'))

console.log(functionalComponentVNode);

const div = h('div', null, 'Hello World');
const app = document.getElementById('app');
console.log(div);

render(div, app);

console.log(11111);

console.log(app.vnode);
