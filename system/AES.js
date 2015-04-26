/**
 * AES engine
 * @type {AES}
 * @constructor
 */

var AES = new function() {
	
	var _r = require;

    /**
     * Encrypt a text with AES algorithm
     * @param {string} decrypted The text to crypt
     * @param {string} key The 256-bytes length key
     * @param {number} iv The initialisation vector
     * @param {string} inputEncoding The input encoding format (hex, binary...)
     * @param {string} outputEncoding The output encoding format (hex, binary...)
     * @returns {string}
     */
	
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

    /**
     * Decrypt an encrypted message with AES algorithm
     * @param {string} encrypted The encrypted message
     * @param {string} key The 256-bytes length key
     * @param {number} iv The initialisation vector
     * @param {string} inputEncoding The input encoding format (hex, binary...)
     * @param {string} outputEncoding The output encoding format (hex, binary...)
     * @returns {string}
     */

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

    /**
     * Generate an AES key (default : 256-bytes)
     * @param {number} [length]
     * @returns {boolean|Buffer}
     */

	this.generateKey = function(length) {
		/* length is in bytes
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

    /**
     * Generate an AES initialization vector (default : 128-bytes)
     * @param {number} [length]
     * @returns {boolean|Buffer}
     */
	
	this.generateIV = function(length) {
		/* length is in bytes
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
