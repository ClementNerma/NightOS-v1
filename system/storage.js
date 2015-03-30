
/**
 * Storage constructor
 * @constructor
 */

var Storage = window.Storage = new function() {

	var fs = require('fs');
	var appDirectory = directory;
	var watchdir     = require('./external_tools/watchdir.js');

	function authorize(funcName, ignorePath, acceptReadableFolders) {

		var args = Core.backtrace.getCaller().arguments;

		if(!args[0] || !args[0].permissions)
			return Debug.error(System.errors.NO_CERTIFICATE);
			//throw new Error(System.errors.NO_CERTIFICATE);

		var path = Core.path.format(args[1]);

		if((!args[0].hasAccess(path, acceptReadableFolders) && !ignorePath) || !args[0].hasPermission(['storage', funcName.replace(/([a-z])([A-Z])/g, function(a, b, c) { return b + '_' + c.toLowerCase(); })]))
			return Debug.error(System.errors.NOPERM);
			//console.log(path);

		if(Core.backtrace.getCaller().arguments.callee.caller !== Application.prototype[funcName])
			return Debug.error(System.errors.NO_APP_CALLER);
			//throw new Error(System.errors.NO_APP_CALLER);

		return path;
		
	}

	/**
	 * Know if a path exists AND is a directory
	 * @param {string} path The path to test
	 * @return {Boolean} true if the specified path is a directory
	 */

	this.directoryExists = function(path) {

		try {
			return fs.lstatSync(Core.path.format(path)).isDirectory();
		}

		catch(e) {
			return false;
		}

	}

	/**
	 * Know if a path exists AND is a file
	 * @param {string} path The path to test
	 * @return {Boolean} true if the specified path is a file
	 */

	this.fileExists = function(path) {

		try {
			return !fs.lstatSync(Core.path.format(path)).isDirectory();
		}

		catch(e) {
			return false;
		}

	}

	/**
	  * Know if a path exists
	  * @param {string} path The path to test
	  * @return {Boolean} true if the specified path exists
	  */

	this.exists = function(path) {

		return fs.existsSync(Core.path.format(path));

	}

	/**
	 * Write a value in a file
	 * @param {string} file
	 * @param {string} value
	 * @return {Boolean} Success of writing
	 */

	this.writeFile = function(_cert, file, value, charset) {

		App.pushStack(0);

		var path = authorize('writeFile');

		if(!path) {
			App.pushStack(-1);
			return false;
		}

		if(this.directoryExists(path))
			return false;
			//throw new Error('The path doesn\'t exists [' + path + ']');

		if(!charset)
			charset = System.defaultCharset;

		try {
			fs.writeFileSync(path, value, charset);
			return true;
		}

		catch(e) {
			return false;
		}
	}

	/**
	  * Read a file
	  * @param {string} file
	  * @param {string} charset
	  * @return {string}
	  */

	this.readFile = function(_cert, file, charset) {

		App.pushStack(0);

		var path = authorize('readFile', undefined, true);
		
		if(!path) {
			App.pushStack(-1);
			return false;
		}

		if(!this.fileExists(path))
			return false;
			//throw new Error('The path doesn\'t exists [' + path + ']');

		if(!charset)
			charset = System.defaultCharset;

		try {
			return fs.readFileSync(path, charset).replace(/\r|\n/gm, "\r\n");
		}

		catch(e) {
			return false;
		}

	}

	/**
	  * Delete a file
	  * @param {string} file File path
	  * @param {Boolean} Return true if success
	  */

	this.removeFile = function(_cert, file) {

		App.pushStack(0);

		path = authorize('removeFile');

		if(!path) {
			App.pushStack(-1);
			return false;
		}

		if(!this.fileExists(path))
			return false;

		try {
			return fs.unlinkSync(path);
		}

		catch(e) {
			return false;
		}

	}

	/**
	  * Copy a file
	  * @param {string} srcFile File path
	  * @param {string} destFile File destination
	  * @param {Number} BUFF_LENGTH Buffer length. If not specified, BUFF_LENGTH equals System.FileSystem.defaultBufferLength
	  * @return {Boolean} Return true if sucess
	  */

	this.copyFile = function(_cert, srcFile, destFile, BUFF_LENGTH) {

		App.pushStack(0);

		from = authorize('moveFile');

		if(!from) {
			App.pushStack(-1);
			return false;
		}

		if(!App.fileExists(from))
			return Debug.error('The origin file doesn\'t exists', from);

		destFile = Core.path.format(destFile);

		if(App.directoryExists(destFile))
			destFile = Core.path.format(destFile + '/' + from.split('/')[from.split('/').length - 1]);

		if(!_cert.hasAccess(destFile)) {
			App.pushStack(-1);
			return Debug.error(System.errors.NOPERM, destFile);
		}
			//throw new Error(System.errors.NOPERM);

		var BUFF_LENGTH;

		if(typeof(BUFF_LENGTH) !== 'number');
			BUFF_LENGTH = System.FileSystem.defaultBufferLength;

		if(BUFF_LENGTH < System.FileSystem.minBufferLength)
			throw new Error(System.errors.BUFFER_TOO_SMALL);

		if(BUFF_LENGTH > System.FileSystem.maxBufferLength)
			throw new Error(System.errors.BUFFER_TOO_LARGE);

		var _buf = new Buffer(BUFF_LENGTH);

	    var fdr = fs.openSync(srcFile, 'r')
	    var stat = fs.fstatSync(fdr)
	    var fdw = fs.openSync(destFile, 'w', stat.mode)
	    var bytesRead = 1
	    var pos = 0

	    while (bytesRead > 0) {
		    bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos)
		    fs.writeSync(fdw, _buff, 0, bytesRead)
		    pos += bytesRead
	    }

    	//fs.unlinkSync(srcFile); don't remove the file because it's just a copy and not a move

	    fs.closeSync(fdr)
	    fs.closeSync(fdw)

	    return true;

	}

	/**
	  * Move a file
	  * @param {string} srcFile File path
	  * @param {string} destFile File destination
	  * @param {Number} BUFF_LENGTH Buffer length. If not specified, BUFF_LENGTH equals System.FileSystem.defaultBufferLength
	  * @return {Boolean} Return true if sucess
	  */

	this.moveFile = function(_cert, srcFile, destFile, BUFF_LENGTH) {

		App.pushStack(0);

		srcFile = authorize('moveFile');

		if(!srcFile) {
			App.pushStack(-1);
			return false;
		}

		if(!App.fileExists(srcFile))
			return Debug.error('The origin file doesn\'t exists', srcFile);

		destFile = Core.path.format(destFile);

		if(App.directoryExists(destFile))
			destFile = Core.path.format(destFile + '/' + srcFile.split('/')[srcFile.split('/').length - 1]);

		if(!_cert.hasAccess(destFile)) {
			App.pushStack(-1);
			return Debug.error(System.errors.NOPERM, destFile);
			//throw new Error(System.errors.NOPERM);
		}

		var BUFF_LENGTH;

		if(typeof(BUFF_LENGTH) !== 'number');
			BUFF_LENGTH = System.FileSystem.defaultBufferLength;

		if(BUFF_LENGTH < System.FileSystem.minBufferLength)
			throw new Error(System.errors.BUFFER_TOO_SMALL);

		if(BUFF_LENGTH > System.FileSystem.maxBufferLength)
			throw new Error(System.errors.BUFFER_TOO_LARGE);

		var _buff = new Buffer(BUFF_LENGTH);

	    var fdr = fs.openSync(srcFile, 'r')
	    var stat = fs.fstatSync(fdr)
	    var fdw = fs.openSync(destFile, 'w', stat.mode)
	    var bytesRead = 1
	    var pos = 0

	    while (bytesRead > 0) {
		    bytesRead = fs.readSync(fdr, _buff, 0, BUFF_LENGTH, pos)
		    fs.writeSync(fdw, _buff, 0, bytesRead)
		    pos += bytesRead
	    }

    	fs.unlinkSync(srcFile);

	    fs.closeSync(fdr)
	    fs.closeSync(fdw)

	    return true;

	}

	this.getFileInformations = function(_cert, directory) {

		App.pushStack(0);

		var path = authorize('getFileInformations');

		if(!path) {
			App.pushStack(-1);
			return false;
		}

		if(!this.fileExists(directory))
			return false;
			//throw new Error('The path doesn\'t exists [' + path + ']');

		try {
			var ext = Explorer.fileExtension(path);
			
			var inf = fs.stats(path);
			inf.opener = ( Registry.read('filesys/' + ext + '/open') || Registry.read('filesys/unknown/open') );
			inf.type   = ( Registry.read('filesys/' + ext + '/type') || Registry.read('filesys/unknown/type') );
		
			return inf;
		}

		catch(e) {
			return false;
		}

	}

	/**
	  * Create a new directory
	  * @param {string} directory
	  * @return {Boolean}
	  */

	this.makeDir = function(_cert, directory) {

		App.pushStack(0);

		var path = authorize('makeDir');

		if(!path) {
			App.pushStack(-1);
			return false;
		}

		if(this.directoryExists(path))
			return false;
			//throw new Error('The path already exists [' + path + ']');

		try {
			fs.mkdirSync(path);
			return true;
		}

		catch(e) {
			return false;
		}

	}

	/**
	  * Delete an empty directory
	  * @param {string} directory
	  * @return {Boolean}
	  */

	this.removeDir = function(_cert, directory) {

		App.pushStack(0);

		var path = authorize('removeDir');

		if(!path) {
			App.pushStack(-1);
			return false;
		}

		if(!this.directoryExists(path))
			return false;
			//throw new Error('The path doesn\'t exists [' + path + ']');

		try {
			fs.rmdirSync(path);
			return true;
		}

		catch(e) {
			return false;
		}

	}

	/**
	  * Read a directory
	  * @param {string} directory
	  * @return {Array}
	  */

	this.readDir = function(_cert, directory) {

		App.pushStack(0);

		var path = authorize('readDir');

		if(!path) {
			App.pushStack(-1);
			return false;
		}

		if(!this.directoryExists(path))
			return false;
			//throw new Error('The path doesn\'t exists [' + path + ']');

		try {
			return fs.readdirSync(path);
		}

		catch(e) {
			return false;
		}

	}

	/**
	  * Return files list from directory
	  * @param {string} directory
	  * @return {Array}
	  */

	this.readDirFiles = function(_cert, directory) {

		App.pushStack(0);

		var path = authorize('readDirFiles');

		if(!path) {
			App.pushStack(-1);
			return false;
		}

		if(!this.directoryExists(path))
			return false;
			//throw new Error('The path doesn\'t exists [' + path + ']');

		try {
			return fs.readdirSync(path).filter(function(e) {
				return !fs.lstatSync(directory + '/' + e).isDirectory();
			});
		}

		catch(e) {
			return false;
		}

	}

	/**
	  * Return directorys list from directory
	  * @param {string} directory
	  * @return {Array}
	  */

	this.readSubDirs = function(_cert, directory) {

		App.pushStack(0);

		var path = authorize('readSubDirs');

		if(!path) {
			App.pushStack(-1);
			return false;
		}

		if(!this.directoryExists(path))
			return false;
			//throw new Error('The path doesn\'t exists [' + path + ']');

		try {
			return fs.readdirSync(path).filter(function(e) {
				return fs.lstatSync(directory + '/' + e).isDirectory();
			});
		}

		catch(e) {
			return false;
		}

	}

	/**
	  * Rename a file or a directory
	  * @param {string} old_name Old name
	  * @param {string} new_name New name
	  * @return {Boolean} Return true if success
	  */

	this.rename = function(_cert, old_name, new_name) {

		App.pushStack(0);

		if(!authorize('rename', true))
			return false;

		old_name = Core.path.format(old_name);
		new_name = Core.path.format(new_name);

		if(!_cert || !_cert.permissions)
			return false;
			//throw new Error(System.errors.NO_CERTIFICATE);

		if(!_cert.hasAccess(old_name) || !_cert.hasAccess(new_name) || !_cert.hasPermission(['storage', 'rename']))
			return false;
			//throw new Error(System.errors.NOPERM);

		if(!this.exists(old_name) || this.exists(new_name))
			return false;

		try {
			return fs.renameSync(old_name, new_name);
		}

		catch(e) {
			return false;
		}

	}

	/**
	  * Watch a directory
	  * @param {string} path directory path
	  * @param {Object} options Watcher options
	  * @param {function} callback Callback - Called when a file is modified in the path
	  */

	this.watchDir = function(_cert, path, options, callback) {

		App.pushStack(0);

		path = authorize('watchDir');

		if(!path) {
			App.pushStack(-1);
			return false;
		}

		if(typeof(options) === 'undefined')
			var options = {};

		watchdir.watchDirectory(path, options, callback);

	}

	/**
	  * Load an application frame
	  * @param {string} name Frame name (without extension)
	  * @param {Object} context DOM Element
      * @return {Boolean} Return true if success
	  */

	this.loadFrame = function(_cert, name, context) {

		App.pushStack(0);

		if(!authorize('loadFrame', true))
			return false;

		var path = Core.path.format(appDirectory + '/' + name.replace(/[^a-zA-Z0-9 _\-]/g, '') + '.frm')

		if(!_cert.hasPermission(['storage', 'load_frame']))
			return false;
			//throw new Error(System.errors.NOPERM);

		if(typeof(context) !== 'object')
			context = $('body');

		try {
			$(context).html('').append(Core.frames.format(fs.readFileSync(path, 'utf8')));
			return true;
		}

		catch(e) {
			//throw new Error('Can\'t load application frame [' + path + ']<br /><br />Details :<br /><br />' + e.message);
			return false;
		}

	}

}

Object.freeze(Storage);
