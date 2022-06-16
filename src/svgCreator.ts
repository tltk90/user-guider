const ns = 'http://www.w3.org/2000/svg'
const svgId = 'guider-svg';
const maskId = 'guider-mask';
const clipId = 'guider-clip';

const preventClicks = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
};

export function removeSvg() {
    const oldSvg = document.getElementById(svgId);
    if(oldSvg) {
        oldSvg.removeEventListener('click', preventClicks);
        oldSvg.parentElement.removeChild(oldSvg);
    }
}
export function createSvg(x, y, width, height, right, bottom) {
    const WINDOW_WIDTH = document.body.clientWidth;
    const WINDOW_HEIGHT = document.body.clientHeight;
    const svg  = createElement('svg', svgId);
    svg.setAttributeNS(null,'width', `${WINDOW_WIDTH}`);
    svg.setAttributeNS(null,'height', `${WINDOW_HEIGHT}`);
    const defs = createDefs(x, y, width, height, right, bottom);
    svg.appendChild(defs);
    const maskRect = createRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT, 'currentColor');
    const clipPathRect = createRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT, 'currentColor');
    const borderRect = buildBorderRect(x,y,width, height);
    maskRect.setAttributeNS(null, 'mask', `url(#${maskId})`);
    clipPathRect.setAttributeNS(null, 'clip-path', `url(#${clipId})`);
    clipPathRect.setAttributeNS(null, 'pointer-events', 'auto');
    borderRect.setAttributeNS(null, 'class', 'active-border');
    svg.appendChild(maskRect);
    svg.appendChild(clipPathRect);
    svg.appendChild(borderRect);
    svg.addEventListener('click', preventClicks);
    return svg;
}
function createRect(x, y, width, height, color?) {
    const rect = createElement('rect');
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    rect.setAttributeNS(null, 'width', `${Math.max(0, width)}`);
    rect.setAttributeNS(null, 'height', `${Math.max(0, height)}`);
    if(color) {
        rect.setAttributeNS(null, 'fill', color);
    }
    return rect;
}


function createDefs(x, y, width, height, right, bottom) {
    const WINDOW_WIDTH = document.body.clientWidth;
    const WINDOW_HEIGHT = document.body.clientHeight;
    const defs = createElement('defs');
    const mask = createElement('mask', maskId);
    const clipPath = createElement('clipPath', clipId);
    mask.appendChild(createRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT, 'white'));
    mask.appendChild(createRect(x, y, width, height, 'black'));
    clipPath.appendChild(createRect(0, 0, WINDOW_WIDTH, y));
    clipPath.appendChild(createRect(0, y, x, height));
    clipPath.appendChild(createRect(right, y, WINDOW_WIDTH - right, height));
    clipPath.appendChild(createRect(0, bottom, WINDOW_WIDTH, WINDOW_HEIGHT - bottom));
    defs.appendChild(mask);
    defs.appendChild(clipPath);
    return defs;
}

function buildBorderRect(x, y, width, height) {
    const fixX  = Math.max(0, x- 5);
    const fixY = Math.max( 0, y - 5);
    const fixW = fixX ? width + 10 : width;
    const fixH = fixY ? height + 10 : height;
    return createRect(fixX, fixY, fixW, fixH, 'transparent');
}

function createElement(name, id?) {
    const tag = document.createElementNS(ns, name);
    if(id) {
        tag.setAttributeNS(null, 'id', id);
    }
    return tag;
}
