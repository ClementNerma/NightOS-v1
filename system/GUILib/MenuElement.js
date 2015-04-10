
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

	this.setText = function(text) {

		if(typeof(text) === 'number')
			text = text.toString();

		if(typeof(text) !== 'string')
			return false;

		_label.innerText = text;

	}

	this.text = function() {

		return _label.innerText;

	}

	this.setVisible = function(visible) {

		_visible = visible;
		_DOM.style.visible = (visible ? 'visible' : 'hidden');

	}

	this.visible = function() {

		return _visible;

	}

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
