
/**
  * GUIMenuBarChild - MenuBar Child system
  * @constructor
  */

var GUIMenuBarChild = function() {

	var _text = '';
	var _children = [];

	this.get = function() {
		
		var $child = $(document.createElement('span')).addClass('GUIMenuBarChild').text(_text);

		for(var i in _children)
			$child.append(_children[i].get());

		return $child;

	}

	this.setText = function(text) {

		if(typeof(text) !== 'string')
			return false;

		_text = text;
		return true;

	}

	this.text = function() { return _text; }

	this.addChild = function(child) {

		if(!child instanceof GUIMenuBarSubChild)
			return false;

		_children.push(child);

		return true;

	}

	this.children = function() { return _children; }

	this.removeChildren = function(place) {

		_children.splice(place, 1);
		return true;

	}

}
