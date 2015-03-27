
/**
  * Windows gestion
  * @constructor
  */

var Windows = new function() {

	var _windows = {};
	var _tasks   = {};
	var _insts   = {};

	var _winIndex = 20;

	this.incIndex = function() {

		return _winIndex++ + 1;

	}

	this.create = function(window_title, id, onClose) {

		var win = $(document.createElement('div')).addClass('window').attr('id', id);
		var title = $(document.createElement('div')).addClass('title').append($(document.createElement('span')).addClass('titleContent')).append($(document.createElement('span')).addClass('close').html('&times;')).append($(document.createElement('span')).addClass('maximize').html('&square;'));

		UI.movable(title);
		$('body').append(win.append(title, $(document.createElement('div')).addClass('content')));

		var task = $(document.createElement('div')).addClass('task').attr('id', id + '-task').text(window_title);

		$('#icons').append(task);

		var inst = new Window(win, task);
		_windows[id] = win;
		_tasks[id]   = task;
		_insts[id]   = inst;

		if(typeof(onClose) !== 'function')
			title.find('.close:first').click(inst.close);
		else
			title.find('.close:first').click(onClose);

		title.find('.maximize:first').click(inst.maximize);

		inst.setActive();
		inst.setTitle(window_title);
	
		return inst;

	}

	this.getAllWindows   = function() { return _windows; }
	this.getAllTasks     = function() { return _tasks; }
	this.getAllInstances = function() { return _insts; }

	this.forEach = function(callback) {

		for(var i in _windows)
			callback(_windows[i], _tasks[i]);

	}

};

/**
  * The Window constructor
  * @constructor
  */

var Window = function(win, task) {

	var _window  = win;
	var _task    = task;
	var _content = win.find('.content:first');
	var _title   = 'Loading...';

	_window[0].addEventListener('mousedown', function() {

		Windows.getAllInstances()[this.id].setActive();
		return true;

	});

	this.close = function() {
		
		_task.animate({
			width: 0
		} , 500, function() {
			$(this).remove();
		});

		_window.fadeOut(500, function() {
			$(this).remove();

		});

	}

	this.setTitle = function(title){

		_title = title;
		_window.find('.titleContent:first').text(title);
		_task.text(title);
		TaskManager.refresh();

	}

	this.title = function() { return _title; }

	this.setActive = function()  {

		_window.css('z-index', Windows.incIndex());

	}

	this.maximize = function() {

		_window.addClass('maximized');

	}

	this.setTitle(_title);

}
