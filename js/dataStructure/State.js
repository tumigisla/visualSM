/**
* A single State in a SM.
* It has a name for the Edges to recognize,
* and can be a Starting State, a Final State or
* neither of those.
*
* A State has an array of both Incoming Edges
* and Outgoing Edges, indicating possible transitions
* from the State.
*
* Usage :
*  new State({
*      cx   : Number,
*      cy   : Number,
*      name : String,
*      start : Boolean,
*      fin : Boolean,
*      id : Number
*  });
*
* @class State
* @constructor
*/
function State(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.incomingEdges = [];
    this.outgoingEdges = [];

    this.depths = [];

    this.radius = 20 + 5 * (this.name.length);
    this.isSelected = false;
}

/**
* Gets the first Edge found that's possible to move along in the
* transition to the new State.
*
* @method psblTrans
* @param {String} str is the symbol to compute the transitions for
* @return {State} The Edge that's possible to move along in the
*                 transition to the new State.
*/
State.prototype.psblTrans = function(str) {
    for (var i = 0; i < this.outgoingEdges.length; i++)
        if (util.contains(this.outgoingEdges[i].symbols, str))
            return this.outgoingEdges[i];
};

/**
* Gets a Set of states that this State's outgoing edges lead to
* for the given str.
*
* @method transition
* @param {String} str is the symbol to compute the transitions for
* @return {Set} The states that this State's outgoing edges lead to
*                for the given str.
*/
State.prototype.transition = function(str) {
    var transStates = new Set();
    for (var i = 0; i < this.outgoingEdges.length; i++) {
        var anOutgoingEdge = this.outgoingEdges[i];
        if (util.contains(anOutgoingEdge.symbols, str))
            transStates.add(anOutgoingEdge.toState);
    }
    return transStates; // A set of states or the empty set.
};

/**
* Gets the id of this State
*
* @method getId
* @return {Number} The unique id of this State.
*/
State.prototype.getId = function() {
    return this.id;
};

/**
* Indicates whether this State is the starting state of
* the global SM.
*
* @method isStart
* @return {Boolean} true iiff this State is the starting state
*                   of the global SM.
*/
State.prototype.isStart = function() {
    return this.start;
};

/**
* Indicates whether this State is the final state of
* the global SM.
*
* @method isFin
* @return {Boolean} true iiff this State is the final state
*                   of the global SM.
*/
State.prototype.isFin = function() {
    return this.fin;
};

/**
* Updates the center coordinates of this State in the canvas.
*
* Post: The center coordinates of this State have been updated
*       in the canvas.
*
* @method updateCoords
* @param {Number} x is an x coordinate in the canvas
* @param {Number} y is an y coordinate in the canvas
*/
State.prototype.updateCoords = function(x, y) {
    if (this.isInCanvas) {
        this.cx = x;
        this.cy = y;
    }
};

/**
* Handles updating of the logic of this State.
*
* Post: The logic of this State has been updated.
*
* @method update
* @param {Number} du is delta time from the last update
*/
State.prototype.update = function(du) {
    if (this.isSelected)
        this.updateCoords(inputs.mouse.X, inputs.mouse.Y);

};

/**
* Renders this State on the canvas.
*
* Post: This State has been rendered on the canvas
*
* @method render
* @param {Object} ctx is the canvas context
*/
State.prototype.render = function(ctx) {
    draw.state(ctx, this.cx, this.cy, this.radius,
               this.isSelected, this.isStart(), this.isFin());

    if (this.name)
        draw.printLetters(ctx, [this.name], this.cx - 9, this.cy + 7, 'state');
};
