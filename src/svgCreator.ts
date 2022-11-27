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
export function createSvg(rects) {
    const WINDOW_WIDTH = document.body.clientWidth;
    const WINDOW_HEIGHT = document.body.clientHeight;
    const svg  = createElement('svg', svgId);
    svg.setAttributeNS(null,'width', `${WINDOW_WIDTH}`);
    svg.setAttributeNS(null,'height', `${WINDOW_HEIGHT}`);
    const defs = createDefs(rects);
    svg.appendChild(defs);
    const maskRect = createRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT, 'currentColor');
    const clipPathRect = createRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT, 'currentColor');
    const borderRect = buildBorderRects(rects);
    maskRect.setAttributeNS(null, 'mask', `url(#${maskId})`);
    clipPathRect.setAttributeNS(null, 'clip-path', `url(#${clipId})`);
    clipPathRect.setAttributeNS(null, 'pointer-events', 'auto');
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

function createPath(rects: Array<DOMRect>, color?) {
    const path = createElement('path');
    const pathString = rects.reduce( (path, rect) => {
        path += `M${rect.left} ${rect.top} L${rect.right} ${rect.top} L${rect.right} ${rect.bottom} L${rect.left} ${rect.bottom} L${rect.left} ${rect.top}Z`;
        return path;
    }, '');

    path.setAttributeNS(null, 'd', pathString);
    if(color) {
        path.setAttributeNS(null, 'fill', color);
    }
    return path;
}

function createDefs(rects) {
    const WINDOW_WIDTH = document.body.clientWidth;
    const WINDOW_HEIGHT = document.body.clientHeight;
    const defs = createElement('defs');
    const mask = createElement('mask', maskId);
    const clipPath = createClipPath(rects);
    mask.appendChild(createRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT, 'white'));
    mask.appendChild(createPath(rects, 'black'));
    defs.appendChild(mask);
    defs.appendChild(clipPath);
    return defs;
}

function createClipPath(rects) {
    const WINDOW_WIDTH = document.body.clientWidth;
    const WINDOW_HEIGHT = document.body.clientHeight;
    const addChild = (x, y, width, height, myIndex) => {
        const left = x;
        const top = y;
        const right = x + width;
        const bottom = y + height;
        if(rects.slice(0, myIndex).concat(rects.slice(myIndex + 1)).some( rect => {
            return left <= rect.left || right >= rect.right ||
            top <= rect.top || bottom >= rect.bottom
        })) {
            return false;
        }
        return true
    };
    const clipPath: SVGClipPathElement = createElement('clipPath', clipId);
    rects.forEach( (rect, i) => {
        if(addChild(0, 0, WINDOW_WIDTH, rect.y, i)) {
            clipPath.appendChild(createRect(0, 0, WINDOW_WIDTH, rect.y));
        }
        if(addChild(0, rect.y, rect.x, rect.height, i)) {
            clipPath.appendChild(createRect(0, rect.y, rect.x, rect.height));
        }
        if(addChild(rect.right, rect.y, WINDOW_WIDTH - rect.right, rect.height, i)) {
            clipPath.appendChild(createRect(rect.right, rect.y, WINDOW_WIDTH - rect.right, rect.height));
        }
        if(addChild(0, rect.bottom, WINDOW_WIDTH, WINDOW_HEIGHT - rect.bottom, i)) {
            clipPath.appendChild(createRect(0, rect.bottom, WINDOW_WIDTH, WINDOW_HEIGHT - rect.bottom));
        }

    });
    return clipPath;
}
function buildBorderRects(rects) {
    const rect = createPath(rects, 'transparent');
    rect.setAttributeNS(null, 'class', 'active-border');
    return rect;
}

function createElement(name, id?) {
    const tag = document.createElementNS(ns, name);
    if(id) {
        tag.setAttributeNS(null, 'id', id);
    }
    return tag;
}
