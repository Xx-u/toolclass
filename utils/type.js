/**
 * type数据类型判断
 * @param {*} value Number | String | Array | Object | Boolean | Function | Null | Undefined | Date | RegExp | Error | Symbol | Promise | Set
 * @returns {Number | String | Array | Object | Boolean | Function | Null | Undefined | Date | RegExp | Error | Symbol | Promise | Set}
 */
function getType(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
}


/**
 * 手机号码中间4位隐藏花号（*）显示
 * @param {*} mobile 
 * @returns {Number}
 */
function hideMobile(mobile) {
    return mobile.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
}


/**
 * 随机密码生成
 * @param {Number} length 密码长度
 * @param {String} charset 规定字符
 * @param {Number} set 组数
 * @returns {String}
 */
const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
function generatePassword(charset, length, set) {
    let password = "";
    let passwordArr = [];
    for (let j = 0; j <= set; j++) {
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
            passwordArr.push(password)
        }
    }
    return passwordArr;
}


/**
 * 数字每千位加逗号
 * @param {*} num 
 * @returns {String}
 */
function commafy(num) {
    return num && num.toString()
        .replace(/\d+/, function (s) {
            return s.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
        })
}


/**
 * 去除字符串空格
 * @param str 要处理的字符串
 * @param type 1：所有空格 2：前后空格 3：前空格 4：后空格
 */
function strTrim(str, type) {
    switch (type) {
        case 1:
            return str.replace(/\s+/g, "");
        case 2:
            return str.replace(/(^\s*)|(\s*$)/g, "");
        case 3:
            return str.replace(/(^\s*)/g, "");
        case 4:
            return str.replace(/(\s*$)/g, "");
        default:
            return str;
    }
}


/**
* 字母大小写切换
* @param str 要处理的字符串
* @param type 1:首字母大写 2：首页母小写 3：大小写转换 4：全部大写 5：全部小写
*/
function strChangeCase(str, type) {
    function ToggleCase(str) {
        var itemText = ""
        str.split("").forEach(
            function (item) {
                if (/^([a-z]+)/.test(item)) {
                    itemText += item.toUpperCase();
                } else if (/^([A-Z]+)/.test(item)) {
                    itemText += item.toLowerCase();
                } else {
                    itemText += item;
                }
            });
        return itemText;
    }

    switch (type) {
        case 1:
            return str.replace(/^(\w)(\w+)/, function (v, v1, v2) {
                return v1.toUpperCase() + v2.toLowerCase();
            });
        case 2:
            return str.replace(/^(\w)(\w+)/, function (v, v1, v2) {
                return v1.toLowerCase() + v2.toUpperCase();
            });
        case 3:
            return ToggleCase(str);
        case 4:
            return str.toUpperCase();
        case 5:
            return str.toLowerCase();
        default:
            return str;
    }
}



/**
* 检测密码强度
* @param str 字符串
* @returns 1：密码弱 2：密码中等 3：密码强 4：密码很强
*/
function checkPwd(str) {
    var nowLv = 0;
    if (str.length < 6) {
        return nowLv
    };
    if (/[0-9]/.test(str)) {
        nowLv++
    };
    if (/[a-z]/.test(str)) {
        nowLv++
    };
    if (/[A-Z]/.test(str)) {
        nowLv++
    };
    return nowLv;
}

/**
 * 返回指定某个区间的一个数字（可以不传参，不传就返回0-255之间的数；可以只传一个，返回0到传入的这个数字之间的某个值）
 * @param n1 开始区间 例：5
 * @param n2 结束区间 例：10
 * @returns 返回这个区间的某个随机值
 */
const randomNumber = (n1, n2) => {
    if (arguments.length === 2) {
        return Math.round(n1 + Math.random() * (n2 - n1));
    } else if (arguments.length === 1) {
        return Math.round(Math.random() * n1)
    } else {
        return Math.round(Math.random() * 255)
    }
}

/**
* 随机产生某个颜色
* @returns {String} 颜色 例：rgb(250,82,49)
*/
//randomNumber是上面定义的函数
function randomColor() {
    return 'rgb(' + this.randomNumber(255) + ',' + this.randomNumber(255) + ',' + this.randomNumber(255) + ')';
}


/**
 * 判断输入格式
 * @param {*} str String
 * @param {*} type String
 * @returns {Boolean}
 */
function checkStr(str, type) {
    switch (type) {
        case 'phone':   //手机号码
            return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(str);
        case 'tel':     //座机
            return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
        case 'card':    //身份证
            return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
        case 'pwd':     //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
            return /^[a-zA-Z]\w{5,17}$/.test(str)
        case 'postal':  //邮政编码
            return /[1-9]\d{5}(?!\d)/.test(str);
        case 'QQ':      //QQ号
            return /^[1-9][0-9]{4,9}$/.test(str);
        case 'email':   //邮箱
            return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
        case 'money':   //金额(小数点2位)
            return /^\d*(?:\.\d{0,2})?$/.test(str);
        case 'URL':     //网址
            return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str)
        case 'IP':      //IP
            return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
        case 'date':    //日期时间
            return /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
        case 'number':  //数字
            return /^[0-9]$/.test(str);
        case 'english': //英文
            return /^[a-zA-Z]+$/.test(str);
        case 'chinese': //中文
            return /^[\u4E00-\u9FA5]+$/.test(str);
        case 'lower':   //小写
            return /^[a-z]+$/.test(str);
        case 'upper':   //大写
            return /^[A-Z]+$/.test(str);
        case 'HTML':    //HTML标记
            return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
        default:
            return true;
    }
}


/**
 * 严格的身份证校验
 * @param {*} sId Number
 * @returns {Boolean}
 */
function isCardID(sId) {
    if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
        alert('你输入的身份证长度或格式错误')
        return false
    }
    //身份证城市
    var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
    if (!aCity[parseInt(sId.substr(0, 2))]) {
        alert('你的身份证地区非法')
        return false
    }

    // 出生日期验证
    var sBirthday = (sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2))).replace(/-/g, "/"),
        d = new Date(sBirthday)
    if (sBirthday != (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate())) {
        alert('身份证上的出生日期非法')
        return false
    }

    // 身份证号码校验
    var sum = 0,
        weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
        codes = "10X98765432"
    for (var i = 0; i < sId.length - 1; i++) {
        sum += sId[i] * weights[i];
    }
    var last = codes[sum % 11]; //计算出来的最后一位身份证号码
    if (sId[sId.length - 1] != last) {
        alert('你输入的身份证号非法')
        return false
    }

    return true
}

