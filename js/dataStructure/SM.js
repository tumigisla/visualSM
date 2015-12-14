/**
* A State Machine. NFA and DFA both inherit from SM.
*
* @class SM
* @constructor
*/

function SM(descr) {
    this._states = [];
    this._edges = [];

    this.finalStates = new Set();

    this.alphabet = [];
    this._id = 0; 
}

/**
* Generates a new state.
*
* Post: A new state has been generated.
*
* @method generateState
* @param {Number} cx is the center x coordinate of the new state
* @param {Number} cy is the center y coordinate of the new state
* @param {String} name is the name which the state is recognized by in the UI
* @param {Boolean} start indicates whether the state is a starting state 
* @param {Boolean} fin indicates whether the state is a final state 
*/
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

/**
* Generates a new edge.
*
* Post: A new edge has been generated.
*
* @method generateEdge
* @param {State} fromState is the state which the edge goes out from
* @param {State} toState is the state which the edge goes to.
* @param {Array} symbols is an array of transition symbols on the edge.
*/
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

/**
* Removes an Edge from the SM
*
* Post: The indicated Edge has been removed from this SM.
*
* @method removeEdge
* @param {Edge} edge is the Edge to remove from this SM
*/
SM.prototype.removeEdge = function(edge) {
    var index = this._edges.indexOf(edge);
    this._edges.splice(index, 1);
};

/**
* Finds a state in this SM by it's id
*
* @method findState
* @param {Number} id is a unique id for a State in this SM.
* @return {State} The State in this SM identified by id, if
*                 it's found, otherwise false.
*/
SM.prototype.findState = function(id) {
    for (var state of this._states)
        if (state.id === id)
            return state;
    return false;
};

/**
* Finds a state by it's name
*
* @method findStateByName
* @param {String} name is a name of a State in this SM
* @return {State} The first State in this SM having the name
*                 name found, otherwise false.
*/
SM.prototype.findStateByName = function(name) {
    for (var state of this._states)
        if (state.name === name)
            return state;
    return false;
};

/**
* Finds the starting state of this SM.
*
* @method findStartState
* @return {State} The starting state of this SM, if it's
*                 found, otherwise false.
*/
SM.prototype.findStartState = function() {
    for(var i in this._states) {
        if (this._states[i].start)
            return this._states[i];
    }
    return false;
};

/**
* Finds out if a symbol is in this SM's alphabet.
*
* @method symbolInAlphabet
* @param {String} str is the symbol being searched for
* @return {Boolean} true iiff the symbol is in this SM's alphabet.
*/
SM.prototype.symbolInAlphabet = function(str) {
    if (util.contains(this.alphabet, str))
        return true;
    else {
        this._route += ' Input Error: ' + str + ' not in alphabet of DFA';
        return false;
    }
};

/**
* Finds out if this SM contains a given State.
*
* @method hasState
* @param {State} st is a State
* @return {Boolean} true iiff the state is in this SM.
*/
SM.prototype.hasState = function(st) {
    return (util.contains(this._states, st));
};