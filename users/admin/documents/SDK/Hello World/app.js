
var name;
var age;

App.dialog.input('Prompt', 'What is your name ?', 'text', function(val) {

	name = val;

	App.dialog.input('Prompt', 'What is your age ?', 'number', function(val) {

		age = val;

		App.dialog.alert('Your name is ' + name + ' and you are ' + age.toString() + ' years-old !');

	});

});
