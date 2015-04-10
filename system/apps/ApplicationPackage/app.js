
var app = (App.call.arguments.openFile || false)

$('body').append($(document.createElement('div')).attr('id', 'build').css({
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0
}));

var con = new Console($('#build'));

Core.commandLine.exec('apkg install --file "' + App.call.arguments.openFile + '"', con);
