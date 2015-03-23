function RouteCircle() {
	this.routePoints = [];
	this.routeBuffer = 120;

	this.shouldRender = false;
};

RouteCircle.prototype.getRouteEdges = function(routeBranch) {
	this.routePoints = [];
	for (var i = 0; i < routeBranch.length; i++) {
		var rE = routeBranch[i];
		if (rE) {
			rE.updateLinePoints(100);
			for (var rP of rE.points)
				this.routePoints.unshift(rP);
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