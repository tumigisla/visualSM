var inputs = {

	keys : [],

	handleKeyDown : function(e) {
		this.keys[e.keyCode] = true;
	},

	handleKeyUp : function(e) {
		this.keys[e.keyCode] = false;
	},

	keyCode : function(e) {
		return keyChar.charCodeAt(0);
	},

	eatKey : function(keyCode) {
		var isDown = this.keys[keyCode];
		this.keys[keyCode] = false;
		return isDown;
	},

	// Returns an array of length 2 containing
	// the mouse coordinates
	handleMouse : function(e) {
		var mouseX = e.clientX - g_canvas.offsetLeft,
			mouseY = e.clientY - g_canvas.offsetTop;

		if (!e.which) return; // no button being pressed

		draw.circle(g_ctx, mouseX, mouseY, consts.STATE_RADIUS);
		testDFA.generateState();
		console.log(testDFA._states);
	}

};

window.addEventListener("keydown", inputs.handleKeydown);
window.addEventListener("keyup", inputs.handleKeyup);

window.addEventListener("mousedown", inputs.handleMouse);
//window.addEventListener("mousemove", inputs.handleMouse);

//var names = ['a', 'b', 'c', 'd', 'e', 'f'];
//var iNames = 0;