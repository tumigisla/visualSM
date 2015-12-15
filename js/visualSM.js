// Get handler for canvas and define the context
var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

var g_SM = new NFA();
var killRouteCircle = false;
var g_isBuildingEdge = false;

/////////////

/**
* The visualization part of the SM
*
* @class visualSM
* @constructor
*/
var visualSM = {

    /**
    * Updates the alphabet with the symbols that are not in the
    * alphaet already.
    *
    * Post: The alphabet has been updated if the intersection of
    *       symbols and the alphabet contained fewer elements than symbols.
    *
    * @method maybeUpdateAlphabet
    * @param {Array} symbols is an Array of strings
    */
    maybeUpdateAlphabet : function(symbols) {
        for (var i = 0; i < symbols.length; i++) {
            var inAlphabet = util.contains(g_SM.alphabet, symbols[i]);
            if (!inAlphabet) g_SM.alphabet.push(symbols[i]);
        }
    },

    /**
    * Finds the state that's in range with the current mouse coords.
    *
    * @method findStateInRange
    * @param {Number} mouseX is an x coordinate on the canvas
    * @param {Number} mouseY is an y coordinate on the canvas
    * @return {State} The state that's in range.
    */
    findStateInRange : function(mouseX, mouseY) {
        for (var i = 0; i < g_SM._states.length; i++) {
            var st = g_SM._states[i];
            var dist = util.distSq(st.cx, st.cy, mouseX, mouseY);
            if (dist < consts.IN_RANGE)
                return st;
        }
    },

     /**
    * Finds the state that the mouse cursor is inside.
    *
    * @method insideState
    * @param {Number} mouseX is an x coordinate on the canvas
    * @param {Number} mouseY is an y coordinate on the canvas
    * @return {State} The state that the mouse cursor is inside.
    */
    insideState : function(mouseX, mouseY) {
        for (var i = 0; i < g_SM._states.length; i++) {
            var st = g_SM._states[i];
            var inCircle = util.inCircle(mouseX, mouseY, st.cx, st.cy, st.radius);
            if (inCircle) return st;
        }
    },

    /**
    * Moves the state that the mouse cursor is inside of
    * to the new mouse coords.
    *
    * Post: A state has been moved if the mouse cursor was inside of one.
    *
    * @method maybeMoveState
    * @param {Number} mouseX is an x coordinate on the canvas
    * @param {Number} mouseY is an y coordinate on the canvas
    */
    maybeMoveState : function(mouseX, mouseY) {
        var maybeState = visualSM.insideState(inputs.mouse.X, inputs.mouse.Y);
        if (maybeState) {
            console.log(maybeState);
            maybeState.updateCoords(inputs.mouse.X, inputs.mouse.Y);
        }
    },

     /**
    * Inserts a new State to the global SM.
    *
    * Post: A new state having center pos (cx, cy) has been added to g_SM.
    *
    * @method insertState
    * @param {Number} cx is an x coordinate on the canvas
    * @param {Number} cy is an y coordinate on the canvas
    */
    insertState : function(cx, cy) {
        var attr = this.addAttr('state'); // name, isStart, isFin
        g_SM.generateState(cx, cy, attr[0], attr[1], attr[2]);

        var newState = g_SM._states[g_SM._states.length - 1];
        this.addToStats(newState);
    },

    /**
    * Starts a drawing path for a new Edge, having center coords (x, y)
    *
    * @method prepareEdge
    * @param {Number} x is an x coordinate on the canvas
    * @param {Number} y is an y coordinate on the canvas
    */
    prepareEdge : function(x, y) {
        var fromState = this.findStateInRange(x, y);
        g_SM.generateEdge(fromState);

        var newEdge = g_SM._edges[g_SM._edges.length - 1];
        var clampCoords = newEdge.clampToState(x, y, fromState);
        newEdge.updateStartCoords(clampCoords[0], clampCoords[1]);
    },

    /**
    * Inserts a new Edge to the global SM
    *
    * @method insertEdge
    * @param {Number} x is an x coordinate on the canvas
    * @param {Number} y is an y coordinate on the canvas
    */
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

    /**
    * Prompts the user for attributes to add to components on the canvas.
    *
    * @method addAttr
    * @param {String} type is the type of component to add attributes to.
    */
    addAttr : function(type) {
        /*
        if (type === 'state') {
            $('#stateModal').modal('show');
            return;
        }
        if (type === 'edge') {
            $('#edgeModal').modal('show');
            return;
        }
        if (type === 'evalStr') {
            $('#evalStringModal').modal('show');
            return;
        }
        */
            
         if (type === 'state') {
            var attr = prompt(type + 'Name isStart isFinal');
            attr = util.extractSymbols(attr);
            attr[1] = attr[1] === 'true';
            attr[2] = attr[2] === 'true';
            console.log(attr)
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

    /**
    * Prompts the user for attributes to add to components on the canvas.
    *
    * @method addAttr
    * @param {String} type is the type of component to add attributes to.
    */
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

    /**
    * Prompts the user for a string to evaluate and starts the evaluation of it.
    *
    * @method evaluate
    */
    evaluate : function() {
        var evalStr = this.addAttr('evalStr');
        //g_SM.evalString(evalStr); // for DFA evaluation
        g_SM.simulate(evalStr); // for NFA evaluation

        /*g_routeCircles.unshift(new RouteCircle());
        for (var rc of g_routeCircles)
            rc.getRouteEdges(0);    // for DFA evaluation
        */
    }

};

////////////

/**
* @method updateSimulation
*/
var updateSimulation = function(du) {
    var states = g_SM._states,
        edges = g_SM._edges;
    for (var i = 0; i < states.length; i++)
        states[i].update(du);
    for (var i = 0; i < edges.length; i++)
        edges[i].update(du);

    if (killRouteCircle) {
        g_routeCircles = [];
        killRouteCircle = false;
    }

    for (var rc of g_routeCircles) {
        if (!rc.isEmpty())
            rc.update(du);
        else
            // remove it.
            g_routeCircles.pop();
    }
};

/**
* @method renderSimulation
*/
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