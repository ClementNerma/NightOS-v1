
function run() {

    if(!args[0])
        return output.error('Missing source file');

    if(!App.fileExists(args[0]))
        return output.error('Source file does not exists !');

    if(App.fileExists(args[1]) && !arg('f', 'force'))
        return output.error('Destination file already exists ! Please use --force parameter to force copy !');

    if(!args[1])
        return output.error('Missing destination file');

    output.text('Copying...');

    if(App.copyFile(args[0], args[1]))
        output.success('Successfully copied [' + args[0] + '] to [' + args[1] + '] !');
    else
        output.error('Error : ' + App.lastError().message);

}

var help = {
    description: 'Copy a file',
    main_arguments: [
        {
            name: 'source',
            description: 'The source file'
        },
        {
            name: 'destination',
            description: 'The destination file'
        }
    ],
    parameters: []
}
