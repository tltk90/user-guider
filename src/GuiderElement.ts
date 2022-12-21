import { ElementPosition, IElementConfig, IGuideElement } from './models';

export class GuiderElement implements IGuideElement {
	constructor(configElement: IElementConfig) {
		this.element = typeof configElement.element === 'string' ? [configElement.element] : configElement.element;
		this.position = configElement.position || ElementPosition.element;
		this.text = configElement.text;
		this.title = configElement.title;
		this.afterGuideFn = configElement.afterGuide;
		this.beforeGuideFn = configElement.beforeGuide;
	}

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
			setTimeout(() => this.beforeGuideFn(), 10);
		}
	}

	get target(): Array<HTMLElement> {
		return this.element && this.element.map( el => document.querySelector(el));
	}
}
