
if(args[0] === '--gui')
	Core.applications.launch('Explorer', {
		openFile: args[1],
		origin: 'CommandLine',
		from: App.name
	})
else
	con.error('Explorer can\'t work in command-line');
