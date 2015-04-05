
var Debug = new function() {

	var _logs   = [];
	var _warns  = [];
	var _errors = [];
	var _infos  = [];

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

	}

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

	}

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

	}

	this.logs = function() { return _logs; }
	this.warns = function() { return _warns; }
	this.errors = function() { return _errors; }
	this.infos = function() { return _infos; }

}