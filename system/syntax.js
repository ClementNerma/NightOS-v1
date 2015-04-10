
var Syntax = new function() {

	this.themes = new function() {

		var _sheets = {};

		this.load = function(name, sheet) {

			if(typeof(sheet) !== 'object') {
				try {
					sheet = JSON.parse(sheet);
				}

				catch(e) {
					return false;
				}
			}

			if(!sheet.syntaxTheme)
				return false;

			_sheets[name] = sheet;
			return true;

		}

		this.get = function(name) {
			return _sheets[name];
		}

	}

	this.languages = new function() {

		var _sheets = {};

		this.load = function(name, sheet) {

			if(typeof(sheet) !== 'object') {
				try {
					sheet = JSON.parse(sheet);
				}

				catch(e) {
					return false;
				}
			}

			if(!sheet.syntaxLanguageSheet)
				return false;

			_sheets[name] = sheet;
			return true;

		}

		this.get = function(name) {
			return _sheets[name];
		}

	}

	this.highlight = function(code, language, stylesheet) {

		var language = this.languages.get(language)
		if(!language) language = this.languages.get('plain');

		var theme = this.themes.get(theme)
		if(!theme) theme = this.themes.get('default');

		var rules = language.rules;
		var color = theme.colors;

		code = code.escapeHTML();

		for(var i in rules) {

			//console.log(new RegExp(rules[i].match, 'g'))

			c = color[rules[i].name];

			if(c)
			code = code.replace(new RegExp(rules[i].match, 'g'), function(match, $1, $2, $3, $4, $5, $6, $7, $8, $9) {

				var rule = rules[i];
				var vars = {};
				var v = [match, $1, $2, $3, $4, $5, $6, $7, $8, $9];
				delete v[rule.vn + 1];
				delete v[rule.vn + 2];

				for(var n in rule.vars) {
					vars[n] = rule.vars[n].replace(/\$([0-9])/g, function(m, n) {
						return v[n];
					});
				}

				for(var n in vars) {
					if(c[n])
						match = match.replace(vars[n], '<span style="color:' + c[n][0] + '">' + vars[n] + '</span>');
				}

				return match;

			})

		}

		return code;

	}

}

Object.freeze(Syntax);
Object.freeze(Syntax.themes);
Object.freeze(Syntax.languages);
