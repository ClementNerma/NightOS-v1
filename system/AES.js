
var AES = window.AES = {
	encrypt: function(decrypted, key, iv, inputEncoding, outputEncoding) {
		/*key and iv must be either binary encoded strings (deprecated) or buffers
		inputEncoding must be either 'ascii', 'utf8', 'binary' or undefined
		outputEncoding must be either 'base64', 'hex', 'binary' or undefined
		when they are undefined, a buffer is expected */
		
		require('crypto');
		
		var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
		
		var encrypted = cipher.update(decrypted, inputEncoding, outputEncoding);
		
		cipher.final();
		
		return encrypted;
	},

	decrypt: function(encrypted, key, iv, inputEncoding, outputEncoding) {
		/*key and iv must be either binary encoded strings (deprecated) or buffers
		inputEncoding must be either 'ascii', 'utf8', 'binary' or undefined
		outputEncoding must be either 'base64', 'hex', 'binary' or undefined
		when they are undefined, a buffer is expected */
		
		require('crypto');
		
		var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
		
		var decrypted = decipher.update(decrypted, inputEncoding, outputEncoding);
		
		decipher.final();
		
		return decrypted;
	},

	generateKey: function(length) {
		/* length is in bits
		This function returns a buffer */
		
		require('crypto');
		
		if(!length) length = 256;

		try {
			var key = crypto.randomBytes(length);
		}
		catch (e) {
			return false;
		}

		return key;
	}
	
	generateIV: function(length) {
		/* length is in bits
		This function returns a buffer */
		
		require('crypto');
		
		if(!length) length = 128;

		try {
			var IV = crypto.randomBytes(length);
		}
		catch (e) {
			return false;
		}

		return IV;
	}
}

Object.freeze(AES);
