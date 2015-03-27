
/**
  * GUIMenuBarSubChild - MenuBar SubChild system
  * @constructor
  */

var GUIMenuBarSubChild = function() {

	var _text = '';

	this.get = function() {
		
		return $(document.createElement('span').addClass('GUIMenuBarSubChild').text(_text));

	}

	this.setText = function(text) {

		if(typeof(text) !== 'string')
			return false;

		_text = text;
		return true;

	}

	this.text = function() { return _text; }

}
