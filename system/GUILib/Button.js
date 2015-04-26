
/**
  * Generate a button for the application GUI
  * @constructor
  * @param {string} text [Optionnal] The label of the button
  * @param {Function} onclick [Optionnal] Callback for the 'click' event
  */

var Button = function(text, onclick) {

	var _DOM = document.createElement('button');
	_DOM.className = 'gui-button';

	/**
	  * Change the label of the button
	  * @param {string} text The label of the button
	  * @returns {Boolean}
	  */

	this.setText = function(text) {

		if(typeof(text) === 'number')
			text = text.toString();

		if(typeof(text) !== 'string')
			return false;

		_DOM.innerText = text;

		return true;

	}

	/**
	  * Get the current label of the buttin
	  * @returns {string}
	  */

	this.text = function() {

		return _DOM.innerText;

	}

	/**
	  * Add an event listener to the button
	  * @param {string} event The event name, such as 'click' or 'mouseover'
	  * @param {Function} callback The callback for the event
	  */

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
