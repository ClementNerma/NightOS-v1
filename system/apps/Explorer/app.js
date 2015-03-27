
var path = App.call.arguments.openFile ? App.call.arguments.openFile : '/users/$USER$/desktop';

Core.vars.set('path', path);
App.loadFrame('UI');

App.events.on('explorerOpen', function(name, args) {

	if(App.directoryExists(args.openFile))
		loadPath(args.openFile);

});

App.events.on('quit', function() {

	App.quit();

});
