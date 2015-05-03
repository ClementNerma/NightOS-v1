
function run() {

    if(!args[0])
        return output.error('Missing path');

    if(App.fileExists(args[0]) && !arg('r', 'recursive'))
        return output.error('Cannot delete a folder');

    if(App.fileExists(args[0])) {
        if(!App.removeFile(args[0]))
            output.error('Error : ' + App.lastError().message);
        else
            output.success('Successfully removed file !');
    } else {
        if(!App.removeDir(args[0]))
            output.error('Error : ' + App.lastError().message);
        else
            output.success('Successfully removed directory !');
    }

}

var help = {
    description: 'Remove a file or a directory',
    main_arguments: [
        {
            name: 'path',
            description: 'The file or directory path'
        }
    ],
    parameters: [
        {
            short: 'r',
            long: 'recursive',
            optional: true,
            description: 'Permit to remove directories'
        }
    ]
}
