
var MenuItem = function(text, callback) {

	var _keyboardShortcut;
	var _visible = true;
	var _items = [];
	var _DOM = document.createElement('span');

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

	this.setClick = function(callback) {

		if(!callback instanceof Function)
			return false;

		_DOM.onclick = callback;

	}

	this.click = function() {

		return _DOM.onclick;

	}

	this.setVisible = function(visible) {

		_visible = visible;
		_DOM.style.visible = (visible ? 'visible' : 'hidden');

	}

	this.visible = function() {

		return _visible;

	}

	this.setEnabled = function(enabled) {

		_enabled = enabled;

		if(enabled)
			_DOM.setAttribute('enabled', 'true');
		else
			_DOM.removeAttribute('enabled');

	}

	this.setKeyboardShortcut = function(keyboardShortcut) {

		if(!keyboardShortcut instanceof KeyboardShortcut)
			return false;

		_keyboardShortcut = keyboardShortcut;
		_DOM.setAttribute('keyboard-shortcut', keyboardShortcut.toString());

	}

	this.keyboardShortcut = function() {

		return _keyboardShortcut;

	}

	this.enabled = function() {

		return _enabled;

	}

	this.DOM = function() {

		return _DOM;

	}

	this.setText(text);
	this.setEnabled(true);
	this.setClick(callback);

}
