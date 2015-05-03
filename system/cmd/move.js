
function run() {

    if(!args[0])
        return output.error('Missing source file');

    if(!App.fileExists(args[0]))
        return output.error('Source file does not exists !');

    if(App.fileExists(args[1]) && !arg('f', 'force'))
        return output.error('Destination file already exists ! Please use --force parameter to force move !');

    if(!args[1])
        return output.error('Missing destination file');

    output.text('Moving...');

    if(App.moveFile(args[0], args[1]))
        output.success('Successfully moved [' + args[0] + '] to [' + args[1] + '] !');
    else
        output.error('Error : ' + App.lastError().message);

}
