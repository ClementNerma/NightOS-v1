
$('body').append(terminal);

App.loadFrame('style');

$('body').append($(document.createElement('div')).attr('id', 'terminal'));

var terminal = new Console($('#terminal'), false);
//terminal.write("\n    ==== NightOS terminal ====\n");
var file;

if(file = App.readFile('/system/cmd/terminal.nsh'));
    terminal.run(file)

if(file = App.readFile('/users/$USER$/.config/terminal.nsh'));
    terminal.run(file);

terminal.invite();

$('#terminal').focus();
