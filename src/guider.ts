import UserGuiderError from './error';
import { createSvg, removeSvg } from './svgCreator';
import { createDom, removeDom } from './helpers';
import { animationKey, buttonThemeKey, ElementPosition, IGuiderConfig, IGuiderOptions } from './models';

const containerId = 'ug-main-overlay-container';
const prevBtnId = 'prevBtn';
const nextBtnId = 'nextBtn';
const selectNavId = 'selectNav';
const getContainer = () => document.getElementById(containerId);


const defaultOptions: Partial<IGuiderOptions> = {
	buttonsTitle: {
		next: 'Next',
		back: 'Back',
		done: 'Done',
		skip: 'Skip'
	},
	buttonsTheme: buttonThemeKey.round,
	animation: {
		type: animationKey.fade,
		duration: 1000
	}
};
export default function guide(config: IGuiderConfig) {
	const WINDOW_WIDTH = () => document.body.clientWidth;
	const WINDOW_HEIGHT = () => document.body.clientHeight;
	const options = Object.assign({}, config.options);
	const ANIMATE_TIME = options.animation.type === animationKey.none ? 0 : (options.animation.duration ? options.animation.duration : defaultOptions.animation.duration);
	const isNotNoneAnimation = options.animation.type !== animationKey.none;
	checkIfAnimationIsValid();
	let configIndex = 0;
	let configCount = config.elements.length - 1;
	let currentElement;
	let guiderContainer: HTMLDivElement;
	let guiderTitle: HTMLSpanElement;
	let guiderText: HTMLSpanElement;
	initializeElement();
	setVarValue();
	const setButtonState = () => {
		const prevBtn = document.getElementById(prevBtnId) as HTMLDivElement;
		const nextBtn = document.getElementById(nextBtnId) as HTMLDivElement;
		const select = document.getElementById(selectNavId) as HTMLSelectElement;
		const setButton = (btn: HTMLDivElement, title: string) => {
			(btn.children[0] as HTMLSpanElement).innerText = title;
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
		guiderTitle = createDom('span', null, ['ug-container-title']);
		guiderText = createDom('span', null, ['ug-container-text']);
		const close = createDom('div', null, ['ug-close-button', options.rtl ? 'rtl': undefined].filter(Boolean), null,[{type: 'click', fn: removeContainer}]);
		const buttons = createNavigatorContainer();
		guiderContainer = createDom('div', null, ['ug-container'], [close, guiderTitle, guiderText, buttons]) as HTMLDivElement;
		const overlay = createDom('div', containerId, ['ug-overlay'], [guiderContainer]);
		if(options.rtl) {
			guiderContainer.setAttribute('dir', 'rtl');
		}
		document.body.appendChild(overlay);
	}

	function setVarValue() {
		const { colors, font } = options;
		const varContainer: any = document.getElementById(containerId);
		if(colors?.background) {
			varContainer.style.setProperty('--background', colors.background);
		}
		if(colors?.text) {
			varContainer.style.setProperty('--text', colors.text);
		}
		if(colors?.elementBorder) {
			varContainer.style.setProperty('--elementBorder', colors.elementBorder);
		}

		if(font) {
			varContainer.style.setProperty('--fontFamily', font);
		}
	}
	function createNavigatorContainer() {
		const spanPrev = createDom('span');
		const spanNext = createDom('span');
		const select = createDom('select', selectNavId, null, null, [{type: 'change', fn: nav}]) as HTMLSelectElement;
		for(let i = 1; i <= config.elements.length; i++ ) {
			const o = createDom('option') as HTMLOptionElement;
			o.setAttribute('value', `${i - 1}`);
			o.text = `${i}`;
			select.add(o);
		}
		const prevBtn = createDom('div', prevBtnId, ['clickable'], [spanPrev], [{type: 'click', fn: prev}]);
		const nextBtn = createDom('div', nextBtnId, ['clickable'], [spanNext], [{type: 'click', fn: next}]);
		const navBtn = createDom('div', null, null, [select]);
		const buttons = createDom('div', ['ug-container-navigator', options.buttonsTheme || defaultOptions.buttonsTheme], null, [prevBtn, navBtn, nextBtn]);
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
		removeDom(overlay?.querySelector('.ug-close-button'));
		removeDom(overlay?.querySelector(`#${nextBtnId}`));
		removeDom(overlay.querySelector(`#${prevBtnId}`));
		removeDom(overlay?.querySelector(`#${selectNavId}`));
		window.removeEventListener('resize', onResize);
		document.body.removeChild(overlay);
	}

	function checkIfAnimationIsValid() {
		if(options.animation) {
			if(Object.keys(animationKey).indexOf(options.animation.type) === -1) {
				throw new UserGuiderError('animation must be one of ' + Object.keys(animationKey).join(', '))
			}
		}

	}

	// main function
	function showGuide() {
		currentElement = Object.assign({position: ElementPosition.element}, config.elements[configIndex]);
		if(!currentElement.text) {
			throw new UserGuiderError("element must contain text attribute");
		}
		currentElement.target = currentElement.element ? document.querySelector(currentElement.element) : undefined;
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
		if(isNotNoneAnimation) {
			guiderContainer.style.animation = `${ options.animation.type || defaultOptions.animation }-out ${ ANIMATE_TIME }ms forwards`;
		}
		setTimeout(() => {
			const isElementPosition = currentElement.target && currentElement.position === ElementPosition.element;
			clearBubbleClass(guiderContainer);
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
			if(isElementPosition) {
				top = onTop ? rect.bottom : undefined;
				bottom = !onTop ? (WINDOW_HEIGHT() - rect.top) : undefined;
				left = onLeft ? rect.x - (rect.width / 2): rect.x + (rect.width / 2) - guiderContainer.clientWidth;
				guiderContainer.classList.add(classToBeAdded);
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
				guiderContainer.style.animation = `${options.animation.type || defaultOptions.animation}-in ${ANIMATE_TIME}ms forwards`;
			}
			removeSvg();
			getContainer().appendChild(svg);
		}, ANIMATE_TIME / 2);
	}
}
