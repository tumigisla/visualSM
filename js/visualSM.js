// Get handler for canvas and define the context
var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

var g_SM = new DFA();

g_SM.alphabet = ['a', 'b'];

// Returns the state object of the state
// that's close enough to the current mouse
// coordinates.
var findStateInRange = function(mouseX, mouseY) {
    for (var i = 0; i < g_SM._states.length; i++) {
        var st = g_SM._states[i];
        var dist = util.distSq(st.cx, st.cy, mouseX, mouseY);
        if (dist < consts.IN_RANGE)
            return st;
    }
};