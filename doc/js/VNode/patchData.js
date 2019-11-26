const domPropsRE = /\W|^(?:value|checked|selected|muted)$/

export function patchData(el, key, prevValue, nextValue) {
    switch (key) {
        case 'style':
            for (let k in nextValue) {
                el.style[k] = nextValue[k]
            }
            for (let k in prevValue) {
                if (!nextValue.hasOwnProperty(k)) {
                    el.style[k] = ''
                }
            }
            break
        case 'class':
            const classes = normalizeClasses(nextValue);
            el.className = classes
            break
        default:
            if (key[0] === 'o' && key[1] === 'n') {
                // 事件
                // 移除旧事件
                if (prevValue) {
                    el.removeEventListener(key.slice(2), prevValue)
                }
                // 添加新事件
                if (nextValue) {
                    el.addEventListener(key.slice(2), nextValue)
                }
            } else if (domPropsRE.test(key)) {
                // 当做 DOM Prop 处理
                el[key] = nextValue
            } else {
                // 当做 Attr 处理
                el.setAttribute(key, nextValue)
            }
            break
    }
}

function normalizeClasses(classes, className = []) {
    console.log(classes);
    if (Array.isArray(classes)) {

        classes.forEach(item => {
            if (typeof item === 'string') {
                className.push(item);
            } else {
                normalizeClasses(item, className);
            }
        })
    } else if (types(classes) === '[object Object]') {
        Object.keys(classes).forEach(key => {
            const item = classes[key];

            if (typeof item === 'boolean') {
                if (item) {
                    className.push(key);
                }
            } else {
                normalizeClasses(item, className);
            }
        })
    }
    return className;
}