
function run() {

    if(arg('c', 'closure')) {
        var f = new Function(['output', 'short_args', 'long_args'], args[0]);
        r = f();
    } else {

        var r;

        try {
            if (arg('g', 'global'))
                r = window.eval(args[0]);
            else
                r = eval(args[0]);
        }

        catch (e) {
            output.error('There was an error : ' + e.message);
        }

        finally {
            if(typeof(r) == 'undefined' && !arg('d', 'dont-ignore-undefined'))
                r = '';

            output.write(r);
        }

    }

}

var help = {
    description: 'Run a JavaScript code',
    main_argument: 'The JavaScript code',
    parameters: [
        {
            short: 'c',
            long: 'closure',
            description: 'Run the JavaScript in an anonymous function (closure)',
            has_value: false,
            optional: true
        },
        {
            short: 'g',
            long: 'global',
            description: 'Run the JavaScript code in global window context',
            has_value: false,
            optional: true
        }
    ]
}