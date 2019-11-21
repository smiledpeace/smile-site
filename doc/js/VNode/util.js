
const toString = Object.prototype.toString;
const type = ['[object Array]', '[object Object]'];

console.log(types({}));

function types(target) {
    return toString.call(target);
}
export {
    types
}