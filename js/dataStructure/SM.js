/*

 Shared attributes and functions for DFA's and NFA's.

*/

function SM(descr) {

    this._states = [];
    this._edges = [];

    this.finalStates = new Set();

    this.alphabet = [];
    this._id = 0;       // TODO: acknowledge all states completely by their id, not by name.

}

// Usage : SM.generateState(name, start, fin);
// Pre : name is a String. start and fin are Booleans.
// Post : A new State with the name name and specifications
//        whether it's a starting or a final State (or neither)
//        has been added to _states.
SM.prototype.generateState = function(cx, cy, name, start, fin) {
    var state = new State({
        cx : cx,
        cy : cy,
        name : name,
        start : start,
        fin : fin,
        id : this._id
    });

    this._states.push(state);
    this._id++;

    // Only possible to have one starting state.
    if (start && !this._startingState) this._startingState = state;

    if (fin) this.finalStates.add(state);
};

// Usage : SM.generateEdge(fromState, toState, symbols)
// Pre : fromState and toState are of type State. symbols
//       is an array of Strings.
// Post : A new Edge connecting fromState and toState
//        by symbols.
SM.prototype.generateEdge = function(fromState, toState, symbols) {
    var edge = new Edge({
        fromState : fromState,
        toState : toState,
        symbols : symbols
    });

    this._edges.push(edge);

    if (fromState) fromState.outgoingEdges.push(edge);
    if (toState) toState.incomingEdges.push(edge);
};

// Usage : SM.findState(name);
// Pre : name is a String
// Return value : A State with the name name,
//                if such a State exists.
SM.prototype.findState = function(id) {
    for (var state of this._states)
        if (state.id === id)
            return state;
    console.log('No state with that id exists');
    return false;
};

// Usage : SM.findStartState();
// Return value : The starting state, if it exists.
SM.prototype.findStartState = function() {
    for(var i in this._states) {
        if (this._states[i].start)
            return this._states[i];
    }
    console.log('No starting state defined');
    return false;
};

// Usage : SM.symbolInAlphabet(str)
// Post : Error msg printed if false
// Return value : true if str is in DFA.alphabet
SM.prototype.symbolInAlphabet = function(str) {
    if (util.contains(this.alphabet, str))
        return true;
    else {
        this._route += ' Input Error: ' + str + ' not in alphabet of DFA';
        return false;
    }
};


// Usage : SM.hasState(st);
// Post : st is a State.
// Return value : true if st is a State in SM.
SM.prototype.hasState = function(st) {
    return (util.contains(this._states, st));
};