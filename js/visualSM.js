// Get handler for canvas and define the context
var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

var testDFA = new DFA();

testDFA.alphabet = ['a', 'b'];