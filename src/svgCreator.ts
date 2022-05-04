const ns = 'http://www.w3.org/2000/svg'
const svgId = 'guider-svg';
const maskId = 'guider-mask';


export function removeSvg() {
    const oldSvg = document.getElementById(svgId);
    if(oldSvg) {
        oldSvg.parentElement.removeChild(oldSvg);
    }
}
export function createSvg(x, y, width, height) {
    const WINDOW_WIDTH = document.body.clientWidth;
    const WINDOW_HEIGHT = document.body.clientHeight;
    const svg  = createElement('svg', svgId);
    svg.setAttributeNS(null,'width', `${WINDOW_WIDTH}`);
    svg.setAttributeNS(null,'height', `${WINDOW_HEIGHT}`);
    const defs = createDefs(x, y, width, height);
    svg.appendChild(defs);
    const maskRect = createRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT, 'currentColor');
    maskRect.setAttributeNS(null, 'mask', `url(#${maskId})`);
    svg.appendChild(maskRect);
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


function createDefs(x, y, width, height) {
    const WINDOW_WIDTH = document.body.clientWidth;
    const WINDOW_HEIGHT = document.body.clientHeight;
    const defs = createElement('defs');
    const mask = createElement('mask', maskId);
    mask.appendChild(createRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT, 'white'));
    mask.appendChild(createRect(x, y, width, height, 'black'));
    defs.appendChild(mask);
    return defs;
}



function createElement(name, id?) {
    const tag = document.createElementNS(ns, name);
    if(id) {
        tag.setAttributeNS(null, 'id', id);
    }
    return tag;
}
