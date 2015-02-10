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

Edge.prototype.updateStartCoords = function(x, y) {
    this.x1 = x;
    this.y1 = y;
};

Edge.prototype.updateFinCoords = function(x, y) {
    this.x2 = x;
    this.y2 = y;
};

Edge.prototype.update = function(du) {};

Edge.prototype.render = function(ctx) {
    draw.edge(ctx, this.x1, this.y1, this.x2, this.y2);
};