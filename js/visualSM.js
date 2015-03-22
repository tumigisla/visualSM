    // Get handler for canvas and define the context
var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

//var g_SM = new DFA(); // make this more general
var g_SM = new DFA();

var g_routeCircles = [];

var routeCircle = new RouteCircle();

/////////////

var visualSM = {

    // Pre : symbols is an array of strings
    // Post : Symbols from the symbols array that were
    //        previously not in this SM alphabet have
    //        been added to the alphabet.
    maybeUpdateAlphabet : function(symbols) {
        for (var i = 0; i < symbols.length; i++) {
            var inAlphabet = util.contains(g_SM.alphabet, symbols[i]);
            if (!inAlphabet) g_SM.alphabet.push(symbols[i]);
        }
    },

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

    // True if mouse cursor is inside the state.
    insideState : function(mouseX, mouseY) {
        for (var i = 0; i < g_SM._states.length; i++) {
            var st = g_SM._states[i];
            var inCircle = util.inCircle(mouseX, mouseY, st.cx, st.cy, st.radius);
            if (inCircle) return st;
        }
    },

    // If the mouse cursor is insede a state,
    // move state to the current mouseX and mouseY coords.
    maybeMoveState : function(mouseX, mouseY) {
        var maybeState = visualSM.insideState(inputs.mouse.X, inputs.mouse.Y);
        if (maybeState) {
            console.log(maybeState);
            maybeState.updateCoords(inputs.mouse.X, inputs.mouse.Y);
        }
    },

    // Pre : cx and cy are canvas coords.
    // Post : A new state with pos (cx, cy)
    //        has been added to g_SM and
    //        drawn to the canvas.
    insertState : function(cx, cy) {
        var attr = this.addAttr('state'); // name, isStart, isFin
        g_SM.generateState(cx, cy, attr[0], attr[1], attr[2]);

        var newState = g_SM._states[g_SM._states.length - 1];
        this.addToStats(newState);
    },

    // Pre :  x and y are canvas coords.
    // Post : A drawing path for a new Edge has
    //        begun, and the starting point of that
    //        Edge is (x, y).
    prepareEdge : function(x, y) {
        var fromState = this.findStateInRange(x, y);
        g_SM.generateEdge(fromState);

        var newEdge = g_SM._edges[g_SM._edges.length - 1];
        var clampCoords = newEdge.clampToState(x, y, fromState);
        newEdge.updateStartCoords(clampCoords[0], clampCoords[1]);
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
        newEdge.symbols = this.addAttr('edge');

        this.maybeUpdateAlphabet(newEdge.symbols);

        if (newEdge.toState) {
            var clampCoords = newEdge.clampToState(x, y, toState);
            newEdge.updateFinCoords(clampCoords[0], clampCoords[1]);

            // Update the ingoing state so that it's
            // aware of it's incoming edge.
            newEdge.toState.incomingEdges.push(newEdge);

            this.addToStats(newEdge);
        }
        else
            g_SM.removeEdge(newEdge);
     },

    // Give attributes to state/edge.
    // A prompt window with a text input
    // pops up.
    // Pre : type is a String and has to be either
    //       'state' or 'edge'.
    addAttr : function(type) {
        if (type === 'state') {
            var attr = prompt(type + 'Name isStart isFinal');
            attr = util.extractSymbols(attr);
            attr[1] = attr[1] === 'true';
            attr[2] = attr[2] === 'true';
            return attr;
        }
        if (type === 'edge') {
            var symbols = prompt(type + 'Symbols (seperated by whitespace)');
            // cut out whitespace and add symbols to the array
            return util.extractSymbols(symbols);
        }
        if (type === 'evalStr')
            return prompt('Enter string to evaluate');
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
        else if (entity.symbols) // then it's an Edge
            textNode = document.createTextNode('Edge' + ': ' + '[' + entity.symbols + ']'
                                               + ', ' + 'from:' +  entity.fromState.name
                                                + ', ' + 'to:' + entity.toState.name);
        else { // text route
            textNode = document.createTextNode('Route: ' + entity);
        }

        listItem.appendChild(textNode);

        var element = document.getElementById("stats");
        element.appendChild(listItem);
    },


    evaluate : function() {
        var evalStr = this.addAttr('evalStr');
        //g_SM.evalString(evalStr);
        g_SM.evalString(evalStr);

        g_routeCircles.unshift(new RouteCircle());
        for (var rc of g_routeCircles)
            rc.getRouteEdges();
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

    for (var rc of g_routeCircles) {
        if (!rc.isEmpty())
            rc.update(du);
        else
            // remove it.
            g_routeCircles.pop();
    }
};

var g_isBuildingEdge = false;

var renderSimulation = function(ctx) {
    var states = g_SM._states,
        edges = g_SM._edges;
    for (var i = 0; i < states.length; i++)
        states[i].render(ctx);
    for (var i = 0; i < edges.length; i++)
        edges[i].render(ctx);

    if (g_isBuildingEdge)
        draw.edge(ctx, draw.edgeX1, draw.edgeY1,
                  inputs.mouse.X, inputs.mouse.Y);

    for (var rc of g_routeCircles)
        rc.render(ctx);
};