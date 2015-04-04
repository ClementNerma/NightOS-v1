
//var explorer = require.library('Explorer');

function openFile() {

	/*explorer.openFile('Open a file...', function(file) {
		if(!openFileCallback(file))
			return Dialogs.error('Text Editor', 'Cannot open ' + file + '. Please check that this file exists and is readable.');
	},  ['*.txt']);*/

	if(changes)
		Dialogs.dialog('Save changes ?', 'The file ' + file + ' has been edited.<br />Do you want to save it ?<br />Note : All not saved modifications will be definitively lost.', {

			'Save': function() {
				saveFile();
				openFile();
			},

			'Do not save': function() {
				App.quit();
			},

			'Cancel': function() {
				Dialogs.close();
			}

		});
	else
		Dialogs.input('Open a file...', 'Please specify the location of the file :', 'text', function(file) {

			if(!openFileCallback(file))
				Dialogs.error('Text Editor', 'Cannot open ' + file + '. Please check that this file exists and is readable.');
			else
				Dialogs.info('Text Editor', 'Sucessfull !');

		});

}

function openFileCallback(path) {

	var content = App.readFile(path);

	if(content === false)
		return false;

	file = path;
	name = path.split('/')[path.split('/').length - 1]

	WinGUI.setTitle('Text Editor - ' + name);
	$('#editor').val(content);

	return true;

}

function saveFile() {

	if(!changes)
		return true;

	if(file) {
		changes = App.writeFile(file, $('#editor').val()) ? true : Dialogs.error('Text Editor', 'Cannot save ' + file + '.');
		return changes;
 	} else
		return saveAsFile();

}

function saveAsFile() {

	Dialogs.input('Text Editor - Save As...', 'Please input the file path :', 'text', function(path) {

		file = path;
		name = file.split('/')[file.split('/').length - 1];

		saveFile();

	});

}

var open = App.call.arguments.openFile;

var file = null;
var name = null;

var changes = false;

App.loadFrame('UI');

$('#editor').on('keydown', function(e) {

	if(e.ctrlKey && String.fromCharCode(e.keyCode) === 'O')
		return openFile();

	if(e.ctrlKey && e.shiftKey && String.fromCharCode(e.keyCode) === 'S')
		return saveAsFile();

	if(e.ctrlKey && String.fromCharCode(e.keyCode) === 'S')
		return saveFile();

	if(e.ctrlKey && String.fromCharCode(e.keyCode) === 'Q')
		return App.events.on('quit')();

	if(e.ctrlKey && String.fromCharCode(e.keyCode) === 'N')
		Dialogs.dialog('Save changes ?', 'The file ' + file + ' has been edited.<br />Do you want to save it ?<br />Note : All not saved modifications will be definitively lost.', {

			'Save': function() {
				saveFile();
				$('#editor').val('');
				name = null;
				file = null;
				changes = false;
				WinGUI.setTitle('Text Editor');
				Dialogs.close();
			},

			'Do not save': function() {
				$('#editor').val('');
				name = null;
				file = null;
				changes = false;
				WinGUI.setTitle('Text Editor');
				Dialogs.close();
			},

			'Cancel': function() {
				Dialogs.close();
			}

		});

});

$('#editor').on('input', function() {

	changes = true;

});

App.events.on('quit', function() {

	if(changes)
		Dialogs.dialog('Save changes ?', 'The file ' + file + ' has been edited.<br />Do you want to save it ?<br />Note : All not saved modifications will be definitively lost.', {

			'Save': function() {
				saveFile();
				App.quit();
			},

			'Do not save': function() {
				App.quit();
			},

			'Cancel': function() {
				Dialogs.close();
			}

		});
	else
		App.quit();

});

if(open && !openFileCallback(open))
	Dialogs.error('Cannot open ' + open);
