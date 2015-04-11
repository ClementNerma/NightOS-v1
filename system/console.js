
var Consoles = new function() {

	var _nb  = 0;
	var _con = {};

	this.inc = function() { return _nb++ + 1; }

	this.add = function(con, id) { _con[id] = con; }

	this.get = function(id) { return _con[id]; }

}

/**
  * Create a console (terminal)
  * @param {Object} context Terminal (div node element)
  * @param {Boolean} setDefaultInvite
  */

var Console = function(context, setDefaultInvite, readOnly) {

	var _console  = $(context)[0];
	var _prompt   = '$' + String.fromCharCode(160);
	var _id       = Consoles.inc();
	var _history  = [];
	var _start    = null;
	var _invite   = false;
	var _readOnly = false;
	var _h        = false;
	var _events   = {
		write: function() {},
		warn: function() {},
		error: function() {},
		clear: function() {},
		'no-invite': function() {},
		invite: function() {}
	};

	Consoles.add(this, _id);

	$(_console).attr('con-id', _id).css({
		color: 'white',
		backgroundColor: 'black',
		overflow: 'auto'
	}).keydown(function(e) {
		//$(this).find('.cmd:last').focus(); // doesn't work
		return Consoles.get(this.getAttribute('con-id')).keydown(e);
	});

	this.keydown = function(e) {

		if(!_invite)
			return false;

		if(e.keyCode === 38) {
			if(_h)
				_h -= 1;
			_console.lastChild.innerText = _history[_h];
			return false;
		}

		_h = _history.length;

		if(e.keyCode === 13) {
			var cmd = _console.lastChild.innerText;
			_console.lastChild.setAttribute('contenteditable', false);

			if(!cmd) {
				this.noinvite();
				this.invite();
				return false;
			}

			_history.push(cmd);
			_h = _history.length;
			Core.commandLine.exec(cmd, this);

			return false;

		}

	}

	this.write = function(text, noJump) {

		_console.innerHTML += (noJump ? '' : '<br />') + text;
		this.on('write')(text);

	}

	this.text = function(text, noJump) {

		_console.innerHTML += (noJump ? '' : '<br />') + text.escapeHTML().replace(/ /g, String.fromCharCode(160)).replace(/\n/g, '<br/>');
		this.on('write')(text);

	}

	this.warn = function(text, noJump) {

		_console.innerHTML += (noJump ? '' : '<br />') + '<span style="color: yellow;">' + text + '</span>';
		this.on('warn')(text);

	}

	this.error = function(text, noJump) {

		_console.innerHTML += (noJump ? '' : '<br />') + '<span style="color: red;">' + text + '</span>';
		this.on('warn')(text);
		return false;

	}

	this.clear = function(text) {

		_console.innerHTML = '';
		this.on('clear')();

	}

	this.noinvite = function() {

		_invite = false;
		this.on('no-invite')();

	}

	this.invite = function() {

		if(!_readOnly) {
			_invite = true;
			_console.innerHTML += '<br /><br /><span style="color: #50E8A0;">' + Core.path.chdir().escapeHTML() + '</span><br />' + _prompt + '<div class="cmd" contenteditable="true"></div>';
			_console.lastChild.style.display = 'inline-block';
			_console.lastChild.style.outline = 'none';
			_console.lastChild.focus();
		}

		this.on('invite')(_readOnly);

	}

	this.on = function(name, callback) {

		if(typeof(callback) === 'function')
		 	_events[name] = callback;

		return _events[name];

	}

	this.setReadOnly = function(bool) {

		_readOnly = bool;

	}

	this.readOnly = function() {

		return _readOnly;

	}

	if(setDefaultInvite)
		this.invite();

	_readOnly = readOnly;

}

Object.freeze(Consoles);
Object.freeze(Console);
