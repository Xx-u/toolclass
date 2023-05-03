/**
 * 数组去重
 * @param {*} arr Array
 * @returns {Array}
 */
function removeDuplicates(arr) {
    return [...new Set(arr)];
}


/**
 * 数组排序
 * @param {*} arr array
 * @param {*} type 1：从小到大   2：从大到小   3：随机
 * @returns {Array}
 */
function sort(arr, type = 1) {
    return arr.sort((a, b) => {
        switch (type) {
            case 1:
                return a - b;
            case 2:
                return b - a;
            case 3:
                return Math.random() - 0.5;
            default:
                return arr;
        }
    })
}


/**
 * n维数组展开成一维数组
 * @param {*} arr Array
 * @returns {Array}
 */
function flatten(arr) {
    return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
}


/**
 * 类数组转换数组
 * @param {*} ary Array
 * @returns {Array}
 */
function formArray(ary) {
    var arr = [];
    if (Array.isArray(ary)) {
        arr = ary;
    } else {
        arr = Array.prototype.slice.call(ary);
    };
    return arr;
}