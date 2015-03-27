
/**
  * TextEdit tool
  * @constructor
  */

var TextEdits      = 0;
var TextEditInputs = {};

var TextEdit = function(context, width, height) {

	var underground = $(document.createElement('pre')).attr('EditorID', TextEdits++ + 1)
		.addClass('text-editor-underground');

	var context = $(context)
		.attr('EditorID', TextEdits)
		.addClass('text-editor')
		.after(underground)
		.on('input', function(e) {

			TextEditInputs[this.getAttribute('EditorID')](this.value, $('pre[EditorID=' + this.getAttribute('EditorID') + ']'), this, e);

		})
		.on('scroll', function(e) {

			var underground = $('pre[EditorID=' + this.getAttribute('EditorID') + ']');
			underground.scrollTop($(this).scrollTop());
			underground.scrollLeft($(this).scrollLeft());			

		})

	var EditorID = TextEdits;

	this.refresh = function() {

		var pos = context.position();

		underground.css({

			top: pos.top,
			left: pos.left,
			width: context.innerWidth(),
			height: context.innerHeight()

		});

	}

	this.refresh();

	this.setContent = function(content) {

		underground.text(content);
		context.val(content);

	}

	this.input = function(callback) {

		TextEditInputs[EditorID] = callback;

	}

	this.input(function(text, pre) {

		pre.html(text);

	});

	this.getContext = function() { return context; }

	this.setBackgroundColor = function(color) {
		
		underground.css('backgroundColor', color);

	}

	this.setColor = function(color) {

		underground.css('color', color);
		context.css('color', color);

	}

	this.setTabSize = function(size) {

		underground.css('tabSize', size);
		context.css('tabSize', size);

	}

	this.keydown = function(callback) {

		return context.keydown(callback);

	}

	this.keyup = function(callback) {

		return context.keyup(callback);

	}

	this.keypress = function(callback) {

		return context.keypress(callback);

	}

	this.getContext     = function() { return context;     }
	this.getUnderground = function() { return underground; }

}
