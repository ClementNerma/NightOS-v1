
function confirmContinue(yes, no, cancel) {

	return Dialogs.dialog('Text Editor', 'The file has been edited. Do you want to save it ?<br /><br />' + file, {

		Save: yes,
		'Do not save': no,
		Cancel: cancel

	});

}

function newFile(e, force) {

	if(changes && !force)
		return confirmContinue(function() {
			saveFile()
			newFile(undefined, true);
			Dialogs.close();
		}, function() {
			newFile(undefined, true);
			Dialogs.close();
		}, function() {
			Dialogs.close();
		});

	file = false;
	changes = false;

	editor.val('');

}

function openFile(name, force) {

	if(typeof(name) !== 'string')
		return Dialogs.input('Text Editor - Open...', 'Please input the file path :', 'text', function(val) {

			openFile(val);

		});

	n = name;

	if(changes && !force)
		return confirmContinue(function() {
			saveFile();
			openFile(n, true);
			Dialogs.close();
		}, function() {
			openFile(n, true);
			Dialogs.close();
		}, function() {
			Dialogs.close();
		})

	var f = App.readFile(name);

	if(!f && typeof(f) !== 'string')
		return Dialogs.error('Text Editor', 'Can\'t open ' + name + ' file');

	changes = false;
	file = name;
	editor.val(f);

}

function saveFile(callback) {

	if(typeof(callback) === 'function')
		c = callback;

	if(!changes)
		return true;

	if(file) {
		if(!App.writeFile(file, editor.val()))
			Dialogs.error('Text Editor - Write failed', 'Cannot write ' + file + ' file.' + (App.lastStack(-1) ? '<br />Needs privileges elevation' : ''));
		else {
			c();
			changes = false;
		}
	} else
		saveAsFile(callback);

}

function saveAsFile(callback) {

	if(typeof(callback) === 'function')
		c = callback;

	return Dialogs.input('Text Editor - Save as...', 'Please input the file path :', 'text', function(val) {

		file = val;
		saveFile(c);

	});

}

function quitFile(e, force) {

	if(changes && !force)
		return confirmContinue(function() {
			saveFile()
			quitFile(undefined, true);
			Dialogs.close();
		}, function() {
			quitFile(undefined, true);
			Dialogs.close();
		}, function() {
			Dialogs.close();
		});

	App.quit();

}

WinGUI.setTitle('Text Editor');

var c = function() {};
var n;
var file;
var changes = false;

App.loadFrame('UI');

/* Set Editor */

var editor = $('#editor');

editor.on('input', function() {
	changes = true;
});

/* Create GUI */

delete menuBar;
var menuBar = new MenuBar();
menuBar.setVisible(true);

var fileMenu = new MenuElement('File');
var _new     = new MenuItem('New', newFile);
var _open    = new MenuItem('Open', openFile);
var _save    = new MenuItem('Save', saveFile);
var _saveAs  = new MenuItem('Save as...', saveAsFile);
var _quit    = new MenuItem('Quit', quitFile);

fileMenu.addItem(_new);
fileMenu.addItem(_open);
fileMenu.addItem(_save);
fileMenu.addItem(_saveAs);
fileMenu.addItem(_quit);

menuBar.addElement(fileMenu);

GUI.setMenuBar(menuBar);

/* Set application events */

App.events.on('quit', quitFile);

/* Open a file if a file is specified */

if(App.call.arguments.openFile)
	openFile(App.call.arguments.openFile, true);
