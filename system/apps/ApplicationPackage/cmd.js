
if(!args[0])
	return con.error('Invalid argument. Please see apkg --help for more informations');

if(args[0] == '--help')
	return con.text("The NightOS application package manager permit to install, get or remove applications from your computer.\n"
					+"apkg install [name | -f file | --file file]\n"
					+"    install an application from NightOS repositories or from a file\n"
					+"    -f Install an application from a local file\n\n"
					+"apkg remove [name]\n"
					+"    remove an application\n"
				);

if(args[0] == 'install') {

	// Install an application

	if(!args[1])
		return con.error('No application or file specified');

	if(args[1] == '-f' || args[1] == '--file') {

		// Install the application from a file

		if(!args[2])
			return con.error('No application file specified');

		var app = App.readFile(args[2]);

		if(!app)
			return App.lastStack(-1) ? con.error('Can\'t access to the specified file because it\'s needs privileges elevation') : con.error('The specified file was not found');

		if(!Core.applications.isValidPackage(app))
			return con.error('The specified file is not a valid application package');

		if(!Core.applications.isSignedPackage(app))
			con.warn('The application package is not signed. This can cause security issues');

		return Core.applications.installFromPackage(app, con);

	} else {

		// Install the application from a NightOS repository (require internet connection)

	}

} else if(args[0] == 'remove') {

	// Remove an application

	if(!args[1])
		return con.error('No application name specified');

	if(!Core.applications.exists(args[1]))
		return con.error('The application [' + args[1].escapeHTML() + '] is not installed on this computer');

	// can remove the application

} else if(args[0] === 'installed') {

	// Check if an application is installed

	if(!args[1])
		return con.error('No application name specified');

	return con.text(Core.applications.exists(args[1]).toString());

} else if(args[0] === 'launch') {

	// Launch an application

	if(!args[1])
		return con.error('No application name specified');

	if(!Core.applications.exists(args[1]))
		return con.error('The application [' + args[1].escapeHTML() + '] is not installed on this computer');

	return Core.applications.launch({
		origin: 'CommandLine',
		from: 'ApplicationPackage'
	});

} else
	return con.error('Invalid parameters.<br />See apkg --help for more informations.');

