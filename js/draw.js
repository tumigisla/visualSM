var draw = {

    state : function(ctx, x, y, r, isSelected) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        if (isSelected) {
            ctx.beginPath();
            ctx.arc(x, y, r + 3, 0, Math.PI * 2);
            ctx.strokeStyle = 'blue';
            ctx.stroke();
        }
    },

    edge : function(ctx, x1, y1, x2, y2) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.restore();
    }

};