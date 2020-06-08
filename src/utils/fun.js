const debounce = (fn, wait = 500) => {
    let timeout = null;
    return (...args) => {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, wait);
    };
};

const throttle = (fn, delay = 500) => {
    let prev = 0;
    let timeout = null;
    return (...args) => {
        const now = Date.now();
        timeout && clearTimeout(timeout);
        if (now - prev >= delay) {
            fn(...args);
            prev = now;
        } else {
            timeout = setTimeout(() => {
                fn(...args);
            }, delay);
        }
    };
};

module.exports = {
    debounce,
    throttle,
};
