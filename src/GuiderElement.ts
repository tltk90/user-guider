import { ElementPosition, IElementConfig, IGuideElement } from './models';
import { preventClick } from './helpers';

export class GuiderElement implements IGuideElement {
	constructor(configElement: IElementConfig) {
		this.element = typeof configElement.element === 'string' ? [configElement.element] : configElement.element;
		this.position = configElement.position || ElementPosition.element;
		this.text = configElement.text;
		this.title = configElement.title;
		this.afterGuideFn = configElement.afterGuide;
		this.beforeGuideFn = configElement.beforeGuide;
	}

	bodyPointerEvent;
	afterGuideFn;
	beforeGuideFn;
	element: Array<string>;
	pointerEvent: Array<string>;
	position: ElementPosition;
	text: string;
	title: string;
	afterGuide(): void {
		if(this.afterGuideFn) {
			setTimeout(() => this.afterGuideFn(this.target), 0);
		}
	}

	beforeGuide(): void {
		if(this.beforeGuideFn) {
			setTimeout(this.beforeGuideFn(), 0);
		}
	}


	get target(): Array<HTMLElement> {
		return this.element && this.element.map( el => document.querySelector(el));
	}

	lock() {
		/*this.pointerEvent = [];
		this.bodyPointerEvent = document.body.style.pointerEvents;
		document.body.style.pointerEvents = 'none';
		window.document.addEventListener('click', preventClick);
		this.target?.forEach((el, i) => {
			el.addEventListener('click', preventClick);
			this.pointerEvent[i] = el.style.pointerEvents;
			el.style.pointerEvents = 'none';
		});*/
	}

	unlock() {
		/*window.document.removeEventListener('click', preventClick);
		document.body.style.pointerEvents = this.bodyPointerEvent;
		this.target?.forEach( (el, i) => {
			el.removeEventListener('click', preventClick);
			el.style.pointerEvents = this.pointerEvent[i];
		})*/
	}
}
