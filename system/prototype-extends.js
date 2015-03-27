
function htmlspecialchars(text) {

	return text
		   .replace(/&/g, '&amp;')
		   .replace(/</g, '&lt;')
		   .replace(/>/g, '&gt;')
		   .replace(/ /g, '&nbsp;')

}

function test(func, callbackOnError) {

	try { func(); }
	catch(e) { callbackOnError(e); }

}

/**
  * salut => "salut" / {1:"lol"} => '{1:"lol"}'
  */

function val2str(value) {
	
	if(typeof(value) === 'string')
		return '"' + value.toString().replace(/\\/g, '\\\\').replace(/\r|\n|\r\n/g, '\\r\\n').replace(/"/g, '\\"') + '"';

	if(typeof(value) === 'number')
		return value;

	if(typeof(value) === 'function')
		return value.toString();

	if(typeof(value) === 'object') {

		try {
			return JSON.stringify(value);
		}

		catch(e) {}

	}
}

/**
  * Delete non-base 64 chars
  * @return {string}
  */

String.prototype.toBase64 = function() {
	return this.toString().replace(/([^a-zA-Z0-9]*)/g, '');
}

/**
  * Delete HTML tags
  * @return {string}
  */

String.prototype.toPlainText = function() {
	return this.toString().replace(/<(|\/)(.*?)>/g, '').replace(/</g, '').replace(/>/g, '');
}

/**
  * Escape HTML chars
  * @return {string}
*/

String.prototype.escapeHTML = function() {
	var map = {
		'&':'&amp;',
		'<':'&lt;',
		'>':'&gt;',
		'"':'&quote;',
		"'":'&#039;'
	};

	return this.toString().replace(/[&<>"']/g, function(m) {
		return map[m];
	});
}

/**
  * Return true if the string contains the specified string
  * @param {string} str
  * @return {Boolean}
  */

String.prototype.contains = function(str) {
	return (this.toString().split(str).length > 1);
}

/**
  * Return true if the string contains one of the specified strings
  * @param {array} arr The string arrays
  * @return {Boolean}
  */

String.prototype.containsOne = function(arr) {
	if(typeof(arr) !== 'Array' && typeof(arr) !== 'Object')
		return false;

	for(var i in arr)
		if(this.toString().split(arr[i]).length > 1)
			return true;

	return false;
}

/**
  * Explode the string to blocks
  * @param {number} size The size of each block
  * @return {array} Blocks
  */

String.prototype.blocks = function(size) {
	if(typeof(size) !== 'number' || !size)
		return false;

	var i = 0;
	var b = [];

	while(i < this.toString().length) {
		b.push(this.toString().substr(i, size));
		i += size;
	}

	return b;
}

String.prototype.formatToRegex = function() {

	var toFormat = '\\^$.*?[]{}()';
	var formated = this.toString();

	for(var i in toFormat)
		formated = formated.replace(new RegExp('\\' + toFormat[i], 'g'), '\\' + toFormat[i]);

	return formated;

}

Function.prototype.args = function() {
	var d = this.toString().match(/^function( +)\((.*?)\)( *)\{(.|\n|\r)*\}$/m)[2].split(',');
	
	if(d[0] === "")
		d.splice(0, 1);

	return d;
}

Function.prototype.toSource = function() {
	return this.toString().replace(/^function( +)\((.*?)\)( *)\{/m, '').replace(/\}$/m, '');
}

/**
  * Add a function to the end of the function
  * @param {function} end The function to add
  * @return {function} The fusionned functions
  */

Function.prototype.fusion = function(end) {

	var args = this.args();
	var src = this.toSource() + "\n" + end.toSource();
	
	return new Function(args, src);

}
