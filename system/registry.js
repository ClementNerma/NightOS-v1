
/**
  * Registry constructor
  * @constructor
  */

// applications which use registry must have admin rights !

var Registry = new function() {

	var _reg = null;

	/**
	  * Load the registry
	  */

	this.load = function() {

		try {
			_reg = JSON.parse(fs.readFileSync(Core.path.root + '/system/data/registry.reg', 'utf8'));
		}

		catch(e) {
			throw new Error('Cannot load registry [system/data/registry.reg]. Please verify that this directory is readable.');
		}

	}

	this.load();

	/**
	  * Return a registry entry
	  * @param {string} path Registry path
	  * @return {string|Boolean|Array|Object} Registry entry
	  */

	this.read = function(path) {

		try {
			return eval('_reg["' + path.replace(/[^a-zA-Z0-9\/\-_]/g, '').replace(/\//g, '"]["') + '"]');
		}

		catch(e) {
			return false;
		}
	}

	/**
	  * Write a registry entry
	  * @param {string} path Registry path
	  * @param {string|Boolean|Array|Object} value Entry value
	  * @return {Boolean} false if failed, true if success
	  */

	this.write = function(path, value) {

		if(App.getCertificate().getRights() < 4)
			throw new Error('Only system applications are allowed to write the system registry.')

		try {
			eval('_reg["' + path.replace(/[^a-zA-Z0-9\/\-_]/g, '').replace(/\//g, '"]["') + '"] = ' + val2str(value));
			fs.writeFileSync(Core.path.root + '/system/data/registry.reg', JSON.stringify(_reg), 'utf8');
			return true;
		}

		catch(e) {
			return false;
		}

	}

}

Object.freeze(Registry);
