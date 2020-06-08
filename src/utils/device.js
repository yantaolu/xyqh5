const { screen } = require('electron');

const getDisplayBound = (win) => {
    const { x: wx, y: wy, width, height } = win.getBounds();
    const displayBounds = screen.getAllDisplays()
        .map(display => display.bounds)
        .sort((a, b) => a.x < b.x || a.y < b.y ? 1 : -1);
    return displayBounds.find(({ x, y }) => wx >= x && wy >= y) || displayBounds.pop();
};

module.exports = {
    getDisplayBound,
};
