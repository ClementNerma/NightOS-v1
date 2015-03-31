
function loadSystemFrame(frame) {

	$('#frame').html('').append(App.readFile('/system/boot/frames/' + frame + '.html'));

	if(App.fileExists('/system/boot/styles/' + frame + '.css'))
		$('#frame').append('<style type="text/css" charset="utf-8">' + App.readFile('/system/boot/styles/' + frame + '.css').replace(/\[ROOT_PATH\]/g, Core.path.root) + '</style>');

}

loadSystemFrame('login');
