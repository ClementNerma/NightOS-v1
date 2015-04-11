
var define = new function() {

	var vars = {};

	this.exec = function(name, value) {

		if(typeof(value) !== 'undefined')
			vars[name] = value;

		return vars[name];

	}

}

var def = function(name, value) {

	return define.exec(name, value);

}

var fs = require('fs');

/**
  * System core constructor
  * @constructor
  */

var Core = new function() {

	/**
	  * crypto
	  * @constructor
	  */

	this.crypto = new function() {

		var _fs = require('fs');
		var _cr = require('crypto');

		this.getSignPublicKey = function() {
			return _fs.readFileSync(Core.path.root + '/system/sign/RSA-public-4096.pem', 'utf8');
		}
		
		/**
	      * Hash a string with SHA384 algorithm
	      * @param {string} str The string to hash
	      * @return {string} The hashed string
	      */

		this.hash = function(str) {

			try {
				return _cr.createHash('sha384').update(str).digest('hex');
			}

			catch(e) {
				return false;
			}

		}

		/**
		  * Protect a password, usin PBKDF2 algorithm
		  * @param {string} str The string to hash
		  * @param {string} salt The HMAC salt
		  * @param {Number} iterations The number of hashs. Default : 50 000
		  * @param {Number} keylen The generated key length. Default : 48
		  * @return {string} The secured-hashed string
		  */

		this.password = function(pass, salt, iterations, keylen) {

			if(typeof(iterations) !== 'number')
				var iterations = 50000;

			if(typeof(keylen) !== 'number')
				var keylen = 48;

			try {
				return _cr.pbkdf2Sync(pass, salt, iterations, keylen).toString('hex');
			}

			catch(e) {
				return false;
			}

		}

		/**
		  * Sign a file
		  * @param {string} data The data to sign
		  * @param {string} priv The private key (ex: The private RSA key)
		  * @param {string} output The output format. Default : hex
		  * @param {string} algo The signature algorithm to use. Default : RSA-SHA384
		  * @return {string} The signed data
		  */

		this.sign = function(data, priv, output, algo) {

			if(typeof(output) !== 'string')
				var output = 'hex';

			if(typeof(algo) !== 'string')
				var algo = 'RSA-SHA384';

			var c = _cr.createSign(algo);
			c.update(data);
			return c.sign(priv, output);

		}

		/**
		  * Verify a signature
		  * @param {string} sign The signed data
		  * @param {string} bef The data before sign
		  * @param {string} pub The public key (ex: The public RSA key)
		  * @param {string} input The signature format. Default : hex
		  * @param {sstring} algo The signature algorithm used. Default : RSA-SHA384
		  * @return {Boolean} Return true if the signature is correct
		  */

		this.verify = function(sign, bef, pub, input, algo) {

			if(typeof(input) !== 'string')
				var input = 'hex';

			if(typeof(algo) !== 'string')
				var algo = 'RSA-SHA384';

			var v = _cr.createVerify(algo);
			v.update(bef);

			return v.verify(pub, sign, input);

		}

	}

	/**
	  * Core.users constructor
	  * @constructor
	  */

	this.users = new function() {

		var _user  = null;
		var _admin = false;
		var fs = require('fs');

		/**
		  * Get informations about a user (permissions, icon, hashed password, etc.)
		  * @param {string} user Username
		  * @return {Boolean|object} User informations
		  */

		if(typeof(applicationLauncher) === 'undefined')

		this.get = function(name) {

			try {
				return JSON.parse(fs.readFileSync(Core.path.root + '/system/users/' + name + '.usr'));
			}

			catch(e) { return false; }

		}

		/**
		  * Login as a user. Please note that you can't login more of one time
		  * @param {string} user Username
		  * @param {string} password User password
		  * @param {Boolean} true if success
		  */

		this.loginAs = function(user, password) {

			var usr = this.get(user);

			if(_user || !usr || usr.password !== Core.crypto.password(password, user, 50000, 48))
				return false;

			if(usr.rights !== 1 && usr.rights !== 2 && usr.rights !== 3)
				throw new Error(System.errors.INVALID_USER_RIGHTS);

			if(!Core.vars.set('user', user, true))
				return Dialogs.error('System login service', 'Cannot define internal constants. Please reboot your computer and try again.')

			if(!Core.vars.set('isAdmin', _admin, true))
				return Dialogs.error('System login service', 'Cannot define internal constants. Please reboot your computer and try again.')

			if(!Core.vars.set('rights', usr.rights, true))
				return Dialogs.error('System login service', 'Cannot define internal constants. Please reboot your computer and try again.')


			_user = usr;
			_admin = (usr.rights === 3);

			return true;

		}

		/**
		  * Know if the current user has administrator privileges
		  * @return {Boolean} Return true if the current user has administrator privileges
		  */

		this.isAdmin = function() {

			return _admin;

		}

		/**
		  * Know if a specified password is the administrator password
		  * @param {string} password The password
		  * @return {Boolean} Return true if the specified password is the administrator password
		  */

		this.isAdminPassword = function(password) {

			return (Core.crypto.password(password, 'admin', 50000, 48) === Core.users.get('admin').password);

		}

		/**
		  * Return actual user informations. Return an empty object if you are not logged in.
		  * @return {Object}
		  */

		this.user = function() {
			return _user;
		}

	}

	/**
	  * Core.applications constructor
	  * @constructor
	  */

	this.applications = new function() {

		this.frames = {};

		var fs = require('fs');

		/**
		  * Get an application
		  * @param {string} name Application name
		  * @return {Object|Boolean} Return false if an error occurred
		  */

		this.get = function(name) {

			var app = {
				isSystem: false
			};

			name = name.replace(/[^a-zA-Z0-9 _\-]/g, '');

			var r = Registry.read('commands/alias');
			var n = null;

			for(var i in r) {
				if(i.toUpperCase() == name.toUpperCase()) {
					name = i;
					break;
				}
				
				for(var j in r[i])
					if(r[i][j].toUpperCase() == name.toUpperCase()) {
						name = i;
						break;
					}
				}

			if(App.directoryExists('/system/apps/' + name)) {
				var directory = '/system/apps/' + name;
				app.isSystem = true;
			} else if(App.directoryExists('/apps/' + name))
				var directory = '/apps/' + name;
			else
				return Debug.error('Application getter', 'Application directory wasn\'t found', name);

			try {
				app.package = JSON.parse(App.readFile(directory + '/package.prm'));
			}

			catch(e) {
				return Debug.error('Application getter', 'Invalid application package', name);
			}

			if(App.fileExists(directory + '/app.js'))
				app.launcher = App.readFile(directory + '/app.js');

			if(App.fileExists(directory + '/cmd.js'))
				app.commandLine = App.readFile(directory + '/cmd.js');

			if(App.fileExists(directory + '/uninstaller.js'))
				app.uninstaller = App.readFile(directory + '/uninstaller.js');

			return app;

		}

		/**
		 * Launch an application
		 * @param {string} name Application name
		 * @param {Object} args Arguments to pass to application instance
		 * @param {string} adminPass The administrator password. Needed to launch high-level applications.
		 * @returns {Number}
		 */

		if(typeof(appLauncher) === 'undefined')

		this.launch = function(name, args, runAsAdmin, adminPass) {

			if(typeof(adminPass) !== 'undefined' && adminPass !== true && !Core.isAdminPassword(adminPass))
				return Dialogs.error('Application launcher', 'The password you entered is incorrect');

			var App = window.App;

			name = name.replace(/[^a-zA-Z0-9 _\-]/g, '');

			var r = Registry.read('commands/alias');
			var n = null;

			for(var i in r)
				for(var j in r[i])
					if(r[i][j].toUpperCase() == name.toUpperCase()) {
						name = i;
						break;
					}

			if(App.directoryExists('/system/apps/' + name))
				var directory = '/system/apps/' + name;
			else if(App.directoryExists('/apps/' + name))
				var directory = '/apps/' + name;
			else
				return Dialogs.error('Application launcher', 'Cannot find application : ' + name);

			var app = App.readFile(directory + '/app.js');

			if(!app)
				return Dialogs.error('Application launcher', 'Cannot find the main file of the ' + name + ' application');

			try { var package = JSON.parse(App.readFile(directory + '/package.prm')); }
			catch(e) { return Dialogs.error('Application launcher', 'Invalid application package'); }

			if(package.rights === 'herit')
				package.rights = parseInt(Core.vars.get('rights'));

			if(typeof(package.rights) === 'string' && package.rights.substr(0, 6) === 'herit<') {

				var r = parseInt(Core.vars.get('rights'));

				if(r >= parseInt(package.rights.substr(6, 1)))
					r = parseInt(package.rights.substr(6, 1)) - 1;

				package.rights = r;

			}

			if(package.rights !== 1 && package.rights !== 2 && package.rights !== 3 && package.rights !== 4)
				return Dialogs.error('Application launcher', 'This application require invalid rights ' + package.rights);

			if(package.rights === 4 && !directory.match(/^\/system\/apps\//))
				return Dialogs.error('Application launcher', 'This application require system rights, but only the system applications can have system rights.');

			if(package.rights > Core.vars.get('rights') && package.rights !== 4)
				return Dialogs.error('Application launcher', 'This application require a rights level that is superior to the user rights.<br />Please connect to an admin session to launch this application. ');

			if(runAsAdmin || typeof(adminPass) !== 'undefined')
				package.rights = 3;

			if(package.rights >= 3 && ((typeof(adminPass) === 'undefined' && adminPass === true) || runAsAdmin)) {
				def('toLaunchApp', name);
				def('toLaunchAppArgs', args);

				if(!Core.users.isAdmin())
					return Dialogs.input('User account control', 'The ' + name + ' application require a rights level which require admin rights.<br />Please input the admin password :', 'password', function(pass) {

						Core.applications.launch(def('toLaunchApp'), def('toLaunchAppArgs'), undefined, pass);

					});
				else
					return Dialogs.confirm('User account control', 'The ' + name + ' application require a rights level which require admin rights.<br />Do you want to continue ?', function(pass) {

						Core.applications.launch(def('toLaunchApp'), def('toLaunchAppArgs'), undefined, true);

					});
			}

			if(!this.frames[name])
				this.frames[name] = [];
			
			var Cert = new Certificate(package.ID, package.rights, package.permissions, package.access);
			var App = new Application(Cert, app);

			var id = Core.applications.frames[name].length;

			var win = Windows.create(name, 'app-' + name + '-' + id, function() {

				/*var iframe = this.parentNode.parentNode.getElementsByTagName('iframe')[0];
				delete Core.applications.frames[iframe.getAttribute('app')][iframe.getAttribute('app-id')];*/

				this.parentNode.parentNode.getElementsByTagName('iframe')[0].contentWindow.injectJS('App.events.on("quit")();')
				return false;

			});

			Object.freeze(win);

			var frame = $(document.createElement('iframe')).attr('sandbox', 'allow-scripts').attr('nwfaketop', true).attr('src', Core.path.format('/system/app-launcher/launcher.html')).attr('app', name).attr('app-id', id);

			$('#app-' + name + '-' + id + ' .content:first').append(frame);

			frame.on('load', function() {

				var name = this.getAttribute('app');
				var id   = this.getAttribute('app-id');

				Core.applications.frames[name][id].window = this.contentWindow;

				this.contentWindow.launchApp = function(name, args) {

					return Core.applications.launch(name, args);

				}

				this.contentWindow.installPackageApp = function(package, con) {

					return Core.applications.installFromPackage(package, con);

				}

				this.contentWindow.sys = {
					quitApp: function(name, frame_ID) {
						return Core.applications.close(name, frame_ID);
					},

					appError: function(message, file, line, col, error, win) {
						Dialogs.error('Application chrashed !', 'The ' + win.App.name + ' application crashed !<br /><br />Details :<br /><br /><span style="color: red;">' + message + '</span><br /><br />app-launcher:' + line + ',' + col);
						Core.applications.close(win.App.name, win.App.ID)
						// write error in log
					}

				}

				this.contentWindow.launch(name, args, Core.vars.vars(), Core.applications.frames[name], Core.applications.frames[name][id].win, Core.applications.frames[name][id].cert, id, Core.path.root);
				this.contentWindow.readyToLaunch = true;
			});

			this.frames[name].push({
				id: id,
				name: name,
				app: App,
				cert: Cert,
				win: win
			});

			$('body').append(win);

			TaskManager.refresh();

			return true;

		}

		else

		this.launch = function(name, args) {

			return launchApp(name, args);

		}

		/**
		  * Close an application
		  * @param {string} name Application name
		  * @param {string} frame_ID Application frame ID
		  * @return {Boolean} Return true if success
		  */

		if(typeof(appLauncher) === 'undefined')

		this.close = function(name, frame_ID) {

			this.frames[name][frame_ID].win.close();
			this.frames[name].splice(frame_ID, 1);

			/*$('#app-' + name + '-' + frame_ID).animate({
				opacity: 0,
				height: 0,
				width: 0
			}, 2000, function() {
				$(this).remove();
			});*/

		}

		/**
		  * Get the package of an application
		  * @param {string} name Application name
		  * @return {Object|Boolean} Return the application package or false if can't get the icon
		  */

		this.packageOf = function(name) {

			name = name.replace(/[^a-zA-Z0-9 _\-]/g, '');

			if(App.directoryExists('/system/apps/' + name))
				var directory = '/system/apps/' + name;
			else if(App.directoryExists('/apps/' + name))
				var directory = '/apps/' + name;
			else
				return Dialogs.error('Application package', 'Cannot find application : ' + name);
			
			return JSON.parse(App.readFile(directory + '/package.prm'));

		}

		/**
		  * Know if an application is installed on the computer
		  * @param {string} name Application name
		  * @return {Boolean}
		  */

		this.exists = function(name) {

			return (App.directoryExists('/system/apps/' + name) || App.directoryExists('/apps/' + name));

		}

		/**
		  * Check if an application name is valid
		  * @param {string} name Application name
		  * @return {Boolean}
		*/

		this.isValidName = function(name) {

			return (name.replace(/[^a-zA-Z0-9 _\-\.]/g, '') === name);

		}

		/**
		  * Check if an application package is valid
		  * @param {string|Object} package Application package (JSON string or JSON object)
		  * @return {Boolean}
		  */

		this.isValidPackage = function(package) {

			if(typeof(package) !== 'object') {
				try {
					package = JSON.parse(package);
				}

				catch(e) {
					return Debug.error('Invalid JSON package');
				}
			}

			var check = ['name', 'creator', 'version', 'icon', 'access', 'permissions', 'rights', 'files'];

			for(var i in check)
				if(typeof(package[check[i]]) === 'undefined')
					return Debug.error('Missing required entries [' + check[i] + ']');

			if(typeof(package.permissions) !== 'object' || typeof(package.rights) !== 'number' || typeof(package.access) !== 'object' || typeof(package.files) !== 'object')
				return Debug.error('Invalid entries format');

			if(package.rights != 1 && package.rights != 2 && package.rights != 3 && package.rights != 4)
				return Debug.error('Invalid rights [' + package['rights'] + ']');

			if(typeof package.files !== 'object')
				return Debug.error('Missing application files');

			for(var i in package.files)
				if(!this.isValidName(i))
					return Debug.error('Invalid file name [' + i + ']');

			if(!this.isValidName(package.name))
				return Debug.error('Not a valid name [' + package.name + ']');

			return true;

		}

		/**
		  * Check if an application package is correctly signed
		  * @param {string|Object} package Application package (JSON string or JSON object)
		  * @return {Boolean}
		  */

		this.isSignedPackage = function(package) {

			if(!this.isValidPackage(package))
				return Debug.error('Not a valid application package');

			if(typeof(package) !== 'object')
				package = JSON.parse(package);

			if(typeof(package.sign) !== 'object')
				return Debug.error('The application package isn\'t signed');

			var sign = package.sign;
			delete package.sign;

			check = ['signed', 'input', 'algorithm'];

			for(var i in check)
				if(!sign[check[i]])
					return Debug.error('The application package sign object doesn\'t contains the required fields [' + check[i].escapeHTML() + ']');

			return Core.crypto.sign(sign.signed, JSON.stringify(package), Core.crypto.getSignPublicKey(), sign.input, sign.algorithm);

		}

		/**
		  * Install an application from a package
		  * @param {Object} package Application package
		  * @param {Object} con [Optionnal] The output debug console
		  * @return {Boolean} Return true if the installation success
		  */

		if(typeof(appLauncher) === 'undefined')

		this.installFromPackage = function(package, con) {

			var out = (con || Debug);

			out.write('Checking application package...');

			if(!this.isValidPackage(package))
				return out.error('Invalid application package');

			if(typeof(package) !== 'object')
				package = JSON.parse(package);

			var o_p = package;

			var s = this.isSignedPackage(package);

			if(!s)
				out.warn('The application package is not signed. This can cause security issues');

			if(package.rights == 4 && !System.rooted)
				return out.error('Can\'t install the application because it require system rights and your system is not rooted');

			if(this.exists(package.name))
				return out.error('An application which this name [' + package.name.escapeHTML() + '] alreay exists on this computer');

			var dir = ((package.rights == 4) ? '/system' : '') + '/apps/' + package.name + '/';

			if(!App.makeDir(dir))
				return out.error('Can\'t make the application directory [' + dir + ']');

			out.write('Writing applications files...');

			for(var i in package.files) {

				out.write('| Writing ' + i.escapeHTML() + '...');

				if(!App.writeFile(dir + i, package.files[i])) {
					App.removeDir(dir);
					return out.error('Can\'t write an application file [' + i + ']');
				}

				out.write(' - Successfull', true);

			}

			delete package.files;

			out.write('| Writing package.prm...');

			if(!App.writeFile(dir + 'package.prm', JSON.stringify(package))) {
				App.removeDir(dir);
				return out.error('Can\'t write the application package [package.prm]');
			}

			out.write(' - Successfull', true);

			out.write('Writing registry...');

			var d = new Date();

			if(Registry.write('applications/' + name, {

				installed: {
					str: d.toString(),
					day: d.getDay(),
					month: d.getMonth(),
					year: d.getFullYear()
				},

				package: o_p

			}))
				out.write(' - Successfull', true);
			else
				out.error(' - Failed', true);

			out.write('The application has been sucessfully installed !');

			return true;

		}

		else

		this.installFromPackage = function(package, con) {

			return installPackageApp(package, con);

		}

	}

	this.certificates = new function() {

		var fs = require('fs');

		/**
		  * Know if an application has access to a specified path with a specified permission
		  * !!! That is a difficult function, please see the function code for a better understand !!!
		  * @param {Object} cert The application certificate
		  * @param {Array} type Permission array. Example : for storage files_write, give ['storage', 'files_write']
		  * @param {string} path
		  * @returns {Boolean}
		  */

		this.authorize = function(cert, type, path) {

			if(!cert || !cert.constructor)
				throw new Error(System.errors.INVALID_CERTIFICATE);

			return (cert.hasPermission(type) && cert.hasAccess(path));
		}

	}

	/* The Core.backtrace constructor
	 * @constructor
	 */

	this.backtrace = new function() {

		/**
		  * Get backtrace
		  * @returns {Array}
		  */

		this.get = function() {

			for(var frame = arguments.callee, stale = []; frame; frame = frame.caller) {
				if(stale.indexOf(frame) >= 0)
					break;

				stale.push({
					context: frame,
					args: frame.arguments,
				});
			}

			return stale;
			
		}

		/**
		  * Debug backtrace
		  * @return {string} Backtrace debug
		  */

		this.debug = function() {

			var html = '';

			for(var frame = arguments.callee, stale = []; frame; frame = frame.caller) {
				if(stale.indexOf(frame) >= 0)
					break;

				stale.push(frame);

				html += '<br /><details><summary>' + (frame.name || '[unknown]') + '</summary>' + frame.toString() + '</details>';
			}

			return html;

		}

		/**
		 * Know the caller of the last function
	 	 * @param {Function|Object} verif
	 	 * @returns {Boolean}
	 	 */

 	 	this.getCaller = function() {
 	 		return arguments.callee.caller.arguments.callee.caller;
 	 	}
	}

 	/**
 	  * The Core.path constructor
 	  * @constructor
 	  */

	this.path = new function() {

		var r_path = require('path');

		/**
		  * Get the current directory
		  */

		this.chdir = this.cd = function(path) {

			if(typeof(path) === 'undefined' || path === true || path === false) {
				var c = process.cwd()
				if(!path)
					c = c.replace(this.root, '');
				return c ? c : '/';
			} else if(App.directoryExists(path)) {

				try {
					process.chdir(this.format(path));
					return true;
				}

				catch(e) {
					return false;
				}

			} else
				return false;

		}

		/**
		  * Convert a NightPath to regex
		  * @param {string} path (NightPath format)
		  */

    	this.format = function(path, formatSelectors, disableVariables) {

    		if(path.replace(this.root, '') === '/*' && formatSelectors)
    			return new RegExp(this.root.formatToRegex() + '($|\/(.*))');

    		var vars = Core.vars.vars();

    		path = path.replace(/[^a-zA-Z0-9 \-_\.\/\?\*\$]/g, '');
    		path = path.replace(Core.path.root, '');

    		if(!disableVariables)
				for(var i in vars)
					path = path.replace(new RegExp('\\$' + i + '\\$', 'gi'), vars[i]);

    		if(!formatSelectors)
    			path = path.replace(/\*/g, '').replace(/\?/g, '');

    		path = (path.substr(0, 1) === '/' ? Core.path.root : Core.path.chdir(true)) + '/' + r_path.normalize(path);
    		path = r_path.normalize(path);

    		if(path.substr(0, Core.path.root.length) !== Core.path.root)
    			path = Core.path.root;

			if(formatSelectors)
				path = new RegExp(path.replace(/\/(|\*)$/, '').formatToRegex() + '($|\/\\*)'
					.replace(/\\\*/g, '([a-zA-Z0-9 _\\-\\/]*)').replace(/\\\?/g, '.'));

			return path;

    	}

		// delete this function !

		/*this.old_format = function(path, formatSelectors, disableVariables) {

			// correct the next bug :
			// when chdir in /users/admin/documents/App
			// and format '../..'
			// relative result is : '/' insteadof '/users/admin'

			if(path.replace(this.root, '') === '/*' && formatSelectors)
				return new RegExp(this.root.formatToRegex() + '($|\/(.*))')

			var vars = Core.vars.vars();

			path = r_path.normalize(path).replace(/\.\./g, '');

			var c = (path.substr(0, 1) !== '/') ? process.cwd() : Core.path.root;

			regex = (c + '/' + path.replace(Core.path.root, '')).replace(/^\\/g, '/');

			if(!disableVariables)
				for(var i in vars)
					regex = regex.replace(new RegExp('\\$' + i + '\\$', 'gi'), vars[i]);

			//console.log(regex);
			regex = regex.replace(/[^a-zA-Z0-9 \.\-_\/\?\*]/g, '');
			//console.log(regex);

			if(formatSelectors) {
				regex = regex.replace(/\/(|\*)$/, '').formatToRegex() + '($|\/\\*)';
				regex = regex.replace(/\\\*/
					/*g, '([a-zA-Z0-9 _\\-\\/]*)').replace(/\\\?/g, '.');
			} else
				regex = regex.replace(/\*/
					/*g, '').replace(/\?/g, '');

			regex = r_path.normalize(regex);

			return formatSelectors ? new RegExp(regex, 'g') : regex;

		}*/

		/**
		  * Know if a path is in a NightPath
		  * @param {string} path
		  * @param {string} selector Selection path (NightPath format)
		  * @returns {Boolean}
		  */

		this.included = function(path, selector) {

			return this.format(selector, true).test(Core.path.format(path));

		}

		this.rootURL = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')).substr(1);
		
		this.root = (typeof(appLauncherRootPath) !== 'undefined') ? appLauncherRootPath : process.cwd();

	}

	/**
	  * Core.commandLine constructor
	  * @constructor
	  */

	this.commandLine = new function() {

		var path = require('path');

		/**
		  * Native NightOS commands
		  */

		var native = {

			echo: function(args, con) {

				var txt = args.join(' ');
				var vars = Core.vars.vars();

				for(var i in vars)
					txt = txt.replace(new RegExp('\\$' + i + '\\$', 'gi'), vars[i]);

				con.text(txt);

			},

			clear: function(args, con) {

				con.clear();

			},

			write: function(args, con) {

				if(App.writeFile(args[0], args[1]))
					con.write('Writed successfull !')
				else if(App.lastStack(-1))
					con.error('Needs privileges elevation');
				else
					con.error('An error has occured.');

			},

			read: function(args, con) {

				var f = App.readFile(args[0])

				if(f !== false)
					con.write(f);
				else if(App.lastStack(-1))
					con.error('Needs privileges elevation');
				else
					con.error('An error has occured.');

			},

			delete: function(args, con) {

				if(App.removeFile(args[0]))
					con.write('Deleted successfull !');
				else if(App.lastStack(-1))
					con.error('Needs privileges elevation');
				else
					con.error('An error has occured.');

			},

			mkdir: function(args, con) {

				if(App.makeDir(args[0]))
					con.write('Writed successfull !');
				else if(App.lastStack(-1))
					con.error('Needs privileges elevation');
				else
					con.error('An error has occured.');

			},

			rmdir: function(args, con) {

				if(App.removeDir(args[0]))
					con.write('Writed successfull !');
				else if(App.lastStack(-1))
					con.error('Needs privileges elevation');
				else
					con.error('An error has occured.');

			},

			ls: function(args, con) {

				if(args[0] === '-d' || args[0] === '--details') {

					var path = (args[1] || '.');
					var f    = App.readDir(path);

					html = '';

					for(var i in f)
						html += '<tr><td>' + (App.fileExists(f[i]) ? 'f' : 'd') + '</td><td>&nbsp;' + (App.fileExists(f[i]) ? App.getFileSize(path + '/' + f[i]) : '-') + '</td><td>&nbsp;' + f[i] + '</td></tr>';

					return con.write('<table>' + html + '</table>');

				}

				var f = App.readDir((args[0] || '.'));

				if(f)
					con.text(f.join("\n"))
				else if(App.lastStack(-1))
					con.error('Needs privileges elevation');
				else
					con.error('An error has occured.');


			},

			chdir: function(args, con) {

				if(args[0])
					if(!Core.path.chdir(args[0]))
						con.error('An error has occured.');
					else
						con.text('Successfully changed path.');
				else
					con.text('/' + path.relative(Core.path.root, process.cwd()));

			},

			debug: function(args, con) {

				con.write('Rights : ' + App.getCertificate().getRights());

			},

			js: function(args, con) {

				try { con.write(new Function(args[0])()) }
				catch(e) { con.error('An error has occured : ' + new String(e)); }

			},

			exists: function(args, con) {

				if(!args[0])
					return con.error('Missing path');

				con.write(App.exists(args[0]) ? 'true' : 'false');

			},

			fexists: function(args, con) {

				if(!args[0])
					return con.error('Missing path');

				con.write(App.fileExists(args[0]) ? 'true' : 'false');

			},

			dexists: function(args, con) {

				if(!args[0])
					return con.error('Missing path');

				con.write(App.directoryExists(args[0]) ? 'true' : 'false');

			},

			copy: function(args, con) {

				if(!args[0] || !args[1])
					return con.error('Missing arguments');

				con.write('Copying...');

				if(App.copyFile(args[0], args[1]))
					con.write(' - Done !', true);
				else if(App.lastStack(-1))
					con.error('Needs privileges elevation');
				else
					con.error('An error has occured');

			},

			move: function(args, con) {

				if(!args[0] || !args[1])
					return con.error('Missing arguments');

				con.write('Moving...');

				if(App.moveFile(args[0], args[1]))
					con.write(' - Done !', true);
				else if(App.lastStack(-1))
					con.error('Needs privileges elevation');
				else
					con.error('An error has occured');

			}

		}

		/**
		  * Get all native NightOS commands
		  * @return {Object} Native NightOS commands
		  */

		this.getNative = function() { return native; }

		/**
		  * Execute a NightOS command
		  * @param {string} cmd NightOS command
		  * @param {Console} con The console instance
		  * @return {string}
		  */

		this.exec = function(cmd, con) {

			if(!(con instanceof Console))
				var con = new Console($(document.createElement('div')));

			var cmds = cmd.split('&&');

			// && chars doesn't works, correct that !

			if(cmds.length > 1) {
				for(var i in cmds)
					this.exec(cmds[i], con)

				return;
			}

			con.noinvite();

			var args = cmd.trim().replace(/ "(.*?)"/g, "\n$1").split("\n");
			var n = args[0];

			args.splice(0, 1);
			args = n.split(' ').concat(args);
			
			var cmd_name = args[0];
			
			args.splice(0, 1);
			
			var alias = Registry.read('commands/alias');

			if(typeof(native[cmd_name]) !== 'function')
				for(var i in alias) {

					if(i.toUpperCase() == cmd_name.toUpperCase()) {
						cmd_name = i;
						break;
					}

					for(var j in alias[i])
						if(alias[i][j].toUpperCase() == cmd_name.toUpperCase()) {
							cmd_name = i;
							break;
						}
					}

			if(typeof(native[cmd_name]) !== 'function') {

				var app = Core.applications.get(cmd_name);

				def('sync', true);

				if(app) {
					def('nextcmd', app);
					def('nextcon', con);
					def('nextargs', args);
					
					if(!app.isSystem)
						Dialogs.confirm('Command line interpreter', 'The command you will run will be use the current application rights. Continue uniquely if you\'re sure about what you are doing.', function() {
							new Function(['con', 'args'], def('nextcmd').commandLine)(def('nextcon'), def('nextargs'));
						});
					else
						new Function(['con', 'args'], app.commandLine)(def('nextcon'), args);

					if(def('sync'))
						con.invite();

 				} else {
					con.error('Command not found : ' + cmd_name);
					con.invite();
				}
			} else {
				native[cmd_name](args, con);
				con.invite();
			}

		}

	}

	this.fatalError = function(error, event) {
	
		try {
			$('#frame').css({
				background: '#1800F4',
				color: 'white',
				fontFamily: 'Ubuntu,Open Sans,sans-serif',
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				padding: 10
			}).html('Fatal error :<br /><br />' + error + '<br /><br />' + event.message + '<br /><br />' + System.name + ' must stop.<br /><br />Stack debug :<br /><br />' + event.stack.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;'));
		}

		catch(e) {
			console.error('A loop error occured : ' + e.message);
		}
	
	}

	/**
	  * Format a frame content to an HTML content
  	  * @param {string} text Frame content
  	  * @returns {string} HTML content
  	  */

	/**
	  * Boot function, launched at OS startup
	  */

	this.boot = function(applicationLauncher) {

		var file = 'Internal error';

		try {
			var styles = fs.readdirSync(Core.path.root + '/system/styles');
			styles.push('../../external-tools/font-awesome.css');

			if(applicationLauncher)
				styles.push('../app-launcher/main.css');

			for(var i in styles) {
				var file = Core.path.root + '/system/styles/' + styles[i];
				
				if(!fs.lstatSync(file).isDirectory()) {
					var style = document.createElement('style');
					style.type = 'text/css';
					style.setAttribute('charset', 'utf-8');
					style.innerHTML = fs.readFileSync(file, 'utf8').replace(/\[ROOT_PATH\]/g, Core.path.root);
					document.getElementsByTagName('head')[0].appendChild(style);
				}
			}
		}

		catch(e) {
			throw new Error('Unable to load main stylesheet [' + file + ']. Make sure that this directory is readable.<br /><br />' + e.message);
		}

		try {
			if(!Syntax.themes.load('default', fs.readFileSync(Core.path.format('/users/common-data/syntax/themes/default.syx'), 'utf8')))
				throw new Error('Invalid file format')
		}

		catch(e) {
			throw new Error('Cannot load default syntax theme.<br /><br />Details :<br /><br />' + new String(e));
		}
		
		try {
			if(!Syntax.languages.load('plain', fs.readFileSync(Core.path.format('/users/common-data/syntax/languages/plain.syx'), 'utf8')))
				throw new Error('Invalid file format')
		}

		catch(e) {
			throw new Error('Cannot load plain syntax language.<br /><br />Details :<br /><br />' + new String(e));
		}

		try {
			Syntax.languages.load('javascript', fs.readFileSync(Core.path.format('/users/common-data/syntax/languages/javascript.syx'), 'utf8'));
		}

		catch(e) {}
		

		if(applicationLauncher)
			return true;

		try {
			var UI = fs.readFileSync(Core.path.root + '/system/boot/app.js', 'utf8');
		}

		catch(e) {
			throw new Error('Unable to load UI [system/boot/app.js]. Make sure that this directory is readable.<br /><br />' + e.message);
		}

		try {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.setAttribute('charset', 'utf8');
			script.innerHTML = UI;

			document.body.appendChild(script);
		}

		catch(e) {
			throw new Error('An error occured during loading UI [system/boot/app.js].<br /><br />' + e.message);
		}
	}

	/**
	  * The Core.frames constructor
	  * @constructor
	  */

	this.frames = new function() {

		/**
		  * Format a frame
		  * @param {string} frame Frame content
		  * @return {string} Formatted frame content
		  */

		this.format = function(frame) {

			var vars = Core.vars.vars();

			for(var i in vars)
				frame = frame.replace(new RegExp('{{ ' + i + ' }}', 'gi'), vars[i]);

			return frame;

		}

	}

	/**
	  * The Core.vars constructor
	  * @constructor
	  */

	this.vars = new function() {

		var _vars = {};
		var _constants = {};

		/**
		  * Set a variable. Please note that a variable can be assigned only one time.
		  * @param {string} name Variable name
		  * @param value Variable value
		  * @return {Boolean} false if variable already exists
		  */
	
		this.set = function(name, value, isConstant) {

			if(typeof(_vars[name]) !== 'undefined')
				return false;

			_vars[name] = value;
			_constants[name] = isConstant;
			window['_' + name + '_'] = value;

 			return true;

		}

		/**
		  * Return a specific variable
		  */

		this.get = function(name) {

			return _vars[name];

		}

		/**
		  * Return all defined vars
		  * @return {Object} vars All defined vars
		  */

		this.vars = function() {

			return _vars;

		}

	}

}

Object.freeze(Core);

Object.freeze(Core.crypto);
Object.freeze(Core.users);
Object.freeze(Core.applications);
Object.freeze(Core.certificates);
Object.freeze(Core.backtrace);
Object.freeze(Core.path);
Object.freeze(Core.frames);
Object.freeze(Core.vars);

window.users        = Core.users
window.applications = Core.applications
window.certificates = Core.certificates
window.backtrace    = Core.backtrace
window.path         = Core.path
window.frames       = Core.frames
window.vars         = Core.vars;
window.crypto       = Core.crypto;

var APP_NAME        = (typeof(app_name) === 'undefined') ? 'System' : app_name;
Core.vars.set('APP_NAME', APP_NAME);

process.on('uncaughtException', function(e) {

	console.log('[process catch error] ', e);

	if(!e.stack.contains('/system/app-launcher/launcher.html'))
		Core.fatalError('An error has occured', e);

});

window.onerror = function(message, file, line, col, error) {

	if(error.stack.contains('/system/app-launcher/launcher.html'))
		if(typeof(appLauncher) !== 'undefined' && typeof(sys) !== 'undefined' && sys.appError)
			sys.appError(message, file, line, col, error, window);
	else
		console.error(message + "\n\n" + file + ':' + line + ',' + col + "\n\n" + error);

}

process.setMaxListeners(35);
