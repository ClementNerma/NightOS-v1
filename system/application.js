
var Application = window.Application = function(certificate, app) {

	this.certificate = certificate;
	this.app = app;

	this.stacks = [];
	
}

/* Application stacks */

Application.prototype.pushStack = function(stack) { return this.stacks.push(stack); }

Application.prototype.popStack = function(stack) { return this.stacks.pop(); }

Application.prototype.lastStack = function(n) {

	return (typeof(n) !== 'undefined') ? (this.stacks[this.stacks.length - 1] === n) : this.stacks[this.stacks.length - 1];

}

Application.prototype.getStacks = function() { return this.stacks; }

/* Get app informations */

Application.prototype.getCertificate = function() { return this.certificate; }

Application.prototype.getLauncher = function() { return this.app; }

/* System app functions */

Application.prototype.quit = function() { return quitApp(this.name, this.ID); }

/* Frames */

Application.prototype.loadFrame = function(name, context) { return Storage.loadFrame(this.certificate, name, context); }

/* Storage watcher */

Application.prototype.watchDir = function(path, options, callback) { return Storage.watchDir(this.certificate, path, options, callback); }

/* Storage */

Application.prototype.writeFile = function(file, value, charset) { return Storage.writeFile(this.certificate, file, value, charset); }

Application.prototype.readFile = function(file, charset) { return Storage.readFile(this.certificate, file, charset); }

Application.prototype.rename = function(old_name, new_name) { return Storage.rename(this.certificate, old_name, new_name); }

Application.prototype.removeFile = function(file) { return Storage.removeFile(this.certificate, file); }

Application.prototype.copyFile = function(srcFile, destFile, BUFFER_LENGTH) { return Storage.copyFile(this.certificate, srcFile, destFile, BUFFER_LENGTH); }

Application.prototype.moveFile = function(srcFile, destFile, BUFFER_LENGTH) { return Storage.moveFile(this.certificate, srcFile, destFile, BUFFER_LENGTH); }

Application.prototype.makeDir = function(path) { return Storage.makeDir(this.certificate, path); }

Application.prototype.readDir = function(path) { return Storage.readDir(this.certificate, path); }

Application.prototype.readDirFiles = function(path) { return Storage.readDirFiles(this.certificate, path); }

Application.prototype.readSubDirs = function(path) { return Storage.readSubDirs(this.certificate, path); }

Application.prototype.removeDir = function(path) { return Storage.removeDir(this.certificate, path); }

Application.prototype.fileExists = function(path) { return Storage.fileExists(path); }

Application.prototype.directoryExists = function(path) { return Storage.directoryExists(path); }

Application.prototype.exists = function(path) { return Storage.exists(path); }

/* Storage informations */

Application.prototype.getFileInformations = function(path) { return Storage.getFileInformations(this.certificate, path); }

Application.prototype.getDirectoryInformations = function(path) { return Storage.getDirectoryInformations(this.certificate, path); }

/* User Interaction (dialogs) */

Application.prototype.dialog = new function() {};

Application.prototype.dialog.alert = function(msg) { return Dialogs.alert(msg); }

Application.prototype.dialog.confirm = function(msg) { return Dialogs.confirm(msg); }

Application.prototype.dialog.input = function(msg) { return Dialogs.input(msg); }

/* System events */

Application.prototype.events = new function() {

	var _events = {
		createCrashSave: function() { return true; },
		loadCrashSave: function() {},
		explorerOpen: function(name, args) {
			return Core.applications.launch(name, args);
		},
		quit: function() {
			return App.quit();
		}
	};

	this.onRespondingTest = function(val) { return val * val; }

	this.on = function(name, callback) {

		if(typeof(_events[name]) !== 'function')
			return false;

		if(typeof(callback) === 'function')
			_events[name] = callback;

		return _events[name];

	};

}

Object.freeze(Application.prototype);
Object.freeze(Application.prototype.dialog);
