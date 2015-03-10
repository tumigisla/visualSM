/*
 A Deterministic Finite State Machine (DFA)

 Usage:

    DFA.alphabet = [String];

    DFA.generateState(name, start, fin);
    .
    .
    .

    DFA.generateEdge(fromState, toState, symbols);
    .
    .
    .

    DFA.evalString(String);

    (see details below)

*/
function DFA(descr) {}

DFA.prototype = new SM();

// Usage : DFA._initRoute(str);
// Post : _routes and _crntStates have been
//        initialized for next evaluation of a String.
DFA.prototype._initRoute = function(str, startState) {
    this._crntState = this.findState(startState.id);    // starting state
    this._routeStr = str + ' |';
    this._routeEdges = [];
};

// Usage : DFA.evalString(str);
// Return value : An array of routes the DFA takes
//                to evaluate the input str.
DFA.prototype.evalString = function(str) {
    var startState = this.findStartState();
    str = str.toLowerCase();    // upper case symbols accepted as well
    this._initRoute(str, startState);  // make ready for evaluation

    for (var i = 0; i < str.length; i++) {
        // Stop evaluating if one of the input symbols
        // is not in the alphabet.
        if (!this.symbolInAlphabet(str[i])) break;

        this.addToRoute(this._crntState);
        var psblEdge = this._crntState.psblTrans(str[i]);

        if (psblEdge) {
            this.move(psblEdge.toState);
            this._routeEdges.push(psblEdge);
        }
        else
            this._routeStr += "No possible transition from " + this._crntState.name
                                        + " given input " + str[i] + ', ';
    }

    this.addAcceptance();
    //this.printRoute();
    visualSM.addToStats(this._routeStr);
};

// Usage : DFA.move(newState);
// Post : DFA._crntState is not newState
DFA.prototype.move = function(newState) {
    this._crntState = newState;
};

// Usage : DFA.addToRoute();
// Post : The name of state has been
//        added to the route string.
DFA.prototype.addToRoute = function(state) {
    this._routeStr += state.name + ' -> ';
};

// Usage : DFA.printRoute();
// Post : The route DFA took to evaluate the input
//        have been logged to the console.
DFA.prototype.printRoute = function() {
    console.log(this._routeStr);
};

// Usage : DFA.addAcceptance();
// Pre : DFA has evaluated all of it's input.
// Post : An indication of whether the input str
//        has been accepted or not by DFA has been
//        pushed to the back of the route string.
DFA.prototype.addAcceptance = function() {
    if (this._crntState.isFin())
        this._routeStr += ' ' + this._crntState.name + ' : Accepted';
    else
        this._routeStr += ' ' + this._crntState.name + ' : NOT Accepted';
};

var testDfa = function() {
    // DFA
    // L = (a(a + b)) + (b(a + b))
    
    var testDfa = new DFA();

    testDfa.alphabet = ['a', 'b'];

    testDfa.generateState('q0', true, false);
    testDfa.generateState('q1', false, false);
    testDfa.generateState('q2', false, false);
    testDfa.generateState('qf', false, true);

    testDfa.generateEdge(testDfa.findState('q0'), testDfa.findState('q1'), ['a']);
    testDfa.generateEdge(testDfa.findState('q0'), testDfa.findState('q2'), ['b']);
    testDfa.generateEdge(testDfa.findState('q1'), testDfa.findState('qf'), ['a', 'b']);
    testDfa.generateEdge(testDfa.findState('q2'), testDfa.findState('qf'), ['a', 'b']);

    // Trash state
    testDfa.generateState('qTrash', false, false);
    testDfa.generateEdge(testDfa.findState('qf'), testDfa.findState('qTrash'), ['a', 'b']);
    testDfa.generateEdge(testDfa.findState('qTrash'), testDfa.findState('qTrash'), ['a', 'b']);

    // Accepted
    testDfa.evalString('aa');
    testDfa.evalString('ab');
    testDfa.evalString('ba');
    testDfa.evalString('bb');
    testDfa.evalString('AB');

    // NOT Accepted
    testDfa.evalString('aaa');
    testDfa.evalString('bab');
    testDfa.evalString('aaaaaaa');

    // Wrong input
    testDfa.evalString('ac');
};

//testDfa();