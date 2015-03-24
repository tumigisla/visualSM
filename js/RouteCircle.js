function RouteCircle() {
	this.routePoints = [];
	this.routeBuffer = 60;

	this.shouldRender = false;

	this.crntIndex = 0;
};

/*
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
*/

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
		
		for (var rp of this.routePoints[this.crntIndex]) {

			if (rp.length === 0) {	// If one is empty, all are empty.
									// They all move at the same speed.
				this.crntIndex++;
				break;
			}

		}

		if (this.crntIndex >= this.routePoints.length) {
			this.shouldRender = false;
			this.routePoints = [];
			killRouteCircle = true;
			return;
		}

		for (var rp of this.routePoints[this.crntIndex]) {

			var coords = rp.pop();

			if (coords)
				draw.routeCircle(ctx, coords.x, coords.y);

		}
	}
}