function NFA() {
    this._transTable = {};
}

NFA.prototype = new SM();

NFA.prototype._initRoute = function(str, startState) {
    this._crntState = this.findState(startState.id);
    this._routeStr = str + ' |';
    this._allRouteStr = [this._routeStr];
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

NFA.prototype._initRoute = function(str, startState) {
    this._crntState = this.findState(startState.name);
    this._routeStr = str + ' |';
    this._routeEdges = [];
};

// Set of NFA states reachable from an NFA state
// on eps-transitions alone.
// Pre : state is an instance of the State object.
NFA.prototype.epsClosureState = function(state) {
    var epsClosureS = new Set();
    var Dstates = [state];
    
    while (Dstates.length > 0) {
        var T = Dstates.pop();
     
        for (var symbol of this.alphabet) {
            var U = this.epsClosureSet(this.move(T, symbol));
     
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

NFA.prototype.simulate = function(str) {

    var startState = this.findStartState();
    str = str.toLowerCase();
    this._initRoute(str, startState);

    // init alreadyOn
    for (var i = 0; i < this._states.length; i++)
        alreadyOn[this._states[i].id] = false;

    var epsClosureStart = this.epsClosureState(this._startingState);
    for (var i = 0; i < epsClosureStart.length(); i++) {
        var aState = epsClosureStart.getObject(i);
        oldStates.push(aState);
        alreadyOn[aState.id] = true;
        this.addState(aState);
    }


    for (var i = 0; i < str.length; i++) {
        var c = str[i];
        // for (s on oldStates)
        for (var s = 0; s < oldStates.length; s++) {
            var aState = oldStates[s];
            for (var j = 0; j < this.move(aState, c).length(); j++) {
                var moveState = this.move(aState, c).getObject(j);
                if (!alreadyOn[moveState.id])
                    this.addState(moveState);
            }
            oldStates.shift();
        }

        // for (s on newStates)
        for (var s = 0; s < newStates.length; s++) {
            var aState = newStates[s];
            newStates.shift();
            oldStates.push(aState);
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
    if (state)
        return state.transition(symbol);
    else 
        return new Set();
};

/////////////////////////////////////////////////////////

var testNfa = new NFA();

// Remember to make alphabet manually when testing/debugging.
testNfa.alphabet = ['a', 'b', 'eps'];

testNfa.generateState(0, 0, 'A', true, false);
testNfa.generateState(0, 0, 'B', false, true);
testNfa.generateState(0, 0, 'C', false, false);

testNfa.generateEdge(testNfa.findState('A'), testNfa.findState('B'), ['a', 'b', 'eps']);
testNfa.generateEdge(testNfa.findState('A'), testNfa.findState('C'), ['']);

testNfa.updateTransTable();

var transTableData = testNfa.dumpTransTable();
for (var i = 0; i < transTableData.length; i++)
    console.log(transTableData[i]);

console.log(testNfa.epsClosureState(testNfa.findState('A')));

testNfa.simulate(['a']);
console.log(oldStates);