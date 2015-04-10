
/**
  * Generate a menu bar for the application GUI
  * @constructor
  */

var MenuBar = function() {

	var _visible = true;
	var _elements = [];
	var _DOM = document.createElement('div');
	_DOM.id  = 'gui-menubar';

	/**
	  * Change the element visibility
	  * @param {Boolean} visible
	  */

	this.setVisible = function(visible) {

		_visible = visible;
		_DOM.style.opacity = (visible ? 1 : 0);

	}

	/**
	  * Know if the element is visible
	  * @return {Number} Return 0 or 1
	  */

	this.visible = function() {

		return _visible;

	}

	/**
	  * Add a MenuElement object to the menu bar
	  * @param {MenuElement} element
	  * @return {Boolean}
	  */

	this.addElement = function(element) {

		if(!element instanceof MenuElement)
			return false;

		_elements.push(element);
		_DOM.appendChild(element.DOM());

		return true;

	}

	this.DOM = function() {

		return _DOM;

	}

}
