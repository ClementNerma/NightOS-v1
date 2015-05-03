
function run() {

    if(!args[0])
        return output.error('Missing file name');

    if(App.fileExists(args[0]))
        return output.write('This file already exists !');

    if(!App.writeFile(args[0], '')) {
        if(App.lastStack(-1))
            return output.error('Cannot create file : Needs privileges elevation');
        else
            return output.error('Cannot create file');
    }

}

var help = {
    description: 'Create a file',
    main_argument: 'The file path'
}