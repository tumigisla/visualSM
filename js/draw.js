/**
* Drawing methods that handle the drawing on the canvas.
*
* @class draw
* @constructor
*/
var draw = {

    /**
    * Draws a state on the canvas.
    *
    * Post: A State has been drawn on the canvas.
    *
    * @method state
    * @param {Object} ctx is the canvas context
    * @param {Number} x is an x coordinate on the canvas
    * @param {Number} y is an y coordinate on the canvas
    * @param {Number} r is the radius of the State
    * @param {Boolean} isSelected indicates whether the State is selected with the mouse cursor
    * @param {Boolean} isStart indicates whether it's a starting state 
    * @param {Boolean} isFin indicates whether it's a final state
    */
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

    /**
    * Draws an Edge on the canvas.
    *
    * Post: An Edge has been drawn on the canvas, having start coords
    *       (x1, y1) and final coords (x2, y2).
    *
    * @method edge
    * @param {Object} ctx is the canvas context
    * @param {Number} x1 is an x coordinate on the canvas
    * @param {Number} y1 is an y coordinate on the canvas
    * @param {Number} x2 is an x coordinate on the canvas
    * @param {Number} y2 is an y coordinate on the canvas
    */
    edge : function(ctx, x1, y1, x2, y2) {
        var dy = y2 - y1,
            dx = x2 - x1;

        var angle = Math.atan2(dy, dx);

        this.drawArrow(ctx, x1, y1, x2, y2, 3, 1, undefined, 20); // use default angle
    },

    /**
    * Prints letters on the canvas.
    *
    * Post: All symbols have been printed on the canvas, starting at x coords x.
    *
    * @method printLetters
    * @param {Object} ctx is the canvas context
    * @param {Array} symbols is an array of symbols
    * @param {Number} x is an x coordinate on the canvas
    * @param {Number} y is an y coordinate on the canvas
    * @param {String} type is 'state' or 'edge'
    */
    printLetters : function(ctx, symbols, x, y, type) {
        if (type !== 'state' && type !== 'edge') return;
        ctx.font = type === 'state' ? 'bold 25px Arial' : 'bold 15px Arial';

        for (var i = 0; i < symbols.length; i++) {
            if (i === symbols.length - 1)
                // Print last symbol without a comma.
                ctx.fillText(symbols[i], x + (20 * i), y);
            else
                ctx.fillText(symbols[i] + ' ,', x + (20 * i), y);
        }
    },

    /**
    * Draws a RouteCircle on the canvas
    *
    * Post: A RouteCircle has been drawn on the canvas.
    *
    * @method routeCircle
    * @param {Object} ctx is the canvas context
    * @param {Number} x is an x coordinate on the canvas
    * @param {Number} y is an y coordinate on the canvas
    */
    routeCircle : function(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
    },

    /**
    * Draws an arrow on the canvas
    *
    * Post: An arrow has been drawn on the canvas, having start coords
    *       (x1, y1) and final coords (x2, y2).
    *
    * Borrowed from this tutorial:
    * http://www.dbp-consulting.com/tutorials/canvas/CanvasArrow.html
    *
    * @method drawArrow
    * @param {Object} ctx is the canvas context
    * @param {Number} x1 is an x coordinate on the canvas
    * @param {Number} y1 is an y coordinate on the canvas
    * @param {Number} x2 is an x coordinate on the canvas
    * @param {Number} y2 is an y coordinate on the canvas
    * @param {String} style is the type of head to draw
    * @param {Number} which indicates which end gets the arrow 
    * @param {Number} angle is the angle at which the arrow will be drawn
    * @param {Number} d is the length (distance) of the arrow 
    */
    drawArrow : function(ctx,x1,y1,x2,y2,style,which,angle,d)
    {
      'use strict';
      // Ceason pointed to a problem when x1 or y1 were a string, and concatenation
      // would happen instead of addition
      if(typeof(x1)=='string') x1=parseInt(x1);
      if(typeof(y1)=='string') y1=parseInt(y1);
      if(typeof(x2)=='string') x2=parseInt(x2);
      if(typeof(y2)=='string') y2=parseInt(y2);
      style=typeof(style)!='undefined'? style:3;
      which=typeof(which)!='undefined'? which:1; // end point gets arrow
      angle=typeof(angle)!='undefined'? angle:Math.PI/8;
      d    =typeof(d)    !='undefined'? d    :10;
      // default to using drawHead to draw the head, but if the style
      // argument is a function, use it instead
      var toDrawHead=typeof(style)!='function'? this.drawHead:style;

      // For ends with arrow we actually want to stop before we get to the arrow
      // so that wide lines won't put a flat end on the arrow.
      //
      var dist=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
      var ratio=(dist-d/3)/dist;
      var tox, toy,fromx,fromy;
      if(which&1){
        tox=Math.round(x1+(x2-x1)*ratio);
        toy=Math.round(y1+(y2-y1)*ratio);
      }else{
        tox=x2;
        toy=y2;
      }
      if(which&2){
        fromx=x1+(x2-x1)*(1-ratio);
        fromy=y1+(y2-y1)*(1-ratio);
      }else{
        fromx=x1;
        fromy=y1;
      }

      // Draw the shaft of the arrow
      ctx.beginPath();
      ctx.moveTo(fromx,fromy);
      ctx.lineTo(tox,toy);
      ctx.strokeStyle = 'black';
      ctx.stroke();

      // calculate the angle of the line
      var lineangle=Math.atan2(y2-y1,x2-x1);
      // h is the line length of a side of the arrow head
      var h=Math.abs(d/Math.cos(angle));

      if(which&1){  // handle far end arrow head
        var angle1=lineangle+Math.PI+angle;
        var topx=x2+Math.cos(angle1)*h;
        var topy=y2+Math.sin(angle1)*h;
        var angle2=lineangle+Math.PI-angle;
        var botx=x2+Math.cos(angle2)*h;
        var boty=y2+Math.sin(angle2)*h;
        toDrawHead(ctx,topx,topy,x2,y2,botx,boty,style);
      }
      if(which&2){ // handle near end arrow head
        var angle1=lineangle+angle;
        var topx=x1+Math.cos(angle1)*h;
        var topy=y1+Math.sin(angle1)*h;
        var angle2=lineangle-angle;
        var botx=x1+Math.cos(angle2)*h;
        var boty=y1+Math.sin(angle2)*h;
        toDrawHead(ctx,topx,topy,x1,y1,botx,boty,style);
      }
  },

  /**
    * Draws an arrow head on the canvas
    *
    * Post: An arrow head has been drawn on the canvas.
    *
    * Borrowed from this tutorial:
    * http://www.dbp-consulting.com/tutorials/canvas/CanvasArrow.html
    *
    * @method drawHead
    * @param {Object} ctx is the canvas context
    * @param {Number} x0 is an x coordinate on the canvas
    * @param {Number} y0 is an y coordinate on the canvas
    * @param {Number} x1 is an x coordinate on the canvas
    * @param {Number} y1 is an y coordinate on the canvas
    * @param {Number} x2 is an x coordinate on the canvas
    * @param {Number} y2 is an y coordinate on the canvas
    * @param {String} style is the type of head to draw
    */
  drawHead : function(ctx,x0,y0,x1,y1,x2,y2,style)
  {
      'use strict';
      if(typeof(x0)=='string') x0=parseInt(x0);
      if(typeof(y0)=='string') y0=parseInt(y0);
      if(typeof(x1)=='string') x1=parseInt(x1);
      if(typeof(y1)=='string') y1=parseInt(y1);
      if(typeof(x2)=='string') x2=parseInt(x2);
      if(typeof(y2)=='string') y2=parseInt(y2);
      var radius=3;
      var twoPI=2*Math.PI;

      // all cases do this.
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x0,y0);
      ctx.lineTo(x1,y1);
      ctx.lineTo(x2,y2);
      switch(style){
        case 0:
          // curved filled, add the bottom as an arcTo curve and fill
          var backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
          ctx.arcTo(x1,y1,x0,y0,.55*backdist);
          ctx.fill();
          break;
        case 1:
          // straight filled, add the bottom as a line and fill.
          ctx.beginPath();
          ctx.moveTo(x0,y0);
          ctx.lineTo(x1,y1);
          ctx.lineTo(x2,y2);
          ctx.lineTo(x0,y0);
          ctx.fill();
          break;
        case 2:
          // unfilled head, just stroke.
          ctx.stroke();
          break;
        case 3:
          //filled head, add the bottom as a quadraticCurveTo curve and fill
          var cpx=(x0+x1+x2)/3;
          var cpy=(y0+y1+y2)/3;
          ctx.quadraticCurveTo(cpx,cpy,x0,y0);
          ctx.fill();
          break;
        case 4:
          //filled head, add the bottom as a bezierCurveTo curve and fill
          var cp1x, cp1y, cp2x, cp2y,backdist;
          var shiftamt=5;
          if(x2==x0){
      // Avoid a divide by zero if x2==x0
      backdist=y2-y0;
      cp1x=(x1+x0)/2;
      cp2x=(x1+x0)/2;
      cp1y=y1+backdist/shiftamt;
      cp2y=y1-backdist/shiftamt;
          }else{
      backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
      var xback=(x0+x2)/2;
      var yback=(y0+y2)/2;
      var xmid=(xback+x1)/2;
      var ymid=(yback+y1)/2;

      var m=(y2-y0)/(x2-x0);
      var dx=(backdist/(2*Math.sqrt(m*m+1)))/shiftamt;
      var dy=m*dx;
      cp1x=xmid-dx;
      cp1y=ymid-dy;
      cp2x=xmid+dx;
      cp2y=ymid+dy;
          }

          ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x0,y0);
          ctx.fill();
          break;
      }
      ctx.restore();
    }
};