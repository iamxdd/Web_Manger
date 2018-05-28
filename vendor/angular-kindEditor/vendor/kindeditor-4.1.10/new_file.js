function _ready(fn) {
	if(_readyFinished) {
		fn(KindEditor);
		return;
	}
	var loaded = false;

	function readyFunc() {
		if(!loaded) {
			loaded = true;
			fn(KindEditor);
			_readyFinished = true;
		}
	}

	function ieReadyFunc() {
		if(!loaded) {
			try {
				document.documentElement.doScroll('left');
			} catch(e) {
				setTimeout(ieReadyFunc, 100);
				return;
			}
			readyFunc();
		}
	}

	function ieReadyStateFunc() {
		if(document.readyState === 'complete') {
			readyFunc();
		}
	}
	if(document.addEventListener) {
		_bind(document, 'DOMContentLoaded', readyFunc);
	} else if(document.attachEvent) {
		_bind(document, 'readystatechange', ieReadyStateFunc);
		var toplevel = false;
		try {
			toplevel = window.frameElement == null;
		} catch(e) {}
		if(document.documentElement.doScroll && toplevel) {
			ieReadyFunc();
		}
	}
	_bind(window, 'load', readyFunc);
}