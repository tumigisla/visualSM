/*
 A single State in the SM.
 It has a name for the Edges to recognize,
 and can be a Starting State, a Final State or
 neither of those.

 A State has an array of both Incoming Edges
 and Outgoing Edges, indicating possible transitions
 from the State.
*/

// Usage : 
//  new State({
//      name : String,
//      start : Boolean,
//      fin : Boolean  
//  });
function State(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.incomingEdges = [];
    this.outgoingEdges = [];
}

// Usage : State.psblTrans(str);
// Return value : An array of Edges that's
//                possible to move along in the transition
//                to the new State.
State.prototype.psblTrans = function(str) {
    var psblEdges = [];
    for (var i = 0; i < this.outgoingEdges.length; i++) {
        
        var hasMatchStr = util.contains(this.outgoingEdges[i].symbols, str),
            hasEmptyStr = util.contains(this.outgoingEdges[i].symbols, consts.EPSILON);

        if (hasMatchStr)
             psblEdges.push(this.outgoingEdges[i]);
        if (hasEmptyStr)
             psblEdges.push([this.outgoingEdges[i], consts.EPSILON]); // FIX THIS
    }
    return psblEdges;
};

// Usage : State.isStart();
// Return value : True if State is a starting position.
State.prototype.isStart = function() {
    return this.start;
};

// Usage : State.isFin();
// Return value : True if State is a final position.
State.prototype.isFin = function() {
    return this.fin;
};
