
function err(msg) {
	Dialogs.error('System Updater - Error', msg, App.quit);
}

if(!App.call.arguments.openFile)
	err('No file specified. Cannot update system.');
else {
	var updater = App.readFile(App.call.arguments.openFile);

	if(updater === false)
		err('Cannot read the specified file.');
	else {

		try {
			updater = JSON.parse(updater);
		}

		catch(e) {
			err('Invalid package format.');
		}

		finally {

			if(!updater.description || typeof(updater.files) !== 'object' || typeof(updater.sign) !== 'object' || !updater.sign.input || !updater.sign.algorithm || !updater.sign.signed)
				err('Invalid package entries.');
			else
				if(!Core.crypto.verify(updater.sign.signed, JSON.stringify(updater.files), Core.crypto.getSignPublicKey(), updater.sign.input, updater.sign.algorithm))
					err('Invalid signature.');
				else
					Dialogs.confirm('System Updater', 'Do you really want to install this update package ?<br /><br />' + updater.description, function() {

						var error = false;

						for(var i in updater.files) {

							var dir = i.split('/');
							dir.splice(dir.length - 1, 1);
							dir = dir.join('/');

							// the file is not writed ! correct it !

							if(!App.directoryExists('/' + dir) && !App.makeDir('/' + dir)) {
								err('Cannot make directory : ' + dir);
								error = true;
								break;
							} else {}

							if(!App.writeFile('/' + i, updater.files[i])) {
								err('Cannot write file : ' + i);
								error = true;
								break;
							}

						}

						if(!error)
							Dialogs.info('System Updater', 'The system has been updated ! Please restart NightOS to see modifications.', App.quit)

					});
		}
		
	}
}