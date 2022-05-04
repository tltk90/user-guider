import {createSvg} from "./svgCreator";

const ANIMATE_TIME = 100;
const containerId = 'ug-main-overlay-container';
const getContainer = () => document.getElementById(containerId);
export function guide(config) {
    let configIndex = 0;
    let configCount = config.length - 1;
    const { guider, guiderText, buttons} = initializeElement();
    const setButtonDisableState = () => {
        if(configIndex === 0) {
            buttons.children[0].disabled = true;
        }
        else {
            buttons.children[0].disabled = false;
        }
        if(configIndex === configCount) {
            buttons.children[1].disabled = true;
        }
        else {
            buttons.children[1].disabled = false;
        }
    };
    buttons.children[0].addEventListener('click', () => {
        // prev press
        configIndex--;
        requestAnimationFrame( () => {
            setButtonDisableState();
            showGuide(config[configIndex], guider, guiderText);
        });

    });
    buttons.children[1].addEventListener('click', () => {
        // next press
        configIndex++;
        requestAnimationFrame(() => {
            setButtonDisableState();
            showGuide(config[configIndex], guider, guiderText);
        })
    });
    setButtonDisableState();
    showGuide(config[configIndex], guider, guiderText);

}


function initializeElement() {
    const overlay = document.createElement('div');
    const guider = document.createElement('div');
    const guiderText = document.createElement('span');
    const buttons = document.createElement('div');
    const close = document.createElement('div');
    overlay.setAttribute('id', containerId);
    buttons.innerHTML = '<button id="prev"> &lt; </button> <button id="next">&gt;</button>';
    overlay.setAttribute('class', 'ug-overlay');
    guider.setAttribute('class', 'ug-container');
    buttons.setAttribute('class', 'ug-container-button');
    close.setAttribute('class', 'ug-close-button');
    close.addEventListener('click', removeContainer);
    guider.appendChild(close);
    guider.appendChild(guiderText);
    guider.appendChild(buttons);

    guider.style.opacity = '0';
    document.body.appendChild(overlay);
    overlay.appendChild(guider);

    return { guider, guiderText, buttons};
}

function showGuide(c, guider, guiderText) {
    const el = document.querySelector(c.element);
    const rect = el.getBoundingClientRect();
    const onTop = rect.y < document.body.clientHeight / 2;
    const onLeft = rect.x < document.body.clientWidth / 2;
    const svg = createSvg(rect.x, rect.y, rect.width, rect.height, rect.top, rect.left, rect.right, rect.bottom);
    let classToBeAdded;
    if(onTop) {
        classToBeAdded = onLeft ? 'ug-bubble-top' : 'ug-bubble-top-right';
    }
    else {
        classToBeAdded = onLeft ? 'ug-bubble-bottom-left': 'ug-bubble-bottom';
    }
    function animate() {
        const transition = `opacity ${ANIMATE_TIME / 2}ms ease-in-out`;
        const oldT = guider.style.transition;
        guider.style.transition = transition;
        guider.style.opacity = '0';
        setTimeout(() => {
            clearBubbleClass(guider);
            getContainer().appendChild(svg);
            guider.classList.add(classToBeAdded);
            guiderText.innerHTML = c.text;
            const top = onTop ? rect.bottom : undefined;
            const bottom = !onTop ? (document.body.clientHeight - rect.top) : undefined;
            const left = onLeft ? rect.x - (rect.width / 2): rect.x + (rect.width / 2) - guider.clientWidth;
            guider.style.top = top ? `${top}px` : '';
            guider.style.bottom = bottom ? `${bottom}px` : '';
            guider.style.left = `${left}px`;
            guider.style.opacity = '1';
            guider.style.transition = oldT;
        }, ANIMATE_TIME);
    }

    animate();
}

function clearBubbleClass(el) {
    el.classList.remove('ug-bubble-bottom', 'ug-bubble-top', 'ug-bubble-bottom-left', 'ug-bubble-top-right');
}
function removeContainer() {
    const overlay = getContainer();
    document.body.removeChild(overlay);
}

