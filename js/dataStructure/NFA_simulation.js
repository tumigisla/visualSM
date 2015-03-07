function NFA() {
    this._transTable = {};
}

NFA.prototype = new SM();

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
            if (symbolSet.isEmpty())
                tmpStr += "Empt \t";
            else {
                tmpStr += "{";
                for (var i = 0; i < symbolSet.length(); i++) 
                    tmpStr += symbolSet.getObject(i).id;
                tmpStr += "} \t";
            }
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
    oldStates = new Set(),
    newStates = new Set();

NFA.prototype.simulate = function(str) {
    
    for (var i = 0; i < this._states.length; i++) {
        var aState = this._states[i];
        alreadyOn[aState.id] = false;
    }   // CHECK

    var epsClosStart = this.epsClosureState(this._startingState);   // CHECK
    for (var i = 0; i < epsClosStart.length(); i++) {
        var aState = epsClosStart.getObject(i);
        oldStates.add(aState);
        alreadyOn[aState.id] = true;
    }   // CHECK

    // for (s on oldStates)
    for (var a = 0; a < str.length; a++) {
        var c = str[a];
        for (var i = 0; i < oldStates.length(); i++) {
            var aState = oldStates.getObject(i);
            var moveSet = this.move(aState, c);
            for (var j = 0; j < moveSet.length(); j++) {
                var moveState = moveSet.getObject(j);
                if (!alreadyOn[moveState.id])
                    this.addState(moveState);
            }
            // pop aState from oldStates.
            oldStates.remove(aState);
        }

        // for (s on newStates)
        for (var i = 0; i < newStates.length(); i++) {
            var aState = newStates.getObject(i);
            
            // pop aState from newStates
            newStates.remove(aState);
            // push aState onto oldStates
            oldStates.add(aState);
     
            if (aState) alreadyOn[aState.id] = false;
        }
    }

    /*
    console.log(oldStates);
    console.log(this.finalStates);
    console.log(util.intersect(newStates, this.finalStates));

    // (if S intersect F != emptySet) return "Yes"
    if (util.intersect(newStates, this.finalStates).length() !== 0)
        console.log("Yes");
    else
        console.log("No");
    */
};


NFA.prototype.addState = function(state) {
    newStates.add(state);
    alreadyOn[state.id] = true;
    var moveSet = this.move(state, 'eps');
    for (var i = 0; i < moveSet.length(); i++) {
        var aState = moveSet.getObject(i);
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
testNfa.generateState(0, 0, 'B', false, false);
testNfa.generateState(0, 0, 'C', false, false);
testNfa.generateState(0, 0, 'D', false, true);

testNfa.generateEdge(testNfa.findState('A'), testNfa.findState('B'), ['a', 'b', 'eps']);
testNfa.generateEdge(testNfa.findState('B'), testNfa.findState('C'), ['a', 'b']);
testNfa.generateEdge(testNfa.findState('C'), testNfa.findState('D'), ['a']);

testNfa.updateTransTable();

var transTableData = testNfa.dumpTransTable();
for (var i = 0; i < transTableData.length; i++)
    console.log(transTableData[i]);

testNfa.simulate(['a', 'a', 'a']);