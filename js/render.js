/**
* Main rendering wrapper.
*
* Based on the framework provided by Patrick Kerr in the
* Computer Game Programming Class, fall 2014.
*
* @class render
* @constructor
*/

/**
* @method render
*/
var render = function(ctx) {
    ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
    // delegate to the rendering in visualSM
    renderSimulation(ctx);
};