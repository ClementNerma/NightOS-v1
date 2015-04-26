
var Dialogs = new function() {

	var validate = null;

	/**
	  * Open a dialog box
	  * @param {string} title Dialog title
	  * @param {string} content Dialog content
	  * @param {Object} buttons Dialog buttons
	  */

	this.dialog = function(title, content, buttons) {

		$('.ui-dialog, #ui-dialog-shadow').remove();

		var dialog_title = $(document.createElement('div')).addClass('ui-dialog-title').html(title);
		var dialog_content = $(document.createElement('div')).addClass('ui-dialog-content').html(content);
		var dialog_buttons = $(document.createElement('div')).addClass('ui-dialog-buttons');
		var dialog_shadow = $(document.createElement('div')).attr('id', 'ui-dialog-shadow');

		for(var i in buttons)
			dialog_buttons.append($(document.createElement('button')).html(i).click(buttons[i]));

		var dialog = $(document.createElement('div')).addClass('ui-dialog');

		dialog.append(dialog_title).append(dialog_content).append(dialog_buttons).hide();

		if(!$('#ui-dialog-shadow').length)
			$('body').append(dialog_shadow).append(dialog);

		dialog.fadeIn(500);

		UI.movable(dialog_title);

		dialog_buttons.find('button:first').focus();

	}

	/**
	  * Close the dialog box
	  */

	this.close = function(elem) {

		if(typeof(elem) === 'undefined')
			var elem = Core.backtrace.getCaller().arguments[0];

		if(elem.toElement)
			var elem = elem.toElement.parentNode.parentNode;

		$(elem).fadeOut(500, function() {
			$('#ui-dialog-shadow').remove();
			$(this).remove();
		});
	
	}

	/*
	 * Display an alert dialog box
	 * @param {string} title Dialog title
	 * @param {string} content Dialog content
	 * @param {function} callback Dialog callback
	 */

	this.alert = function(title, content, callback) {
		if(typeof(callback) !== 'function') callback = function() {};

		Dialogs.dialog(title, content, {Close: this.close.fusion(callback)});
	}

	/*
	 * Display an info dialog box
	 * @param {string} title Dialog title
	 * @param {string} content Dialog content
	 * @param {function} callback Dialog callback
	 */

	this.info = function(title, content, callback) {
		if(typeof(callback) !== 'function') callback = function() {};

		Dialogs.dialog(title, '<span class="ui-dialog-left-image"><img width="64" height="64" src="data:image/png;base64,' + Registry.read('dialogs/info/icon') + '" /></span><span class="ui-dialog-right-content">'+ content + '</span>', {Close: this.close.fusion(callback)});
	}

	/*
	 * Display a warning dialog box
	 * @param {string} title Dialog title
	 * @param {string} content Dialog content
	 * @param {function} callback Dialog callback
	 */

	this.warning = function(title, content, callback) {
		if(typeof(callback) !== 'function') callback = function() {};

		Dialogs.dialog(title, '<span class="ui-dialog-left-image"><img width="64" height="64" src="data:image/png;base64,' + Registry.read('dialogs/warning/icon') + '" /></span><span class="ui-dialog-right-content">'+ content + '</span>', {Close: this.close.fusion(callback)});
	}

	/*
	 * Display an error dialog box
	 * @param {string} title Dialog title
	 * @param {string} content Dialog content
	 * @param {function} callback Dialog callback
	 */

	this.error = function(title, content, callback) {
		if(typeof(callback) !== 'function') callback = function() {};

		Dialogs.dialog(title, '<span class="ui-dialog-left-image"><img width="64" height="64" src="data:image/png;base64,' + Registry.read('dialogs/error/icon') + '" /></span><span class="ui-dialog-right-content">'+ content + '</span>', {Close: this.close.fusion(callback)});
	}

	/*
	 * Display a confirmation dialog box
	 * @param {string} title Dialog title
	 * @param {string} content Dialog content
	 * @param {function} yes Dialog callback on yes
	 * @param {function} no Dialog callback on no
	 */

	this.confirm = function(title, content, yes, no) {
		if(typeof(yes) !== 'function') yes = function() {};
		if(typeof(no) !== 'function') no = function() {};

		Dialogs.dialog(title, '<span class="ui-dialog-left-image"><img width="64" height="64" src="data:image/png;base64,' + Registry.read('dialogs/confirm/icon') + '" /></span><span class="ui-dialog-right-content">'+ content + '</span>', {Yes: this.close.fusion(yes), No: this.close.fusion(no)});
	}

	/*
	 * Display an input dialog box
	 * @param {string} title Dialog title
	 * @param {string} content Dialog content
	 * @param {string} type Input type (number|text|...)
	 * @param {function} callback Dialog callback
	 */

	this.input = function(title, content, type, callback) {
		if(typeof(callback) !== 'function') callback = function() {};

		validate = callback.fusion(this.close);

		Dialogs.dialog(title, '<span class="ui-dialog-left-image"><img width="64" height="64" src="data:image/png;base64,' + Registry.read('dialogs/input/icon') + '" /></span><span class="ui-dialog-right-content">'+ content + '</span><br /><br /><input type="' + type + '" />', {OK: function() {
			Dialogs.callback()(this.parentNode.parentNode.getElementsByTagName('input')[0].value, this.parentNode.parentNode.getElementsByTagName('input')[0]);
		}});
	}

	/**
	  * Get callback function (for input dialogs)
	  * @returns {function} callback
	  */

	this.callback = function() {
		return validate;
	}

}

Object.freeze(Dialogs);

window.alert = function(content) {
	Dialogs.alert('[Window alert]', content, function(){});
}

window.confirm = function(content) {
	Dialogs.confirm('[Window alert]', content, function(){});
}
