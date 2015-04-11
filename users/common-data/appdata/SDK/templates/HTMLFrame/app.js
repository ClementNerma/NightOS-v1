
// Load the HTML frame file
// Here, the frame file is MyUI.frm

var success = App.loadFrame('MyUI');

// If success equals false, the frame loader had a critical error

if(!success) {

	// There was an error during frame loading

	App.dialog.error('My own application', 'Cannot load the UI frame', function() {

		// We close the application because of the UI frame cannot be load

		App.quit();

	});

} else {

	// There was no error, the UI frame was successfully loaded

	App.dialog.info('My own application', 'The UI frame successfully loaded !');

	// Here, we use jQuery to edit the title content
	// We add ' - My own application' to the title content

	$('h1').text($('h1').text() + ' - My own application');

}
