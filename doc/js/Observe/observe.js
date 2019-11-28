class Observer {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        // 遍历 data 对象属性，调用 defineReactive 方法
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(data, keys[i], data[keys[i]])
        }
    }
}


// defineReactive方法仅仅将data的属性转换为访问器属性
function defineReactive(data, key, val) {
    // 递归观测子属性
    observer(val)

    let dep = new Dep()        // 新增
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            console.log('get');
            dep.addSub()    // 新增
            return val
        },
        set: function (newVal) {
            console.log('set');
            if (val === newVal) {
                return
            }
            // 对新值进行观测
            observer(newVal)
            
            dep.notify()    // 新增
        }
    })
}

// observer 方法首先判断data是不是纯JavaScript对象，如果是，调用 Observer 类进行观测
function observer(data) {
    if (Object.prototype.toString.call(data) !== '[object Object]') {
        return
    }
    new Observer(data)
}

var data = {
    a: 1,
    b: {
        c: 2
    }
}
class Dep {
    constructor () {
        this.subs = [];
        console.log(this.subs);
        
    }
    addSub () {
        this.subs.push(Dep.target)
    }
    notify () {
        for(let i = 0; i < this.subs.length; i++){
            this.subs[i].fn()
        }
    }
}
Dep.target = null
function pushTarget(watch){
    Dep.target = watch
}

class Watch {
    constructor (exp, fn) {
        this.exp = exp
        this.fn = fn
        pushTarget(this)
        data[exp]
    }
}

observer(data)

new Watch('a', () => {
    console.log(9)
})

new Watch('b.c', () => {
    console.log(80)
})
setTimeout(() => {
    data.a = 2;
});
