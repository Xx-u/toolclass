/**
 * 节流
 * @param {*} func 执行函数
 * @param {*} delay 防抖时间,毫秒
 * @returns {Function}
 */
function throttle(func, delay) {
    let lastTime = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastTime >= delay) {
            func.apply(this, args);
            lastTime = now;
        }
    };
}


/**
 * 防抖
 * @param {*} func 执行函数
 * @param {*} wait 防抖时间,毫秒
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeoutId;
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}


/**
 * 浅拷贝
 * @param {*} obj 
 * @returns {Object}
 */
function shallowCopy(target) {
    // 1. 对于基本数据类型(string、number、boolean……), 直接返回
    if (typeof target !== 'object' || target === null) {
        return target
    }

    // 2. 创建新对象
    const cloneTarget = Array.isArray(target) ? [] : {}

    // 3. 循环 + 递归处理
    Object.keys(target).forEach(key => {
        cloneTarget[key] = target[key];
    })

    return cloneTarget
}


/**
 * 深拷贝
 * @param {*} obj 
 * @returns {Object}
 */
// map 用于记录出现过的对象, 解决循环引用
const deepClone = (target, map = new WeakMap()) => {
    // 1. 对于基本数据类型(string、number、boolean……), 直接返回
    if (typeof target !== 'object' || target === null) {
        return target
    }

    // 2. 函数 正则 日期 MAP Set: 执行对应构造题, 返回新的对象
    const constructor = target.constructor
    if (/^(Function|RegExp|Date|Map|Set)$/i.test(constructor.name)) {
        return new constructor(target)
    }

    // 3. 解决 共同引用 循环引用等问题
    // 借用 `WeakMap` 来记录每次复制过的对象, 在递归过程中, 如果遇到已经复制过的对象, 则直接使用上次拷贝的对象, 不重新拷贝
    if (map.get(target)) {
        return map.get(target)
    }

    // 4. 创建新对象
    const cloneTarget = Array.isArray(target) ? [] : {}
    map.set(target, cloneTarget)

    // 5. 循环 + 递归处理
    Object.keys(target).forEach(key => {
        cloneTarget[key] = deepClone(obj[key], map);
    })

    // 6. 返回最终结果
    return cloneTarget
}


/**
 * 懒加载
 * @param {*} imgs 获取所有图片节点
 */
function lazyLoad(imgs) {
    // 视口的高度；
    const clientH = document.documentElement.clientHeight;
    // 滚动的距离，这里的逻辑判断是为了做兼容性处理；
    const clientT = document.documentElement.scrollTop || document.body.scrollTop;
    for (let i = 0; i < imgs.length; i++) {
        // 逻辑判断，如果视口高度+滚动距离 > 图片到浏览器顶部的距离就去加载；
        // !imgs[i].src 是避免重复请求，可以把该条件取消试试：可以看到不加该条件的话往回滚动就会重复请求；
        if (clientH + clientT > imgs[i].offsetTop && !imgs[i].src) {
            // 使用data-xx的自定义属性可以通过dom元素的dataset.xx取得；
            imgs[i].src = imgs[i].dataset.src;
        }
    }
};
// 一开始能够加载显示在视口中的图片；
lazyLoad(imgs);
// 监听滚动事件，加载后面的图片；throttle节流函数
window.onscroll = () => throttle(lazyLoad(imgs), 500)


/**
 * 图片地址转 Base64
 * @param {String} url 图片地址
 */
function convertUrlToBase64(url) {
    return new Promise(function (resolve, reject) {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.src = url
        img.onload = function () {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, img.width, img.height)
            const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
            const dataURL = canvas.toDataURL('image/' + ext)
            const base64 = {
                dataURL: dataURL,
                type: 'image/' + ext,
                ext: ext
            }
            resolve(base64)
        }
    })
}


/**
* Base64 转 Blob
* @param {String} base64 Base64源
*/
function convertBase64UrlToBlob(base64) {
    const parts = base64.dataURL.split(';base64,')
    const contentType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length
    const uInt8Array = new Uint8Array(rawLength)
    for (let i = 0; i < rawLength; i++) {
        uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: contentType })
}


/**
 * 判断 URL
 * @param {*} path 
 * @returns {String}
 */
export function isUrl(path) {
    let url
    try {
        url = new URL(path)
    }
    catch (_) {
        return false
    }
    return url.protocol === 'http:' || url.protocol === 'https:'
}
