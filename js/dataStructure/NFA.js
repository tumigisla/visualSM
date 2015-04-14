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

NFA.prototype.maybeAddToDTran = function(T, U) {
    if (U.length() > 0) {
        var symbolsToAdd = [];
        for (var edge of this._edges) {
            if (T.contains(edge.fromState) &&
                U.contains(edge.toState)) {
                for (var sym of edge.symbols)
                    if (!util.contains(symbolsToAdd, sym))
                        symbolsToAdd.push(sym);
            }
        }
            
        DTran.push([T, symbolsToAdd, U]);
    }
};

NFA.prototype.epsClosState = function(state) {
    var s0Set = new Set();
    s0Set.add(state);
    var Dstates = [this.epsClosSet(this.move(state, eps))];   // an array of sets
    this.maybeAddToDTran(s0Set, this.epsClosSet(this.move(state, eps)));

    while(util.hasUnmarkedStateSet(Dstates)) {
        var T;
        // mark T
        for (var i = 0; i < Dstates.length; i++) {
            if (!Dstates[i].isMarked) {
                T = Dstates[i];
                Dstates[i].isMarked = true;
                break;
            }
        }

        if (T.length() === 0) {
            var index = Dstates.indexOf(T);
            Dstates.splice(index, 1);
            continue;
        }

        // for each input symbol
        for (var symbol of this.alphabet) {
            var U = this.epsClosSet(this.moveFromSet(T, symbol));
            if (!util.contains(Dstates, U)) {
                // The state hasn't been added.
                Dstates.push(U);
                this.maybeAddToDTran(T, U);
            }
        }
    }
    Dstates.unshift(s0Set);
    return Dstates;
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
        var epsStates = this.move(topState, eps);
        for (var j = 0; j < epsStates.length(); j++) {
            var anEpsState = epsStates.getObject(j);
            if (!epsClosT.contains(anEpsState)) {
                epsClosT.add(anEpsState);
                stack.push(anEpsState);
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
        var isStart, isFin;
        var newStateName = "";

        // new fromState
        var fromStateSet = tran[0]; 
        for (var i = 0; i < fromStateSet.length(); i++) {
            var aState = fromStateSet.getObject(i);
            isStart = aState.isStart();
            isFin = aState.isFin();
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
        this.generateEdge(fromState, toState, edgeSymbols);
        var newEdge = this._edges[this._edges.length - 1];
        this.initEdgeCoords(fromState, toState, newEdge);
    }
};


var alreadyOn = [],
    oldStates = [],
    newStates = [];

var visitedStates = [];

// str is an array
NFA.prototype.simulate = function(str) {

    this._routeEdges = [];

    var s0 = this.findStartState();
    this.addState(s0);

    for (var s of newStates) {
            var index = newStates.indexOf(s);
            newStates.splice(index, 1);
            oldStates.push(s);
            alreadyOn[s.id] = false;
        }

    for (var i = 0; i < str.length; i++) {

        var c = str[i];
        
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
        visitedStates.push(oldStatesCopy);
    

    }  

    this.addRouteEdges(s0);
    this.addRouteCircles();

    visitedStates = [];
    oldStates = [];
    newStates = [];

};


NFA.prototype.addState = function(s) {
    newStates.push(s);
    alreadyOn[s.id] = true;
    for (var i = 0; i < this.move(s, eps).length(); i++) {
        var aState = this.move(s, eps).getObject(i);
        if (!alreadyOn[aState.id])
            this.addState(aState);
    }
};

// Returns the set of states that you can go to when you're in
// state and you read symbol.
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
                for (var edge of this._edges)
                    if (edge.fromState === s0 && edge.toState === st)
                        if (!util.contains(this._routeEdges[i], edge))
                            // No duplicate edges.
                            this._routeEdges[i].push(edge);
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
    testNfa.generateState(300, 100, 'E', false, false);
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

    startingEpsClos = testNfa.epsClosState(stateA);

    console.log(startingEpsClos);
    console.log(DTran);
};

NFATest();