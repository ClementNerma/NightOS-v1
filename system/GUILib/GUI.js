
var GUI = function() {

	var _layout;
	var _menuBar;
	var _statusBar;

	this.setMenuBar = function(menuBar) {

		if(!menuBar instanceof MenuBar)
			return false;

		_menuBar = menuBar;

		var old = document.getElementById('gui-menubar');

		if(old)	old.remove();

		document.body.appendChild(_menuBar.DOM())

		if(_layout)
			_layout.DOM().style.top = '25px';

	}

	this.menuBar = function() {

		return _menuBar;

	}

	this.setLayout = function(layout) {

		if(!layout instanceof Layout)
			return false;

		_layout = layout;

		if(_menuBar)
			_layout.DOM().style.top = '25px';

		if(_statusBar)
			_layout.DOM().style.bottom = '25px';

		document.body.appendChild(_layout.DOM())

	}

	this.layout = function() {

		return _layout;

	}

	this.setStatusBar = function(statusBar) {

		if(!statusBar instanceof StatusBar)
			return false;

		_statusBar = statusBar;

		var old = document.getElementById('gui-statusbar');

		if(old)	old.remove();

		document.body.appendChild(_statusBar.DOM())

		if(_layout)
			_layout.DOM().style.bottom = '25px';

	}

	this.statusBar = function() {

		return _statusBar;

	}

}
