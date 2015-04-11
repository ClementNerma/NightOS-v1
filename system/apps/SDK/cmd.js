
if(!args[0])
	return con.error('No input directory specified');

if(!args[1])
	return con.error('No output file specified');

console.log(args[0], args[1]);

var p = App.readFile(args[0] + '/package.prm')

if(!p)
	return con.error('package.prm is not accessible or doesn\'t exists');

try {
	p = JSON.parse(p);
}

catch(e) {
	return con.error('The package.prm file is not a valid JSON file');
}

if(!p.name)
	return con.error('Missing application name');

if(!p.version)
	return con.error('Missing application version');

if(!p.icon)
	return con.error('Missing application icon');

if(!p.creator)
	return con.error('Missing application creator');

if(!p.permissions)
	return con.error('Missing application permissions');

if(!p.access)
	return con.error('Missing application access');

if(!p.rights)
	return con.error('Missing application rights');

if(p.rights != 1 && p.rights != 2 && p.rights != 3 && p.rights != 4 && p.rights != 'herit<3' && p.rights != 'herit')
	return con.error('Invalid application rights [' + p.rights + ']');

if(typeof(p.permissions) !== 'object')
	return con.error('Application permissions must be an object');

if(!p.permissions.storage)
	p.permissions.storage = [];

var app = App.readFile(args[0] + '/app.js');
var cmd = App.readFile(args[0] + '/cmd.js');
var uninstaller = App.readFile(args[0] + '/uninstaller.js');

if(!app)
	return con.error('Cannot read main application file [app.js]');

if(!cmd)
	con.warn('No command-line file found');

if(!uninstaller)
	con.warn('No uninstaller found, the system will use the default uninstaller.');

p.files = {
	"app.js": app
}

if(cmd)
	p.files["cmd.js"] = cmd;

if(uninstaller)
	p.files["uninstaler.js"] = uninstaller;

if(!App.writeFile(args[1], JSON.stringify(p)))
	return con.error('Application has been packed but cannot write in the output file [' + args[1] + ']');
else
	return con.write('Application successfully packed !');
