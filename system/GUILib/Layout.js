
var Layout = function() {

	var _elements = [];
	var _DOM = document.createElement('div');
	_DOM.id = 'gui-layout';
	_DOM.style.position = 'relative';
	_DOM.style.top = '0';
	_DOM.style.left = '0';
	_DOM.style.right = '0';
	_DOM.style.bottom = '0';

	var _caseWidth = 50;
	var _caseHeight = 30;

	/**
	  * Append an element to the application layout
	  * @param {Object} The element you want to add to the layout. It must be a GUI widget, such as TextEdit, etc.
	  * @param {Number} X The X position of the element
	  * @param {Number} Y The Y position of the element
	  * @param {Number} width [optional] The element width
	  * @param {Number} height [optional] The element height
	  */

	this.append = function(element, X, Y, width, height) {

		if(!element.DOM || !element.DOM())
			return false;

		if(typeof X !== 'number' || typeof height !== 'number' ||typeof width !== 'number' || typeof height !== 'number')
			return false;

		var e = element.DOM().style;
		e.position = 'absolute';
		e.top    = (Y * _caseHeight).toString() + 'px'; 
		e.left   = (X * _caseWidth).toString() + 'px';
		
		if(typeof height === 'number' && height > 0)
			e.height = (height * _caseHeight).toString() + 'px';
		
		if(typeof width === 'number' && width > 0)
			e.width  = (width * _caseWidth).toString() + 'px';

		_elements.push(element);
		_DOM.appendChild(element.DOM());

	}

	this.DOM = function() {

		return _DOM;

	}

}
