// 挂载
import { VNodeFlags, ChildrenFlags } from './flags';
import { patchData } from './patchData'
export function render(vnode, container) {
    const prevVNode = container.vnode;
    // 旧的Node
    if (prevVNode == null) {
        if (vnode) {
            // 没有旧的 VNode，使用 `mount` 函数挂载全新的 VNode
            mount(vnode, container);
            // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode 就存在了
            container.vnode = vnode
        }
    }else {
        if (vnode) {
            // 有旧的 VNode，则调用 `patch` 函数打补丁
            patch(prevVNode, vnode, container)
            // 更新 container.vnode
            container.vnode = vnode
        } else {
            // 有旧的 VNode 但是没有新的 VNode，这说明应该移除 DOM，在浏览器中可以使用 removeChild 函数。
            container.removeChild(prevVNode.el)
            container.vnode = null
        }
    }
}

function mount(vnode, container, isSVG) {
    const { flags } = vnode
    if (flags & VNodeFlags.ELEMENT) {
        // 挂载普通标签
        mountElement(vnode, container, isSVG)
    } else if (flags & VNodeFlags.TEXT) {
        mountText(vnode, container, isSVG);
    }
}


function mountElement(vnode, container, isSVG) {
    isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG;
    const el = isSVG
        ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
        : document.createElement(vnode.tag)
    vnode.el = el;

    const data = vnode.data
    if (data) {
        for (let key in data) {
            patchData(el, key, null, data[key])
        }
    }
    // 如果存在子节点
    const childFlags = vnode.childFlags
    const children = vnode.children;
    if (childFlags !== ChildrenFlags.NO_CHILDREN) {
        if (childFlags & ChildrenFlags.SINGLE_VNODE) {
            // 递归处理子节点
            mount(children, el, isSVG)
        } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
            for (let i = 0; i < children.length; i++) {
                mount(children[i], el, isSVG)
            }
        }
    }

    container.appendChild(el)
}


function mountText(vnode, container) {
    const el = document.createTextNode(vnode.children)
    vnode.el = el
    container.appendChild(el)
}