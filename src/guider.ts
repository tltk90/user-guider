import UserGuiderError, { assert } from './error';
import { createSvg, removeSvg } from './svgCreator';
import {
	createDom,
	findGuiderLeft,
	findGuiderTop,
	getElementRect,
	preventClick,
	removeDom,
	WINDOW_HEIGHT, WINDOW_WIDTH
} from './helpers';
import {
	AnimationType,
	ButtonsTheme,
	ElementPosition,
	IGuiderConfig,
	IGuiderOptions,
	UG_MAIN_CLASS_NAME,
	UserGuiderEndEvent
} from './models';
import { GuiderElement } from './GuiderElement';

const containerId = 'ug-main-overlay';
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
	buttonsTheme: ButtonsTheme.round,
	animation: {
		type: AnimationType.fade,
		duration: 250
	}
};
export default function guide(config: IGuiderConfig) {
	const options = Object.assign({}, config.options);
	assert(options);
	const ANIMATE_TIME = options.animation.type === AnimationType.none ? 0 : (options.animation.duration ? options.animation.duration : defaultOptions.animation.duration);
	const isNotNoneAnimation = options.animation.type !== AnimationType.none;
	let configIndex = 0;
	let configCount = config.elements.length - 1;
	let currentElement: GuiderElement;
	let guiderContainer: HTMLDivElement;
	let guiderTitle: HTMLSpanElement;
	let guiderText: HTMLSpanElement;
	initializeElement();
	setVarValue();
	const calcTransform = () => {
		const leftOffset = (guiderContainer.offsetLeft + guiderContainer.offsetWidth) - WINDOW_WIDTH();
		const topOffset = (guiderContainer.offsetTop + guiderContainer.offsetHeight) - WINDOW_HEIGHT();
		return `translate(-${ leftOffset > 0 ? leftOffset : 0 }px, -${ topOffset > 0 ? topOffset : 0 }px)`;
	};

	const setButtonState = () => {
		const prevBtn = document.getElementById(prevBtnId) as HTMLDivElement;
		const nextBtn = document.getElementById(nextBtnId) as HTMLDivElement;
		const select = document.getElementById(selectNavId) as HTMLSelectElement;
		const setButton = (btn: HTMLDivElement, title: string) => {
			(btn.children[0] as HTMLSpanElement).innerText = title;
			btn.setAttribute('title', title)
		};
		select.value = `${ configIndex }`;
		if (configIndex === 0) {
			setButton(prevBtn, options.buttonsTitle.skip || defaultOptions.buttonsTitle.skip);
		} else {
			setButton(prevBtn, options.buttonsTitle.back || defaultOptions.buttonsTitle.back);
		}
		if (configIndex === configCount) {
			setButton(nextBtn, options.buttonsTitle.done || defaultOptions.buttonsTitle.done);
		} else {
			setButton(nextBtn, options.buttonsTitle.next || defaultOptions.buttonsTitle.next);
		}
	};
	const checkIfDone = () => configIndex < 0 || configIndex > configCount;
	const onResize = () => showGuide();
	window.addEventListener('resize', onResize);
	// start
	step();


	// private functions
	function step() {
		currentElement?.afterGuide();
		if (checkIfDone()) {
			return removeContainer();
		}
		currentElement = new GuiderElement(config.elements[configIndex]);
		currentElement.beforeGuide();
		showGuide();
	}

	function next(e) {
		preventClick(e);
		configIndex++;
		step();
	}

	function prev(e) {
		preventClick(e);
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
		const close = createDom('div', null, ['ug-close-button', options.rtl ? 'rtl' : undefined].filter(Boolean), null, [{
			type: 'click',
			fn: removeContainer
		}]);
		const buttons = createNavigatorContainer();
		guiderContainer = createDom('div', null, ['ug-container'], [close, guiderTitle, guiderText, buttons]) as HTMLDivElement;
		const overlay = createDom('div', containerId, [UG_MAIN_CLASS_NAME], [guiderContainer]);
		if (options.rtl) {
			guiderContainer.setAttribute('dir', 'rtl');
		}
		document.body.appendChild(overlay);
	}

	function setVarValue() {
		const { colors, font } = options;
		const varContainer: any = document.getElementById(containerId);
		if (colors?.background) {
			varContainer.style.setProperty('--background', colors.background);
		}
		if (colors?.text) {
			varContainer.style.setProperty('--text', colors.text);
		}
		if (colors?.elementBorder) {
			varContainer.style.setProperty('--activeElementBorder', colors.elementBorder);
		}

		if (font) {
			varContainer.style.setProperty('--fontFamily', font);
		}
	}

	function createNavigatorContainer() {
		const spanPrev = createDom('span');
		const spanNext = createDom('span');
		const select = createDom('select', selectNavId, null, null, [{ type: 'change', fn: nav }]) as HTMLSelectElement;
		for (let i = 1; i <= config.elements.length; i++) {
			const o = createDom('option') as HTMLOptionElement;
			o.setAttribute('value', `${ i - 1 }`);
			o.text = `${ i }`;
			select.add(o);
		}
		const prevBtn = createDom('div', prevBtnId, ['clickable'], [spanPrev], [{ type: 'click', fn: prev }]);
		const nextBtn = createDom('div', nextBtnId, ['clickable'], [spanNext], [{ type: 'click', fn: next }]);
		const navBtn = createDom('div', null, null, [select]);
		const buttons = createDom('div', null, ['ug-container-navigator', options.buttonsTheme || defaultOptions.buttonsTheme, options.rtl ? 'rtl' : null].filter(Boolean), [prevBtn, navBtn, nextBtn]);
		return buttons;
	}

	function removeContainer() {
		const overlay = getContainer();
		removeSvg();
		removeDom(overlay?.querySelector('.ug-close-button'));
		removeDom(overlay?.querySelector(`#${ nextBtnId }`));
		removeDom(overlay.querySelector(`#${ prevBtnId }`));
		removeDom(overlay?.querySelector(`#${ selectNavId }`));
		window.removeEventListener('resize', onResize);
		document.body.removeChild(overlay);
		if (config.onUserGuiderEnd) {
			let endEvent = UserGuiderEndEvent.close;
			if (configIndex < 0) {
				endEvent = UserGuiderEndEvent.skip;
			}
			if (configIndex > configCount) {
				endEvent = UserGuiderEndEvent.done;
			}
			config.onUserGuiderEnd(endEvent);
		}
	}

	function hideGuiderAndSvg() {
		const allBlackSvg = createSvg([{x: 0, y: 0, left: 0, right: 0, bottom: 0, top: 0, width: 0, height: 0}]);
		guiderContainer.style.visibility = 'hidden';
		removeSvg();
		getContainer().appendChild(allBlackSvg);
	}

	function showGuideAndSvg(rects) {
		const svg = createSvg(rects);
		removeSvg();
		getContainer().appendChild(svg);
		guiderContainer.style.visibility = 'visible';
	}
	// main function
	function showGuide() {
		if (!currentElement.text) {
			throw new UserGuiderError('element must contain text attribute');
		}
		if (isNotNoneAnimation) {
			guiderContainer.style.animation = `${ options.animation.type || defaultOptions.animation }-out ${ ANIMATE_TIME }ms forwards`;
		}
		hideGuiderAndSvg();
		setTimeout(async () => {
			const rects = await getElementRect(currentElement);
			const isElementPosition = currentElement.target && currentElement.position === ElementPosition.element;
			if (currentElement.title) {
				guiderTitle.style.display = '';
				guiderTitle.innerText = currentElement.title;
			} else {
				guiderTitle.style.display = 'none'
			}
			guiderText.innerText = currentElement.text;
			let top;
			let left;
			if (isElementPosition) {
				top = findGuiderTop(rects);
				left = findGuiderLeft(rects, guiderContainer.clientWidth);
			} else {
				top = (WINDOW_HEIGHT() / 2) - (guiderContainer.clientHeight / 2);
				left = (WINDOW_WIDTH() / 2) - (guiderContainer.clientWidth / 2);
			}
			guiderContainer.style.top = `${ top > 0 ? top : '0' }px`;
			guiderContainer.style.left = `${ left > 0 ? left : '0' }px`;

			setButtonState();
			showGuideAndSvg(rects);
			if (isNotNoneAnimation) {
				guiderContainer.style.animation = `${ options.animation.type || defaultOptions.animation }-in ${ ANIMATE_TIME }ms forwards`;
			}
			guiderContainer.scrollIntoView(true);
			requestAnimationFrame(() => {
				if (options.animation.type === AnimationType.slide) {
					guiderContainer.style.animation = '';
				}
				guiderContainer.style.transform = isElementPosition ? calcTransform() : '';
			})
		}, ANIMATE_TIME);
	}
}
