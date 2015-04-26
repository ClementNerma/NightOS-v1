
function run() {

    if(arg('d', 'details')) {

        var path = (args[0] || '.');
        var f    = App.readDir(path);
        var html = '';

        for(var i in f) {
            var isDir = App.fileExists(path + '/' + f[i]);
            var type = isDir ? 'd' : 'f';

            html += '<tr><td>' + type + '</td><td' + (arg('c', 'color') ? ' style="color: cyan;"' : '') + '>&nbsp;' + (App.fileExists(path + '/' + f[i]) ? App.getFileSize(path + '/' + f[i]) : '-') + '</td><td' + (arg('c', 'color') ? (isDir ? ' style="color: blue;"' : ' style="color: green;"') : '') + '>&nbsp;' + f[i] + '</td></tr>';
        }

        return output.write('<table>' + html + '</table>');

    }

    var f = App.readDir((arguments[0] || '.'));

    if(f)
        output.text(f.join("\n"))
    else if(App.lastStack(-1))
        output.error('Needs privileges elevation');
    else
        output.error('An error has occured.');

}
