
var name;
var age;

Dialogs.input('Prompt', 'What is your name ?', 'text', function(val) {

	name = val;

	Dialogs.input('Prompt', 'What is your age ?', 'number', function(val) {

		age = val;

		Dialogs.alert('Your name is ' + name + ' and you are ' + age.toString() + ' years-old !');

	});

});
