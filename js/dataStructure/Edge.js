/*
 An Edge connecting fromState
 and toState.

 symbols is an array of possible
 transitions from fromState to toState.
*/

// Usage :
//  new Edge({
//      fromState : State,
//      toState : State,
//      symbols : [String]
//  });
function Edge(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}


// Interaction

// No return value. Updates the points on this
// Edge.
Edge.prototype.updateLinePoints = function(frames) {
    var dx = this.x2 - this.x1,
        dy = this.y2 - this.y1,
        length = Math.sqrt(util.square(dx) + util.square(dy));

    var incrX = dx / frames,
        incrY = dy / frames;

    this.points = [];

    this.points.push({x : this.x1, y : this.y1});

    for (var i = 0; i < frames; i++) {
        this.points.push({
            x : this.x1 + (incrX * i),
            y : this.y1 + (incrY * i)
        });
    }

    this.points.push({x : this.x2, y : this.y2});
};

Edge.prototype.updateStartCoords = function(x, y) {
    this.x1 = x;
    this.y1 = y;
};

Edge.prototype.updateFinCoords = function(x, y) {
    this.x2 = x;
    this.y2 = y;
};

Edge.prototype.clampToState = function(x, y, state) {
    if (x >= state.cx) x = state.cx + state.radius; // edge end to right of state
    else if (x < state.cx) x = state.cx - state.radius; // edge end to left of state
    y = state.cy;
    return [x, y];
};

Edge.prototype.update = function(du) {
    if (this.fromState) {
        var clampStartCoords = this.clampToState(this.x1, this.y1, this.fromState);
        this.x1 = clampStartCoords[0];
        this.y1 = clampStartCoords[1];
    }

    if (this.toState) {
        var clampFinCoords = this.clampToState(this.x2, this.y2, this.toState);
        this.x2 = clampFinCoords[0];
        this.y2 = clampFinCoords[1];
    }
};

Edge.prototype.render = function(ctx) {
    draw.edge(ctx, this.x1, this.y1, this.x2, this.y2);
};
