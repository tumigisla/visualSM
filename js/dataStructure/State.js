// name : String
// start, fin : Boolean
function State(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }

    this.incomingEdges = [];
    this.outgoingEdges = [];

}

State.prototype.isStart = function() {
    return this.start;
};

State.prototype.isFin = function() {
    return this.fin;
};