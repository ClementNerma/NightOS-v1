
/**
  * OS informations
  */

var System = {

	name: 'NightOS',
	version: '0.2',
	type: 'alpha',
	developpers: ['Clement Nerma'],
	thanksTo: ['motezazer', 'EPonix', 'Fire4764'],
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
		INVALID_USER_RIGHTS: 'This user has invalid rights',

		NATIVE: {
            "ENOENT": {
                "errno": 34,
                "code": "ENOENT",
                "description": "no such file or directory"
            },
            "UNKNOWN": {
                "errno": -1,
                "code": "UNKNOWN",
                "description": "unknown error"
            },
            "OK": {
                "errno": 0,
                "code": "OK",
                "description": "success"
            },
            "EOF": {
                "errno": 1,
                "code": "EOF",
                "description": "end of file"
            },
            "EADDRINFO": {
                "errno": 2,
                "code": "EADDRINFO",
                "description": "getaddrinfo error"
            },
            "EACCES": {
                "errno": 3,
                "code": "EACCES",
                "description": "permission denied"
            },
            "EAGAIN": {
                "errno": 4,
                "code": "EAGAIN",
                "description": "resource temporarily unavailable"
            },
            "EADDRINUSE": {
                "errno": 5,
                "code": "EADDRINUSE",
                "description": "address already in use"
            },
            "EADDRNOTAVAIL": {
                "errno": 6,
                "code": "EADDRNOTAVAIL",
                "description": "address not available"
            },
            "EAFNOSUPPORT": {
                "errno": 7,
                "code": "EAFNOSUPPORT",
                "description": "address family not supported"
            },
            "EALREADY": {
                "errno": 8,
                "code": "EALREADY",
                "description": "connection already in progress"
            },
            "EBADF": {
                "errno": 9,
                "code": "EBADF",
                "description": "bad file descriptor"
            },
            "EBUSY": {
                "errno": 10,
                "code": "EBUSY",
                "description": "resource busy or locked"
            },
            "ECONNABORTED": {
                "errno": 11,
                "code": "ECONNABORTED",
                "description": "software caused connection abort"
            },
            "ECONNREFUSED": {
                "errno": 12,
                "code": "ECONNREFUSED",
                "description": "connection refused"
            },
            "ECONNRESET": {
                "errno": 13,
                "code": "ECONNRESET",
                "description": "connection reset by peer"
            },
            "EDESTADDRREQ": {
                "errno": 14,
                "code": "EDESTADDRREQ",
                "description": "destination address required"
            },
            "EFAULT": {
                "errno": 15,
                "code": "EFAULT",
                "description": "bad address in system call argument"
            },
            "EHOSTUNREACH": {
                "errno": 16,
                "code": "EHOSTUNREACH",
                "description": "host is unreachable"
            },
            "EINTR": {
                "errno": 17,
                "code": "EINTR",
                "description": "interrupted system call"
            },
            "EINVAL": {
                "errno": 18,
                "code": "EINVAL",
                "description": "invalid argument"
            },
            "EISCONN": {
                "errno": 19,
                "code": "EISCONN",
                "description": "socket is already connected"
            },
            "EMFILE": {
                "errno": 20,
                "code": "EMFILE",
                "description": "too many open files"
            },
            "EMSGSIZE": {
                "errno": 21,
                "code": "EMSGSIZE",
                "description": "message too long"
            },
            "ENETDOWN": {
                "errno": 22,
                "code": "ENETDOWN",
                "description": "network is down"
            },
            "ENETUNREACH": {
                "errno": 23,
                "code": "ENETUNREACH",
                "description": "network is unreachable"
            },
            "ENFILE": {
                "errno": 24,
                "code": "ENFILE",
                "description": "file table overflow"
            },
            "ENOBUFS": {
                "errno": 25,
                "code": "ENOBUFS",
                "description": "no buffer space available"
            },
            "ENOMEM": {
                "errno": 26,
                "code": "ENOMEM",
                "description": "not enough memory"
            },
            "ENOTDIR": {
                "errno": 27,
                "code": "ENOTDIR",
                "description": "not a directory"
            },
            "EISDIR": {
                "errno": 28,
                "code": "EISDIR",
                "description": "illegal operation on a directory"
            },
            "ENONET": {
                "errno": 29,
                "code": "ENONET",
                "description": "machine is not on the network"
            },
            "ENOTCONN": {
                "errno": 31,
                "code": "ENOTCONN",
                "description": "socket is not connected"
            },
            "ENOTSOCK": {
                "errno": 32,
                "code": "ENOTSOCK",
                "description": "socket operation on non-socket"
            },
            "ENOTSUP": {
                "errno": 33,
                "code": "ENOTSUP",
                "description": "operation not supported on socket"
            },
            "ENOSYS": {
                "errno": 35,
                "code": "ENOSYS",
                "description": "function not implemented"
            },
            "EPIPE": {
                "errno": 36,
                "code": "EPIPE",
                "description": "broken pipe"
            },
            "EPROTO": {
                "errno": 37,
                "code": "EPROTO",
                "description": "protocol error"
            },
            "EPROTONOSUPPORT": {
                "errno": 38,
                "code": "EPROTONOSUPPORT",
                "description": "protocol not supported"
            },
            "EPROTOTYPE": {
                "errno": 39,
                "code": "EPROTOTYPE",
                "description": "protocol wrong type for socket"
            },
            "ETIMEDOUT": {
                "errno": 40,
                "code": "ETIMEDOUT",
                "description": "connection timed out"
            },
            "ECHARSET": {
                "errno": 41,
                "code": "ECHARSET",
                "description": "invalid Unicode character"
            },
            "EAIFAMNOSUPPORT": {
                "errno": 42,
                "code": "EAIFAMNOSUPPORT",
                "description": "address family for hostname not supported"
            },
            "EAISERVICE": {
                "errno": 44,
                "code": "EAISERVICE",
                "description": "servname not supported for ai_socktype"
            },
            "EAISOCKTYPE": {
                "errno": 45,
                "code": "EAISOCKTYPE",
                "description": "ai_socktype not supported"
            },
            "ESHUTDOWN": {
                "errno": 46,
                "code": "ESHUTDOWN",
                "description": "cannot send after transport endpoint shutdown"
            },
            "EEXIST": {
                "errno": 47,
                "code": "EEXIST",
                "description": "file already exists"
            },
            "ESRCH": {
                "errno": 48,
                "code": "ESRCH",
                "description": "no such process"
            },
            "ENAMETOOLONG": {
                "errno": 49,
                "code": "ENAMETOOLONG",
                "description": "name too long"
            },
            "EPERM": {
                "errno": 50,
                "code": "EPERM",
                "description": "operation not permitted"
            },
            "ELOOP": {
                "errno": 51,
                "code": "ELOOP",
                "description": "too many symbolic links encountered"
            },
            "EXDEV": {
                "errno": 52,
                "code": "EXDEV",
                "description": "cross-device link not permitted"
            },
            "ENOTEMPTY": {
                "errno": 53,
                "code": "ENOTEMPTY",
                "description": "directory not empty"
            },
            "ENOSPC": {
                "errno": 54,
                "code": "ENOSPC",
                "description": "no space left on device"
            },
            "EIO": {
                "errno": 55,
                "code": "EIO",
                "description": "i/o error"
            },
            "EROFS": {
                "errno": 56,
                "code": "EROFS",
                "description": "read-only file system"
            },
            "ENODEV": {
                "errno": 57,
                "code": "ENODEV",
                "description": "no such device"
            },
            "ESPIPE": {
                "errno": 58,
                "code": "ESPIPE",
                "description": "invalid seek"
            },
            "ECANCELED": {
                "errno": 59,
                "code": "ECANCELED",
                "description": "operation canceled"
            }
        }

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
