
/**
  * GUI system for NightOS windows
  * @constructor */

var GUI = function() {

	var _menuBar   = [];
	var _statusBar = false;

	this.setMenuBar = function(menuBar) {

		if(!menuBar instanceof GUIMenuBar)
			return false;

		_menuBar = menuBar;
		
		$('#GUI_menuBar').remove();
		$('body').append(menuBar.get().attr('id', 'GUI_menuBar'));

		return true;		 

	}

	this.menuBar = function() { return _menuBar; }

}

function loadGUI(name) {

	try {
		
		window.eval(fs.readFileSync(Core.path.root + '/system/GUI/GUI' + name + '.js', 'utf8'));

	}

	catch(e) {

		throw new Error('Cannot load GUI component : ' + name + ' [system/GUI/GUI' + name + '.js]');

	}

}

loadGUI('MenuBar');
loadGUI('MenuBarChild');
loadGUI('MenuBarSubChild');

delete loadGUI;
