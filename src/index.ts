import UserGuiderError from './error';
import { createSvg, removeSvg } from './svgCreator';

const containerId = 'ug-main-overlay-container';
const prevBtnId = 'prevBtn';
const nextBtnId = 'nextBtn';
const selectNavId = 'selectNav';
const getContainer = () => document.getElementById(containerId);
enum animationKey {
    none = 'none',
    fade = 'fade',
    slide = 'slide'
}
export interface IElementConfig {
    name?: string;
    text: string;
    title?: string;
}
export interface IGuiderOptions {
    rtl: boolean;
    buttonsTitle: {
        next: string;
        back: string;
        done: string;
        skip: string;
    },
    colors: {
        background: string;
        text: string;
    }
    animation: animationKey
}
export interface IGuiderConfig {
    elements: Array<IElementConfig>,
    options: IGuiderOptions

}

const defaultOptions: Partial<IGuiderOptions> = {
    buttonsTitle: {
        next: 'Next',
        back: 'Back',
        done: 'Done',
        skip: 'Skip'
    },
    animation: animationKey.fade
};
export default function guide(config: IGuiderConfig) {
    const WINDOW_WIDTH = () => document.body.clientWidth;
    const WINDOW_HEIGHT = () => document.body.clientHeight;
    const options = Object.assign({}, config.options);
    const ANIMATE_TIME = options.animation === animationKey.none ? 0 : 500;
    checkIfAnimationIsValid();
    let configIndex = 0;
    let configCount = config.elements.length - 1;
    let currentElement;
    let guiderContainer: HTMLDivElement;
    let guiderTitle: HTMLSpanElement;
    let guiderText: HTMLSpanElement;
    initializeElement();
    setColorsValue();
    const setButtonState = () => {
        const prevBtn = document.getElementById(prevBtnId) as HTMLDivElement;
        const nextBtn = document.getElementById(nextBtnId) as HTMLDivElement;
        const select = document.getElementById(selectNavId) as HTMLSelectElement;
        const setButton = (btn: HTMLDivElement, title: string) => {
            (btn.children[0] as HTMLSpanElement).innerText = title.substring(0, 6) + `${title.length > 6 ? '...' : ''}`;
            btn.setAttribute('title', title)
        };
        select.value = `${configIndex}`;
        if(configIndex === 0) {
            setButton(prevBtn, options.buttonsTitle.skip || defaultOptions.buttonsTitle.skip);
        }
        else {
            setButton(prevBtn, options.buttonsTitle.back || defaultOptions.buttonsTitle.back);
        }
        if(configIndex === configCount) {
            setButton(nextBtn, options.buttonsTitle.done || defaultOptions.buttonsTitle.done);
        }
        else {
            setButton(nextBtn, options.buttonsTitle.next || defaultOptions.buttonsTitle.next);
        }
    };
    const checkIfDone = () => configIndex < 0 || configIndex > configCount;
    const onResize = () => showGuide();
    window.addEventListener('resize', onResize);

    // start
    showGuide();



    // private functions
    function step() {
        if(checkIfDone()) {
            return removeContainer();
        }
        showGuide();
    }

    function next() {
        configIndex++;
        step();
    }

    function prev() {
        configIndex--;
        step();
    }
    function nav() {
        const select = document.getElementById(selectNavId) as HTMLSelectElement;
        configIndex = +select.value;
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
        close.style[options.rtl ? 'right' : 'left'] = '5px';
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
        if(options.rtl) {
            guiderContainer.setAttribute('dir', 'rtl');
        }
        document.body.appendChild(overlay);
        overlay.appendChild(guiderContainer);
    }

    function setColorsValue() {
        const { colors } = options;
        const varContainer: any = document.querySelector(':root');
        if(colors?.background) {
            varContainer.style.setProperty('--background', colors.background);
        }
        if(colors?.text) {
            varContainer.style.setProperty('--text', colors.text);
        }
    }
    function createButtonsContainer() {
        const buttons = document.createElement('div');
        const prevBtn = document.createElement('div');
        prevBtn.setAttribute('id', prevBtnId);
        prevBtn.classList.add('clickable', options.rtl ? 'rtl' : '');
        const nextBtn = document.createElement('div');
        nextBtn.setAttribute('id', nextBtnId);
        nextBtn.classList.add('clickable', options.rtl ? 'rtl' : '');
        const navBtn = document.createElement('div');
        const spanPrev = document.createElement('span');
        const spanNext = document.createElement('span');
        const select = document.createElement('select');
        select.setAttribute('id', selectNavId);
        for(let i = 1; i <= config.elements.length; i++ ) {
            const o = document.createElement('option');
            o.setAttribute('value', `${i - 1}`);
            o.text = `${i}`;
            select.add(o);
        }
        spanNext.innerText = 'Next';
        spanPrev.innerText = 'Back';
        navBtn.appendChild(select);
        prevBtn.appendChild(spanPrev);
        nextBtn.appendChild(spanNext);
        prevBtn.addEventListener('click', prev);
        nextBtn.addEventListener('click', next);
        select.addEventListener('change', nav);
        buttons.appendChild(prevBtn);
        buttons.appendChild(navBtn);
        buttons.appendChild(nextBtn);
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
        removeSvg();
        overlay?.querySelector('ug-close-button')?.removeEventListener('click', removeContainer);
        overlay?.querySelector('#nextBtn')?.removeEventListener('click', next);
        overlay?.querySelector('#prevBtn')?.removeEventListener('click', prev);
        window.removeEventListener('resize', onResize);
        document.body.removeChild(overlay);
    }

    function checkIfAnimationIsValid() {
        if(options.animation) {
            if(Object.keys(animationKey).indexOf(options.animation) === -1) {
                throw new UserGuiderError('animation must be one of ' + Object.keys(animationKey).join(', '))
            }
        }

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
        const isNotNoneAnimation = options.animation !== animationKey.none;
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
            if(isNotNoneAnimation) {
                guiderContainer.style.animation = `${ options.animation || defaultOptions.animation }-out ${ ANIMATE_TIME }ms forwards`;
            }
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
                setButtonState();
                guiderContainer.style.visibility = 'visible';
                if(isNotNoneAnimation) {
                    guiderContainer.style.animation = `${options.animation || defaultOptions.animation}-in ${ANIMATE_TIME}ms forwards`;
                }
            }, ANIMATE_TIME);
        }
        animate();
    }
}
