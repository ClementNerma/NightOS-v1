
/**
 * Certificate constructor
 * @constructor
 * @param {string} ID The application ID (specified in the application package)
 * @param {Number} rights The application privileges level (specified in the application package)
 * @param {Object} permissions The application permissions (storage & access) (specified in the application package)
 */

var Certificate = function(ID, rights, permissions, access) {

	this.ID = ID;
	this.rights = rights;
	this.access = access;
	this.permissions = {};

	for(var i in permissions) {
		this.permissions[i] = {};

		for(var j in permissions[i])
			this.permissions[i][permissions[i][j]] = true;
	}
	
}

/*
 * Returns the application ID (specified in the application package)
 * @returns {string}
 */

Certificate.prototype.getID = function() {

	return this.ID;

}

/**
 * Returns the application permissions (specified in the application package)
 * @returns {Object}
 */

Certificate.prototype.getPermissions = function() {

	return this.permissions;

}

/**
 * Returns the application privileges level (specified in the application package)
 * @returns {Number}
 */

Certificate.prototype.getRights = function() {

	return this.rights;

}

/**
 * Know if the application has a permission (Example : ['storage', 'filesWrite'])
 * @param {Array} permission Example : for storage files_write, give ['storage', 'files_write']
 * @returns {Boolean}
 */

Certificate.prototype.hasPermission = function(name) {

	if(!name || typeof(name) !== 'object' || name.length !== 2)
		throw new Error('[Certificate debug] Invalid parameters');

	if(!this.permissions[name[0]])
		return false;

	if(!this.permissions[name[0]][name[1]] && !this.permissions[name[0]]['*'])
		return false;

	return true;

}

/**
 * Kow if the application has access to a specified path (NightPath format)
 * @param {string} path
 * @returns {Boolean}
 */

Certificate.prototype.hasAccess = function(path, isRead) {

	if(System.requireRights(path, isRead) > this.rights)
		return false;

	for(var i in this.access)
		if(!Core.path.included(path, this.access[i]))
			return false;

	return true;

}

Object.freeze(Certificate.prototype);
