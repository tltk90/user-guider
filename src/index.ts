import { createSvg, removeSvg } from './svgCreator';

const ANIMATE_TIME = 100;
const containerId = 'ug-main-overlay-container';
const getContainer = () => document.getElementById(containerId);
export interface IGuiderConfig {
    elements: Array<{name: string, text: string}>,

}
export default function guide(config: IGuiderConfig) {
    let configIndex = 0;
    let configCount = config.elements.length - 1;
    const { guider, guiderText, buttons} = initializeElement();
    const setButtonDisableState = () => {
        if(configIndex === 0) {
            (buttons.children[0] as HTMLButtonElement).disabled = true;
        }
        else {
            (buttons.children[0] as HTMLButtonElement).disabled = false;
        }
        if(configIndex === configCount) {
            (buttons.children[1] as HTMLButtonElement).disabled = true;
        }
        else {
            (buttons.children[1] as HTMLButtonElement).disabled = false;
        }
    };
    buttons.children[0].addEventListener('click', () => {
        // prev press
        configIndex--;
        requestAnimationFrame( () => {
            setButtonDisableState();
            showGuide(config.elements[configIndex], guider, guiderText);
        });

    });
    buttons.children[1].addEventListener('click', () => {
        // next press
        configIndex++;
        requestAnimationFrame(() => {
            setButtonDisableState();
            showGuide(config.elements[configIndex], guider, guiderText);
        })
    });
    setButtonDisableState();
    showGuide(config.elements[configIndex], guider, guiderText);

}


function initializeElement() {
    const overlay = document.createElement('div');
    const guider = document.createElement('div');
    const guiderText = document.createElement('span');
    const buttons = createButtonsContainer(); //document.createElement('div');
    const close = document.createElement('div');
    overlay.setAttribute('id', containerId);
    // buttons.innerHTML = '<button id="prev"> &lt; </button> <button id="next">&gt;</button>';
    overlay.setAttribute('class', 'ug-overlay');
    guider.setAttribute('class', 'ug-container');
    buttons.setAttribute('class', 'ug-container-button');
    close.setAttribute('class', 'ug-close-button');
    close.addEventListener('click', removeContainer);
    guider.appendChild(close);
    guider.appendChild(guiderText);
    guider.appendChild(buttons);
    guider.style.boxShadow = '0px 0px 3px 1px #fff';
    guider.style.opacity = '0';
    document.body.appendChild(overlay);
    overlay.appendChild(guider);

    return { guider, guiderText, buttons};
}

function showGuide(element, guider, guiderText) {
    const el = document.querySelector(element.name);
    const rect = el.getBoundingClientRect();
    const onTop = rect.y < document.body.clientHeight / 2;
    const onLeft = rect.x < document.body.clientWidth / 2;
    const svg = createSvg(rect.x, rect.y, rect.width, rect.height);
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
            removeSvg();
            getContainer().appendChild(svg);
            guider.classList.add(classToBeAdded);
            guiderText.innerHTML = element.text;
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

function createButtonsContainer() {
    const buttons = document.createElement('div');
    buttons.innerHTML = `
        <button id="prev"> 
            <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                 <g>
                    <path stroke="currentColor" d="m 23.549223,0.4646839 3.738037,2.330995 c 0.681775,0.4256902 0.680038,1.1221716 0,1.545694 L 11.797506,14.000603 27.28726,23.659828 c 0.681775,0.425691 0.677433,1.122715 0,1.545694 l -3.738037,2.331 c -0.680038,0.423519 -1.798671,0.423519 -2.478708,0 L 4.3735387,17.123942 4.3413995,17.104448 0.60336235,14.773453 c -0.67916977,-0.424066 -0.68264428,-1.120006 0,-1.545694 L 4.3413995,10.896764 4.3735385,10.877271 21.070515,0.46469427 c 0.681775,-0.42514736 1.796065,-0.42514736 2.478708,0 z" fill="currentColor"/>
                </g>
            </svg>
    </button> 
    <button id="next">
        <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
             <g>
                <path transform="rotate(180 14 14)" stroke="currentColor" d="m 23.549223,0.4646839 3.738037,2.330995 c 0.681775,0.4256902 0.680038,1.1221716 0,1.545694 L 11.797506,14.000603 27.28726,23.659828 c 0.681775,0.425691 0.677433,1.122715 0,1.545694 l -3.738037,2.331 c -0.680038,0.423519 -1.798671,0.423519 -2.478708,0 L 4.3735387,17.123942 4.3413995,17.104448 0.60336235,14.773453 c -0.67916977,-0.424066 -0.68264428,-1.120006 0,-1.545694 L 4.3413995,10.896764 4.3735385,10.877271 21.070515,0.46469427 c 0.681775,-0.42514736 1.796065,-0.42514736 2.478708,0 z" fill="currentColor"/>
            </g>
        </svg>
    </button>`;
    return buttons;

}
