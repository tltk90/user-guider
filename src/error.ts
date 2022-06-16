import { AnimationType, ButtonsTheme, IGuiderOptions } from './models';

export default class UserGuiderError extends Error {
	name = 'User Guider Error';
	constructor(message) {
		super(message);
	}
}


export function assert(options: IGuiderOptions) {
	if(options.animation.type) {
		if(Object.keys(AnimationType).indexOf(options.animation.type) === -1) {
			throw new UserGuiderError('animation must be one of [' + Object.keys(AnimationType).join(', ') + ' ]')
		}
	}

	if(options.buttonsTheme) {
		if(Object.keys(ButtonsTheme).indexOf(options.buttonsTheme) === -1) {
			throw new UserGuiderError('buttonsTheme must be one of [' + Object.keys(ButtonsTheme).join(', ') + ' ]')
		}
	}
}

