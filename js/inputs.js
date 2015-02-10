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

    handleDblKlick : function(e) {
        inputs.updateMouseCoords(e);
        if (!e.which) return; // no button being pressed
        visualSM.insertState(inputs.mouse.X, inputs.mouse.Y)
    },

    mouseDown : function(e) {
        if (e.shiftKey) { // shift + mouseClick
            inputs.updateMouseCoords(e);
            visualSM.prepareEdge(inputs.mouse.X, inputs.mouse.Y);
        }
    },

    mouseUp : function(e) {
        if (e.shiftKey) { // shift + mouseClick
            inputs.updateMouseCoords(e);
            visualSM.insertEdge(inputs.mouse.X, inputs.mouse.Y);
        }
    },


};

window.addEventListener("keydown", inputs.handleKeydown);
window.addEventListener("keyup", inputs.handleKeyup);

window.addEventListener("dblclick", inputs.handleDblKlick);
window.addEventListener("mousedown", inputs.mouseDown);
window.addEventListener("mouseup", inputs.mouseUp);