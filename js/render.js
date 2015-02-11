var render = function(ctx) {
	ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
	// delegate to the rendering in visualSM
	renderSimulation(ctx);
};