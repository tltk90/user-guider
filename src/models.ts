export const UG_MAIN_CLASS_NAME = 'ug-main-overlay';

export enum UserGuiderEndEvent {
	close = 'close',
	skip = 'skip',
	done = 'done'
}
export enum AnimationType {
	none = 'none',
	fade = 'fade',
	slide = 'slide'
}
export enum ButtonsTheme {
	solid = 'solid',
	round = 'round'
}
export enum ElementPosition {
	center = 'center',
	element = 'element'
}
export interface IElementConfig {
	element?: string | Array<string>;
	text: string;
	title?: string;
	position?: ElementPosition
	beforeGuide(): void;
	afterGuide(element): void;
}
export interface IGuiderOptions {
	rtl: boolean;
	font: string;
	buttonsTitle: {
		next: string;
		back: string;
		done: string;
		skip: string;
	};
	buttonsTheme: ButtonsTheme;
	colors: {
		background: string;
		text: string;
		elementBorder: string;
	};
	animation: {
		type: AnimationType,
		duration: number
	};
}
export interface IGuiderConfig {
	elements: Array<IElementConfig>;
	options: IGuiderOptions;
	onUserGuiderEnd(endEvent: UserGuiderEndEvent): void;

}

export interface IGuideElement extends IElementConfig {
	element: Array<string>
	target: Array<HTMLElement>;
	pointerEvent?: Array<string>;
}
