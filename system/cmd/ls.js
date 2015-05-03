
function run() {

    if(arg('d', 'details')) {

        var path = (args[0] || '.');
        var f    = App.readDir(path);
        var html = '';

        if(!f) {
            if(App.lastStack(-1))
                return output.error('Needs privileges elevation');
            else
                return output.error('This directory doesn\'t exists');
        }

        for(var i in f) {
            var isDir = App.fileExists(path + '/' + f[i]);
            var type = isDir ? 'f' : 'd';

            html += '<tr><td>' + type + '</td><td' + (arg('c', 'color') ? ' style="color: cyan;"' : '') + '>&nbsp;' + (App.fileExists(path + '/' + f[i]) ? App.getFileSize(path + '/' + f[i]) : '-') + '</td><td' + (arg('c', 'color') ? (isDir ? ' style="color: blue;"' : ' style="color: green;"') : '') + '>&nbsp;' + f[i] + '</td></tr>';
        }

        return output.write('<table>' + html + '</table>');

    }

    var f = App.readDir((args[0] || '.'));

    if(f)
        output.text(f.join("\n"))
    else if(App.lastStack(-1))
        output.error('Needs privileges elevation');
    else
        output.error('This directory doesn\'t exists');

}

var help = {
    description: 'List files and directories',
    main_argument: 'Directory path',
    main_argument_optional: true,
    parameters: [
        {
            short: 'd',
            long: 'details',
            description: 'View entries details (size, type, etc.)',
            has_value: false,
            optional: true
        },
        {
            short: 'c',
            long: 'color',
            description: 'Color output. Require -d parameter',
            has_value: false,
            optional: true
        }
    ]
}
