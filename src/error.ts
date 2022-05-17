
export default class UserGuiderError extends Error {
	name = 'User Guider Error';
	constructor(message) {
		super(message);
	}
}
