
function run() {
	if (arg('g', 'gui'))
		Core.applications.launch('Explorer', {
			openFile: args[1],
			origin: 'CommandLine',
			from: App.name
		});
	else
		output.error('Explorer can\'t work in command-line');
}
