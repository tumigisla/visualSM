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
    this.isSelected = false;
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

// TODO : combine this function and the psblTrans function from above.
// Always returns an object of type Set.
State.prototype.transition = function(str) {
    var transStates = new Set();
    for (var i = 0; i < this.outgoingEdges.length; i++) {
        var anOutgoingEdge = this.outgoingEdges[i];
        if (util.contains(anOutgoingEdge.symbols, str))
            transStates.add(anOutgoingEdge.toState);
    }
    return transStates; // A set of states or the empty set.
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

State.prototype.updateCoords = function(x, y) {
    if (this.isInCanvas) {
        this.cx = x;
        this.cy = y;
    }
};

// Fix this, is NOT working.
State.prototype.isInCanvas = function() {
    var canvasWidth = g_canvas.width,
        canvasHeight = g_canvas.height;

    var cx = this.cx,
        cy = this.cy,
        rad = this.radius;

    var inLeftBound = cx - rad > 0,
        inTopBound = cy - rad > 0,
        inRightBound = cx + rad < canvasWidth,
        inBtmBound = cy + rad < canvasHeight;

    return inLeftBound && inTopBound && inRightBound && inBtmBound;
};

State.prototype.update = function(du) {
    if (this.isSelected)
        this.updateCoords(inputs.mouse.X, inputs.mouse.Y);

};

State.prototype.render = function(ctx) {
    draw.state(ctx, this.cx, this.cy, this.radius,
               this.isSelected, this.isStart(), this.isFin());

    if (this.name)
        draw.printLetters(ctx, [this.name], this.cx - 9, this.cy + 7, 'state');
};