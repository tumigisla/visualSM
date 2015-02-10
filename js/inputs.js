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

        draw.circle(g_ctx, inputs.mouse.X, inputs.mouse.Y, consts.STATE_RADIUS);
        g_SM.generateState(inputs.mouse.X, inputs.mouse.Y, inputs.addName('state'));

        inputs.addToStats('state' ,g_SM._states[g_SM._states.length - 1]);
    },

    mouseDown : function(e) {
        if (e.shiftKey) {
            inputs.updateMouseCoords(e);

            var st = findStateInRange(inputs.mouse.X, inputs.mouse.Y);

            g_SM.generateEdge(st);

            edgeInMaking = g_SM._edges[g_SM._edges.length - 1];

            draw.startEdge(g_ctx, inputs.mouse.X, inputs.mouse.Y);
        }
    },

    mouseUp : function(e) {
        if (e.shiftKey) {
            inputs.updateMouseCoords(e);

            var st = findStateInRange(inputs.mouse.X, inputs.mouse.Y);

            edgeInMaking.toState = st;
            edgeInMaking.symbols = inputs.addName('edge');

            edgeInMaking.toState.incomingEdges.push(edgeInMaking);

            inputs.addToStats('edge', edgeInMaking);

            draw.finEdge(g_ctx, inputs.mouse.X, inputs.mouse.Y);
        }
    },

    // Give name to state/edge.
    // A prompt window with a text input
    // pops up.
    // Pre : type is a String and has to be either
    //       'state' or 'edge'.
    addName : function(type) {
        if (type === 'state') return prompt('Enter name of ' + type);
        if (type === 'edge') {
            var symbols = prompt('Enter symbols for ' + type + ' , seperated by whitespace.');
            // cut out whitespace and add symbols to the array
            return util.extractSymbols(symbols);
        }
        return;
        // TODO : deal with unnamed states or unnamed edges (empty string).
    },


    // Add stats about state or edge to html div
    // next to the canvas.
    // Pre : type is a String, either
    //       'state' or 'edge'.
    //       Entity is an object of state/edge.
    addToStats : function(type, entity) {
        var listItem = document.createElement("li");

        var textNode;
        if (type === 'state') 
            textNode = document.createTextNode(type + ': ' + entity.name + ', ' + '(' + entity.cx
                                               + ', ' + entity.cy + ')');
        if (type === 'edge')
            textNode = document.createTextNode(type + ': ' + '[' + entity.symbols + ']'
                                               + ', ' + 'from:' +  entity.fromState.name
                                                + ', ' + 'to:' + entity.toState.name);

        listItem.appendChild(textNode);

        var element = document.getElementById("stats");
        element.appendChild(listItem);
    }

};

window.addEventListener("keydown", inputs.handleKeydown);
window.addEventListener("keyup", inputs.handleKeyup);

window.addEventListener("dblclick", inputs.handleDblKlick);

window.addEventListener("mousedown", inputs.mouseDown);
window.addEventListener("mouseup", inputs.mouseUp);

console.log(inputs.mouse);

var edgeInMaking;