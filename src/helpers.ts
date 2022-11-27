import { GuiderElement } from './GuiderElement';

const listenersMap = new Map<any, any[]>();
export function createDom(type: keyof HTMLElementTagNameMap, id?: string, classes?: string[], children?: HTMLElement[], listeners?: {type: any, fn: any}[]) {
	const dom: HTMLElement = document.createElement(type);
	if(id && typeof id === 'string') {
		dom.setAttribute('id', id);
	}

	if(classes) {
		dom.classList.add(...classes);
	}

	if(children) {
		children.forEach( (child) => dom.appendChild(child) )
	}

	if(listeners) {
		const domListener = [];
		listeners.forEach( (listener) => {
			dom.addEventListener(listener.type, listener.fn);
			domListener.push(listener);
		});

		listenersMap.set(dom, domListener);
	}

	return dom;
}

export function removeDom(dom: HTMLElement) {
	if(listenersMap.has(dom)) {
		listenersMap.get(dom).forEach( (l) => {
			dom.removeEventListener(l.type, l.fn)
		})
	}
	listenersMap.delete(dom);
	dom.parentElement.removeChild(dom);
}

export function preventClick(event): void {
	try {
		event?.stopImmediatePropagation();
	} catch {
	}
	event?.stopPropagation();
	event?.preventDefault();


}

export function getElementRect(guiderElement: GuiderElement): Promise<DOMRect[]> {
	if(!guiderElement.target) {
		const div = document.createElement('div');
		return Promise.resolve([div.getBoundingClientRect()]);
	}
	const rectPs = guiderElement.target.map( el => findOneRect(el));


	return Promise.all(rectPs);

}


function findOneRect(el: HTMLElement): Promise<DOMRect> {
	return new Promise( resolve => {
		let rect;
		let lastX = Infinity;
		let lastY = Infinity;
		const getRect = () => {
			rect = el.getBoundingClientRect();
			if(rect.x !== lastX || rect.y !== lastY) {
				lastX = rect.x;
				lastY = rect.y;
				setTimeout(getRect, 50);
			}
			else
				resolve(rect);
		};
		getRect();
	})
}
