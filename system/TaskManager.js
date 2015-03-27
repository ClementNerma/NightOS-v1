
var TaskManager = new function() {

	var _opened = false;

	this.isOpened = function() { return _opened; }

	this.refresh = function() {

		if(_opened) return this.open();

	}

	this.open = function() {
		
		if(!_opened) {
			_opened = Windows.create('Task Manager', 'sys-task-manager');

			$('#sys-task-manager .close:first')[0].addEventListener('click', function() {

				TaskManager.close();

			});
		} else
			$('#sys-task-manager .content:first').html('');

		for(var i in Core.applications.frames) {

			var $app = $(document.createElement('details')).append($(document.createElement('summary')).text(i));

			for(var j in Core.applications.frames[i]) {
				
				if(Core.applications.frames[i][j]) {
					var div = $(document.createElement('div')).text(Core.applications.frames[i][j].win.title()).attr('app', i).attr('app-id', j);
					
					div.append($(document.createElement('button')).text('Close').click(function() {

						try {
							var name = this.parentNode.getAttribute('app');
							var ID   = this.parentNode.getAttribute('app-id');
							Core.applications.frames[name][ID].window.injectJS('App.events.on("quit")();');

						}
						
						catch(e) {
							console.error('[Task Manager] Can\'t stop application !');
							Dialogs.error('Task Manager', 'Can\'t stop application. Please try again.<br /><br />Details :<br /><br />' + new String(e));
						}

					}));

					div.append($(document.createElement('button')).text('Stop process').click(function() {

						window.quitSysTask = Core.applications.frames[this.parentNode.getAttribute('app')][this.parentNode.getAttribute('app-id')].win.close;

						Dialogs.confirm('Task Manager', 'Stop an application process can cause a lost of informations.<br /><br />Do you really want to continue ?', function() {

							test(window.quitSysTask, function(e) {
								Dialogs.error('Task Manager', 'Can\'t stop application process. Please try again.<br /><br />Details :<br /><br />' + new String(e));
							});

						}, function() {});

					}));

					$app.append(div);

				}

			}

		}

		$('#sys-task-manager .content').append($app);

	}

	this.close = function() {

		if(!_opened)
			return false;

		_opened.close();
		_opened = false;

	}

}