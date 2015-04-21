var g_routeCircles = [];

var eps = 'd';

var startingEpsClos;

function NFA() {}

NFA.prototype = new SM();

NFA.prototype._initRoute = function(str, startState) {
    this._crntState = this.findState(startState.id);    // starting state
    this._routeStrings = [str + ' |'];
    this._routeEdges = [];
};

NFA.prototype.extractStr = function(stateSet) {
    var str = "";
    for (var i = 0; i < stateSet.length(); i++) {
        var aState = stateSet.getObject(i);
        if (aState.name) str += aState.name + ',';        
    }
    return str;
};

var DTran = [];

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

var Dstates;

NFA.prototype.subsetConstruction = function(state) {
    Dstates = [this.epsClosState(state)];   // an array of sets

    for (var crntIndex = 0; crntIndex < Dstates.length; crntIndex++) {
        var T = Dstates[crntIndex];
        // for eaxh input symbol
        for (var symbol of this.alphabet) {
            if (symbol === eps) continue;
            var U = this.epsClosSet(this.moveFromSet(T, symbol));
            if (U.length()> 0 && !util.contains(Dstates, U)) {
                // The state hasn't been added.
                Dstates.push(U); // thus increasing the length of Dstates
                                 // and adding another iteration to the outer-most loop.
                this.updateDTran(T, symbol, U);
            }
        }
    }
    return Dstates;
};

NFA.prototype.epsClosState = function(state) {
    var returnSet = new Set();
    returnSet.add(state);
    var epsSet = state.transition(eps);
    for (var i = 0; i < epsSet.length(); i++)
        returnSet.add(epsSet.getObject(i));
    return returnSet;
};

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



NFA.prototype.combineStates = function() {
    /*
        - delete all the current states and edges
            (_states = []  _edges = [] finalStates = {empty set})

        for (all things in DTran)
            - make new state from 0th entry
                -
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


var alreadyOn = [],
    oldStates = [],
    newStates = [];

var visitedStates = [],
    tmpVisitedStates = [];

// str is an array
NFA.prototype.simulate = function(str) {

    this._routeEdges = [];

    var s0 = this.findStartState();
    s0.distFromStart = 0;
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
        //visitedStates.push(oldStatesCopy);
    }  

    // Compute all the distances from the starting state (root).
    for (var st of this._states) {
        for (var edge of this._edges) {
            if (edge.fromState === st)
                edge.toState.distFromStart = edge.fromState.distFromStart + 1;
        }
    }

    for (var st of tmpVisitedStates) {
        var index = st.distFromStart;
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

    this.addRouteEdges(s0);
    this.addRouteCircles();


    var oldStatesSet = new Set();
    for (var st of oldStates)
        oldStatesSet.add(st);

    console.log(util.areInterSecting(oldStatesSet, this.finalStates));
    
    visitedStates = [];
    oldStates = [];
    newStates = [];
    
};


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

// Returns the set of states that you can go to when you're in
// state and read symbol.
NFA.prototype.move = function(state, symbol) {
    if (state)  return state.transition(symbol);
    else        return new Set();
};

// Returns the set of states that's possible to go to
// from a given set of states(stateSet) when an input
// symbol is read.
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
                    else if (edge.toState === st){
                        console.log('SPLICING');
                        //visitedStates.splice(i+1, 0, [st]);
                        if (visitedStates[i+2] && util.contains(visitedStates[i+2], st)) {
                            var index = visitedStates[i+2].indexOf(st);
                            //visitedStates[i+2].splice(index,1);
                        }
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

NFA.prototype.initEdgeCoords = function(fromState, toState, newEdge) {
    // fromState
    clampCoords = newEdge.clampToState(fromState.cx, fromState.cy, fromState);
    newEdge.updateStartCoords(clampCoords[0], clampCoords[1]);
    // toState
    clampCoords = newEdge.clampToState(toState.cx, toState.cy, toState);
    newEdge.updateFinCoords(clampCoords[0], clampCoords[1]);
};

/////////////////////////////////////////////////////////

var testNfa;

var NFATest = function() {
    testNfa = new NFA();

    var newEdge;

    testNfa.alphabet = ['a', 'b', eps];

    testNfa.generateState(50, 50, 'A', true, false);
    testNfa.generateState(200, 50, 'B', false, false);
    testNfa.generateState(200, 200, 'C', false, false);
    testNfa.generateState(300, 100, 'E', false, true);
    testNfa.generateState(400, 100, 'F', false, true)

    var stateA = testNfa.findStateByName('A'),
        stateB = testNfa.findStateByName('B'),
        stateC = testNfa.findStateByName('C'),
        stateE = testNfa.findStateByName('E'),
        stateF = testNfa.findStateByName('F');

    testNfa.generateEdge(stateA, stateB, ['a', 'b', eps]);
    newEdge = testNfa._edges[testNfa._edges.length - 1];
    testNfa.initEdgeCoords(stateA, stateB, newEdge);

    testNfa.generateEdge(stateA, stateC, ['a', eps]);
    newEdge = testNfa._edges[testNfa._edges.length - 1];
    testNfa.initEdgeCoords(stateA, stateC, newEdge);

    testNfa.generateEdge(stateC, stateE, ['a']);
    newEdge = testNfa._edges[testNfa._edges.length - 1];
    testNfa.initEdgeCoords(stateC, stateE, newEdge);

    testNfa.generateEdge(stateE, stateF, ['a']);
    newEdge = testNfa._edges[testNfa._edges.length - 1];
    testNfa.initEdgeCoords(stateE, stateF, newEdge);    

    startingEpsClos = testNfa.subsetConstruction(stateA);

    console.log(Dstates);
    console.log(DTran);
};

//NFATest();