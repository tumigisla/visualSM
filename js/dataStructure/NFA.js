var g_routeCircles = [];

function NFA() {
    this._transTable = {};
}

NFA.prototype = new SM();

NFA.prototype._initRoute = function(str, startState) {
    this._crntState = this.findState(startState.id);    // starting state
    this._routeStrings = [str + ' |'];
    this._routeEdges = [];
};


NFA.prototype.updateTransTable = function() {
    for (var i = 0; i < this._states.length; i++) {
        var aState = this._states[i];
        this._transTable[aState.id] = {};
        for (var a = 0; a < this.alphabet.length; a++) {
            var aSymbol = this.alphabet[a];
            this._transTable[aState.id][aSymbol] = aState.transition(aSymbol);
        }
    }
};

// Should print the correct transition table now.
NFA.prototype.dumpTransTable = function() {
    var dumpData = [];
    var firstLine = "STATE \t ";
    for (var i = 0; i < this.alphabet.length; i++)
        firstLine += this.alphabet[i] + "\t\t";
    dumpData.push(firstLine);

    for (var state = 0; state < util.objSize(this._transTable); state++) {
        var aState = this._transTable[state];
        var tmpStr = state + "\t\t";
        for (var symbol = 0; symbol < this.alphabet.length; symbol++) {
            var symbolSet = aState[this.alphabet[symbol]];
            tmpStr += "{";
            for (var i = 0; i < symbolSet.length(); i++) 
                tmpStr += symbolSet.getObject(i).id + ", ";
            tmpStr += "} \t";
        }
        dumpData.push(tmpStr);
    }
    return dumpData;
};

// Set of NFA states reachable from and NFA state
// on eps-transitions alone.
// Pre : state is an instance of the State object.
NFA.prototype.epsClosureState = function(state) {
    var epsClosureS = new Set();
    var Dstates = [state];
    while (Dstates.length > 0) {
        var T = Dstates.pop();
        for (var a = 0; a < this.alphabet.length; a++) { // for each input symbol
            var anInputSymbol = this.alphabet[a];
            var U = this.epsClosureSet(this.move(T, anInputSymbol));
            if (!util.contains(Dstates, U))
                for (var i = 0; i < U.length(); i++) {
                    Dstates.push(U[i]);
                    epsClosureS.add(U.getObject(i));
                }
        }
    }
    return epsClosureS;
};


// Set of NFA states reachable from some NFA state
// in the stateSet on eps-transitions alone.
NFA.prototype.epsClosureSet = function(stateSet) {
    var stack = [];
    for (var i = 0; i < stateSet.length(); i++)
        stack.push(stateSet.getObject(i));
    var epsClosureT = stateSet;

    while(stack.length > 0) {
        var t = stack.pop();
        var epsStateSet = this.move(t, 'eps');
        for (var i = 0; i < epsStateSet.length(); i++) {
            var u = epsStateSet.getObject(i);
            if (!epsClosureT.contains(u)) {
                epsClosureT.add(u);
                stack.push(u);
            }
        }
    }
    return epsClosureT;
};

var alreadyOn = [],
    oldStates = [],
    newStates = [];

// str is an array
NFA.prototype.simulate = function(str) {

    var startState = this.findStartState();
    for (var s of str)
        s = s.toLowerCase();
    this._initRoute(str[0], startState);

    // Add all edges from the starting state to the 
    // route edges.
    for (var edge of this._edges) {
        var firstSymbol = str[0];
        if (edge.fromState === startState && util.contains(edge.symbols, firstSymbol)) {
            this._routeEdges.push([edge]);
            //console.log(this._routeEdges);
        }
    }

    // init alreadyOn
    for (var i = 0; i < this._states.length; i++)
        alreadyOn[this._states[i].id] = false;

    var epsClosureStart = this.epsClosureState(this._startingState);
    for (var i = 0; i < epsClosureStart.length(); i++) {
        var aState = epsClosureStart.getObject(i);
        oldStates.push(aState);
        // adding a routeCircle
        //g_routeCircles.push(new RouteCircle());
        //index of current string.
        //g_routeCircles[g_routeCircles.length - 1].getRouteEdges(i);
        ////
        alreadyOn[aState.id] = true;
        this.addState(aState);
    }



        // for (s on oldStates)
    for (var s = 0; s < oldStates.length; s++) {
        var aState = oldStates[s];
        for (var i = 0; i < str.length; i++) {
            var c = str[i];
            // A set of states
            var movingStates = this.move(aState, c);

            if (movingStates.length() > 1) {
                // Make a new route branching from the latest one.
                for (var rE of this._routeEdges)
                    rE.push(movingStates.getObject(0));

                for (var e = 1; e < movingStates.length(); e++) {
                    var moveState = movingStates.getObject(e);
                    for (var edge of this._edges)
                        if (edge.fromState === aState && edge.toState === moveState) {
                            this._routeEdges.push([edge]);
                            //console.log(this._routeEdges);
                        }
                }
            }

            else {
                //console.log(movingStates.length(), c, aState);
                for (var j = 0; j < this.move(aState, c).length(); j++) {
                    var moveState = this.move(aState, c).getObject(j);

                        for (var routeEdge of this._routeEdges) {
                            for (var edge of this._edges)
                                if (edge.fromState === aState && edge.toState === moveState) {
                                    var latestEdge = routeEdge[routeEdge.length - 1];
                                    if (edge !== latestEdge)
                                        routeEdge.push(edge);
                                    //console.log(this._routeEdges);
                                }
                        }

                    if (!alreadyOn[moveState.id])
                        this.addState(moveState);
                }
            }

            oldStates.shift();
        }

        // for (s on newStates)
        for (var s = 0; s < newStates.length; s++) {
            var aState = newStates[s];
            newStates.shift();
            oldStates.push(aState);
            // adding a routeCircle
            //g_routeCircles.push(new RouteCircle());
            //index of current string.
            //g_routeCircles[g_routeCircles.length - 1].getRouteEdges(i); 
            ////
            alreadyOn[aState.id] = false;
        }
    }

    // add oldStates to a new set
    var set = new Set();
    for (var i = 0; i < oldStates.length; i++)
        set.add(oldStates[i]);

    if (util.areInterSecting(set, this.finalStates))
        console.log("YES");
    else
        console.log("NO");

    
    // Make route circles for this simulation.
    for (var routeBranch of this._routeEdges) {
        g_routeCircles.push(new RouteCircle());
        g_routeCircles[g_routeCircles.length - 1].getRouteEdges(routeBranch);
    }

    console.log(this._routeEdges);
    console.log(oldStates);

    // Clear the route edges, make ready for next simulation / evaluation.
    this._routeEdges = [];

    // Erase this when using NFA for evaluation.
    // g_routeCircles = [];
};


NFA.prototype.addState = function(s) {
    newStates.push(s);
    alreadyOn[s.id] = true;
    for (var i = 0; i < this.move(s, 'eps'); i++) {
        var aState = this.move(s, 'eps')[i];
        if (!alreadyOn[aState.id])
            this.addState(aState);
    }
};

// Returns the set of states that you can go to when you're in
// state and you read symbol.
NFA.prototype.move = function(state, symbol) {
    if (state) {
        var psblStates = state.transition(symbol);
        for (var i = 0; i < psblStates.length(); i++) {
            var aState = psblStates.getObject(i);
            for (var edge of this._edges)
                if (edge.fromState === state && edge.toState === aState)
                    1+1;
                    // this._routeEdges.push(edge);
        }
        return state.transition(symbol);
    }
    else 
        return new Set();
};

/////////////////////////////////////////////////////////

var NfaTest = function() {
    var testNfa = new NFA();

    // Remember to make alphabet manually when testing/debugging.
    testNfa.alphabet = ['a', 'b', 'eps'];

    var states = [];

    testNfa.generateState(0, 0, 'A', true, false);
    testNfa.generateState(0, 0, 'B', false, true);
    testNfa.generateState(0, 0, 'C', false, true);

    testNfa.generateEdge(testNfa.findStateByName('A'), testNfa.findStateByName('B'), ['a', 'b', 'eps']);
    testNfa.generateEdge(testNfa.findStateByName('A'), testNfa.findStateByName('C'), ['a']);

    testNfa.updateTransTable();

    var transTableData = testNfa.dumpTransTable();
    for (var i = 0; i < transTableData.length; i++)
        console.log(transTableData[i]);

    testNfa.simulate(['a']);
    console.log(newStates);
};

//NfaTest();