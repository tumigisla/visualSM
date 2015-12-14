/**
* Handles keyboard and mouse inputs in the window and on the canvas.
*
* @class inputs
* @constructor
*/
var inputs = {

    keys : [],

    // X : mouseX
    // Y : mouseY
    mouse : {X : 0, Y : 0},

    /**
    * @method handleKeyDown
    */
    handleKeyDown : function(e) {
        this.keys[e.keyCode] = true;
    },

    /**
    * @method handleKeyUp
    */
    handleKeyUp : function(e) {
        this.keys[e.keyCode] = false;
    },

    /**
    * @method keyCode
    */
    keyCode : function(e) {
        return keyChar.charCodeAt(0);
    },

    /**
    * @method handleKeyDown
    */
    eatKey : function(keyCode) {
        var isDown = this.keys[keyCode];
        this.keys[keyCode] = false;
        return isDown;
    },

    /**
    * @method updateMouseCoords
    */
    updateMouseCoords : function(e) {
        inputs.mouse.X = e.clientX - g_canvas.offsetLeft;
        inputs.mouse.Y = e.clientY - g_canvas.offsetTop;
    },

    /**
    * @method handleClick
    */
    handleClick : function(e) {
        inputs.updateMouseCoords(e);
        // var state = visualSM.insideState(inputs.mouse.X, inputs.mouse.Y);
        // if (state) state.isSelected = !state.isSelected;
    },

    /**
    * @method handleDblKlick
    */
    handleDblKlick : function(e) {
        inputs.updateMouseCoords(e);
        if (!e.which) return; // no button being pressed
        visualSM.insertState(inputs.mouse.X, inputs.mouse.Y);
   },

    /**
    * @method mouseDown
    */
    mouseDown : function(e) {
        var state = visualSM.insideState(inputs.mouse.X, inputs.mouse.Y);

        if (e.shiftKey){// && g_routeCircles.length === 0) { // shift + mouseClick
            inputs.updateMouseCoords(e);
            g_isBuildingEdge = true;
            draw.edgeX1 = inputs.mouse.X;
            draw.edgeY1 = inputs.mouse.Y;
            visualSM.prepareEdge(inputs.mouse.X, inputs.mouse.Y);
        }
        else if (state)// && g_routeCircles.length === 0)
            state.isSelected = true;
    },

    /**
    * @method mouseUp
    */
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

    /**
    * @method mouseMove
    */
    mouseMove : function(e) { inputs.updateMouseCoords(e); },

    /**
    * @method evalHandle
    */
    evalHandle : function() { visualSM.evaluate(); },

    /**
    * @method combineStatesHandle
    */
    combineStatesHandle : function() { 
        g_SM.subsetConstruction(g_SM.findStartState());
        g_SM.combineStates(); 
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
document.getElementById("combineStatesBtn").addEventListener("click", inputs.combineStatesHandle);