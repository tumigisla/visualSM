// fromState, toState : State
// symbols : [Strings]
function Edge(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}