import { VNodeFlags, ChildrenFlags } from './flags';

// 如何使用virtual dom 描述一个元素 

/* 
    const elememt = {
        tag: 'div',
        data: {
            style: {
                width: '100px',
                height: '100px',
                backgroundColor: 'red'
            }
        }
    }
*/
/*    @param tag // 目标元素
    * @param data // 数据
    * @param chilren // 子节点
 */
export const Fragment = Symbol();
export const Portal = Symbol();
export const h = function (tag, data = null, children = null) {
    // 确定 flags
    let flags = null
    // 判断父节点 flags 类型
    if (typeof tag === 'string') {
        flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
    }else if (tag === Fragment) {
        flags = VNodeFlags.FRAGMENT;
    }else if (tag === Portal) {
        flags = VNodeFlags.PORTAL;
        tag = data && data.target
    }else {
        if (tag !== null && typeof tag === 'object') {
            flags = tag.functional
                ? VNodeFlags.COMPONENT_FUNCTIONAL // 函数式组件
                : VNodeFlags.COMPONENT_STATEFUL_NORMAL // 有状态组件
        } else if (typeof tag === 'function') {
            // Vue3 的类组件
            flags =
                tag.prototype && tag.prototype.render
                    ? VNodeFlags.COMPONENT_STATEFUL_NORMAL // 有状态组件
                    : VNodeFlags.COMPONENT_FUNCTIONAL // 函数式组件
        }
    }

    // 确定 childFlags
    let childFlags = null

    if (Array.isArray(children)) {
        const { length } = children
        if (length === 0) {
            // 没有 children
            childFlags = ChildrenFlags.NO_CHILDREN
        } else if (length === 1) {
            // 单个子节点
            childFlags = ChildrenFlags.SINGLE_VNODE
            children = children[0]
        } else {
            // 多个子节点，且子节点使用key
            childFlags = ChildrenFlags.KEYED_VNODES
            children = normalizeVNodes(children)
        }
    }else {
        if (children == null) {
            childFlags = ChildrenFlags.NO_CHILDREN
        }else if (children._isVNode) {
            // 单个子节点
            childFlags = ChildrenFlags.SINGLE_VNODE
        }else {
            // 其他情况都作为文本节点处理，即单个子节点，会调用 createTextVNode 创建纯文本类型的 VNode
            childFlags = ChildrenFlags.SINGLE_VNODE
            children = createTextVNode(children + '')
        }
    }

    // 返回 VNode 对象
    return {
        _isVNode: true,
        flags,
        tag,
        data,
        children,
        childFlags,
        el: null
    }
}


function normalizeVNodes(children) {
    const newChildren = []
    // 遍历 children
    for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (child.key == null) {
            // 如果原来的 VNode 没有key，则使用竖线(|)与该VNode在数组中的索引拼接而成的字符串作为key
            child.key = '|' + i
        }
        newChildren.push(child)
    }
    // 返回新的children，此时 children 的类型就是 ChildrenFlags.KEYED_VNODES
    return newChildren
}

export function createTextVNode(text) {
    return {
        _isVNode: true,
        // flags 是 VNodeFlags.TEXT
        flags: VNodeFlags.TEXT,
        tag: null,
        data: null,
        // 纯文本类型的 VNode，其 children 属性存储的是与之相符的文本内容
        children: text,
        // 文本节点没有子节点
        childFlags: ChildrenFlags.NO_CHILDREN
    }
}