export const getNowFormatDate = (seperator = '/') => {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    const currentdate = year + seperator + month + seperator + strDate;
    return currentdate;
}
export const getCurrentDay = () => {
    const myDate = new Date();
    let days = myDate.getDay();
    switch (days) {
        case 1:
            days = "星期一";
            break;
        case 2:
            days = "星期二";
            break;
        case 3:
            days = "星期三";
            break;
        case 4:
            days = "星期四";
            break;
        case 5:
            days = "星期五";
            break;
        case 6:
            days = "星期六";
            break;
        case 0:
            days = "星期日";
            break;
    }
    return days;
}

// 减法
export function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  }
  
  // 加法
  export function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
  }