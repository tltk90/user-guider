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
    const disableRect = createRect(x, y, width, height, 'transparent');
    maskRect.setAttributeNS(null, 'mask', `url(#${maskId})`);
    clipPathRect.setAttributeNS(null, 'clip-path', `url(#${clipId})`);
    clipPathRect.setAttributeNS(null, 'pointer-events', 'auto');
    disableRect.setAttributeNS(null, 'pointer-events', 'none');
    svg.appendChild(maskRect);
    svg.appendChild(clipPathRect);
    svg.addEventListener('click', preventClicks);
    return svg;
}
function createRect(x, y, width, height, color?) {
    const rect = createElement('rect');
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    rect.setAttributeNS(null, 'width', width);
    rect.setAttributeNS(null, 'height', height);
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



function createElement(name, id?) {
    const tag = document.createElementNS(ns, name);
    if(id) {
        tag.setAttributeNS(null, 'id', id);
    }
    return tag;
}
