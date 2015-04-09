
var AES = window.AES = new function() {
	
	var _r = require;
	
	this.encrypt = function(decrypted, key, iv, inputEncoding, outputEncoding) {
		/*key and iv must be either binary encoded strings (deprecated) or buffers
		inputEncoding must be either 'ascii', 'utf8', 'binary' or undefined
		outputEncoding must be either 'base64', 'hex', 'binary' or undefined
		when they are undefined, a buffer is expected */
		
		var crypto = _r('crypto');
		
		var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
		
		var encrypted = cipher.update(decrypted, inputEncoding, outputEncoding);
		
		cipher.final();
		
		return encrypted;
	};

	this.decrypt = function(encrypted, key, iv, inputEncoding, outputEncoding) {
		/*key and iv must be either binary encoded strings (deprecated) or buffers
		inputEncoding must be either 'ascii', 'utf8', 'binary' or undefined
		outputEncoding must be either 'base64', 'hex', 'binary' or undefined
		when they are undefined, a buffer is expected */
		
		var crypto = _r('crypto');
		
		var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
		
		var decrypted = decipher.update(decrypted, inputEncoding, outputEncoding);
		
		decipher.final();
		
		return decrypted;
	};

	this.generateKey = function(length) {
		/* length is in bits
		This function returns a buffer */
		
		var crypto = _r('crypto');
		
		if(!length) length = 256;

		try {
			var key = crypto.randomBytes(length);
		}
		catch (e) {
			return false;
		}

		return key;
	};
	
	this.generateIV = function(length) {
		/* length is in bits
		This function returns a buffer */
		
		var crypto = _r('crypto');
		
		if(!length) length = 128;

		try {
			var IV = crypto.randomBytes(length);
		}
		catch (e) {
			return false;
		}

		return IV;
	};
}

Object.freeze(AES);
