
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
        success: function() {},
		clear: function() {},
		'no-invite': function() {},
		invite: function() {}
	};

	Consoles.add(this, _id);

	$(_console).attr('con-id', _id).attr('console-container', 'true')
        .keydown(function(e) {
	    	return Consoles.get(this.getAttribute('con-id')).keydown(e);
	    })
        .click(function() {
            var s = window.getSelection(),
                r = document.createRange();
            var p = this.querySelector('div[contenteditable="true"]');
            r.selectNodeContents(p);
            s.removeAllRanges();
            s.addRange(r);
        });

	/**
	 * Internal keydown event when the console textarea is writed
	 * @param e
	 * @returns {boolean}
	 */

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

	/**
	 * Run a command in the console
	 * @param {string} cmd
	 */

	this.run = function(code) {
		Core.commandLine.exec(code, this);
	}

    /**
     * Write an HTML message in the console
     * @param {string} text
     * @param {boolean} [noJump] Do not jump to the next line
     */

	this.write = function(text, noJump) {

		_console.innerHTML += (noJump ? '' : '<br />') + text;
		this.on('write')(text);

	}

    /**
     * Write a text message (without style) in the console
     * @param {string} text
     * @param {boolean} [noJump] Do not jump to the next line
     */

	this.text = function(text, noJump) {

		_console.innerHTML += (noJump ? '' : '<br />') + text.escapeHTML().replace(/ /g, String.fromCharCode(160)).replace(/\\n|\\r/g, '<br/>').replace(/\n|\r/g, '<br/>');
		this.on('write')(text);

	}

    /**
     * Write a success message in the console
     * @param {string} text
     * @param {boolean} [noJump] Do not jump to the next line
     */

    this.success = function(text, noJump) {

        _console.innerHTML += (noJump ? '' : '<br />') + '<span style="color: green;">' + text + '</span>';
        this.on('success')(text);

    }

    /**
     * Write a warning message in the console
     * @param {string} text
     * @param {boolean} [noJump] Do not jump to the next line
     */

	this.warn = function(text, noJump) {

		_console.innerHTML += (noJump ? '' : '<br />') + '<span style="color: yellow;">' + text + '</span>';
		this.on('warn')(text);

	}

    /**
     * Write an error message in the console
     * @param {string} text
     * @param {boolean} [noJump] Do not jump to the next line
     */

	this.error = function(text, noJump) {

		_console.innerHTML += (noJump ? '' : '<br />') + '<span style="color: red;">' + text + '</span>';
		this.on('warn')(text);
		return false;

	}

    /**
     * Clear the console
     */

	this.clear = function() {

		_console.innerHTML = '';
		this.on('clear')();

	}

    /**
     * Disable console input
     */

	this.noinvite = function() {

		_invite = false;
		this.on('no-invite')();

	}

    /**
     * Allow user to write in the console, write invite prompt
     */

	this.invite = function() {

		if(!_readOnly && !_invite) {
			_console.innerHTML += '<br /><br /><span style="color: #50E8A0;">' + Core.path.chdir().escapeHTML() + '</span><br />' + _prompt + '<div class="cmd" contenteditable="true"></div>';
			_console.lastChild.style.display = 'inline-block';
			_console.lastChild.style.outline = 'none';
			_console.lastChild.focus();
			_invite = true;
		}

		this.on('invite')(_readOnly);

	}

	this.isInvite = function() {
		return _invite;
	}

    /**
     * Attach or get a console event
     * @param {string} name
     * @param {function} [callback]
     * @returns {void|function}
     */

	this.on = function(name, callback) {

		if(typeof(callback) === 'function')
		 	_events[name] = callback;

		return _events[name];

	}

    /**
     * Set the console read-only
     * @param {boolean} bool
     */

	this.setReadOnly = function(bool) {

		_readOnly = bool;

	}

    /**
     * Check if the console is in the read-only mode
     * @returns {boolean}
     */

	this.readOnly = function() {

		return _readOnly;

	}

	if(setDefaultInvite)
		this.invite();

	_readOnly = readOnly;

}

Object.freeze(Consoles);
Object.freeze(Console);
