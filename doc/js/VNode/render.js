import { VNodeFlags, ChildrenFlags } from './flags'
import { types } from './util';
import { createTextVNode } from './h';
import { patchData } from './patchData';

// vnode.el = el 主要引用真实的dom元素
export default function render(vnode, container) {
    const prevVNode = container.vnode
    if (prevVNode == null) {
        if (vnode) {
            // 没有旧的 VNode，使用 `mount` 函数挂载全新的 VNode
            mount(vnode, container)
            // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode 就存在了
            container.vnode = vnode
        }
    } else {
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

function mount(vnode, container, isSVG, refNode) {
    const { flags } = vnode
    if (flags & VNodeFlags.ELEMENT) {
        // 挂载普通标签
        mountElement(vnode, container, isSVG, refNode)
    } else if (flags & VNodeFlags.COMPONENT) {
        // 挂载组件
        mountComponent(vnode, container, isSVG)
    } else if (flags & VNodeFlags.TEXT) {
        // 挂载纯文本
        mountText(vnode, container)
    } else if (flags & VNodeFlags.FRAGMENT) {
        // 挂载 Fragment
        mountFragment(vnode, container, isSVG)
    } else if (flags & VNodeFlags.PORTAL) {
        // 挂载 Portal
        mountPortal(vnode, container, isSVG)
    }
}
function mountElement(vnode, container, isSVG, refNode) {
    isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG
    const el = isSVG
        ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
        : document.createElement(vnode.tag)
    vnode.el = el
    const data = vnode.data
    if (data) {
        for (let key in data) {
            patchData(el, key, null, data[key])
        }
    }

    const childFlags = vnode.childFlags
    const children = vnode.children
    if (childFlags !== ChildrenFlags.NO_CHILDREN) {
        if (childFlags & ChildrenFlags.SINGLE_VNODE) {
            mount(children, el, isSVG)
        } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
            for (let i = 0; i < children.length; i++) {
                mount(children[i], el, isSVG)
            }
        }
    }
    // console.log('$$ refNode');

    // console.log(refNode);

    refNode ? container.insertBefore(el, refNode) : container.appendChild(el)
}
function mountText(vnode, container) {
    const el = document.createTextNode(vnode.children)
    vnode.el = el
    container.appendChild(el)
}
function mountFragment(vnode, container, isSVG) {
    // 拿到 children 和 childFlags
    const { children, childFlags } = vnode
    switch (childFlags) {
        case ChildrenFlags.SINGLE_VNODE:
            // 如果是单个子节点，则直接调用 mount
            mount(children, container, isSVG);
            // 单个子节点，就指向该节点
            vnode.el = children.el
            break
        case ChildrenFlags.NO_CHILDREN:
            // 如果没有子节点，等价于挂载空片段，会创建一个空的文本节点占位
            const placeholder = createTextVNode('')
            mountText(placeholder, container)
            // 没有子节点指向占位的空文本节点
            vnode.el = placeholder.el
            break
        default:
            // 多个子节点，遍历挂载之
            for (let i = 0; i < children.length; i++) {
                mount(children[i], container, isSVG)
            }
            // console.log(vnode);
            // 多个子节点，指向第一个子节点
            vnode.el = children[0].el
    }
}

function mountPortal(vnode, container) {
    const { tag, children, childFlags } = vnode
    const target = typeof tag === 'string' ? document.querySelector(tag) : tag
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
        mount(children, target)
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
        for (let i = 0; i < children.length; i++) {
            mount(children[i], target)
        }
    }

    // 占位的空文本节点
    const placeholder = createTextVNode('')
    // 将该节点挂载到 container 中
    mountText(placeholder, container, null)
    // el 属性引用该节点
    vnode.el = placeholder.el
}

function mountComponent(vnode, container, isSVG) {
    if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
        mountStatefulComponent(vnode, container, isSVG)
    } else {
        mountFunctionalComponent(vnode, container, isSVG)
    }
}
// 有状态组件
function mountStatefulComponent(vnode, container, isSVG) {
    // console.log(vnode);

    // 创建组件实例
    const instance = (vnode.children = new vnode.tag())
    // 初始化 props
    instance.$props = vnode.data;
    // console.log(vnode);

    instance._update = function () {
        // 如果 instance._mounted 为真，说明组件已挂载，应该执行更新操作
        if (instance._mounted) {
            // 1、拿到旧的 VNode
            const prevVNode = instance.$vnode
            // 2、重渲染新的 VNode
            const nextVNode = (instance.$vnode = instance.render())
            // 3、patch 更新
            patch(prevVNode, nextVNode, prevVNode.el.parentNode)
            // 4、更新 vnode.el 和 $el
            instance.$el = vnode.el = instance.$vnode.el
        } else {
            // 1、渲染VNode
            instance.$vnode = instance.render()
            // 2、挂载
            mount(instance.$vnode, container, isSVG)
            // 3、组件已挂载的标识
            instance._mounted = true
            // 4、el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素
            instance.$el = vnode.el = instance.$vnode.el
            // 5、调用 mounted 钩子
            instance.mounted && instance.mounted()
        }
    }

    instance._update()
}
// 无状态组件
function mountFunctionalComponent(vnode, container, isSVG) {
    vnode.handle = {
        prev: null,
        next: vnode,
        container,
        update: () => {
            if (vnode.handle.prev) {
                // 更新
                // prevVNode 是旧的组件VNode，nextVNode 是新的组件VNode
                const prevVNode = vnode.handle.prev
                const nextVNode = vnode.handle.next
                // prevTree 是组件产出的旧的 VNode
                const prevTree = prevVNode.children
                // nextTree 是组件产出的新的 VNode
                const props = nextVNode.data
                const nextTree = (nextVNode.children = nextVNode.tag(props))
                // 调用 patch 函数更新
                patch(prevTree, nextTree, vnode.handle.container)
            } else {
                // 获取 props
                const props = vnode.data
                // 获取 VNode
                const $vnode = (vnode.children = vnode.tag(props))
                // 挂载
                mount($vnode, container, isSVG)
                // el 元素引用该组件的根元素
                vnode.el = $vnode.el
            }
        }
    }

    // 立即调用 vnode.handle.update 完成初次挂载
    vnode.handle.update()
}

function patch(prevVNode, nextVNode, container) {
    // 分别拿到新旧 VNode 的类型，即 flags
    const nextFlags = nextVNode.flags
    const prevFlags = prevVNode.flags

    // 检查新旧 VNode 的类型是否相同，如果类型不同，则直接调用 replaceVNode 函数替换 VNode
    // 如果新旧 VNode 的类型相同，则根据不同的类型调用不同的比对函数
    if (prevFlags !== nextFlags) {
        replaceVNode(prevVNode, nextVNode, container)
    } else if (nextFlags & VNodeFlags.ELEMENT) {
        patchElement(prevVNode, nextVNode, container)
    } else if (nextFlags & VNodeFlags.COMPONENT) {
        patchComponent(prevVNode, nextVNode, container)
    } else if (nextFlags & VNodeFlags.TEXT) {
        patchText(prevVNode, nextVNode)
    } else if (nextFlags & VNodeFlags.FRAGMENT) {
        patchFragment(prevVNode, nextVNode, container)
    } else if (nextFlags & VNodeFlags.PORTAL) {
        patchPortal(prevVNode, nextVNode)
    }
}
// 看上去很简单，但实际上仅有这两行代码的话，是存在缺陷的。至于有何缺陷我们会在本章的后面讲解，因为目前我们的背景铺垫还不够
function replaceVNode(prevVNode, nextVNode, container) {
    // 将旧的 VNode 所渲染的 DOM 从容器中移除
    container.removeChild(prevVNode.el);

    if (prevVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
        // 类型为有状态组件的 VNode，其 children 属性被用来存储组件实例对象
        const instance = prevVNode.children
        instance.unmounted && instance.unmounted()
    }
    // 再把新的 VNode 挂载到容器中
    mount(nextVNode, container)
}

// 我们认为不同的标签渲染的内容不同 即 div 和 ul
function patchElement(prevVNode, nextVNode, container) {
    // 如果新旧 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode
    if (prevVNode.tag !== nextVNode.tag) {
        replaceVNode(prevVNode, nextVNode, container)
        return
    }
    // 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素
    // 将新的 VNodeData 全部应用到元素上，再把那些已经不存在于新的 VNodeData 上的数据从元素上移除，
    const el = (nextVNode.el = prevVNode.el);

    const prevData = prevVNode.data;
    const nextData = nextVNode.data;
    // 新的 VNodeData 存在时才有必要更新
    if (nextData) {
        // 遍历新的 VNodeData，将旧值和新值都传递给 patchData 函数
        for (let key in nextData) {
            const prevValue = prevData[key]
            const nextValue = nextData[key]
            patchData(el, key, prevValue, nextValue)
        }
    }
    if (prevData) {
        // 遍历旧的 VNodeData，将已经不存在于新的 VNodeData 中的数据移除
        for (let key in prevData) {
            const prevValue = prevData[key]
            if (prevValue && !nextData.hasOwnProperty(key)) {
                // 第四个参数为 null，代表移除数据
                patchData(el, key, prevValue, null)
            }
        }
    }

    // 调用 patchChildren 函数递归地更新子节点
    patchChildren(
        prevVNode.childFlags, // 旧的 VNode 子节点的类型
        nextVNode.childFlags, // 新的 VNode 子节点的类型
        prevVNode.children,   // 旧的 VNode 子节点
        nextVNode.children,   // 新的 VNode 子节点
        el                    // 当前标签元素，即这些子节点的父节点
    )
}


function patchChildren(
    prevChildFlags,
    nextChildFlags,
    prevChildren,
    nextChildren,
    container
) {
    switch (prevChildFlags) {
        // 旧的 children 是单个子节点，会执行该 case 语句块
        case ChildrenFlags.SINGLE_VNODE:
            switch (nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    // 新的 children 也是单个子节点时，会执行该 case 语句块
                    patch(prevChildren, nextChildren, container)
                    break
                case ChildrenFlags.NO_CHILDREN:
                    // 新的 VNode 没有子节点。在这种情况下我们只需要把旧的子节点移除即可
                    container.removeChild(prevChildren.el)
                    break
                default:
                    // 新的 children 中有多个子节点时，会执行该 case 语句块
                    // 移除旧的单个子节点
                    container.removeChild(prevChildren.el)
                    // 遍历新的多个子节点，逐个挂载到容器中
                    for (let i = 0; i < nextChildren.length; i++) {
                        mount(nextChildren[i], container)
                    }
                    break
            }
            break
        // 旧的 children 中没有子节点时，会执行该 case 语句块
        case ChildrenFlags.NO_CHILDREN:
            switch (nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    // 新的 children 是单个子节点时，会执行该 case 语句块
                    // 使用 mount 函数将新的子节点挂载到容器元素
                    mount(nextChildren, container);

                    break
                case ChildrenFlags.NO_CHILDREN:
                    // 新的 children 中没有子节点时，会执行该 case 语句块
                    // 什么都不做
                    break
                default:
                    // 新的 children 中有多个子节点时，会执行该 case 语句块
                    // 遍历多个新的子节点，逐个使用 mount 函数挂载到容器元素
                    for (let i = 0; i < nextChildren.length; i++) {
                        mount(nextChildren[i], container)
                    }
                    break
            }
            break
        // 旧的 children 中有多个子节点时，会执行该 case 语句块
        default:
            switch (nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    // 新的 children 是单个子节点时，会执行该 case 语句块
                    // 有多个旧的子节点，但新的子节点是单个子节点，这时只需要把所有旧的子节点移除，再将新的单个子节点添加到容器元素即可
                    for (let i = 0; i < prevChildren.length; i++) {
                        container.removeChild(prevChildren[i].el)
                    }
                    mount(nextChildren, container)
                    break
                case ChildrenFlags.NO_CHILDREN:
                    // 新的 children 中没有子节点时，会执行该 case 语句块
                    for (let i = 0; i < prevChildren.length; i++) {
                        container.removeChild(prevChildren[i].el)
                    }
                    break
                default:
                    // 新的 children 中有多个子节点时，会执行该 case 语句块
                    // 核心diff 算法
                    // 第一种diff 算法
                    // pathDiffDom(prevChildren, nextChildren, container);
                    internoDiffDome(prevChildren, nextChildren, container)
                    break
            }
            break
    }
}
// 判断是否有节点需要移动，以及应该如何移动和寻找出那些需要被添加或移除的节点
function pathDiffDom(prevChildren, nextChildren, container) {
    // 多个节点 需要patch下数据是否相同, 使用key来判断是否需要移动 添加 和删除
    let lastIndex = 0;
    for (let i = 0; i < nextChildren.length; i++) {
        const nextVNode = nextChildren[i];
        let j = 0, find = false;
        for (j; j < prevChildren.length; j++) {
            const prevVNode = prevChildren[j];
            // 如果key 相同进行对比
            if (nextVNode.key === prevVNode.key) {
                find = true;
                patch(prevVNode, nextVNode, container);
                // 是否需要移动  寻找过程中在 旧 children 中所遇到的最大索引值。如果在后续寻找的过程中发现存在索引值比最大索引值小的节点，意味着该节点需要被移动。
                if (j < lastIndex) {
                    // 需要移动
                    const refNode = nextChildren[i - 1].nextSibling;
                    container.insertBefore(prevVNode.el, refNode);
                } else {
                    lastIndex = j;
                }
            }
        }

        if (!find) {
            // 需要添加
            // 挂载新节点
            // 找到 refNode
            const refNode =
                i - 1 < 0
                    ? prevChildren[0].el // 第一个节点
                    : nextChildren[i - 1].el.nextSibling
            mount(nextVNode, container, false, refNode)
        }
    }

    // 移除已经不存在的节点
    // 遍历旧的节点
    for (let i = 0; i < prevChildren.length; i++) {
        const prevVNode = prevChildren[i]
        // 拿着旧 VNode 去新 children 中寻找相同的节点
        const has = nextChildren.find(
            nextVNode => nextVNode.key === prevVNode.key
        )
        if (!has) {
            // 如果没有找到相同的节点，则移除
            container.removeChild(prevVNode.el)
        }
    }




}

function internoDiffDome(prevChildren, nextChildren, container) {
    // 更新相同的前缀节点
    let j = 0
    let prevVNode = prevChildren[j]
    let nextVNode = nextChildren[j]
    let prevEnd = prevChildren.length - 1
    let nextEnd = nextChildren.length - 1

    outer: {
        while (prevVNode.key === nextVNode.key) {
            patch(prevVNode, nextVNode, container)
            j++
            if (j > prevEnd || j > nextEnd) {
                break outer
            }
            prevVNode = prevChildren[j]
            nextVNode = nextChildren[j]
        }
        // 更新相同的后缀节点
        prevVNode = prevChildren[prevEnd]
        nextVNode = nextChildren[nextEnd]
        while (prevVNode.key === nextVNode.key) {
            patch(prevVNode, nextVNode, container)
            prevEnd--
            nextEnd--
            if (j > prevEnd || j > nextEnd) {
                break outer
            }
            prevVNode = prevChildren[prevEnd]
            nextVNode = nextChildren[nextEnd]
        }
    }

    if (j > prevEnd && j <= nextEnd) {
        // j -> nextEnd 之间的节点应该被添加
        const nextPos = nextEnd + 1
        const refNode =
            nextPos < nextChildren.length ? nextChildren[nextPos].el : null
        while (j <= nextEnd) {
            mount(nextChildren[j++], container, false, refNode)
        }
    } else if (j > nextEnd) {
        while (j <= prevEnd) {
            container.removeChild(prevChildren[j++].el)
        }
    } else {
        // 构造 source 数组
        const nextLeft = nextEnd - j + 1 // 新 children 中剩余未处理节点的数量
        const source = []
        for (let i = 0; i < nextLeft; i++) {
            source.push(-1)
        }

        const prevStart = j
        const nextStart = j
        let moved = false
        let pos = 0
        // 构建索引表
        const keyIndex = {}
        for (let i = nextStart; i <= nextEnd; i++) {
            keyIndex[nextChildren[i].key] = i
        }
        // debugger
        let patched = 0
        // 遍历旧 children 的剩余未处理节点
        for (let i = prevStart; i <= prevEnd; i++) {
            prevVNode = prevChildren[i]

            if (patched < nextLeft) {
                // 通过索引表快速找到新 children 中具有相同 key 的节点的位置
                const k = keyIndex[prevVNode.key]
                if (typeof k !== 'undefined') {
                    nextVNode = nextChildren[k]
                    // patch 更新
                    patch(prevVNode, nextVNode, container)
                    patched++
                    // 更新 source 数组
                    source[k - nextStart] = i
                    // 判断是否需要移动
                    if (k < pos) {
                        moved = true
                    } else {
                        pos = k
                    }
                } else {
                    // 没找到，说明旧节点在新 children 中已经不存在了，应该移除
                    container.removeChild(prevVNode.el)
                }
            } else {
                // 多余的节点，应该移除
                container.removeChild(prevVNode.el)
            }
        }

        if (moved) {
            const seq = lis(source)
            // j 指向最长递增子序列的最后一个值
            let j = seq.length - 1
            // 从后向前遍历新 children 中的剩余未处理节点
            for (let i = nextLeft - 1; i >= 0; i--) {
                if (source[i] === -1) {
                    // 作为全新的节点挂载

                    // 该节点在新 children 中的真实位置索引
                    const pos = i + nextStart
                    const nextVNode = nextChildren[pos]
                    // 该节点下一个节点的位置索引
                    const nextPos = pos + 1
                    // 挂载
                    mount(
                        nextVNode,
                        container,
                        false,
                        nextPos < nextChildren.length
                            ? nextChildren[nextPos].el
                            : null
                    )
                } else if (i !== seq[j]) {
                    // 说明该节点需要移动

                    // 该节点在新 children 中的真实位置索引
                    const pos = i + nextStart
                    const nextVNode = nextChildren[pos]
                    // 该节点下一个节点的位置索引
                    const nextPos = pos + 1
                    // 移动
                    container.insertBefore(
                        nextVNode.el,
                        nextPos < nextChildren.length
                            ? nextChildren[nextPos].el
                            : null
                    )
                } else {
                    // 当 i === seq[j] 时，说明该位置的节点不需要移动
                    // 并让 j 指向下一个位置
                    j--
                }
            }
        }

    }
}
function patchText(prevVNode, nextVNode) {
    // 拿到文本元素 el，同时让 nextVNode.el 指向该文本元素
    const el = (nextVNode.el = prevVNode.el)
    // 只有当新旧文本内容不一致时才有必要更新
    if (nextVNode.children !== prevVNode.children) {
        el.nodeValue = nextVNode.children
    }
}


function patchFragment(prevVNode, nextVNode, container) {
    // 直接调用 patchChildren 函数更新 新旧片段的子节点即可
    patchChildren(
        prevVNode.childFlags, // 旧片段的子节点类型
        nextVNode.childFlags, // 新片段的子节点类型
        prevVNode.children,   // 旧片段的子节点
        nextVNode.children,   // 新片段的子节点
        container
    )

    switch (nextVNode.childFlags) {
        case ChildrenFlags.SINGLE_VNODE:
            nextVNode.el = nextVNode.children.el
            break
        case ChildrenFlags.NO_CHILDREN:
            nextVNode.el = prevVNode.el
            break
        default:
            nextVNode.el = nextVNode.children[0].el
    }
}

function patchPortal(prevVNode, nextVNode) {
    patchChildren(
        prevVNode.childFlags,
        nextVNode.childFlags,
        prevVNode.children,
        nextVNode.children,
        prevVNode.tag // 注意 container 是旧的 container
    )
    // 让 nextVNode.el 指向 prevVNode.el
    nextVNode.el = prevVNode.el

    // 如果新旧容器不同，才需要搬运
    if (nextVNode.tag !== prevVNode.tag) {
        // 获取新的容器元素，即挂载目标
        const container =
            typeof nextVNode.tag === 'string'
                ? document.querySelector(nextVNode.tag)
                : nextVNode.tag

        switch (nextVNode.childFlags) {
            case ChildrenFlags.SINGLE_VNODE:
                // 如果新的 Portal 是单个子节点，就把该节点搬运到新容器中
                container.appendChild(nextVNode.children.el)
                break
            case ChildrenFlags.NO_CHILDREN:
                // 新的 Portal 没有子节点，不需要搬运
                break
            default:
                // 如果新的 Portal 是多个子节点，遍历逐个将它们搬运到新容器中
                for (let i = 0; i < nextVNode.children.length; i++) {
                    container.appendChild(nextVNode.children[i].el)
                }
                break
        }
    }
}
// 组件更新
function patchComponent(prevVNode, nextVNode, container) {
    // tag 属性的值是组件类，通过比较新旧组件类是否相等来判断是否是相同的组件
    if (nextVNode.tag !== prevVNode.tag) {
        replaceVNode(prevVNode, nextVNode, container)
    } else if (nextVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
        // 获取组件实例
        const instance = (nextVNode.children = prevVNode.children)
        // 更新 props
        instance.$props = nextVNode.data
        // 更新组件
        instance._update()
    } else {
        // 更新函数式组件
        const handle = (nextVNode.handle = prevVNode.handle)
        handle.prev = prevVNode
        handle.next = nextVNode
        handle.container = container

        handle.update()
    }
}
// 什么是最长递增子序列：给定一个数值序列，找到它的一个子序列，并且子序列中的值是递增的，子序列中的元素在原序列中不一定连续。
// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
// 当一个序列只有一个元素时，我们认为其递增子序列就是其本身，
function lis(arr) {
    const p = arr.slice()
    const result = [0]
    let i
    let j
    let u
    let v
    let c
    const len = arr.length
    for (i = 0; i < len; i++) {
        const arrI = arr[i]
        if (arrI !== 0) {
            j = result[result.length - 1]
            if (arr[j] < arrI) {
                p[i] = j
                result.push(i)
                continue
            }
            u = 0
            v = result.length - 1
            while (u < v) {
                c = ((u + v) / 2) | 0
                if (arr[result[c]] < arrI) {
                    u = c + 1
                } else {
                    v = c
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1]
                }
                result[u] = i
            }
        }
    }
    u = result.length
    v = result[u - 1]
    while (u-- > 0) {
        result[u] = v
        v = p[v]
    }
    return result
}

var x = lis([ 0,8 ]);
console.log(x);
