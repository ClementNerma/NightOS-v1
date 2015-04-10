
var TextEdit = function() {

	var _DOM = document.createElement('textarea');

	this.setText = function(text) {

		if(typeof(text) === 'number')
			text = text.toString();

		if(typeof(text) !== 'string')
			return false;

		_DOM.value = text;

	}

	this.toPlainText = function() {

		return _DOM.value;

	}

	this.DOM = function() {

		return _DOM;

	}

}
