
function ConActPre(_underground, _terminal) {

	_underground.html(_terminal.value.replace(/^\$ (.*)/gm, function(match) {

		return htmlspecialchars(match).replace(/( | )/g, '&nbsp;');

	}));

}

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

	var _context     = $(context);
	var _terminal    = new TextEdit(_context);
	var _underground = _terminal.getUnderground();
	var _prompt      = '$ ';
	var _invite      = false;

	_terminal.setBackgroundColor('#000000');
	_terminal.setColor('#FFFFFF');

	_terminal.keydown(function(e) {

		if(e.ctrlKey && e.keyCode === 65)
			return false;
	
		if(!Consoles.get(this.getAttribute('con-id')).isInvite())
			return true;

		var k = e.keyCode;

		if(this.value.substr(0, this.selectionStart).split("\n").length != this.value.split("\n").length)
			this.selectionStart = this.selectionEnd = this.value.length;

		if((k < 65 || k > 111) && (k < 47 || k > 57) && (k < 219 || k > 225) && (k < 187 || k > 192))
			if(k != 8 && k != 37 && k != 39 && k != 18 && k != 144 && k != 20 && k != 16 && k != 30 && k != 46 && k != 13 && k != 32 && k != 45)
				return false;

	});

	_terminal.input(function(text, _pre, el, e) {

		var con = Consoles.get(el.getAttribute('con-id'));

		if(!con.isInvite())
			return true;

		if(text.substr(0, el.selectionStart).split("\n").length != text.split("\n").length)
			el.selectionStart = el.selectionEnd = text.length;

		ConActPre(_pre, el);

		if(text.substr(-1) === "\n") {

			con.setInvite(false);

			el.value = el.value.substr(0, el.value.length - 1);

			var start = text.substr(text.lastIndexOf("\n" + con.prompt()));
			var promptRegex = new RegExp("\n" + con.prompt().formatToRegex());

			Core.commandLine.exec(start.replace("\n" + con.prompt().formatToRegex(), '').replace(promptRegex, ''), con);

			con.invite();

		}

	});

	this.prompt = function(assign) {

		_prompt = (assign || _prompt).replace(/ /g, String.fromCharCode(160));
		return _prompt.replace(/ /g, String.fromCharCode(160));

	}

	this.write = function(msg) {

		_context[0].value += "\n" + msg;

		ConActPre(_underground, _context[0]);

	}

	this.error = function(msg) {

		_context[0].value += "\n" + '<span style="color:red;">' + msg + '</span>';

		ConActPre(_underground, _context[0]);

	}

	this.clear = function() {

		_context.val('');
		ConActPre(_underground, _context[0]);

	}	

	this.invite = function() {

		_invite = true;

		_context[0].value += "\n" + _prompt.replace(/ /g, String.fromCharCode(160));

		ConActPre(_underground, _context[0]);

	}

	this.setInvite = function(bool) { _invite = bool; }
	this.isInvite  = function() { return _invite; }

	_context.attr('con-id', Consoles.inc());
	_terminal.setContent('');

	if(setDefaultInvite !== false)
		this.setInvite();

	Consoles.add(this, _context.attr('con-id'));

}

Object.freeze(Consoles);
Object.freeze(Console);
