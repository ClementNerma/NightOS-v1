
function run() {

    if(!args[0])
        return output.error('Missing path');

    if(App.fileExists(args[0]) && !arg('r', 'recursive'))
        return output.error('Cannot delete a folder');

}
