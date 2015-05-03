
function run() {

    if (args[0] === 'install') {

        // Install an application

        if (arg('f', 'file')) {

            // Install the application from a file

            if (!args[2])
                return output.error('No application file specified');

            var app = App.readFile(args[2]);

            if (!app)
                return App.lastStack(-1) ? output.error('Can\'t access to the specified file because it\'s needs privileges elevation') : output.error('The specified file was not found');

            /*if (!Core.applications.isValidPackage(app))
                return output.error('The specified file is not a valid application package');

            if (!Core.applications.isSignedPackage(app))
                output.warn('The application package is not signed. This can cause security issues');*/
            // Don't show that because the Core installer display these warn

            return Core.applications.installFromPackage(app, con);

        } else {

            if(!args[1])
                return output.error('Missing application name');

            // Install the application from a NightOS repository (require internet connection)

            def('sync', false);

            Core.applications.installFromServer(args[1], output, function() {
                END();
            }, function() {
                END();
            });

        }

    } else if (args[0] === 'remove') {

        // Remove an application

        if (!args[1])
            return output.error('No application name specified');

        if (!Core.applications.exists(args[1]))
            return output.error('The application [' + args[1].escapeHTML() + '] is not installed on this computer');

        return Core.applications.remove(args[1], output);

    } else if (args[0] === 'installed') {

        // Check if an application is installed

        if (!args[1])
            return output.error('No application name specified');

        return output.text(Core.applications.exists(args[1]).toString());

    } else if (app = arg('l', 'launch')) {

        // Launch an application

        if (!app)
            return output.error('No application name specified');

        if (!Core.applications.exists(app))
            return output.error('The application [' + app.escapeHTML() + '] is not installed on this computer');

        return Core.applications.launch(app, {
            origin: 'CommandLine',
            from: 'ApplicationPackage'
        });

    } else
        return output.error('Invalid parameters.<br />See apkg --help for more informations.');

}
