
var Debug = new function() {

	var _logs   = [];
	var _warns  = [];
	var _errors = [];
	var _infos  = [];

	/**
	 * Log a message
     * @param {string} msg
	 * @type {Function}
	 */

	this.log = this.write = function(msg) {

		var args = [];

		for(var i in arguments)
			args.push(arguments[i]);

		args.splice(0, 1);

		_logs.push({
			time: new Date().getTime(),
			msg: msg,
			args: args
		});

		console.log(msg);

		return true;

	}

    /**
     * Display a warning message
     * @param {string} msg
     * @type {Function}
     */

	this.warn = function(msg) {

		var args = [];

		for(var i in arguments)
			args.push(arguments[i]);

		args.splice(0, 1);

		_warns.push({
			time: new Date().getTime(),
			msg: msg,
			args: args
		});

		console.warn(msg);

	}

    /**
     * Display an error message
     * @param {string} msg
     * @type {Function}
     */

	this.error = function(msg) {

		var args = [];

		for(var i in arguments)
			args.push(arguments[i]);

		args.splice(0, 1);

		_errors.push({
			time: new Date().getTime(),
			msg: msg,
			args: args
		});

		console.error(msg);

		return false;

	}

    /**
     * Display an info message
     * @param {string} msg
     * @type {Function}
     */

	this.info = function(msg) {

		var args = [];

		for(var i in arguments)
			args.push(arguments[i]);

		args.splice(0, 1);

		_infos.push({
			time: new Date().getTime(),
			msg: msg,
			args: args
		});

		console.info(msg);

		return true;

	}

    /**
     * Get all logs messages
     * @returns {Array}
     */

    this.logs = function() {
        return _logs;
    }

    /**
     * Get all warning messages
     * @returns {Array}
     */

    this.warns = function() {
        return _warns;
    }

    /**
     * Get all errors messages
     * @returns {Array}
     */

    this.errors = function() {
        return _errors;
    }

    /**
     * Get all infos messages
     * @returns {Array}
     */

    this.infos = function() {
        return _infos;
    }

}
