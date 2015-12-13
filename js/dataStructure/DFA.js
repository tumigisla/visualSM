/**
* A Deterministic Finite State Machine (DFA).
* This class was only used during production.
* It's not used in the main UI.
*
* @class DFA
* @constructor
*/
function DFA(descr) {}

DFA.prototype = new SM(); // Inherits from SM

/**
* Initializes the route string.
*
* Post: _crntState, _routeStr and _routeEdges have been initalized for 
        the next evaluation of a String.
*
* @method _initRoute
* @param {String} str is the name of the string being evaluated
* @param {State} startState is the starting state of the SM
*/
DFA.prototype._initRoute = function(str, startState) {
    this._crntState = this.findState(startState.id);    // starting state
    this._routeStr = str + ' |';
    this._routeEdges = [];
};

/**
* Evaluates a given string.
*
* Post: The status has been updated.
*
* @method evalString
* @param {String} str is the name of the string being evaluated
*/
DFA.prototype.evalString = function(str) {
    var startState = this.findStartState();
    str = str.toLowerCase();    // upper case symbols accepted as well
    this._initRoute(str, startState);  // make ready for evaluation

    for (var i = 0; i < str.length; i++) {
        // Stop evaluating if one of the input symbols
        // is not in the alphabet.
        if (!this.symbolInAlphabet(str[i])) break;

        this.addToRoute(this._crntState);
        var psblEdge = this._crntState.psblTrans(str[i]);

        if (psblEdge) {
            this.move(psblEdge.toState);
            this._routeEdges.push(psblEdge);
        }
        else
            this._routeStr += "No possible transition from " + this._crntState.name
                                        + " given input " + str[i] + ', ';
    }

    this.addAcceptance();
    //this.printRoute();
    visualSM.addToStats(this._routeStr);
};

/**
* Moves the status of the SM to the new state.
*
* Post: newState is now _crntState.
*
* @method move
* @param {State} newState is the state being moved to
*/
DFA.prototype.move = function(newState) {
    this._crntState = newState;
};

/**
* Adds the state being evaluated to the route string.
*
* Post: The name of the state has been added to the route string.
*
* @method addToRoute
* @param {State} state is the state who's name is being added to the route string.
*/
DFA.prototype.addToRoute = function(state) {
    this._routeStr += state.name + ' -> ';
};

/**
* Prints the route to the console window.
*
* Post: The route DFA took to evaluate the input
*        has been logged to the console window.
*
* @method printRoute
*/
DFA.prototype.printRoute = function() {
    console.log(this._routeStr);
};

/**
* Adds information to the route string on whether the DFA
* has accepted the input string or not.
*
* Pre: DFA has evaluated all of it's inputs. 
* Post: An indication of whether the input str
*       has been accepted or not by DFA has been
*       pushed to the back of the route string.
*
* @method addAcceptance
*/
DFA.prototype.addAcceptance = function() {
    if (this._crntState.isFin())
        this._routeStr += ' ' + this._crntState.name + ' : Accepted';
    else
        this._routeStr += ' ' + this._crntState.name + ' : NOT Accepted';
};