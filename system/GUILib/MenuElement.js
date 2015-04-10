
var MenuElement = function(text) {

	var _visible = true;
	var _items = [];
	var _label = document.createElement('div');
	var _DOM = document.createElement('span');
	_DOM.appendChild(_label);
	_DOM.className = 'gui-menu-element';
	_DOM.onclick = function() {

		if(this.getAttribute('opened'))
			this.removeAttribute('opened');
		else
			this.setAttribute('opened', 'true');

	}

	/**
	  * Change the label of the element
	  * @param {string} text The label of the element
	  * @return {Boolean}
	  */

	this.setText = function(text) {

		if(typeof(text) === 'number')
			text = text.toString();

		if(typeof(text) !== 'string')
			return false;

		_label.innerText = text;

	}

	/**
	  * Get the current label of the buttin
	  * @return {string}
	  */

	this.text = function() {

		return _label.innerText;

	}

	/**
	  * Change the element visibility
	  * @param {Boolean} visible
	  */

	this.setVisible = function(visible) {

		_visible = visible;
		_DOM.style.visible = (visible ? 'visible' : 'hidden');

	}

	/**
	  * Know if the element is visible
	  * @return {Number} Return 0 or 1
	  */

	this.visible = function() {

		return _visible;

	}

	/**
	  * Add a MenuItem object to the menu element
	  * @param {MenuItem} item
	  * @return {Boolean}
	  */

	this.addItem = function(item) {

		if(!item instanceof MenuItem)
			return false;

		_items.push(item);
		_DOM.appendChild(item.DOM());

	}

	this.DOM = function() {

		return _DOM;

	}

	this.setText(text);

}
