var inputs = {

	keys : [],

	// X : mouseX
	// Y : mouseY
	mouse : {X : 0, Y : 0},

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

	updateMouseCoords : function(e) {
		inputs.mouse.X = e.clientX - g_canvas.offsetLeft;
		inputs.mouse.Y = e.clientY - g_canvas.offsetTop;
	},

	// Returns an array of length 2 containing
	// the mouse coordinates
	handleMouse : function(e) {
		inputs.updateMouseCoords(e);

		if (!e.which) return; // no button being pressed

		draw.circle(g_ctx, inputs.mouse.X, inputs.mouse.Y, consts.STATE_RADIUS);
		testDFA.generateState(inputs.mouse.X, inputs.mouse.Y);
		console.log(testDFA._states);
	},

	mouseDown : function(e) {
		if (e.shiftKey) {
			inputs.updateMouseCoords(e);

			findStateInRange(inputs.mouse.X, inputs.mouse.Y);

			g_ctx.save();
			g_ctx.beginPath();
			g_ctx.moveTo(inputs.mouse.X, inputs.mouse.Y);
		}
	},

	mouseUp : function(e) {
		if (e.shiftKey) {
			inputs.updateMouseCoords(e);

			g_ctx.lineTo(inputs.mouse.X, inputs.mouse.Y);
			g_ctx.stroke();
			g_ctx.restore();
		}
	}

};

window.addEventListener("keydown", inputs.handleKeydown);
window.addEventListener("keyup", inputs.handleKeyup);

window.addEventListener("dblclick", inputs.handleMouse);

window.addEventListener("mousedown", inputs.mouseDown);
window.addEventListener("mouseup", inputs.mouseUp);

console.log(inputs.mouse);