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
    for (var i = 0; i < this.move(s, 'ð').length(); i++) {
        var aState = this.move(s, 'ð').getObject(i);
        if (!alreadyOn[aState.id])
            this.addState(aState);
    }
};

// Returns the set of states that you can go to when you're in
// state and you read symbol.
NFA.prototype.move = function(state, symbol) {
    if (state) {
        return state.transition(symbol);
    }
    else 
        return new Set();
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