
<div id="menu">
	<span id="back" class="fa fa-arrow-circle-left">&nbsp;</span>
	<span id="next" class="fa fa-arrow-circle-right">&nbsp;</span>
	<input type="text" id="path" placeholder="Please specify a path, then press [Return] key" />
	<div id="name_container" align="center">
		<span id="name">File Explorer - Loading...</span>
	</div>
</div>
<div id="links">
	<span class="fa fa-home">&nbsp;&nbsp;Home</span>
	<span class="fa fa-desktop">&nbsp;Desktop</span>
	<span class="fa fa-file-text-o">&nbsp;Documents</span>
	<span class="fa fa-music">&nbsp;Musics</span>
	<span class="fa fa-picture-o">&nbsp;Pictures</span>
	<span class="fa fa-video-camera">&nbsp;Videos</span>
	<span class="fa fa-trash-o">&nbsp;Recycle</span>
</div>
<div id="navigation"></div>
<div id="context"></div>

<script type="text/javascript">

$('#links span').click(function() {

	if(this.innerText.substr(2) === 'Home')
		loadPath('/users/$USER$/')
	else
		loadPath('/users/$USER$/' + this.innerText.toLowerCase());

});

function loadPath(path) {

	path = Core.path.format(path);

	if(!App.directoryExists(path)) {
		console.info(Dialogs);
		console.info(Dialogs.error)
		Dialogs.error('Explorer - Open failed', 'Can\'t open ' + Core.path.format(path).replace(Core.path.root, '') + "\n\nPlease make sure that this path is a directory and is readable.");
		return false;
	}

	var pathName = path.split('/')[path.split('/').length - 1];

	WinGUI.setTitle('File Explorer - Loading ' + pathName);

	$('#name').text(pathName + ' - loading...');

	if(window.watchExplorerDir)
		window.watchExplorerDir();

	$('#path').val(path.replace(Core.path.root, ''));
	$('#navigation').html('');

	var items = App.readDir(path);

	if(!items) {
		Dialogs.error('Explorer - Open failed', 'Unable to open ' + path.replace(Core.path.root, '') + '.');
		return false;
	}

	for(var index in items)
		$('#navigation').append(Explorer.DOM.file(path + '/' + items[index]));

	window.watchExplorerDir = App.watchDir(path, {
		initial: false
	}, function() {

		loadPath(window.currentPath);

	});

	$('#name').text(pathName);
	WinGUI.setTitle('File Explorer - ' + pathName);

	window.currentPath = path

	return true;

}

$('#path').keydown(function(e) {

	if(e.keyCode === 13) {
		loadPath(this.value);
		return false;
	}

});

if(!App.directoryExists('{{ PATH }}')) {
	$('body').html('');
	Dialogs.error('Explorer - Open failed', 'Can\'t open {{ PATH }}.' + "\n\nPlease make sure that this path is a directory and is readable.", function() {
		App.quit();
	})
} else 
	loadPath('{{ PATH }}');

</script>

<style type="text/css">

#menu {

	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 85%;

	border-bottom: 1px solid gray;
	padding: 5px;

}

#links {

	position: absolute;
	top: 15%;
	left: 0;
	bottom: 27px;
	width: 150px;

	padding: 5px;

	border-right: 1px solid gray;
	border-bottom: 1px solid gray;

}

#links span {

	display: block;
	border: 1px solid transparent;
	padding: 5px;

}

#links span:hover {

	cursor: pointer;
	background-color: #249EFF;
	border: 1px solid blue;
	color: white;

}

#menu, #links {

	background-color: #E3E3E3;

}

#navigation {

	position: absolute;
	top: 15%;
	left: 150px;
	right: 0;
	bottom: 0;

	padding: 5px;

}

#path {

	display: inline-block;
	width: 80%;

}

#name_container {

	margin-top: 10px;

}

</style>
