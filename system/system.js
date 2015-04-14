
/**
  * OS informations
  */

var System = {

	name: 'NightOS',
	version: '0.1',
	type: 'alpha',
	developpers: ['Clement Nerma'],
	thanksTo: ['motezazer'],
	rooted: false,

	defaultCharset: 'utf8',

	FileSystem: {

		defaultBufferLength: 64 * 1024,
		minBufferLength: 1024,
		maxBufferLength: 10 * 1024 * 1024

	},

	errors: {

		NOPERM: 'Unable to access to the specified ressource because you don\'t have enough right to access that',
		NO_CERTIFICATE: 'You must use a certificate and pass by the application instance to use this function',
		NO_APP_CALLER: 'You must pass by the application instance to use this function',
		BUFFER_TOO_SMALL: 'The filesystem buffer is too small',
		BUFFER_TOO_LARGE: 'The filesystem buffer is too large',
		INVALID_USER_RIGHTS: 'This user has invalid rights'

	},

	requireRights: function(path, isRead) {

		if(isRead) {
			var rf = Registry.read('system/storage/readable');

			for(var i in rf)
				if(Core.path.included(path, rf[i]))
					return 1;
		}

		if(Core.path.included(path, '/users/$USER$/appdata/$APP_NAME$/*'))
			return 1;

		if(Core.path.included(path, '/users/$USER$/*'))
			return 2;

		if(!Core.path.included(path, '/system/*') && !Core.path.included(path, '/node-webkit/*') && !Core.path.included(path, '/external-tools/*') && !Core.path.included(path, '/apps/*') && !Core.path.included(path, '/libs/*'))
			return 3;

		return 4;

	}

};

Object.freeze(System);
Object.freeze(System.FileSystem);
Object.freeze(System.errors);
Object.freeze(System.requireRights);
