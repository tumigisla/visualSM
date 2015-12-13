/*
* Globals
*/
var g_routeCircles = [];
var eps = 'd';
var startingEpsClos;
var DTran = [];
var Dstates;
var alreadyOn = [],
    oldStates = [],
    newStates = [];
var visitedStates = [],
    tmpVisitedStates = [];

/**
* Non-Deterministic Finite State Machine (NFA)
*
* Usage :
*  new NFA();

* @class NFA
* @constructor
*/
function NFA() {}

NFA.prototype = new SM();   // Inherits from SM

/**
* Initializes the route string.
*
* Post: _crntState, _routeStrings and _routeEdges have been initalized for 
        the next evaluation of a String.
*
* @method _initRoute
* @param {String} str is the name of the string being evaluated
* @param {State} startState is the starting state of the SM
*/
NFA.prototype._initRoute = function(str, startState) {
    this._crntState = this.findState(startState.id);    // starting state
    this._routeStrings = [str + ' |'];
    this._routeEdges = [];
};

/**
* Extracts the names of states in a set to a comma seperated string. 
*
* @method extractStr
* @param {Set} stateSet is a Set of State objects.
* @return {String} The comma seperated string of the names of the states in the set.
*/
NFA.prototype.extractStr = function(stateSet) {
    var str = "";
    for (var i = 0; i < stateSet.length(); i++) {
        var aState = stateSet.getObject(i);
        if (aState.name) str += aState.name + ',';        
    }
    return str;
};

/**
* DTran, the transition table, is updated.
* Based on chapter 3.7.1 (starting at p.152) in the dragon book.
*
* Post: DTran, the transition table, has been updated.
*
* @method updateDTran
* @param {Set} T is a set of states
* @param {String} symbol is the symbol from the eval string being
*                 added to the transition table.
* @param {Set} U is a set of states 
*/
NFA.prototype.updateDTran = function(T, symbol, U) {
    if (U.length() > 0) {
        // Check if T -> already in DTran
        for (var tran of DTran) {
            if (T === tran[0] && U === tran[2]) {
                tran[1].push(symbol);
                return;
            }
        }
        // Otherwise, add a new entry.
        DTran.push([T, [symbol], U]);
    }
};

/**
* Computes the set of states a state can transition to.
* Based on Figure 3.32, p.154 in the dragon book.
*
* Post: Dstates has been updated.
*
* @method subsetConstruction
* @param {State} state is the state to compute the subset from.
* @return {Set} The current status of Dstates.
*/
NFA.prototype.subsetConstruction = function(state) {
    Dstates = [this.epsClosState(state)];   // an array of sets

    for (var crntIndex = 0; crntIndex < Dstates.length; crntIndex++) {
        var T = Dstates[crntIndex];
        // for each input symbol
        for (var symbol of this.alphabet) {
            if (symbol === eps) continue;
            var U = this.epsClosSet(this.moveFromSet(T, symbol));
            if (U.length()> 0 && !util.contains(Dstates, U)) {
                // The state hasn't been added.
                // thus increasing the length of Dstates
                // and adding another iteration to the outer-most loop.
                Dstates.push(U);
                this.updateDTran(T, symbol, U);
            }
        }
    }
    return Dstates;
};

/**
* Computes the epsilon closure from a single state.
* Based on chapter 3.7.1 (starting at p.152) in the dragon book.
*
* @method epsCloseState
* @param {State} state is the state to compute the epsilon closure from.
* @return {Set} The set of states in the epsilon closure of state.
*/
NFA.prototype.epsClosState = function(state) {
    var returnSet = new Set();
    returnSet.add(state);
    var epsSet = state.transition(eps);
    for (var i = 0; i < epsSet.length(); i++)
        returnSet.add(epsSet.getObject(i));
    return returnSet;
};

/**
* Computes the epsilon closure from a set of states.
* Based on Figure 3.33 p.154 in the dragon book.
*
* @method epsCloseSet
* @param {State} stateSet is the set of states to compute the epsilon closure from.
* @return {Set} The set of states in the epsilon closure of stateSet.
*/
NFA.prototype.epsClosSet = function(stateSet) {
    var stack = [];
    // Push all states onto stack.
    if (stateSet.length() > 0)
        for (var i = 0; i < stateSet.length(); i++)
            stack.push(stateSet.getObject(i));
    var epsClosT = stateSet;
    while (stack.length !== 0) {
        var topState = stack.pop();
        for (var outEdge of topState.outgoingEdges) {
            if (util.contains(outEdge.symbols, eps) &&
                !epsClosT.contains(outEdge.toState))
            {
                epsClosT.add(outEdge.toState);
                stack.push(outEdge.toState);
            }
        }
    }
    return epsClosT;
};

/**
* Combines the states that can be the same state according to
* the already computed transition table DTran.
* Based on chapter 3.7.1 (starting at p.152) in the dragon book.
*
* Post: The logic of the state machine has been updated according
*       to the combination of the states.
*
* @method combineStates
*/
NFA.prototype.combineStates = function() {
    /*
        Pseudo for this method:

        - delete all the current states and edges
            (_states = []  _edges = [] finalStates = {empty set})

        for (all things in DTran)
            - make new state from 0th entry
            - make new state from 2nd entry
            - make edge from 0th entry state to
              2nd entry state having the symbols
              in the 1st entry

    */

    // Remove old states and edges.
    this._states = [];
    this._edges = [];
    this.finalStates = new Set();

    // Init new coords.
    var cx = 100,
        cy = 100;

    for (var tran of DTran) {
        var isStart = false,
            isFin = false;
        var newStateName = "";

        // new fromState
        var fromStateSet = tran[0]; 
        for (var i = 0; i < fromStateSet.length(); i++) {
            var aState = fromStateSet.getObject(i);
            if (aState.isStart()) isStart = true;
            if (aState.isFin()) isFin = true;
            if (aState.name) newStateName += aState.name;
            else             newStateName += " ";
        }
        if (!this.findStateByName(newStateName))
            this.generateState(cx, cy, newStateName, isStart, isFin);

        var fromState = this.findStateByName(newStateName);

        newStateName = "";

        cx += 50;
        cy += 50;

        // new toState
        var toStateSet = tran[2];
        for (var i = 0; i < toStateSet.length(); i++) {
            var aState = toStateSet.getObject(i);
            isStart = aState.isStart();
            isFin = aState.isFin();
            if (aState.name) newStateName += aState.name;
            else             newStateName += " ";               
        }
        if (!this.findStateByName(newStateName))
            this.generateState(cx, cy, newStateName, isStart, isFin);

        var toState = this.findStateByName(newStateName);

        cx += 50;
        cy += 50;

        // new edge between fromState and toState
        var edgeSymbols = tran[1];
        // remove eps transitions
        if (util.contains(edgeSymbols, eps)) {
            var index = edgeSymbols.indexOf(eps);
            edgeSymbols.splice(index, 1);
        }
        this.generateEdge(fromState, toState, edgeSymbols);
        var newEdge = this._edges[this._edges.length - 1];
        this.initEdgeCoords(fromState, toState, newEdge);
    }
};

/**
* Simulates the evaluation of an input string for this SM.
* Based Figure 3.37, p.156 in the dragon book.
*
* Post: The logic for the simulation has been computed.
*
* @method simulate
* @param {String} str is the evaluation string.
*/
NFA.prototype.simulate = function(str) {

    this._routeEdges = [];

    var s0 = this.findStartState();
    s0.depths.push(0);
    var epsClosStates = this.epsClosState(s0);
    for (var i = 0; i < epsClosStates.length(); i++)
        this.addState(epsClosStates.getObject(i));

    for (var s of newStates) {
            var index = newStates.indexOf(s);
            newStates.splice(index, 1);
            oldStates.push(s);
            alreadyOn[s.id] = false;
    }


    for (var i = 0; i < str.length; i++) {
        var c = str[i];

        if (!(util.contains(this.alphabet, c)) ||
            (testNfa && util.contains(testNfa.alphabet, c))) break;

        var index;

        for (var k = 0; k < oldStates.length; k++) {

            var s = oldStates[k];
            var moveSC = this.move(s, c);   // a set of states
            for (var j = 0; j < moveSC.length(); j++) {

                var t = moveSC.getObject(j);    // a state

                if (!alreadyOn[t.id])
                    this.addState(t);
            }

            var index = oldStates.indexOf(s);
            oldStates.splice(index, 1);
            --k;
        }

        for (var k = 0; k < newStates.length; k++) {
            var s = newStates[k];
            var index = newStates.indexOf(s);
            newStates.splice(index, 1);
            --k;
            oldStates.push(s);
            alreadyOn[s.id] = false;
        }

        var oldStatesCopy = oldStates.slice(0);
        for (var ost of oldStatesCopy)
            tmpVisitedStates.push(ost);
    }  

    // Compute all the distances from the starting state (root).
    for (var st of tmpVisitedStates) {
        for (var edge of this._edges) {
            if (edge.toState === st) {
                var fsDepths = edge.fromState.depths;
                var tsDepths = edge.toState.depths;
                var latestDepth = fsDepths[fsDepths.length - 1];
                tsDepths.push(latestDepth + 1);
            }
        }   
    }

    // Add states in the correct ordering to the visitedStates array.
    for (var st of tmpVisitedStates) {
        if (!st.depths.length > 0) break;
        var index = st.depths.shift();
        console.log(index);
        if (visitedStates[index])
            visitedStates[index].push(st);
        else
            visitedStates[index] = [st];
    }

    // Clean up the array.
    for (var i = 0; i < visitedStates.length; i++) {
        if (!visitedStates[i]) {
            visitedStates.splice(i, 1);
            i--;
        }
    }
    
    if (util.contains(visitedStates[0], s0)) {
        var index = visitedStates[0].indexOf(s0);
        visitedStates[0].splice(index, 1);
    }

    if (visitedStates[0].length === 0)
        visitedStates.shift();

    this.addRouteEdges(s0);
    this.addRouteCircles();

    var oldStatesSet = new Set();
    for (var st of oldStates)
        oldStatesSet.add(st);

    // console.log(util.areInterSecting(oldStatesSet, this.finalStates));

    visitedStates = [];
    oldStates = [];
    newStates = [];
    tmpVisitedStates = [];
};

/**
* A recursive method that adds a new state s, which is known not to be
* on newStates.
*
* Post: The state and all it's recursively computed epsilon closure states
*       have been added to newStates.
*
* @method addState
* @param {State} s is a State.
*/
NFA.prototype.addState = function(s) {
    newStates.push(s);
    alreadyOn[s.id] = true;
    var epsStates = this.epsClosState(s);
    for (var i = 0; i < epsStates.length(); i++) {
        var aState = epsStates.getObject(i);
        if (!alreadyOn[aState.id])
            this.addState(aState);
    }
};

/**
* Computes the transition set for a given state and input symbol.
*
* @method move
* @param {State} state is the state to compute the transition from.
* @param {String} symbol is the input symbol to compute the transition for.
* @return {Set} The transition set.
*/
NFA.prototype.move = function(state, symbol) {
    if (state)  return state.transition(symbol);
    else        return new Set();
};

/**
* Computes the transition set for a given set of states and input symbol.
*
* @method moveFromSet
* @param {Set} stateSet is the set of states to compute the transition from.
* @param {String} symbol is the input symbol to compute the transition for.
* @return {Set} The transition set.
*/
NFA.prototype.moveFromSet = function(stateSet, symbol) {
    var allToStates = new Set();
    for (var i = 0; i < stateSet.length(); i++) {
        var aState = stateSet.getObject(i);
        var toStates = this.move(aState, symbol);
        for (var j = 0; j < toStates.length(); j++)
            allToStates.add(toStates.getObject(j));
    }
    return allToStates;
};

/**
* Computes the edges that should be a part of the route in the simulation,
* given a state, and adds to the route edges collection.
*
* Post: The edges have been added to the _routeEdges collection.
*
* @method addRouteEdges
* @param {State} s0 is  the state to compute the edges for.
*/
NFA.prototype.addRouteEdges = function(s0) {
    for (var i = 0; i < visitedStates.length; i++) {
        var v = visitedStates[i];
        this._routeEdges.push([]); // Will be the ith element of routeEdges.
        if (i === 0) {
            // Check if there's  and edge from starting state 
            // to any of the visited states.
            for (var st of v) {
                for (var edge of this._edges) {
                    if (edge.fromState === s0 && edge.toState === st) {
                        if (!util.contains(this._routeEdges[i], edge))
                            // No duplicate edges.
                            this._routeEdges[i].push(edge);
                    }
                }
            }
        }
        else if (i > 0) { // Last visited state is visitedStates[i - 1]
            for (var st of v) {
                // Check for edges between visitedStates[i - 1]
                // and visitedStates[i]
                for (var ovst of visitedStates[i - 1]) { // old visited states
                    for (var edge of this._edges)
                        if (edge.fromState === ovst && edge.toState === st)
                            if (!util.contains(this._routeEdges[i], edge))
                                // No duplicate edges.
                                this._routeEdges[i].push(edge);
                }
            }
        }
    }
};

/**
* Computes the route circles (the blue simulation circles) 
* that should be a part of the route in the simulation,
* given a state, and adds to the route circles collection.
*
* Post: The circles have been added to the _routeCircles collection.
*
* @method addRouteCircles
*/
NFA.prototype.addRouteCircles = function() {
    var rC = new RouteCircle();
    var rCP = rC.routePoints;

    for (var i = 0; i < this._routeEdges.length; i++) {
        var rE = this._routeEdges[i];

        rCP.push([]);   // one set of edges between states (one transfer
                        // between states in the animation)

        for (var j = 0; j < rE.length; j++) {
            var r = rE[j];

            rCP[i].push([]);

            r.updateLinePoints(100);

            for (var p of r.points)
                rCP[i][j].unshift(p);
        }
    }

    g_routeCircles.push(rC);
};

/**
* Initializes the coords for a a given edge and states it is
* connected to.
*
* Post: The coords have been initialized.
*
* @method initEdgeCoords
* @param {State} fromState is the state that newEdge goes from.
* @param {State} toState is the state that newEdge goes to.
* @param {Edge} newEdge is the Edge to initalize the coords for. 
*/
NFA.prototype.initEdgeCoords = function(fromState, toState, newEdge) {
    // fromState
    clampCoords = newEdge.clampToState(fromState.cx, fromState.cy, fromState);
    newEdge.updateStartCoords(clampCoords[0], clampCoords[1]);
    // toState
    clampCoords = newEdge.clampToState(toState.cx, toState.cy, toState);
    newEdge.updateFinCoords(clampCoords[0], clampCoords[1]);
};