function RouteCircle() {
	this.routePoints = [];
	this.routeBuffer = 120;
	this.routeEdges = [];

	this.shouldRender = false;
};

RouteCircle.prototype.getRouteEdges = function() {
	this.routeEdges = g_SM._routeEdges;
	this.routePoints = [];
	for (var i = 0; i < this.routeEdges.length; i++) {
		console.log(this.routeEdges[i]);
		if (this.routeEdges[i][0]) { // Tekka betur a þessu
			this.routeEdges[i][0].updateLinePoints(100);
			for (var j = 0; j < this.routeEdges[i][0].points.length; j++)
				// add as first element
				this.routePoints.unshift(this.routeEdges[i][0].points[j]);
		}
	}
};

RouteCircle.prototype.isEmpty = function() {
	return this.routePoints.length === 0;
};

RouteCircle.prototype.update = function(du) {
	if (this.routeBuffer < 0) {
		this.shouldRender = true;
		this.routeBuffer = 60;
	}

	this.routeBuffer -= du;
};

RouteCircle.prototype.render = function(ctx) {
	if (this.shouldRender) {
		var coords = this.routePoints.pop();
		if (coords)
			draw.routeCircle(ctx, coords.x, coords.y);
	}
}