
function run() {

    if (!args[0])
        return output.error('Missing directory path !');

    var path = Core.path.format(args[0]).replace(Core.path.root, '');

    if (arg('m', 'make-tree')) {
        var tree = path.split('/');
        var p = '';

        for (var i = 0; i < tree.length; i++) {

            p += tree[i];

            if (arg('v', 'verbose'))
                output.write('Making ' + p + '...');

            if (!App.makeDir(p) && !App.directoryExists(p)) {
                if (App.lastStack(-1))
                    return output.error('Cannot make directory : ' + p + '<br/>Needs privileges elevation.')
                else
                    return output.error('Cannot make directory : ' + p);
            }

            p += '/';
        }

        return output.write('Successfully maked directory !');
    }

    if (App.directoryExists(path))
        output.write('This directory already exists !');
    else {
        if (!App.makeDir(path)) {
            if (App.lastStack(-1))
                output.error('Cannot make directory. Needs privileges elevation.');
            else
                output.error('Cannot make directory !');
        } else
            output.write('Successfully maked directory !');
    }

}

var help = {
    description: 'Make a directory',
    main_argument: 'The directory path',
    parameters: [
        {
            short: 'r',
            long: 'recursive',
            description: 'If the directory parents doesn\'t exists, the command make them',
            has_value: false,
            optional: true
        }
    ]
};
