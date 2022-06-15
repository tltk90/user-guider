export enum animationKey {
	none = 'none',
	fade = 'fade',
	slide = 'slide'
}
export enum buttonThemeKey {
	solid = 'solid',
	round = 'round'
}
export interface IElementConfig {
	name?: string;
	text: string;
	title?: string;
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
	}
	animation: animationKey
}
export interface IGuiderConfig {
	elements: Array<IElementConfig>,
	options: IGuiderOptions

}
