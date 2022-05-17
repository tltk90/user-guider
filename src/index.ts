import UserGuiderError from './error';
import { createSvg, removeSvg } from './svgCreator';

const ANIMATE_TIME = 100;
const containerId = 'ug-main-overlay-container';
const getContainer = () => document.getElementById(containerId);
export interface IElementConfig {
    name?: string;
    text: string;
    title?: string;
}
export interface IGuiderConfig {
    elements: Array<IElementConfig>,

}
export default function guide(config: IGuiderConfig) {
    const WINDOW_WIDTH = () => document.body.clientWidth;
    const WINDOW_HEIGHT = () => document.body.clientHeight;
    let configIndex = 0;
    let configCount = config.elements.length - 1;
    let currentElement;
    let guiderContainer: HTMLDivElement;
    let guiderTitle: HTMLSpanElement;
    let guiderText: HTMLSpanElement;
    initializeElement();
    const setButtonState = () => {
        const buttons = guiderContainer.children[3];
        const prevBtn = buttons.children[0] as HTMLDivElement;
        const nextBtn = buttons.children[1] as HTMLDivElement;
        if(configIndex === 0) {
            (prevBtn.children[1] as HTMLSpanElement).innerText = 'Exit';
        }
        else {
            (prevBtn.children[1] as HTMLSpanElement).innerText = 'Back';
        }
        if(configIndex === configCount) {
            (nextBtn.children[1] as HTMLSpanElement).innerText = 'Done';
        }
        else {
            (nextBtn.children[1] as HTMLSpanElement).innerText = 'Next';
        }
    };
    const checkIfDone = () => configIndex < 0 || configIndex > configCount;
    const onResize = () => showGuide();
    const preventClicks = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };
    document.body.addEventListener('click', preventClicks);
    window.addEventListener('resize', onResize);

    // start
    showGuide();



    // private functions
    function step() {
        if(checkIfDone()) {
            removeContainer();
        }
        else {
            requestAnimationFrame( () => {
                showGuide();
            });
        }
    }

    function next() {
        configIndex++;
        step();
    }

    function prev() {
        configIndex--;
        step();
    }
    function initializeElement() {
        // init overlay
        const overlay = document.createElement('div');
        overlay.setAttribute('id', containerId);
        overlay.setAttribute('class', 'ug-overlay');
        // init close button
        const close = document.createElement('div');
        close.setAttribute('class', 'ug-close-button');
        close.addEventListener('click', removeContainer);
        // init guider container
        guiderContainer = document.createElement('div');
        guiderContainer.setAttribute('class', 'ug-container');
        guiderTitle = document.createElement('span');
        guiderTitle.setAttribute('class', 'ug-container-title');
        guiderText = document.createElement('span');
        guiderText.setAttribute('class', 'ug-container-text');
        const buttons = createButtonsContainer();
        buttons.setAttribute('class', 'ug-container-button');

        guiderContainer.appendChild(close);
        guiderContainer.appendChild(guiderTitle);
        guiderContainer.appendChild(guiderText);
        guiderContainer.appendChild(buttons);
        guiderTitle.style.textShadow = '0px 3px 2px #00000055';
        guiderContainer.style.boxShadow = '0px 0px 3px 1px #fff';
        guiderContainer.style.opacity = '0';
        document.body.appendChild(overlay);
        overlay.appendChild(guiderContainer);
    }

    function createButtonsContainer() {
        const buttons = document.createElement('div');
        buttons.innerHTML = `
        <div  id="prevBtn">
            <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                 <g>
                    <path stroke="currentColor" d="m 23.549223,0.4646839 3.738037,2.330995 c 0.681775,0.4256902 0.680038,1.1221716 0,1.545694 L 11.797506,14.000603 27.28726,23.659828 c 0.681775,0.425691 0.677433,1.122715 0,1.545694 l -3.738037,2.331 c -0.680038,0.423519 -1.798671,0.423519 -2.478708,0 L 4.3735387,17.123942 4.3413995,17.104448 0.60336235,14.773453 c -0.67916977,-0.424066 -0.68264428,-1.120006 0,-1.545694 L 4.3413995,10.896764 4.3735385,10.877271 21.070515,0.46469427 c 0.681775,-0.42514736 1.796065,-0.42514736 2.478708,0 z" fill="currentColor"/>
                </g>
            </svg>
    <span>back</span>
    </div>
    <div id="nextBtn">
        <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
             <g>
                <path transform="rotate(180 14 14)" stroke="currentColor" d="m 23.549223,0.4646839 3.738037,2.330995 c 0.681775,0.4256902 0.680038,1.1221716 0,1.545694 L 11.797506,14.000603 27.28726,23.659828 c 0.681775,0.425691 0.677433,1.122715 0,1.545694 l -3.738037,2.331 c -0.680038,0.423519 -1.798671,0.423519 -2.478708,0 L 4.3735387,17.123942 4.3413995,17.104448 0.60336235,14.773453 c -0.67916977,-0.424066 -0.68264428,-1.120006 0,-1.545694 L 4.3413995,10.896764 4.3735385,10.877271 21.070515,0.46469427 c 0.681775,-0.42514736 1.796065,-0.42514736 2.478708,0 z" fill="currentColor"/>
            </g>
        </svg>
    <span>back</span>
</div>`;

        buttons.children[0].addEventListener('click', prev);
        buttons.children[1].addEventListener('click', next);
        return buttons;

    }

    function getRect() {
        if(currentElement.target) {
            return currentElement.target.getBoundingClientRect();
        }
        else {
            return {x: 0, y: 0, width: 0, height: 0, right: 0, bottom: 0};
        }
    }
    function clearBubbleClass(el) {
        el.classList.remove('ug-bubble-bottom', 'ug-bubble-top', 'ug-bubble-bottom-left', 'ug-bubble-top-right');
    }
    function removeContainer() {
        const overlay = getContainer();
        overlay?.querySelector('ug-close-button')?.removeEventListener('click', removeContainer);
        overlay?.querySelector('#nextBtn')?.removeEventListener('click', next);
        overlay?.querySelector('#prevBtn')?.removeEventListener('click', prev);
        window.removeEventListener('resize', onResize);
        window.document.body.removeEventListener('click', preventClicks);
        document.body.removeChild(overlay);
    }

    // main function
    function showGuide() {
        currentElement = Object.assign({}, config.elements[configIndex]);
        if(!currentElement.text) {
            throw new UserGuiderError("element must contain text attribute");
        }
        currentElement.target = currentElement.name ? document.querySelector(currentElement.name) : undefined;
        if(currentElement.target) {
            currentElement.target.scrollIntoViewIfNeeded(true);
        }
        const rect = getRect();
        const onTop = rect.y < WINDOW_HEIGHT() / 2;
        const onLeft = rect.x < WINDOW_WIDTH() / 2;
        const svg = createSvg(rect.x, rect.y, rect.width, rect.height, rect.right, rect.bottom);
        let classToBeAdded;
        if(onTop) {
            classToBeAdded = onLeft ? 'ug-bubble-top' : 'ug-bubble-top-right';
        }
        else {
            classToBeAdded = onLeft ? 'ug-bubble-bottom-left': 'ug-bubble-bottom';
        }
        function animate() {
            const transition = `opacity ${ANIMATE_TIME / 2}ms ease-in-out`;
            const oldT = guiderContainer.style.transition;
            guiderContainer.style.transition = transition;
            guiderContainer.style.opacity = '0';
            setTimeout(() => {
                clearBubbleClass(guiderContainer);
                removeSvg();
                getContainer().appendChild(svg);
                if(currentElement.target) {
                    guiderContainer.classList.add(classToBeAdded);
                }
                if(currentElement.title) {
                    guiderTitle.style.display = '';
                    guiderTitle.innerText = currentElement.title;
                }
                else {
                    guiderTitle.style.display = 'none'
                }
                guiderText.innerText = currentElement.text;
                let top;
                let bottom;
                let left;
                if(currentElement.target) {
                    top = onTop ? rect.bottom : undefined;
                    bottom = !onTop ? (WINDOW_HEIGHT() - rect.top) : undefined;
                    left = onLeft ? rect.x - (rect.width / 2): rect.x + (rect.width / 2) - guiderContainer.clientWidth;
                }
                else {
                    top = (WINDOW_HEIGHT() / 2) - (guiderContainer.clientHeight / 2);
                    left = (WINDOW_WIDTH() / 2) - (guiderContainer.clientWidth / 2);
                }
                guiderContainer.style.top = top ? `${top}px` : '';
                guiderContainer.style.bottom = bottom ? `${bottom}px` : '';
                guiderContainer.style.left = `${left}px`;
                guiderContainer.style.opacity = '1';
                guiderContainer.style.transition = oldT;
                setButtonState();
            }, ANIMATE_TIME);
        }
        animate();
    }
}
