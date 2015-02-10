/*
 A single State in a SM.
 It has a name for the Edges to recognize,
 and can be a Starting State, a Final State or
 neither of those.

 A State has an array of both Incoming Edges
 and Outgoing Edges, indicating possible transitions
 from the State.
*/

// Usage : 
//  new State({
//      cx   : Number,
//      cy   : Number,
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

    this.radius = 25;
}

// Usage : State.psblTrans(str);
// Return value : The Edge that's
//                possible to move along in the transition
//                to the new State.
State.prototype.psblTrans = function(str) {
    for (var i = 0; i < this.outgoingEdges.length; i++)
        if (util.contains(this.outgoingEdges[i].symbols, str))
            return this.outgoingEdges[i];
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


// Interaction

State.prototype.update = function(du) {};

State.prototype.render = function(ctx) {
    draw.circle(ctx, this.cx, this.cy, this.radius);
};