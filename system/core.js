
/**
 * Clone an object (permit to modify the cloned object without modifying the original object)
 * @param {object} e
 * @returns {object}
 */

function clone(e){var n;if(null==e||"object"!=typeof e)return e;if(e instanceof Date)return n=new Date,n.setTime(e.getTime()),n;if(e instanceof Array){n=[];for(var t=0,r=e.length;r>t;t++)n[t]=clone(e[t]);return n}if(e instanceof Object){n={};for(var o in e)e.hasOwnProperty(o)&&(n[o]=clone(e[o]));return n}throw new Error("Unable to copy obj! Its type isn't supported.")}

var define = new function() {

	var vars = {};

	this.exec = function(name, value) {

		if(typeof(value) !== 'undefined')
			vars[name] = value;

		return vars[name];

	}

};

var def = function(name, value) {

	return define.exec(name, value);

};

var fs = require('fs');

/**
  * System core constructor
  * @constructor
  */

var Core = new function() {

    /**
     * Core variables
     * @constructor
     */

    this.vars = new function() {

        var _vars = {};
        var _constants = {};
        var _watchers = {};

        /**
         * Set a variable
         * @param {string} name
         * @param {*} value
         * @returns {Boolean}
         */

        this.set = function(name, value, isConstant) {

            if(_constants[name])
                return false;

            var old = _vars[name];

            _vars[name] = value;
            _constants[name] = isConstant;
            window['_' + name + '_'] = value;

            if(_watchers[name])
                _watchers[name](old, value);

            return true;

        };

        /**
         * Watch a variable
         * @param {string} name
         * @param {function} [callback]
         */

        this.watch = function(name, callback) {

            if(typeof(callback) === 'function')
                _watchers[name] = callback;

            return _watchers[name];

        };

        /**
         * Return a specific variable
         * @param {string} name
         */

        this.get = function(name) {

            return _vars[name];

        };

        /**
         * Return all defined vars
         * @returns {Object} vars All defined vars
         */

        this.all = function() {

            return _vars;

        };

    };

    /**
	  * Cryptography library
	  * @constructor
	  */

	this.crypto = new function() {

		var _fs = require('fs');
		var _cr = require('crypto');

		this.getSignPublicKey = function() {
			return _fs.readFileSync(Core.path.root + '/system/sign/RSA-public-4096.pem', 'utf8');
		};
		
		/**
	      * Hash a string with SHA384 algorithm
	      * @param {string} str The string to hash
	      * @returns {string} The hashed string
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
		  * Protect a password, using PBKDF2 algorithm
		  * @param {string} pass The string to hash
		  * @param {string} salt The HMAC salt
		  * @param {Number} iterations The number of hashs. Default : 50 000
		  * @param {Number} keylen The generated key length. Default : 48
		  * @returns {string} The secured-hashed string
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
		  * @returns {string} The signed data
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
		  * @param {string} algo The signature algorithm used. Default : RSA-SHA384
		  * @returns {Boolean} Return true if the signature is correct
		  */

		this.verify = function(sign, bef, pub, input, algo) {

			if(typeof(input) !== 'string')
				input = 'hex';

			if(typeof(algo) !== 'string')
				algo = 'RSA-SHA384';

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
		  * @returns {Boolean|object} User informations
		  */

		if(typeof(applicationLauncher) === 'undefined')

		this.get = function(name) {

			try {
				return JSON.parse(fs.readFileSync(Core.path.root + '/system/users/' + name + '.usr'));
			}

			catch(e) { return false; }

		};

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

		};

		/**
		  * Know if the current user has administrator privileges
		  * @returns {Boolean} Return true if the current user has administrator privileges
		  */

		this.isAdmin = function() {

			return _admin;

		};

		/**
		  * Know if a specified password is the administrator password
		  * @param {string} password The password
		  * @returns {Boolean} Return true if the specified password is the administrator password
		  */

		this.isAdminPassword = function(password) {

			return (Core.crypto.password(password, 'admin', 50000, 48) === Core.users.get('admin').password);

		};

		/**
		  * Return actual user informations. Return an empty object if you are not logged in.
		  * @returns {Object}
		  */

		this.user = function() {
			return _user;
		};

	};

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
		  * @returns {Object|Boolean} Return false if an error occurred
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

            var directory;

			if(App.directoryExists('/system/apps/' + name)) {
				directory = '/system/apps/' + name;
				app.isSystem = true;
			} else if(App.directoryExists('/apps/' + name))
				directory = '/apps/' + name;
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

		};

		/**
		 * Launch an application
		 * @param {string} name Application name
		 * @param {Object} args Arguments to pass to application instance
		 * @param {string} adminPass The administrator password. Needed to launch high-level applications.
		 * @returns {boolean}
		 */

		this.launch = function(name, args, runAsAdmin, adminPass) {

			if(typeof(adminPass) !== 'undefined' && adminPass !== true && !Core.isAdminPassword(adminPass))
				return Dialogs.error('Application launcher', 'The password you entered is incorrect');

			var App = window.App;

			name = name.replace(/[^a-zA-Z0-9 _\-]/g, '');

			var r = Registry.read('commands/alias');

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

			var frame = $(document.createElement('iframe')).attr('sandbox', 'allow-scripts').attr('nwfaketop', true).attr('nwdisable', true).attr('src', Core.path.format('/system/app-launcher/launcher.html')).attr('app', name).attr('app-id', id);

			$('#app-' + name + '-' + id + ' .content:first').append(frame);

			frame.on('load', function() {

				var name = this.getAttribute('app');
				var id   = this.getAttribute('app-id');

				Core.applications.frames[name][id].window = this.contentWindow;

				this.contentWindow.launchApp = function(name, args) {

					return Core.applications.launch(name, args);

				};

                this.contentWindow.sysApp = {};

                if(App.getCertificate().getRights() >= 3) {

                    this.contentWindow.sysApp.installPackageApp = function (package, con) {

                        return Core.applications.installFromPackage(package, con);

                    };

                    this.contentWindow.sysApp.installServerApp = function (name, con, success, error) {

                        return Core.applications.installFromServer(name, con, success, error);

                    };

                    this.contentWindow.sysApp.removeApp = function (name, con) {

                        return Core.applications.remove(name, con);

                    }

                } else {

                    this.contentWindow.sysApp.installFromPackageApp = this.contentWindow.sysApp.installServerApp = this.contentWindow.sysApp.removeApp = function(ignore, con) {
                        (con || console).error('SysApp : Not enough rights');
                        return false;
                    }

                }

				this.contentWindow.sys = {
					quitApp: function(name, frame_ID) {
						return Core.applications.close(name, frame_ID);
					},

					appError: function(message, file, line, col, error, win) {
						Dialogs.error('Application crashed !', 'The ' + win.App.name + ' application crashed !<br /><br />Details :<br /><br /><span style="color: red;">' + message + '</span><br /><br />app-launcher:' + line + ',' + col);
						Core.applications.close(win.App.name, win.App.ID)
						// write error in log
					}

				};

				this.contentWindow.launch(name, args, Core.vars.all(), Core.applications.frames[name], Core.applications.frames[name][id].win, Core.applications.frames[name][id].cert, id, Core.path.root, require, process, Buffer);
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

		};

		if(typeof(appLauncher) !== 'undefined')

		this.launch = function(name, args) {

			return launchApp(name, args);

		};

		/**
		  * Close an application
		  * @param {string} name Application name
		  * @param {string} frame_ID Application frame I		  * @returns {Boolean} Return true if success
		  */

		this.close = function(name, frame_ID) {

			this.frames[name][frame_ID].win.close();

			this.frames[name].splice(frame_ID, 1);

			if(!this.frames[name].length)
				delete this.frames[name];

			TaskManager.refresh(); // refresh the taskmanager

		};

		if(typeof(appLauncher) !== 'undefined')
			delete this.close; // delete close function only now to permit JSDoc to generate documentation

		/**
		  * Get the package of an application
		  * @param {string} name Application name
		  * @returns {Object|Boolean} Return the application package or false if can't get the icon
		  */

		this.packageOf = function(name) {

			name = name.replace(/[^a-zA-Z0-9 _\-]/g, '');

			if(App.directoryExists('/system/apps/' + name))
				var directory = '/system/apps/' + name;
			else if(App.directoryExists('/apps/' + name))
				var directory = '/apps/' + name;
			else
				return Debug.error('packageOf : Cannot find application : ' + name);
			
			return JSON.parse(App.readFile(directory + '/package.prm'));

		};

		/**
		  * Know if an application is installed on the computer
		  * @param {string} name Application name
		  * @returns {Boolean}
		  */

		this.exists = function(name) {

			return (App.directoryExists('/system/apps/' + name) || App.directoryExists('/apps/' + name));

		};

		/**
		  * Check if an application name is valid
		  * @param {string} name Application name
		  * @returns {Boolean}
		*/

		this.isValidName = function(name) {

			return (name.replace(/[^a-zA-Z0-9 _\-\.]/g, '') === name);

		};

		/**
		  * Check if an application package is valid
		  * @param {string|Object} package Application package (JSON string or JSON object)
		  * @returns {Boolean}
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

		};

		/**
		  * Check if an application package is correctly signed
		  * @param {string|Object} pkg Application package (JSON string or JSON object)
		  * @returns {Boolean}
		  */

		this.isSignedPackage = function(pkg) {

			if(!this.isValidPackage(pkg))
				return Debug.error('Not a valid application pkg');

			if(typeof(pkg) !== 'object')
				pkg = JSON.parse(pkg);

			if(typeof(pkg.sign) !== 'object')
				return Debug.error('The application pkg isn\'t signed');

			var sign = pkg.sign;
			delete pkg.sign;

			check = ['signed', 'input', 'algorithm'];

			for(var i in check)
				if(!sign[check[i]])
					return Debug.error('The application package sign object doesn\'t contains the required fields [' + check[i].escapeHTML() + ']');

			return Core.crypto.sign(sign.signed, JSON.stringify(pkg), Core.crypto.getSignPublicKey(), sign.input, sign.algorithm);

		};

		/**
		  * Install an application from a package
		  * @param {Object} package Application package
		  * @param {Object} con [optional] The output debug console
		  * @returns {Boolean} Return true if the installation success
		  */

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

			out.write('Writing package.prm...');

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
					year: d.getFullYear(),
                    exact: d.getTime()
				},

				package: o_p

			}))
				out.success(' - Successfull', true);
			else
				out.error(' - Failed', true);

			out.write('The application has been sucessfully installed !');

			delete package;

			return true;

		}

		if(typeof(appLauncher) !== 'undefined')

		this.installFromPackage = function(package, con) {

            sysApp.installPackageApp(package, con);

		}

        /**
         * Install an application from server
         * @param {string} name
         * @param {Console} con
         * @param {function} [success]
         * @param {function} [error]
         */

		this.installFromServer = function(name, con, success, error) {

            if(def('server_install_request')) {
                con.error('The system is already installing an application');
                error(0);
            }

            def('server_install_requesting', true);

            def('server_install_con', con);
            def('server_install_success', (success || function(){}));
            def('server_install_error', (error || function(){}));

            con.text('Requesting server...');

            return request('http://nightos.890.com/backend/get.php?name=' + name, function(error, response, body) {

                var output = def('server_install_con');
                var err;

                if(!error && response.statusCode === 200) {
                    try { if(err = JSON.parse(body).error) {
                        output.error('Error : ' + err);
                        return def('server_install_error')(0);
                    } }
                    catch(e) {}

                    Core.applications.installFromPackage(body, output);
                    return def('server_install_success')();
                }

                if(response.statusCode === 404) {
                    output.error('Repository not found (returned 404)');
                    return def('server_install_error')(404);
                }

                if(response.statusCode === 403) {
                    output.error('Repository forbidden access (returned 403)');
                    return def('server_install_error')(403);
                }

                if(response.statusCode === 500) {
                    output.error('Internal server error. Please try later (returned 500)');
                    return def('server_install_error')(500);
                }

            });

        };

		if(typeof(appLauncher) !== 'undefined')

		this.installFromServer = function(name, con, success, error) {

			if(sysApp.installServerApp(name, con, success, error) === false)
                error(-1);

		};

        /**
         * Remove an application
         * @param {string} name
         * @param {Console} con
         */

        this.remove = function(name, con) {

            if(!this.exists(name))
                return con.error('This application is not installed');

            App.removeDir('/apps/' + name);

            var a = Registry.read('applications');
            delete a[name];

            Registry.write('applications', a);

            return con.success('Successfully removed application !');

        }

        if(typeof(appLauncher) !== 'undefined')

        this.remove = function(name, con) {

            sysApp.removeApp(name, con);

        }

	};

	/**
	  * Use libraries in your applications
	  * @constructor
	  */

	this.libraries = new function() {

		/**
		  * Check if a library is installed on this computer and is available
		  * @param {string} name The library name
		  * @returns {Boolean}
		  */

		this.exists = function(name) {

			return App.directoryExists('/libs/' + name);

		};

		/**
		  * Get main library file name
		  * @param {string} name The library name
		  * @param {Boolean} uncompressed Get the uncompressed library main file name
		  * @returns {Boolean|String} Return false on fail
		  */

		this.getMainFileName = function(name, uncompressed) {

			try {
				return JSON.parse(App.readFile('/libs/' + name + '/package.json'))[(uncompressed ? 'lib' : 'min')];
			}

			catch(e) {
				return false;
			}

		};

		/**
		  * Launch a library
		  * @param {string} name The library name
		  * @param {Boolean} uncompressed Use the uncompressed library
		  * @returns {Boolean} Return true if success
		  */

		this.require = function(name, uncompressed) {

			if(!this.exists(name))
				return Debug.error('The specified library doesn\'t exists');

			var main = this.getMainFileName(name, uncompressed);

			if(!main)
				return Debug.error('Invalid library package : can\'t read main file name');

			var file = App.readFile('/libs/' + name + '/' + main);

			if(!file)
				return Debug.error('Can\'t get library main file' + (App.lastStack(-1) ? ' : Needs privileges elevation' : ''));

			try {
				window.eval(file);
				return true;
			}

			catch(e) {
				return Debug.error('Can\'t run library main file : ' + new String(e));
			}

		};

	};

	this.certificates = new function() {

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
		};

	}

	/* The Core.backtrace constructor
	 * @constructor
	 */

	this.backtrace = new function() {

		/**
		  * Get backtrace
		  * @returns {string}
		  */

		this.get = function() {

            return (new Error('')).stack.replace(/^(.*?)\n/, '').replace(new RegExp(Core.path.rootURL, 'g'), '');
			
		};

		/**
		 * Know the caller of the last function
	 	 * @param {Function|Object} verif
	 	 * @returns {Boolean}
	 	 */

 	 	this.getCaller = function() {
 	 		return arguments.callee.caller.arguments.callee.caller;
 	 	};
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

		};

		/**
		  * Convert a NightPath to regex
		  * @param {string} path (NightPath format)
		  */

    	this.format = function(path, formatSelectors, disableVariables) {

    		if(path.replace(this.root, '') === '/*' && formatSelectors)
    			return new RegExp(this.root.formatToRegex() + '($|\/(.*))');

    		var vars = Core.vars.all();

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

    	};

		/**
		  * Know if a path is in a NightPath
		  * @param {string} path
		  * @param {string} selector Selection path (NightPath format)
		  * @returns {Boolean}
		  */

		this.included = function(path, selector) {

			return this.format(selector, true).test(Core.path.format(path));

		};

		this.rootURL = window.location.href.replace(/\/system\/system\.html$/, '');

		/**
		 * The system root path
		 * @type {string}
		 */
		this.root = (typeof(appLauncherRootPath) !== 'undefined') ? appLauncherRootPath : process.cwd();

	}

    /* Etablish command-line queue */

    this.vars.set('last_cmd_sync', null);
    this.vars.set('last_cmd_resolve', true);

    this.vars.watch('last_cmd_resolve', function(old, newest) {

        if(newest) {

            var cmds = Core.vars.get('cmd_queue');

            if (cmds.length) {
                var cmd = cmds[0];
                cmds.shift();
                Core.vars.get('cmd_queue_console').noRedirection();
                Core.vars.set('cmd_queue', cmds);
                Core.commandLine.exec(cmd, Core.vars.get('cmd_queue_console'), cmds.length);
            }

        }

    });

    this.vars.set('cmd_queue_console', null);
    this.vars.set('cmd_queue', []);

    this.vars.watch('cmd_queue', function(old, newest) {

        if(!old.length && newest.length && Core.vars.get('last_cmd_resolve'))
            Core.vars.set('last_cmd_resolve', true);

    });

	/**
	  * Core.commandLine constructor
	  * @constructor
	  */

	this.commandLine = new function() {

		var path = require('path');

		/**
		  * Native NightOS commands
          * @type {object}
		  */

		var native = {

			echo: function(args, con) {

				var txt = args.join(' ');
				var vars = Core.vars.all();

				for(var i in vars)
					txt = txt.replace(new RegExp('\\$' + i + '\\$', 'gi'), vars[i]);

				con.text(txt);

			},

            set: function(args, con) {

                if(!args[0] || args[0].indexOf('=') === -1)
                    con.error('Missing alias name and value');
                else
                    Core.vars.set(args[0].split('=')[0].trim(), args[0].split('=')[1].trim());

            },

			clear: function(args, con) {

				con.clear();

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

            alias: function(args, con) {

                if(!args[0])
                    con.error('Missing alias name and value');
                else if(args[0].indexOf('=') === -1) {
                    if(_alias[args[0]])
                        con.text(_alias[args[0]]);
                    else
                        con.error('Alias not found');
                } else
                    _alias[args[0].split('=')[0].trim()] = args[0].split('=')[1].trim();

            },

            macro: function(args, con) {

                if(!args[0])
                    con.error('Missing macro name and value');
                else if(!args[1]) {
                    if(_macros[args[0]])
                        con.text(_macros[args[0]].join("\n"));
                    else
                        con.error('Macro not found');
                } else {
                    var m = args[1].trim();

                    while (m.indexOf('&&') != -1)
                        m = m.replace(/( *)&&( *)/g, '&&');

                    _macros[args[0].trim()] = m.split('&&');

                }
            },

            exit: function() {
                App.events.on('quit')();
            }

		}

        /**
         * Shell alias
         * @type {object}
         */

        var _alias = {};

        /**
         * Shell macros
         * @type {object}
         */

        var _macros = {};

		/**
		  * Get all native NightOS commands
		  * @returns {Object} Native NightOS commands
		  */

		this.getNative = function() { return native; };

		/**
		  * Execute a NightOS command
		  * @param {string} cmd NightOS command
		  * @param {Console} con The console instance
          * @param {boolean} [disableInvite]
		  * @returns {string|boolean}
		  */

		this.exec = function(cmd, con, disableInvite) {

            Core.vars.set('last_cmd_resolve', false);

            if(typeof(cmd) !== 'string')
                return false;

            cmd = cmd.replace(/#(.*?)$/gm, '');

            if(!cmd) {
                Core.vars.set('last_cmd_resolve', true);
                return false;
            }

            function createCallback(content, help) {
                return new Function(['output', 'arg_index', 'args', 'short_args', 'long_args', 'data'], 'function arg(short, long) { return (short_args[short] || long_args[long]); }\nfunction END() { Core.vars.set("last_cmd_sync", def("sync")); if(!def("disableInvite")) { output.invite(); } Core.vars.set("last_cmd_resolve", true); }\n' + content + "\n" + (help ? 'if(typeof(help) === "object") { Core.commandLine.viewObjHelp(output, help); } else { run(); }' : 'run();'));
            }

			if(!(con instanceof Console))
                con = new Console($(document.createElement('div')));

            var cmds = cmd.replace(/\r\n|\r|\n/g, '&&').replace(/(&&){2,}/g, '&&').split('&&');

			if(cmds.length > 1) {
                Core.vars.set('cmd_queue_console', con);
                Core.vars.set('cmd_queue', Core.vars.get('cmd_queue').concat(cmds));
                return Core.vars.set('last_cmd_resolve', true);
			}

            cmd = cmd.trim();

			con.noInvite();

            for(var i in _alias) {
                if(cmd.substr(0, i.length + 1) === i + ' ' || cmd === i)
                    cmd = _alias[i] + cmd.substr(i.length);
            }

            var data;

            if(cmd.split('<').length > 1 && cmd.split('<')[0].substr(-1) !== '\\') {
                cmd = cmd.replace(/<(.*)$/, App.readFile(cmd.split('<')[1].trim())).trim();
            }

            if(cmd.split('>>').length > 1 && cmd.split('>>')[0].substr(-1) !== '\\') {
                con.setRedirection(cmd.split('>>')[1].trim());
                cmd = cmd.replace(/>>(.*)$/, '').trim();
            } else if(cmd.split('>').length > 1 && cmd.split('>')[0].substr(-1) !== '\\') {
                con.setRedirection(cmd.split('>')[1].trim(), true);
                cmd = cmd.replace(/>(.*)$/, '').trim();
            } else
                con.noRedirection();

            cmd = cmd.replace(/\\(<|>|>>)/, '$1');

            var vars = Core.vars.all();

            for(var i in vars) {
                var e = '%' + i + '%';
                while (cmd.indexOf(e) !== -1)
                    cmd = cmd.substr(0, cmd.indexOf(e)) + vars[i] + cmd.substr(cmd.indexOf(e) + e.length);
            }

            cmd = cmd.replace(/(\\|)\$([0-9])/g, function(match) {
                return (match.substr(0, 1) !== '\\') ? Core.vars.get(match) : match.substr(1);
            });

			var args = cmd.replace(/ "(.*?)" /g, '\n$1\n').replace(/ "(.*?)"/g, "\n$1").split("\n");
			var n = args[0];

			args.splice(0, 1);
			args = n.split(' ').concat(args);

			var cmd_name = args[0];

			args.splice(0, 1);

            for(var i in args)
                while(args[i].match(/^\-([0-9a-zA-Z])([0-9a-zA-Z])/))
                    args[i] = args[i].replace(/^\-([0-9a-zA-Z])([0-9a-zA-Z])/g, function(match, first, last) {
                        args.push('-' + last);
                        return '-' + first;
                    });

			var alias = Registry.read('commands/alias');

            if(typeof(_macros[cmd_name]) !== 'undefined') {
                for(var i = 0; i < 9; i++)
                    Core.vars.set('$' + (i + 1), args[i]);

                Core.vars.set('$0', cmd);

                var queue = Core.vars.get('cmd_queue');

                for(var i = 0; i < _macros[cmd_name].length; i++) {
                    var c = _macros[cmd_name][_macros[cmd_name].length - i - 1];

                    if(queue.length)
                        queue.shift(c)
                    else
                        queue = [c];
                }

                Core.vars.set('cmd_queue', queue);
                Core.vars.set('last_cmd_resolve', true);

                return true;
            }

            if(typeof(native[cmd_name]) !== 'function') {

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

                var sys_cmd;
                var short_args = {};
                var long_args  = {};
                var all_args = args;
                var args = clone(args);
                var f_args = clone(args);
                var n = 0;

                for(var i in args)
                    if(args[i].substr(0, 2) == '--') {
                        long_args[args[i].substr(2).replace(/=(.*)$/, '')] = (args[i].indexOf('=') != -1) ? args[i].substr(args[i].indexOf('=') + 1) : true;
                        f_args.splice(i - n, 1);
                        n++;
                    } else if(args[i].substr(0, 1) == '-') {
                        short_args[args[i].substr(1).replace(/=(.*)$/, '')] = (args[i].indexOf('=') != -1) ? args[i].substr(args[i].indexOf('=') + 1) : true;
                        f_args.splice(i - n, 1);
                        n++;
                    }

                args = f_args;

                if(sys_cmd = (App.readFile('/system/cmd/' + cmd_name + '.js'))) {

                    def('sync', true);
                    def('disableInvite', disableInvite);

                    createCallback(sys_cmd, long_args['help'])(con, 0, args, short_args, long_args, data);

                    Core.vars.set('last_cmd_sync', def('sync'));

                    if(def('sync') && !disableInvite)
                        con.invite();

                } else {
                    var app = Core.applications.get(cmd_name);

                    def('sync', true);

                    if (app && app.commandLine) {

                        def('nextcb', createCallback(app.commandLine, long_args['help']));

                        if (!app.isSystem) {
                            def('nextcon', con);
                            def('nextargs', args);
                            def('nextshortargs', short_args);
                            def('nextlongargs', long_args);
                            def('disableInvite', disableInvite);

                            Dialogs.confirm('Command line interpreter', 'The command you will run will be use the current application rights. Continue uniquely if you\'re sure about what you are doing.', function () {
                                def('sync', true);

                                def('nextcb')(def('nextcon'), 0, def('nextargs'), def('nextshortargs'), def('nextlongargs'), def('nextdata'));

                                Core.vars.set('last_cmd_sync', sync);

                                if (def('sync') && !def('disableInvite'))
                                    def('nextcon').invite();

                                if (def('sync'))
                                    Core.vars.set('last_cmd_resolve', sync);

                            });
                        } else {
                            var sync = true;
                            def('sync', true);

                            def('nextcb')(con, 0, args, short_args, long_args, data);

                            if(sync && def('sync') && !disableInvite)
                                con.invite();

                            if(sync && def('sync'))
                                Core.vars.set('last_cmd_sync', sync);
                        }
                    } else {
                        con.error('Command not found : ' + cmd_name);

                        if(!disableInvite)
                            con.invite();
                    }
                }
            } else {
                native[cmd_name](args, con);

                Core.vars.set('last_cmd_sync', true);
                Core.vars.set('last_cmd_resolve', true);

                if(!disableInvite)
                    con.invite();
            }


		};

        /**
         * View a command help from it help's object
         * @param {Console} con
         * @param {object} help
         */

		this.viewObjHelp = function(con, help) {

            con.write('<br /><strong>Description<br />===========</strong><br />');
            con.text('   ' + help.description + '\n');
            con.write('<strong>Synopsis<br />========</strong>');

            if(help.main_argument)
                con.write('<br />&nbsp;&nbsp;&nbsp;&nbsp;[...]' + (help.main_argument_optional ? ' [Optional]' : '') + '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + help.main_argument.escapeHTML());

            for (var i in help.parameters) {
                var arg = help.parameters[i];
                con.write('<br />&nbsp;&nbsp;&nbsp;&nbsp;<strong>' + (arg.short ? '-' + arg.short + (arg.has_value ? '=...' : '') : '') + ((arg.short && arg.long) ? ', ' : '') + (arg.long ? '--' + arg.long + (arg.has_value ? '=...' : '') : '') + (arg.optional ? ' [Optional]' : '') + '</strong><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + arg.description.escapeHTML());
            }

		};

	};

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
	
	};

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
			//styles.push('../../external-tools/font-awesome.css');

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
	};

	/**
	  * The Core.frames constructor
	  * @constructor
	  */

	this.frames = new function() {

		/**
		  * Format a frame
		  * @param {string} frame Frame content
		  * @returns {string} Formatted frame content
		  */

		this.format = function(frame) {

			var vars = Core.vars.all();

			for(var i in vars)
				frame = frame.replace(new RegExp('{{ ' + i + ' }}', 'gi'), vars[i]);

			return frame;

		};

	}

};

Object.freeze(Core);

Object.freeze(Core.crypto);
Object.freeze(Core.users);
Object.freeze(Core.applications);
Object.freeze(Core.libraries);
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
window.libraries    = Core.libraries;

var request = require(Core.path.root + '/external-tools/request');

var APP_NAME        = (typeof(app_name) === 'undefined') ? 'System' : app_name;
Core.vars.set('APP_NAME', APP_NAME);

process.on('uncaughtException', function(e) {

	console.log('[process catch error] ', e);

	if(!e.stack.contains('/system/app-launcher/launcher.html'))
		Core.fatalError('An error has occured', e);

});

window.onerror = function(message, file, line, col, error) {

	if(error && error.stack && error.stack.contains('/system/app-launcher/launcher.html'))
		if(typeof(appLauncher) !== 'undefined' && typeof(sys) !== 'undefined' && sys.appError)
			sys.appError(message, file, line, col, error, window);
	else
		console.error(message + "\n\n" + file + ':' + line + ',' + col + "\n\n" + error);

}

process.setMaxListeners(35);
