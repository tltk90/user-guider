const listenersMap = new Map<any, any[]>();
export function createDom(type: keyof HTMLElementTagNameMap, id?: string | string[], classes?: string[], children?: HTMLElement[], listeners?: {type: any, fn: any}[]) {
	if(Array.isArray(id)) {
		classes = id;
		id = undefined;
	}
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
