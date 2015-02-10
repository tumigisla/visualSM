var draw = {

	circle : function(ctx, x, y, r) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.stroke();
	},

	startEdge : function(ctx, x, y) {
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(x, y);
	},

	finEdge : function(ctx, x, y) {
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.restore();
	}

};