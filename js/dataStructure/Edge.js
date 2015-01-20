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