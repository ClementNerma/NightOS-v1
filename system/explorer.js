/**
  * Explorer constructor
  * @constructor
  */

var Explorer = window.Explorer = new function() {

	/**
	  * Explorer.DOM constructor
	  * @constructor
	  */

	this.DOM = new function() {

		function attachDOMEvents(element) {

			return element.click(function() {
				$('.explorer-shortcut-selected').removeClass('explorer-shortcut-selected');
				$(this).toggleClass('explorer-shortcut-selected');
				$('#context').hide();
			}).dblclick(function() {
				$('.explorer-shortcut-selected').removeClass('explorer-shortcut-selected');
				$('#context').hide();
				Explorer.open(this.getAttribute('shortcut'), this.getAttribute('shortcut'));
			}).contextmenu(function() {
				$('.explorer-shortcut-selected').removeClass('explorer-shortcut-selected');
				$(this).addClass('explorer-shortcut-selected');
				Explorer.DOM.contextMenu(this, this.getAttribute('shortcut'));
			});

		}

		/**
		  * Return an HTML shortcut to a directory
		  * @param {string} path directory path
		  * @return {Object} HTML Node Element
		  */

		this.directory = function(path) {

			path = Core.path.format(path);

			var picture = $(new Image());
			picture.attr('src', 'data:image/png;base64,' + Registry.read('filesys/directory/icon'));

			var name = path.split('/')[path.split('/').length - 1];

			if(App.fileExists(path))
				name = name.replace(/\.sht$/, '');

			name = $(document.createElement('span')).text(name);

			return attachDOMEvents($(document.createElement('div')).addClass('explorer-shortcut').attr('shortcut', path).append(picture, name));
		}

		/**
		  * Return an HTML shortcut to a file
		  * @param {string} path File path
		  * @return {Object|Boolean} HTML Node Element
		  */

		this.file = function(path) {

			path = Core.path.format(path);

			if(App.directoryExists(path))
				return this.directory(path);

			var ext = Explorer.fileExtension(path);
			var old_ext = ext;

			if(ext === 'sht') {
				var sht = Explorer.shortcuts.read(path);

				if(!sht)
					return false;

				if(App.directoryExists(sht.path))
					return this.directory(path);

				var shtPath = sht.path;
				ext = Explorer.fileExtension(shtPath);
			}

			var name = path.split('/')[path.split('/').length - 1];
			var picture = $(new Image());

			if((shtPath || name).substr(0, 4) !== 'app:')
				if(Registry.read('filesys/' +  ext + '/icon'))
					picture.attr('src', 'data:image/png;base64,' + Registry.read('filesys/' +  ext + '/icon'));
				else
					picture.attr('src', 'data:image/png;base64,' + Registry.read('filesys/unknown/icon'));
			else
				picture.attr('src', 'data:image/png;base64,' + Core.applications.packageOf(shtPath.substr(4)).icon);

			name = $(document.createElement('span')).text(name);

			if(old_ext === 'sht')
				name.text(path.split('/')[path.split('/').length - 1].replace(/\.sht$/, ''));

			return attachDOMEvents($(document.createElement('div')).addClass('explorer-shortcut').attr('shortcut', path).append(picture, name));

		}

		/**
		  * Show the sortcut context menu
		  * @param {Object} element Shortcut DOM element
		  */

		this.contextMenu = function(element, shortcut) {

			var ext = Explorer.fileExtension(shortcut);

			if(shortcut.substr(0, 4) === 'app:')
				var ctx = [{
					title: "Open",
					path: shortcut
				}];
			else // Here I don't use ternary condition for a best lisibility of the code
				if(App.directoryExists(shortcut))
					var ctx = [{
						title: "Open",
						path: shortcut
					}].concat(Registry.read('filesys/directory/context'));
				else
					var ctx = [{
						title: "Open",
						path: shortcut
					}].concat(Registry.read('filesys/' + ext + '/context') || []).concat(Registry.read('filesys/file/context'));
			
			$('#context').hide().html('');

			for(var i in ctx)
				$('#context').append($(document.createElement('span')).html(ctx[i].title).attr('file', shortcut).attr('shortcut', ctx[i].path).click(function() {
					$('.explorer-shortcut-selected').removeClass('explorer-shortcut-selected');
					Explorer.open(this.getAttribute('shortcut'), this.getAttribute('file'));
					$('#context').hide();
				}));

			$('#context').css({
				top: UI.mouseY,
				left: UI.mouseX
			}).show();
		}

	}

	/**
	  * Explorer.shortcuts constructor
	  * @constructor
	  */

	this.shortcuts = new function() {

		/**
		  * Read a shortcut from a file
		  * @param {string} path Shortcut path
		  */

		this.read = function(path) {

			if(Core.path.format(path).substr(-4) !== '.sht')
				return false;

			if(typeof(App) === 'undefined')
				var file = App.readFile(path);
			else
				var file = App.readFile(path);

			try {
				return JSON.parse(file);
			}

			catch(e) {
				return false;
			}

		}

	}

	/**
	  * Read the file extension
	  * @param {string} file Filename
	  * @return {string} File extension. Return 'unknown' if the file hasn't extension
	  */

 	this.fileExtension = function(file) {

 		var part = file.split('/')[file.split('/').length - 1].split('.');
		return ext = (part.length > 1) ? part[part.length - 1] : 'unknown';
	
 	}

 	/**
 	  * Open a file
 	  * @param {string} path File or application path
 	  * @param {string} file Original file path
 	  * @return {Boolean} Return true on opening success
 	  */

 	 this.open = function(path, file) {

 	 	if(path.substr(0, 4) === 'app:')
 	 		return Core.applications.launch(path.substr(4), {
 	 			origin: 'System'
 	 		});

 	 	if(path.substr(0, 4) === 'sys:')
 	 		if(typeof(eval(path.substr(4))) === 'function') {
 	 			console.log('open : ' + path.substr(4), file);
				return eval(path.substr(4))(file, file);
			}
			else
				return Dialogs.error('File opener - Open failed', 'Cannot find system function : ' + path.substr(4))

		if(!App.exists(path)) {
			window.corruptedShortcut = file;
			return Dialogs.confirm('File opener - Open failed', 'This shortcut is corrupted. Do you want to delete it ?', function() {
				
				App.deleteFile(corruptedShortcut);

			}, function() {});
		}

 	 	if(App.fileExists(path)) {
 	 		var sht = this.shortcuts.read(path);

 	 		if(sht)
 				return this.open(sht.path, file);
 		}

 	 	var real_path = path;
 	 	path = Core.path.format(path);
 	 	var ext = App.directoryExists(path) ? 'directory' : this.fileExtension(path);
 	 	var app = Registry.read('filesys/' + ext + '/open');

 	 	if(!app)
	 		app = Registry.read('filesys/unknown/open');

	 	if(app.substr(0, 4) === 'sys:')
 	 		if(typeof(eval(app.substr(4))) === 'function')
				return eval(app.substr(4))(path);

	 	if(app === App.name)
	 		return App.events.on('explorerOpen')(app, {
	 			openFile: real_path,
	 			origin: 'System',
	 			from: App.name
	 		});
	 	else
	 		return Core.applications.launch(app, {
	 			openFile: real_path,
	 			origin: 'System',
	 			from: App.name
	 		});

 	}

 	/**
 	  * The Explorer.FileSystem constructor
 	  * @constructor
 	  */

 	this.FileSystem = new function() {

 		this.associateApplication = function(path) {

 			path = Core.path.format(path).replace(Core.path.root, '');

			Dialogs.input('Associate Application', 'Select the application to open the file [' + path + ']', 'text" path="' + path + '"', function(app, obj) {

				if(app)
					Core.applications.launch(app, {
						openFile: obj.getAttribute('path'),
						origin: 'Associate Application',
						from: App.name
					});

			});

 		};

 		/**
 		  * Rename a file or a directory
 		  * @param {string} path The file or directory path
 		  */

 		this.renameFile = this.renameDirectory = function(path) {

 			var oPath = path;
			path = Core.path.format(path).split('/');
			var old_name = path[path.length - 1];

			var display_name = (App.fileExists(oPath) && Explorer.fileExtension(oPath) === 'sht') ? old_name.replace(/\.sht$/, '') : old_name;

			Dialogs.input('Rename file or directory', 'Please specify the new name for ' + display_name, 'text" path="' + oPath + '"', function(new_name, obj) {

				if(new_name.replace(/[^a-zA-Z0-9 _\-\.]/g, '') !== new_name)
					return Dialogs.error('Rename file or directory', 'The name you entered is invalid.');

				var oPath = obj.getAttribute('path');
				var path = obj.getAttribute('path').split('/');
				var old_name = path.join('/');
				path.splice(path.length - 1, 1);
				new_name = path.join('/') + '/' + new_name;

				if(App.fileExists(oPath) && Explorer.fileExtension(oPath) === 'sht')
					new_name += '.sht';

				App.rename(old_name, new_name);

			});

 		}

 		/**
 		  * Delete a file
 		  * @param {string} path The file path
 		  */

 		this.removeFile = function(path) {

 			path = Core.path.format(path);

			if(!App.fileExists(path))
				return Dialogs.error('Cannot delete ' + path + ' because he doesn\'t exists');

			window.toRemoveFile = path;

			Dialogs.confirm('Delete file', 'Are you sure you want to delete ' + path + ' ?<br />It will be sent to the trash directory.', function() {

				App.moveFile(window.toRemoveFile, '/users/$USER$/recycle/');

			}, function() {});

 		}

 		/**
 		  * Get file properties
 		  * @param {string} path The file path
 		  */

 		this.fileProperties = function(path) {

 			path = Core.path.format(path);

			if(!App.fileExists(path))
				return Dialogs.error('File properties', 'Cannot get properties of the file because he doesn\'t exists');

			var id  = 'file-properties' + $('.file-properties-dialog').length.toString();
			var win = Windows.create('File properties', id);

			var file = App.getFileInformations(path);

			if(!file)
				return Dialogs.error('File properties', 'Can\'t get properties of the file. Please try again.');

			$('#' + id).addClass('file-properties-dialog').find('.content:first').html('<table><tr><td>File name</td><td>: ' + path.split('/')[path.split('/').length - 1] + '</td></tr><tr><td>File path</td><td>: ' + path + '</td></tr><tr><td>File size</td><td>: ' + file.size + '</td></tr><tr><td>File type</td><td>' + file.type + '</td></tr><td>Associated to</td><td>: ' + file.opener + '</td></tr></table>');

 		}

 	}

}

Object.freeze(Explorer);
