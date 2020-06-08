const format = (date = new Date(), fmt = 'yyyy-MM-dd HH:mm:ss') => {
    // 如果只传了格式化模板
    if (typeof date === 'string') {
        fmt = date;
        date = new Date();
    }

    let d = {
        'y+': date.getFullYear(),
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'H+': date.getHours(),
        'h+': date.getHours() % 12,
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        't+': date.getHours() > 11 ? 'PM' : 'AM',
    };

    for (let r in d) {
        switch (r) {
            case 'y+':
                (new RegExp(`(${r})`, 'gi').test(fmt)) && (fmt = fmt.replace(RegExp.$1, d[r].toString().substring(4 - RegExp.$1.length)));
                break;
            case 't+':
                (new RegExp(`(${r})`, 'gi').test(fmt)) && (fmt = fmt.replace(RegExp.$1, d[r].toString().substring(0, RegExp.$1.length)));
                break;
            default:
                (new RegExp(`(${r})`, 'g').test(fmt)) && (fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? d[r] : `${d[r]}`.padStart(2, '0')));
                break;
        }
    }
    return fmt;
};

module.exports = {
    format,
};
