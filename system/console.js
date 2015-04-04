
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

var Console = function(context, setDefaultInvite) {

	var _console = $(context)[0];
	var _prompt  = '$' + String.fromCharCode(160);
	var _id      = Consoles.inc();
	var _history = [];
	var _start   = null;
	var _invite  = false;
	var _h       = false;

	Consoles.add(this, _id);

	$(_console).attr('con-id', _id).css({
		color: 'white',
		backgroundColor: 'black',
		overflow: 'auto'
	}).keydown(function(e) {
		return Consoles.get(this.getAttribute('con-id')).keydown(e);
	}).click(function(e) {
		return false;
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

	}

	this.warn = function(text, noJump) {

		_console.innerHTML += (noJump ? '' : '<br />') + '<span style="color: yellow;">' + text + '</span>';

	}

	this.error = function(text, noJump) {

		_console.innerHTML += (noJump ? '' : '<br />') + '<span style="color: red;">' + text + '</span>';
		return false;

	}

	this.clear = function(text) {

		_console.innerHTML = '';

	}

	this.noinvite = function() {
		_invite = false;
	}

	this.invite = function() {

		_invite = true;
		_console.innerHTML += '<br /><br /><span style="color: #50E8A0;">' + Core.path.chdir().escapeHTML() + '</span><br />' + _prompt + '<div class="cmd" contenteditable="true"></div>';
		_console.lastChild.style.display = 'inline-block';
		_console.lastChild.style.outline = 'none';
		_console.lastChild.focus();

	}

	/*this.placeCaretAtEnd = function() {

		var range = document.createRange();
        range.selectNodeContents(_console);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

	}

	this.getCaretPosition = function() {
	   
	   var caretOffset = 0;
	   var range = window.getSelection().getRangeAt(0);
       var preCaretRange = range.cloneRange();
       preCaretRange.selectNodeContents(_console);
       preCaretRange.setEnd(range.endContainer, range.endOffset);
       return preCaretRange.toString().length;

	}*/

	if(setDefaultInvite)
		this.invite();

}

Object.freeze(Consoles);
Object.freeze(Console);
