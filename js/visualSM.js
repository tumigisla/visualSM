// Get handler for canvas and define the context
var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

var g_SM = new DFA(); // make this more general

g_SM.alphabet = ['a', 'b']; // make this more general

/////////////

var visualSM = {

    // Returns the state object of the state
    // that's close enough to the current mouse
    // coordinates.
    findStateInRange : function(mouseX, mouseY) {
        for (var i = 0; i < g_SM._states.length; i++) {
            var st = g_SM._states[i];
            var dist = util.distSq(st.cx, st.cy, mouseX, mouseY);
            if (dist < consts.IN_RANGE)
                return st;
        }
    },

    // Pre : cx and cy are canvas coords.
    // Post : A new state with pos (cx, cy)
    //        has been added to g_SM and
    //        drawn to the canvas.
    insertState : function(cx, cy) {
        g_SM.generateState(cx, cy, this.addName('state'));
        
        var newState = g_SM._states[g_SM._states.length - 1];
        this.addToStats(newState);

        //draw.circle(g_ctx, cx, cy, consts.STATE_RADIUS);
    },

    // Pre :  x and y are canvas coords.
    // Post : A drawing path for a new Edge has
    //        begun, and the starting point of that
    //        Edge is (x, y).
    prepareEdge : function(x, y) {
        var fromState = this.findStateInRange(x, y);
        g_SM.generateEdge(fromState);

        var newEdge = g_SM._edges[g_SM._edges.length - 1];
        newEdge.updateStartCoords(x, y);

        //draw.startEdge(g_ctx, x, y);
    },

    // Pre : x and y are canvas coords.
    // Post : A drawing path for a new Edge has
    //        ended, and the ending point of that
    //        Edge is (x, y).
    //        It's symbols are the output of the
    //        prompt window.
    insertEdge : function(x, y) {
        var toState = this.findStateInRange(x, y);

        var newEdge = g_SM._edges[g_SM._edges.length - 1];
        newEdge.toState = toState;
        newEdge.symbols = this.addName('edge');
        newEdge.updateFinCoords(x, y);
        // Update the ingoing state so that it's
        // aware of it's incoming edge.
        newEdge.toState.incomingEdges.push(newEdge);

        this.addToStats(newEdge);

        draw.finEdge(g_ctx, x, y);
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
    addToStats : function(entity) {
        var listItem = document.createElement("li");

        var textNode;
        if (entity.name) // then it's a State 
            textNode = document.createTextNode('State' + ': ' + entity.name + ', ' + '(' + entity.cx
                                               + ', ' + entity.cy + ')');
        if (entity.symbols) // then it's an Edge
            textNode = document.createTextNode('Edge' + ': ' + '[' + entity.symbols + ']'
                                               + ', ' + 'from:' +  entity.fromState.name
                                                + ', ' + 'to:' + entity.toState.name);

        listItem.appendChild(textNode);

        var element = document.getElementById("stats");
        element.appendChild(listItem);
    }

};

////////////

var updateSimulation = function(du) {
    var states = g_SM._states,
        edges = g_SM._edges;
    for (var i = 0; i < states.length; i++)
        states[i].update(du);
    for (var i = 0; i < edges.length; i++)
        edges[i].update(du);
};

var renderSimulation = function(ctx) {
    var states = g_SM._states,
        edges = g_SM._edges;
    for (var i = 0; i < states.length; i++)
        states[i].render(ctx);
    for (var i = 0; i < edges.length; i++)
        edges[i].render(ctx);
};
