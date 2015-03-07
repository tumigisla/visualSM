function NFA() {
    this._startingState;
    this._transTable = {};
}

NFA.prototype = new SM();


NFA.prototype.updateTransTable = function() {
    for (var i = 0; i < this._states.length; i++) {
        var aState = this._states[i];
        this._transTable[i] = {};
        for (var a = 0; a < this.alphabet.length; a++) {
            var aSymbol = this.alphabet[a];
            this._transTable[i][aSymbol] = aState.psblTransNfa(aSymbol);
        }
    }
};

// Should print the correct transition table now.
NFA.prototype.dumpTransTable = function() {
    var dumpData = [];
    var firstLine = "STATE \t ";
    for (var i = 0; i < this.alphabet.length; i++)
        firstLine += this.alphabet[i] + "\t";
    dumpData.push(firstLine);

    for (var state = 0; state < util.objSize(this._transTable); state++) {
        var aState = this._transTable[state];
        var tmpStr = state + "\t";
        for (var symbol = 0; symbol < this.alphabet.length; symbol++) {
            var symbolSet = aState[this.alphabet[symbol]];
            if (symbolSet.isEmpty())
                tmpStr += "Empt \t";
            else {
                tmpStr += "{";
                for (var i = 0; i < symbolSet.length(); i++) 
                    tmpStr += symbolSet.getObject(i).name;
                tmpStr += "}";
            }
        }
        dumpData.push(tmpStr);
    }
    return dumpData;
};

NFA.prototype.transition = function(state) /* and some more inputs */ {

};


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
console.log(testNfa.dumpTransTable());