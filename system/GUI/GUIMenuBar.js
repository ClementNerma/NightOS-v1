
/**
  * GUIMenuBar - MenuBar system
  * @constructor
  */

var GUIMenuBar = function() {

	var _children = [];

	this.get = function() {

		var $menu = $(document.createElement('div'));

		for(var i in _children)
			$menu.append(_children[i].get());

		return $menu;

	}

	this.addChild = function(child) {

		if(!child instanceof GUIMenuBarChild)
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
