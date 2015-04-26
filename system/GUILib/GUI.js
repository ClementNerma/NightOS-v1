
/**
  * The default GUI for all applications
  * @constructor
  */

var GUI = function() {

	var _layout;
	var _menuBar;
	var _statusBar;

	/**
	  * Set a menu bar to your application window
	  * @param {MenuBar} menuBar
	  * @returns {Boolean}
	  */

	this.setMenuBar = function(menuBar) {

		if(!menuBar instanceof MenuBar)
			return false;

		_menuBar = menuBar;

		var old = document.getElementById('gui-menubar');

		if(old)	old.remove();

		document.body.appendChild(_menuBar.DOM())

		if(_layout)
			_layout.DOM().style.top = '25px';

		return true;

	}

	/**
	  * Get the current application menu bar
	  * @returns {MenuBar}
	  */

	this.menuBar = function() {

		return _menuBar;

	}

	/**
	  * Set a layout to your application window
	  * @param {Layout} layout
	  * @returns {Boolean}
	  */

	this.setLayout = function(layout) {

		if(!layout instanceof Layout)
			return false;

		_layout = layout;

		if(_menuBar)
			_layout.DOM().style.top = '25px';

		if(_statusBar)
			_layout.DOM().style.bottom = '25px';

		document.body.appendChild(_layout.DOM());

		return true;

	}

	/**
	  * Get the current application layout
	  * @returns {Layout}
	  */

	this.layout = function() {

		return _layout;

	}

	/**
	  * Set a status bar to your application window
	  * @param {StatusBar} statusBar
	  * @returns {Boolean}
	  */

	this.setStatusBar = function(statusBar) {

		if(!statusBar instanceof StatusBar)
			return false;

		_statusBar = statusBar;

		var old = document.getElementById('gui-statusbar');

		if(old)	old.remove();

		document.body.appendChild(_statusBar.DOM())

		if(_layout)
			_layout.DOM().style.bottom = '25px';

		return true;

	}

	/**
	  * Get the current application status bar
	  * @returns {StatusBar}
	  */

	this.statusBar = function() {

		return _statusBar;

	}

}
