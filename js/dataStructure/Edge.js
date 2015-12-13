/**
* An Edge connecting fromState and toState.
*
* Usage :
*  new Edge({
*      fromState : State,
*      toState : State,
*      symbols : [String]
*  });

* @class Edge
* @constructor
*/
function Edge(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

/**
* Computes the points that define the line that a route circle
* will travel by.
*
* Post: The points of this Edge has been filled with the computed points.
*
* @method updateLinePoints
* @param {Number} frames is the number of points that define the line to compute. (steps)
*/
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

/**
* Updates the starting coordinates of this Edge.
*
* Post: This Edge's starting coordinates have been set to (x, y)
*
* @method updateStartCoords
* @param {Number} x is the x value of the coordinates
* @param {Number} y is the y value of the coordinates
*/
Edge.prototype.updateStartCoords = function(x, y) {
    this.x1 = x;
    this.y1 = y;
};

/**
* Updates the final coordinates of this Edge.
*
* Post: This Edge's final coordinates have been set to (x, y)
*
* @method updateFinCoords
* @param {Number} x is the x value of the coordinates
* @param {Number} y is the y value of the coordinates
*/
Edge.prototype.updateFinCoords = function(x, y) {
    this.x2 = x;
    this.y2 = y;
};

/**
* Clamps this Edge to a given state.
*
* Post: This Edge has been clamped to state.
*
* @method clampToState
* @param {Number} x is the x value of the coordinates
* @param {Number} y is the y value of the coordinates
* @param {State} state is the state to clamp to
*/
Edge.prototype.clampToState = function(x, y, state) {
    if (x >= state.cx) x = state.cx + state.radius; // edge end to right of state
    else if (x < state.cx) x = state.cx - state.radius; // edge end to left of state
    y = state.cy;
    return [x, y];
};

/**
* Handles updating the logic of this Edge
*
* Post: This Edge's logic has been updated.
*
* @method update
* @param {Number} du is delta time from the last update.
*/
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

/**
* Renders this Edge on the canvase
*
* Post: This edge has been rendered on the canvas
*
* @method render
* @param {Object} ctx is the canvas context.
*/
Edge.prototype.render = function(ctx) {
    draw.edge(ctx, this.x1, this.y1, this.x2, this.y2);

    var dx = this.x2 - this.x1,
        dy = this.y2 - this.y1;
    if (this.symbols)
        draw.printLetters(ctx, this.symbols, this.x1 + dx/2, this.y1 + ((dy/2) - 20), 'edge');
};