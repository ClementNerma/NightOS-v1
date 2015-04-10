
var RichEdit = function() {

	var _DOM = document.createElement('div');
	_DOM.setAttribute('contenteditable', true);

	this.setText = function(text) {

		if(typeof(text) === 'number')
			text = text.toString();

		if(typeof(text) !== 'string')
			return false;

		_DOM.innerText = text;

	}

	this.setHTML = function(HTML) {

		if(typeof(HTML) === 'number')
			HTML = HTML.toString();

		if(typeof(HTML) !== 'string')
			return false;

		_DOM.innerHTML = HTML;

	}

	this.toPlainText = function() {

		return (_DOM.innerText || _DOM.innerHTML.toPlainText());

	}

	this.toHTML = function() {

		return _DOM.innerHTML;

	}

	this.DOM = function() {

		return _DOM;

	}

}
