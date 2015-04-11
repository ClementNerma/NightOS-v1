
// Set the menu bar visible

menuBar.setVisible(true);

// Create the 'Application' menu element
// It have to be attached to a menu bar

var appMenu = new MenuElement('Application');

// Create the 'Quit' menu item
// It have to be attached to a menu element

var quitApp = new MenuItem('Quit', function() {

	App.quit();

});


// Attach the 'Quit' menu item to the 'Application' element

appMenu.addItem(quitApp);

// Attach the 'Application' menu element to the menu bar

menuBar.addElement(appMenu);

// The menuBar object is an instance of MenuBar,
// And is already attached to the GUI
// If you load a frame with App.loadFrame or if you destroy the body content,
// You have to re-create your own menu bar.
// To do that, copy the following commands (or uncomment these lines) :

// var myMenuBar = new MenuBar();
// GUI.setMenuBar(myMenuBar);
