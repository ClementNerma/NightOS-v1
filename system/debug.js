
var Debug = new function() {

	this.log = function(msg) {
		console.log(msg);
	}

	this.error = function(err) {
		console.error(err);
	}

	this.warn = function(msg) {
		console.warn(msg);
	}

	this.info = function(msg) {
		console.info(msg);
	}

}