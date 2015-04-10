
var StatusBar = function() {

	var _DOM = document.createElement('div');
	_DOM.id = 'gui-statusbar';

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

	this.setVisible = function(visible) {

		_visible = visible;
		_DOM.style.visible = (visible ? 'visible' : 'hidden');

	}

	this.visible = function() {

		return _visible;

	}

	this.DOM = function() {

		return _DOM;

	}

}