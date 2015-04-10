
var MenuBar = function() {

	var _visible = true;
	var _elements = [];
	var _DOM = document.createElement('div');
	_DOM.id  = 'gui-menubar';

	this.setVisible = function(visible) {

		_visible = visible;
		_DOM.style.opacity = (visible ? 1 : 0);

	}

	this.visible = function() {

		return _visible;

	}

	this.addElement = function(element) {

		if(!element instanceof MenuElement)
			return false;

		_elements.push(element);
		_DOM.appendChild(element.DOM());

	}

	this.DOM = function() {

		return _DOM;

	}

}
