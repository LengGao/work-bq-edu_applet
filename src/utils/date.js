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