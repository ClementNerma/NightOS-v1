
/**
  * UnderEdit tool
  * @constructor
  */

var UnderEdits      = 0;
var UnderEditInputs = {};

var UnderEdit = function(context, width, height) {

	var underground = $(document.createElement('pre')).attr('EditorID', UnderEdits++ + 1)
		.addClass('text-editor-underground');

	var context = $(context)
		.attr('EditorID', UnderEdits)
		.addClass('text-editor')
		.after(underground)
		.on('input', function(e) {

			UnderEditInputs[this.getAttribute('EditorID')](this.value, $('pre[EditorID=' + this.getAttribute('EditorID') + ']'), this, e);

		})
		.on('scroll', function(e) {

			var underground = $('pre[EditorID=' + this.getAttribute('EditorID') + ']');
			underground.scrollTop($(this).scrollTop());
			underground.scrollLeft($(this).scrollLeft());			

		})

	var EditorID = UnderEdits;

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

	this.content = function() {

		return context.val();

	}	

	this.setContent = function(content) {

		underground.text(content);
		context.val(content);

	}

	this.setHTML = function(content) {

		underground.html(content);
		
	}

	this.input = function(callback) {

		if(!callback)
			return UnderEditInputs[EditorID]();

		UnderEditInputs[EditorID] = callback;

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
