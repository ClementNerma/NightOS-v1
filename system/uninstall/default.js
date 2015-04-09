
// This file is the default uninstaller
// He's launched if the application doesn't have uninstaller (uninstall.js)

function uninstall() {

	function del_rec(path) {

		var r = App.readFile(path);
		var s = true;

		for(var i in r)
			if(App.directoryExists(path + '/' + r[i]))
				s = del_rec(path + '/' + r[i]);
			else
				if(!App.removeFile(path + '/' + r[i]))
					s = Dialogs.error('Application uninstaller', 'Cannot remove ' + App.name + '<br />Cannot remove the "' + path + '/' + r[i] + '" file');

		return s;

	}

	return {
		success: del_rec('.');
	}

}
