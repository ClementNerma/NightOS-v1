
//var explorer = require.library('Explorer');

function newFile() {

	Dialogs.dialog('Save changes ?', 'The file ' + file + ' has been edited.<br />Do you want to save it ?<br />Note : All not saved modifications will be definitively lost.', {

		'Save': function() {
			saveFile();
			$('#editor').val('');
			name = null;
			file = null;
			changes = false;
			WinGUI.setTitle('NightOS SDK');
			Dialogs.close();
		},

		'Do not save': function() {
			$('#editor').val('');
			name = null;
			file = null;
			changes = false;
			WinGUI.setTitle('NightOS SDK');
			Dialogs.close();
		},

		'Cancel': function() {
			Dialogs.close();
		}

	});

}

function openFile() {

	/*explorer.openFile('Open a file...', function(file) {
		if(!openFileCallback(file))
			return Dialogs.error('NightOS SDK', 'Cannot open ' + file + '. Please check that this file exists and is readable.');
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
				Dialogs.error('NightOS SDK', 'Cannot open ' + file + '. Please check that this file exists and is readable.');
			else
				Dialogs.info('NightOS SDK', 'Sucessfull !');

		});

}

function openFileCallback(path) {

	var content = App.readFile(path);

	if(content === false)
		return false;

	file = path;
	name = path.split('/')[path.split('/').length - 1]

	WinGUI.setTitle('NightOS SDK - ' + name);
	$('#editor').val(content);

	language = (Registry.read('filesys/' + Explorer.fileExtension(file) + '/language') || 'plain')
	editor.input();
	changes = false;

	return true;

}

function saveFile() {

	if(!changes)
		return true;

	if(file) {
		language = (Registry.read('filesys/' + Explorer.fileExtension(file) + '/language') || 'plain')
		editor.input();
		changes = App.writeFile(file, $('#editor').val()) ? false : !Dialogs.error('NightOS SDK', 'Cannot save ' + file + '.');
		return changes;
 	} else
		return saveAsFile();

}

function saveAsFile() {

	Dialogs.input('NightOS SDK - Save As...', 'Please input the file path :', 'text', function(path) {

		file = path;
		name = file.split('/')[file.split('/').length - 1];

		saveFile();

	});

}

function build() {

	if(changes)
		return Dialogs.alert('NightOS SDK - Build...', 'You must save changes before build your application.');

	Dialogs.confirm('NightOS SDK - Build...', 'Do you want to build your application with the following informations :<br /><br /><table noborder><tr><td>Editor</td><td>' + inf.creator + '</td></tr><tr><td>Version</td><td>' + inf.version + '</td></tr><tr><td>App. name</td><td>' + inf.name + '</td></tr></table>', function() {

		$('#build-log').html('').show();
		App.writeFile('/users/$USER$/tmp/sdk/package.prm', JSON.stringify(inf))
		App.copyFile(file, '/users/$USER$/tmp/sdk/app.js');
		Core.commandLine.exec('chdir /users/$USER$/tmp/sdk && make package.prm package.app', con);

	}, function() {
		Dialogs.alert('NightOS SDK - Build canceled', 'Please change the following informations in the <b>Build</b> menu.');
	})

}

var open = App.call.arguments.openFile;

var file = null;
var name = null;
var theme = 'default';
var language = 'plain';

var changes = false;

App.loadFrame('UI');

$('#build-log').hide();

var fileMenu = new MenuElement('File');

var _newFile = new MenuItem('New', newFile);
var _openFile = new MenuItem('Open', openFile);
var _saveFile = new MenuItem('Save', saveFile);
var _saveAsFile = new MenuItem('Save as...', saveAsFile);
var _quitFile = new MenuItem('Quit', App.events.on('quit'));

fileMenu.addItem(_newFile);
fileMenu.addItem(_openFile);
fileMenu.addItem(_saveFile);
fileMenu.addItem(_saveAsFile);
fileMenu.addItem(_quitFile);

var buildMenu = new MenuElement('Build');

var buildBuild = new MenuItem('Build...', build);

menuBar.addElement(fileMenu);
menuBar.addElement(buildMenu);

menuBar.setVisible(true);

var editor = new UnderEdit($('#editor'));

editor.keydown(function(e) {

	if(e.ctrlKey && String.fromCharCode(e.keyCode) === 'O')
		return openFile();

	if(e.ctrlKey && e.shiftKey && String.fromCharCode(e.keyCode) === 'S')
		return saveAsFile();

	if(e.ctrlKey && String.fromCharCode(e.keyCode) === 'S')
		return saveFile();

	if(e.ctrlKey && String.fromCharCode(e.keyCode) === 'Q')
		return App.events.on('quit')();

	if(e.ctrlKey && String.fromCharCode(e.keyCode) === 'N')
		newFile();

	if(e.ctrlKey && String.fromCharCode(e.keyCode) === 'B')
		build();

});

editor.input(function() {

	changes = true;
	editor.setHTML(Syntax.highlight(editor.content(), language, theme))

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

var con = new Console($('#build-log'));

var inf = {
	name: 'MyFirstApplication',
	creator: 'Me',
	version: '1.0',
	icon: 'no-icon',

	permissions: {
		storage: []
	},

	access: [],

	rights: 1
}
