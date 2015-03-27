
function err(msg) {
	return Dialogs.error('System Updater - Error', msg, App.quit);
}

if(!App.call.arguments.openFile)
	return err('No file specified. Cannot update system.');
else {
	var updater = App.readFile(App.call.arguments.openFile);

	if(!updater)
		return err('Cannot read the specified file.');
	else {

		Dialogs.confirm('System Updater', 'Do you want to install this update ?<br /><br />' + updater.split("\n")[0]);

		// Core.sign.verify : [plain text], [hash], [publicRSAKey]

		if(!Core.crypto.signVerify(update.substr(96), update.substr(0, 95)))
			return err('Invalid signature.');
		else {

			try {
				var files = JSON.parse(update.substr(96));
			}

			catch(e) {
				return err('Invalid file format.');
			}

			finally {

				for(var i in files) {
					var dir = files[i].split('/');
					dir.splice(dir.length - 1, 1);
					dir = dir.join('/');

					if(!App.directoryExists(dir))
						if(!App.mkdir(dir))
							return err('Can\'t make the ' + dir + ' directory.');

					if(!App.writeFile(i, files[i]))
						return err('Can\'t write ' + i + ' please try again.');
				}

			}

		}

	}
}