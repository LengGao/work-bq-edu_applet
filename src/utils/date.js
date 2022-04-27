// 获取回款计划年份选项
export const currentYear = new Date().getFullYear();
export function getPlanYearOptions() {
    const startYear = currentYear - 3;
    let endYear = currentYear + 3;
    let options = [];
    options.push(endYear);
    while (endYear-- > startYear) {
        options.push(endYear);
    }
    return [...options]
}

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

export let toDay = getNowFormatDate()