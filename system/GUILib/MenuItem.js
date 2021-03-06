
var MenuItem = function(text, callback) {

	var _keyboardShortcut;
	var _visible = true;
	var _items = [];
	var _DOM = document.createElement('span');
	var _click;

	/**
	  * Change the label of the item
	  * @param {string} text The label of the item
	  * @returns {Boolean}
	  */

	this.setText = function(text) {

		if(typeof(text) === 'number')
			text = text.toString();

		if(typeof(text) !== 'string')
			return false;

		_DOM.innerText = text;

	}

	/**
	  * Get the current label of the buttin
	  * @returns {string}
	  */

	this.text = function() {

		return _DOM.innerText;

	}

	/**
	  * Set the callback for the click event
	  * @param {Function} callback The click event callback
	  * @returns {Boolean}
	  */

	this.setClick = function(callback) {

		if(!callback instanceof Function)
			return false;

		_DOM.onclick = callback;
		return true;

	}

	/**
	  * Get the current click event callback
	  * @returns {Function}
	  */

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

	/**
	  * Choose to enable or disable the item
	  * @param {Boolean} enabled
	  */

	this.setEnabled = function(enabled) {

		_enabled = enabled;

		if(enabled) {
			_DOM.setAttribute('enabled', 'true');
			this.setClick(_click);
		} else {
			_click = this.click();
			_DOM.removeAttribute('enabled');
			this.setClick(function() {});
		}

	}

	/**
	  * Know if the item is enabled or not
	  * @returns {Boolean}
	  */

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
