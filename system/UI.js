
/**
  * UI constructor
  * @constructor
  */

var UI = new function() {

	this.mouseX = null;
	this.mouseY = null;
	this.moving = null;
	this.diffX = null;
	this.diffY = null;

	/**
	  * Make an element movable
	  * @param {Object} movable The element to make movable
	  */

	this.movable = function(movable) {

		movable[0].addEventListener('mousedown', function(event) {
			UI.moving = this;
	 		UI.diffX = this.parentNode.offsetLeft - UI.mouseX;
	 		UI.diffY = this.parentNode.offsetTop - UI.mouseY;

	 		this.style.cursor = 'pointer';

	 		return false;
		});

		movable[0].addEventListener('mouseup', function(event) {

			UI.moving = null;
			return false;

		});

	}

};

Object.seal(UI);

$('body').mousemove(function(event) {
	UI.mouseX = event.clientX;
	UI.mouseY = event.clientY;

	if(!UI.moving) return;

	UI.moving.parentNode.style.top = (UI.mouseY + UI.diffY) + 'px';
	UI.moving.parentNode.style.left = (UI.mouseX + UI.diffX) + 'px';
});

$('body').mouseup(function() {
	if(!UI.moving) return;

	UI.moving.style.cursor = 'normal';
	UI.moving = null;
});
