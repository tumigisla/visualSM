/**
* A route circle that travels on an Edge
* between states in the SM.
*
* @class RouteCircle
* @constructor
*/
function RouteCircle() {
    this.routePoints = [];
    this.routeBuffer = 60;

    this.shouldRender = false;

    this.crntIndex = 0;

    this.oldRoutePoints = [];
};

/**
* Indicates whether this RouteCircle has any route points defined for it.
*
* @method isEmpty
* @return {Boolean} true iiff this RouteCircle has any route circles
*                   defined for it.
*/
RouteCircle.prototype.isEmpty = function() {
    return this.routePoints.length === 0;
};

/**
* Handles the updating of the logic for this RouteCircle.
*
* Post: The logic of this RouteCircle has been updated.
*
* @method update
* @param {Number} du is delta time from the last update
*/
RouteCircle.prototype.update = function(du) {
    if (this.routeBuffer < 0) {
        this.shouldRender = true;
        this.routeBuffer = 60;
    }

    this.routeBuffer -= du;
};

/**
* Renders this RouteCircle on the canvas.
*
* Post: This RouteCircle has been rendered on the canvas.
*
* @method render
* @param {Object} ctx is the canvas context.
*/
RouteCircle.prototype.render = function(ctx) {
    if (this.shouldRender) {
        
        for (var rp of this.routePoints[this.crntIndex]) {

            if (rp.length === 0) {  // If one is empty, all are empty.
                                    // They all move at the same speed.
                this.crntIndex++;
                break;
            }

        }

        if (this.crntIndex >= this.routePoints.length) {
            this.shouldRender = false;
            //g_routeCircles = [];
            //killRouteCircle = true;
            //this.routePoints = this.oldRoutePoints;
            this.crntIndex = 0;
            return;
        }

        for (var rp of this.routePoints[this.crntIndex]) {

            var coords = rp.pop();

            this.oldRoutePoints.push(coords);

            if (coords)
                draw.routeCircle(ctx, coords.x, coords.y);

        }
    }
}