
var app = (App.call.arguments.openFile || false)

Core.commandLine.exec('apkg install --file "' + App.call.arguments.openFile + '"');
