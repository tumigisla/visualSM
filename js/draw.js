var draw = {

    state : function(ctx, x, y, r, isSelected, isStart, isFin) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        if(isStart) {
            ctx.beginPath();
            ctx.moveTo(x - r, y);
            ctx.lineTo(x - (2 * r), y);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }

        if (isFin) {
            ctx.beginPath();
            ctx.arc(x, y, r - 6, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        }

        if (isSelected) {
            ctx.beginPath();
            ctx.arc(x, y, r + 6, 0, Math.PI * 2);
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.closePath();
        }


    },

    edgeX1 : 0,
    edgeY1 : 0,

    edge : function(ctx, x1, y1, x2, y2) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    },

    routeCircle : function(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
    }

};
