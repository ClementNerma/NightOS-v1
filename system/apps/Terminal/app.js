
$('body').append(terminal);

App.loadFrame('style');

$('body').append($(document.createElement('textarea')).attr('id', 'terminal'));

var terminal = new Console($('#terminal'), false);

terminal.write("\n    ==== NightOS terminal ====\n");
terminal.invite();

$('#terminal').focus();

App.events.on('quit', function() {

	Dialogs.confirm('Application closer', 'Do you really want to close the terminal ?', function() {

		App.quit();

	}, function() {});

});