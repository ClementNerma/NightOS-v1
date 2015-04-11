
/* Define SDK functions */

function enableMenu(bool) {

	_new.setEnabled    (bool);
	_open.setEnabled   (bool);
	_save.setEnabled   (bool);
	_saveAs.setEnabled (bool);
	_quit.setEnabled   (bool);
	_build.setEnabled  (bool);

}

function createProject(template, location) {

	if(!template) {
		var tpl = App.readSubDirs('/users/common-data/appdata/SDK/templates');

		if(!tpl)
			return Dialogs.error('SDK', 'Cannot load SDK project templates');

		$('#loc-input').hide();
		$('#new-project').show();

		for(var i in tpl)
			$('#templates').append($(document.createElement('div')).text(tpl[i]).click(function() {
				this.className = 'selected';
				createProject(this.innerText);
			}));

	} else if(!location) {

		$('#loc-input').slideDown(1000);
		$('#loc-input button').click(function() {

			createProject($('#templates .selected').text(), $('#loc').val());

		});

	} else {

		if(App.directoryExists(location))
			return Dialogs.error('SDK - Cannot create project', 'This folder already exists. Please specify a non-existant path.');

		if(!App.makeDir(location))
			return Dialogs.error('SDK - Cannot make specified folder' + (App.lastStack(-1) ? '<br />Needs privileges elevation' : ''));

		var tpl_loc = '/users/common-data/appdata/SDK/templates/' + template;

		var files = App.readDir(tpl_loc);

		if(!files)
			return Dialogs.error('SDK - Cannot read template folder', 'Cannot read <b>' + template + '</b> template folder');

		var copy_err = [];

		for(var i in files)
			if(!App.copyFile(tpl_loc + '/' + files[i], location))
				copy_err.push(files[i]);

		if(copy_err.length)
			Dialogs.error('SDK - Cannot copy template files', 'The following files has not been copied to the project folder :<br /><br />' + copy_err.join('<br />') + '<br /><br />');
		else {
			location = Core.path.format(location).replace(Core.path.format, '').replace(/\/$/g, '');
			p_ini[location.split('/')[location.split('/').length - 1]] = location;
			App.writeFile('/users/$USER$/appdata/SDK/projects.ini', ini.encode({projects:p_ini}));
			openProject(location);
		}

	}

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

	$('#projects, #new-project').remove();
	$('#editor').show();
		
	var files = App.readDir(path);

	if(!files)
		return Dialogs.error('SDK - Error', 'Can\'t get the template files');

	for(var i in files)
		$('#panel').append($(document.createElement('div')).text(files[i]).click(function() {
			openFile(proj + '/' + this.innerHTML);
		}))

	$('#panel').show();

	editor.refresh();
	proj = path;
	enableMenu(true);

}

function confirmContinue(yes, no, cancel) {

	return Dialogs.dialog('SDK', 'The file has been edited. Do you want to save it ?<br /><br />' + file, {

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
	lang = 'plain';

	editor.setContent('');

}

function openFile(name, force) {

	if(typeof(name) !== 'string')
		return Dialogs.input('SDK - Open...', 'Please input the file path :', 'text', function(val) {

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

	if(!f)
		return Dialogs.error('SDK', 'Can\'t open ' + name + ' file');

	changes = false;
	file = name;
	lang = (Registry.read('filesys/' + Explorer.fileExtension(name) + '/language') || 'plain');
	editor.setContent(f);
	editor.setHTML(Syntax.highlight(f, lang));

}

function saveFile(callback) {

	if(typeof(callback) === 'function')
		c = callback;

	if(!changes)
		return true;

	if(file) {
		if(!App.writeFile(file, editor.content()))
			Dialogs.error('SDK - Write failed', 'Cannot write ' + file + ' file.' + (App.lastStack(-1) ? '<br />Needs privileges elevation' : ''));
		else {
			if(typeof c === 'function')
				c();
			changes = false;
		}
	} else
		saveAsFile(callback);

}

function saveAsFile(callback) {

	if(typeof(callback) === 'function')
		c = callback;

	return Dialogs.input('SDK - Save as...', 'Please input the file path :', 'text', function(val) {

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

	Dialogs.confirm('SDK - Quit', 'Do you really want to close the SDK ?', function() {

		App.quit();

	});

}

function buildApp() {

	$('#build-log').show();
	buildError = false;
	Core.commandLine.exec('make "' + proj + '" "' + proj + '/package.app"', con);

}

function installApp() {

	if(!App.fileExists(proj + '/package.app'))
		return Dialogs.error('SDK - Install', 'Cannot install the application because missing file package.app');

	Core.applications.launch('ApplicationPackage', {
		openFile: proj + '/package.app',
		origin: 'SDK',
		from: App.name
	});

}

function runApp() {

	try {
		var name = JSON.parse(App.readFile(proj + '/package.prm')).name;
	}

	catch(e) {
		return Dialogs.error('SDK - Run', 'Cannot read package.prm file because it\'s not a valid JSON file');
	}

	if(!Core.applications.exists(name))
		return Dialogs.error('SDK - Run', 'The application [' + name + '] is not installed on this computer');

	Debug.info('[SDK] Running application : ' + name);

	Core.applications.launch(name, {
		origin: 'SDK',
		from: App.name
	});

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

if(!p_ini) {
	App.makeDir('/users/$USER$/appdata/SDK');
	App.writeFile('/users/$USER$/appdata/SDK/projects.ini', '[projects]');
	p_ini = {};
} else
	p_ini = ini.parse(p_ini).projects;

App.loadFrame('UI');

$('#editor, #build-log, #panel, #new-project').hide();

for(var i in p_ini)
	$('#projects').append($(document.createElement('div')).text(i).click(function() {
		openProject(p_ini[this.innerText]);
	}));

$('#projects').append($(document.createElement('div')).text('Create a new project...').click(function() {
	createProject();
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

delete menuBar;
var menuBar = new MenuBar();
menuBar.setVisible(true);

var fileMenu = new MenuElement('File');
var _new     = new MenuItem('New', newFile);
var _open    = new MenuItem('Open', openFile);
var _save    = new MenuItem('Save', saveFile);
var _saveAs  = new MenuItem('Save as...', saveAsFile);
var _quit    = new MenuItem('Quit', quitFile);

var buildMenu = new MenuElement('Build');
var _build    = new MenuItem('Build application...', buildApp);
var _install  = new MenuItem('Install', installApp);
var _run      = new MenuItem('Run...', runApp);

enableMenu(false);

fileMenu.addItem(_new);
fileMenu.addItem(_open);
fileMenu.addItem(_save);
fileMenu.addItem(_saveAs);
fileMenu.addItem(_quit);

buildMenu.addItem(_build);
buildMenu.addItem(_install);
buildMenu.addItem(_run);

menuBar.addElement(fileMenu);
menuBar.addElement(buildMenu);

GUI.setMenuBar(menuBar);

/* Set application events */

App.events.on('quit', quitFile);
