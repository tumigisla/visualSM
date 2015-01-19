var SM = {


    _states : [],
    _edges : [],

    alphabet : [],

    generateState : function(name, start, fin) {
        var state = new State({
            name : name,
            start : start,
            fin : fin
        });

        this._states.push(state);
    },


    generateEdge : function(fromState, toState, symbols) {
        var edge = new Edge({
            fromState : fromState,
            toState : toState,
            symbols : symbols
        });
        
        this._edges.push(edge);
        
        fromState.outgoingEdges.push(edge);
        toState.incomingEdges.push(edge);
    },


    // find by name
    findState : function(name) {
        for (var i in this._states) {
            if (this._states[i].name === name) {
                return this._states[i];
            }
        }
        console.log('No state with that name exists');
        return false;
    },


    evalString : function(str) {

        str = str.toLowerCase();    // upper case symbols accepted as well
        var currentState = this.findState('q0');    // starting state
        var route = '';

        for (var i = 0; i < str.length; i++) {
            if (!util.containsStr(this.alphabet, str[i])) {
                console.log(str[i] + ' not in alphabet of SM');
                return;
            }
            var outEdges = currentState.outgoingEdges;
            
            for (var e in outEdges) {    
                if (util.containsStr(outEdges[e].symbols, str[i])) {
                    currentState = outEdges[e].toState;

                    if (i === str.length - 1)   route += str[i]; // no arrow for last symbol
                    else                        route += str[i] + ' -> ';
                }
            }
        }
        if (currentState.name === 'qf')     route += ' : Accepted';
        if (currentState.name === 'qTrash') route += ' : NOT Accepted';

        console.log(route);
    }

};


// A test state machine
// Should accept L = (a(a + b)) + (b(a + b))

SM.alphabet = ['a', 'b'];

SM.generateState('q0', true, false);
SM.generateState('q1', false, false);
SM.generateState('q2', false, false);
SM.generateState('qf', false, true);

SM.generateEdge(SM.findState('q0'), SM.findState('q1'), ['a']);
SM.generateEdge(SM.findState('q0'), SM.findState('q2'), ['b']);
SM.generateEdge(SM.findState('q1'), SM.findState('qf'), ['a', 'b']);
SM.generateEdge(SM.findState('q2'), SM.findState('qf'), ['a', 'b']);

// Trash state
SM.generateState('qTrash', false, false);
SM.generateEdge(SM.findState('qf'), SM.findState('qTrash'), ['a', 'b']);

// Accepted
SM.evalString('aa');
SM.evalString('ab');
SM.evalString('ba');
SM.evalString('bb');
SM.evalString('AB');

// NOT Accepted
SM.evalString('aaa');
SM.evalString('bab');

// Wrong input
SM.evalString('ac');