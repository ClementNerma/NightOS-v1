
var Button = function(text, onclick) {

	var _DOM = document.createElement('button');
	_DOM.className = 'gui-button';

	this.setText = function(text) {

		if(typeof(text) === 'number')
			text = text.toString();

		if(typeof(text) !== 'string')
			return false;

		_DOM.innerText = text;

	}

	this.text = function() {

		return _DOM.innerText;

	}

	this.addEventListener = function(event, callback) {

		if(typeof(event) !== 'string')
			return false;

		if(typeof(callback) !== 'function')
			return false;

		return _DOM.addEventListener(event, callback);

	}

	this.DOM = function() {

		return _DOM;

	}

	this.setText(text);
	this.addEventListener('click', onclick);

}
