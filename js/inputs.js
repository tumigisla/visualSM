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

    handleClick : function(e) {
        inputs.updateMouseCoords(e);
        // var state = visualSM.insideState(inputs.mouse.X, inputs.mouse.Y);
        // if (state) state.isSelected = !state.isSelected;
    },

    handleDblKlick : function(e) {
        inputs.updateMouseCoords(e);
        if (!e.which) return; // no button being pressed
        visualSM.insertState(inputs.mouse.X, inputs.mouse.Y);
   },

    mouseDown : function(e) {
        var state = visualSM.insideState(inputs.mouse.X, inputs.mouse.Y);

        if (e.shiftKey && routePoints.length === 0) { // shift + mouseClick
            inputs.updateMouseCoords(e);
            g_isBuildingEdge = true;
            draw.edgeX1 = inputs.mouse.X;
            draw.edgeY1 = inputs.mouse.Y;
            visualSM.prepareEdge(inputs.mouse.X, inputs.mouse.Y);
        }
        else if (state && routePoints.length === 0)
            state.isSelected = true;
    },

    mouseUp : function(e) {
        var state = visualSM.insideState(inputs.mouse.X, inputs.mouse.Y);

        if (g_isBuildingEdge) {
            g_isBuildingEdge = false;
            inputs.updateMouseCoords(e);
            visualSM.insertEdge(inputs.mouse.X, inputs.mouse.Y);
        }

        else if (state)
            state.isSelected = false;
    },

    mouseMove : function(e) { inputs.updateMouseCoords(e); },

    evalHandle : function() {
        visualSM.evaluate();
    }


};

window.addEventListener("keydown", inputs.handleKeydown);
window.addEventListener("keyup", inputs.handleKeyup);

window.addEventListener("click", inputs.handleClick);
window.addEventListener("dblclick", inputs.handleDblKlick);
window.addEventListener("mousedown", inputs.mouseDown);
window.addEventListener("mouseup", inputs.mouseUp);
window.addEventListener("mousemove", inputs.mouseMove);

document.getElementById("evalBtn").addEventListener("click", inputs.evalHandle);
