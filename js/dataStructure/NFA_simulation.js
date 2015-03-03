function NFA (descr) {}

NFA.prototype = new SM();

// From Compilers (dragonbook)
// 3.7.2 Simulation of an NFA, page 156, 2.ed


// DATA STRUCTURES WE NEED

// Holds the current set of states.
var oldStates = [];

// Holds the "next" set of states.
var newStates = [];

// Boolean array, to indicate which states are
// in newStates, for efficiency.
var alreadyOn = [];

// A 2D array move[s, a] holding the transition table
// of the NFA.
var move = [];


// EPSILON CLOSURE

// Set each entry of alreadyOn to false.
//for (var i = 0; i < this._states.length; i++)
//  alreadyOn[i] = false;

// Then, for each state s in epsilon-closure(s0),
// push s onto oldStates and set alreadyOn[s] to true.

var anonFunc = function() {
    S = epsClosure(s0);
    c = nextChar();
    while (c != eof) {
        S = epsClosure(move(S, c));
        c = nextChar();
    }
    // TODO : implement intersect function in util.
    return util.intersect(S, F) != [];
};

// This function pushes state s onto newStates,
// sets alreadyOn[s] to true, and calls itself
// recursively on the states in move[s, eps]
// in order to further the computation of
// eps-closure(s).
// However, to avoid duplicating work, we must be
// careful never to call addState on a state that
// is already on the stack newStates.
var addState = function(s) {
    newStates.push(s);
    alreadyOn[s] = true;
    for (t in move[s, eps])
        addState(t); // recursive call
};



// Figure 3.33 page 154 in Dragonbook
// T is a SM
var epsClosure = function(T) {
    // push all states of T onto stack
    var stack = [];
    for (var t = 0; t < T._states.length; t++) {
        stack.push(T._states[t]);
        // initialize eps-closure(T) to T
        var epsClos = T;

        while(!util.isEmpty(stack)){
            // pop t, the top element, off stack
            var t = stack.pop();
            for (var e = 0; e < T._edges.length; e++) {
                if (e.fromState === t && util.contains(T._edges.symbols, 'eps')) {
                    var u = e;
                    if (!epsClos.hasState(u)) {
                        epsClos.generateState('from'+epsClos.name, false, false);
                        stack.push(u);
                    }
                }
            }
        }
    }
    console.log(T._states);
};

/*
var testSim = new NFA();

testSim.alphabet = ['a', 'b', 'eps'];

testSim.generateState('q0', true, false);
testSim.generateState('q1', false, false);
testSim.generateState('q1', false, false);
testSim.generateState('qf', false, true);

testSim.generateEdge(testSim.findState('q0'), testSim.findState('q1'), ['a', 'b', 'eps']);
testSim.generateEdge(testSim.findState('q0'), testSim.findState('q2'), ['a', 'b', 'eps']);
testSim.generateEdge(testSim.findState('q2'), testSim.findState('qf'), ['a', 'b']);
testSim.generateEdge(testSim.findState('q1'), testSim.findState('qf'), ['a', 'b']);

epsClosure(testSim);
*/
