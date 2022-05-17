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
            (prevBtn.children[0] as HTMLSpanElement).innerText = 'Skip';
        }
        else {
            (prevBtn.children[0] as HTMLSpanElement).innerText = 'Back';
        }
        if(configIndex === configCount) {
            (nextBtn.children[0] as HTMLSpanElement).innerText = 'Done';
        }
        else {
            (nextBtn.children[0] as HTMLSpanElement).innerText = 'Next';
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
    <span>Back</span>
    </div>
    <div id="nextBtn">       
        <span>Next</span>
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
