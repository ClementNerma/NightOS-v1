
function loadSystemFrame(frame) {

	$('#frame').html('').append(App.readFile('/system/boot_frames/frames/' + frame + '.html'));

	if(App.fileExists('/system/boot_frames/styles/' + frame + '.css'))
		$('#frame').append('<style type="text/css" charset="utf-8">' + App.readFile('/system/boot_frames/styles/' + frame + '.css').replace(/\[ROOT_PATH\]/g, Core.path.root) + '</style>');

}

loadSystemFrame('login');
