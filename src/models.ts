export enum animationKey {
	none = 'none',
	fade = 'fade',
	slide = 'slide'
}
export enum buttonThemeKey {
	solid = 'solid',
	round = 'round'
}
export enum ElementPosition {
	center = 'center',
	element = 'element'
}
export interface IElementConfig {
	element?: string;
	text: string;
	title?: string;
	position?: ElementPosition
}
export interface IGuiderOptions {
	rtl: boolean;
	font: string;
	buttonsTitle: {
		next: string;
		back: string;
		done: string;
		skip: string;
	},
	buttonsTheme: buttonThemeKey;
	colors: {
		background: string;
		text: string;
		elementBorder: string;
	}
	animation: {
		type: animationKey,
		duration: number
	}
}
export interface IGuiderConfig {
	elements: Array<IElementConfig>,
	options: IGuiderOptions

}
