
/* Define SDK functions */

function enableMenu(bool) {

	_new.setEnabled    (bool);
	_open.setEnabled   (bool);
	_save.setEnabled   (bool);
	_saveAs.setEnabled (bool);
	_quit.setEnabled   (bool);
	_build.setEnabled  (bool);

}

function openProject(path) {

	if(!App.directoryExists(path))
		return Dialogs.error('SDK - Can\'t open project', 'Unable to open project because the project path doesn\'t exists [' + path + ']');

	var _pkg = App.readFile(path + '/package.prm');
	var _app = App.readFile(path + '/app.js');
	var _cmd = App.readFile(path + '/cmd.js');
	var _uninstaller = App.readFile(path + '/uninstaller.js');

	if(!_pkg)
		return Dialogs.error('SDK - Error', 'Missing package.prm file');

	if(!_app)
		return Dialogs.error('SDK - Error', 'Missing app.js file');

	$('#projects').hide();
	$('#editor').show();
	$('#panel').html('<div>package.prm</div><div>app.js</div>' + (_cmd ? '<div>cmd.js</div>' : '') + (_uninstaller ? '<div>uninstaller.js</div>' : ''));
	$('#panel div').click(function() {
		openFile(proj + '/' + this.innerHTML);
	});
	$('#panel').show();

	editor.refresh();
	proj = path;
	enableMenu(true);

}

function confirmContinue(yes, no, cancel) {

	return Dialogs.dialog('SDK', 'The file has been edited. Do you want to save it ?<br /><br />' + proj + '/' + file, {

		Save: yes,
		'Do not save': no,
		Cancel: cancel

	});

}

function newFile(force) {

	if(changes && !force)
		return confirmContinue(function() {
			saveFile()
			newFile(true);
			Dialogs.close();
		}, function() {
			newFile(true);
			Dialogs.close();
		}, function() {
			Dialogs.close();
		});

	file = false;
	changes = false;
	lang = 'plain';

	editor.setContent('');

}

function openFile(name, force) {

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

	if(!f)
		return Dialogs.error('SDK', 'Can\'t open ' + name + ' file');

	file = name;
	lang = (Registry.read('filesys/' + Explorer.fileExtension(name) + '/language') || 'plain');
	editor.setContent(f);
	editor.setHTML(Syntax.highlight(f, lang));

}

function saveFile(callback) {

	c = callback;

	if(!changes)
		return true;

	if(file) {
		if(!App.writeFile(file))
			Dialogs.error('SDK - Write failed', 'Cannot write ' + file + ' file.' + (App.lastStack(-1) ? '<br />Needs privileges elevation' : ''));
		else {
			c();
			changes = false;
		}
	} else
		saveAsFile(callback);

}

function saveAsFile(callback) {

	c = callback;

	return Dialogs.input('SDK - Save as...', 'Please input the file path :', 'text', function(val) {

		file = val;
		saveFile(c);

	});

}

function quitFile(force) {

	if(changes && !force)
		return confirmContinue(function() {
			saveFile()
			quitFile(true);
			Dialogs.close();
		}, function() {
			quitFile(true);
			Dialogs.close();
		}, function() {
			Dialogs.close();
		});

	Dialogs.confirm('SDK - Quit', 'Do you really want to close the SDK ?', function() {

		App.quit();

	});

}

function buildApp() {

	$('#build-log').show();
	buildError = false;
	Core.commandLine.exec('make "' + proj + '" "' + proj + '/package.app"', con);

}

function openBuiltApp() {

	Core.applications.launch('Explorer', {
		openFile: proj,
		origin: 'SDK',
		from: App.name
	})

}

/* Get the projects list */

var p_ini = App.readFile('/users/$USER$/appdata/SDK/projects.ini');

if(!p_ini)
	p_ini = {};
else
	p_ini = ini.parse(p_ini).projects;

App.loadFrame('UI');

$('#editor, #build-log, #panel').hide();

for(var i in p_ini)
	$('#projects').append($(document.createElement('div')).text(i).click(function() {
		openProject(p_ini[this.innerText]);
	}));

/* Define SDK variables */

var proj; // the project directory (ex: /users/admin/documents/Hello World)
var file; // the current file name (ex: app.js)
var lang; // the language sheet to use (ex: javascript)
var changes = false;
var n, c;

/* Create SDK editor */

var editor = new UnderEdit($('#editor'));

editor.input(function() {

	changes = true;
	editor.setHTML(Syntax.highlight(editor.content(), lang));

});

/* Create SDK build log */

var buildError;
var con = new Console($('#build-log'), false, true);

con.on('error', function() {

	buildError = true;

});

con.on('invite', function() {

	con.write('<br /><div id="build-log-closer" OnClick="$(\'#build-log\').hide().html(\'\')">Close</div>' + (buildError ? '' : ' <div id="build-log-opener" OnClick="openBuiltApp();">Open app folder</div>'));

});

/* Create GUI */

var menuBar = new MenuBar();
menuBar.setVisible(true);

var fileMenu = new MenuElement('File');
var _new = new MenuItem('New', newFile);
var _open = new MenuItem('Open', openFile);
var _save = new MenuItem('Save', saveFile);
var _saveAs = new MenuItem('Save as...', saveAsFile);
var _quit = new MenuItem('Quit', quitFile);

var buildMenu = new MenuElement('Build');
var _build = new MenuItem('Build application...', buildApp);

enableMenu(false);

fileMenu.addItem(_new);
fileMenu.addItem(_open);
fileMenu.addItem(_save);
fileMenu.addItem(_saveAs);
fileMenu.addItem(_quit);

buildMenu.addItem(_build);

menuBar.addElement(fileMenu);
menuBar.addElement(buildMenu);

GUI.setMenuBar(menuBar);