
var AES = {
	encrypt: function(decrypted, key) {
		return CryptoJS.AES.encrypt(decrypted, key);
	},

	decrypt: function(decrypted, key, charset) {
		return CryptoJS.AES.decrypt(decrypted, key).toString(CryptoJS.enc[charset]);
	},

	generateKey: function(length) {
		if(!length) length = 40;

		var key = '';
		var lt = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var nb = '0123456789';

		for(var i = 0; i < length; i++)
			key += (Math.floor(Math.random() * 2)) ? lt.substr(Math.floor(Math.random() * 26), 1) : nb.substr(Math.floor(Math.random() * 10), 1);

		return key;
	}
}

Object.freeze(AES);
