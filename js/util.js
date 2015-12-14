/**
* Utilities, used by all the system.
*
* @class util
* @constructor
*/
var util = {

    /**
    * Indicates whether an array contains a given value.
    * Does not work for Set.
    *
    * @method contains
    * @param {Array} A is an array of any object that's
    *                comparable with ===
    * @param {Object} i is any object.
    * @return {Boolean} true iiff A contains i    
    */
    contains : function(A, i) {
        if (A.length === 0) return false;
        for (var j = 0; j < A.length; j++)
            if (A[j] === i)
                return true;
        return false;
    },

    /**
    * Indicates whether an array is empty.
    *
    * @method isEmpty
    * @param {Array} A is an array of any object
    * @return {Boolean} true iiff A is nt empty  
    */
    isEmpty : function(A) {
        return A.length === 0;
    },

    /**
    * Computes the square of x
    *
    * @method square
    * @param {Number} x is an integer
    * @return {Number} x^2
    */
    square : function(x) {return x*x},

    /**
    * Computes the abs of x
    *
    * @method abs
    * @param {Number} x is an integer
    * @return {Number} absolute value of x
    */
    abs : function(x) {
        return x < 0 ? -x : x;
    },

    /**
    * Computes squared distance between coordinates
    * (x1, y1) and (x2, y2)
    *
    * @method distSq
    * @param {Number} x1 is an x coordinate
    * @param {Number} y1 is an y coordinate
    * @param {Number} x2 is an x coordinate
    * @param {Number} y2 is an y coordinate
    * @return {Number} The squared distance between the coordinates.
    */
    distSq : function(x1, y1, x2, y2) {
        return this.square(x2-x1) + this.square(y2-y1);
    },

    /**
    * Indicates whether the mouse cursor is inside a State,
    * having center coords (cx, cy) and radius rad.
    *
    * @method inCircle
    * @param {Number} mouseX is a valid x coordinate on the window
    * @param {Number} mouseY is a valid y coordinate on the window
    * @param {Number} cx is an x coordinate on the canvas
    * @param {Number} cy is an y coordinate on the canvas
    * @param {Number} rad is the radius of the circle.
    * @return {Boolean} true iiff mouse cursor in circle
    */
    inCircle : function(mouseX, mouseY, cx, cy, rad) {
        var pointDistSq = this.distSq(mouseX, mouseY, cx, cy);
        var radSq = this.square(rad);
        return pointDistSq < radSq;
    },

    /**
    * Indicates whether a chr is whitespace
    *
    * @method inCircle
    * @return {Boolean} true iiff chr is whitespace
    */
    isWsp : function(chr) {
        return chr === ' ';
    },
    
    /**
    * Extracts symbols (characters) from a string
    *
    * @method extractSymbols
    * @param {String} str is a string
    * @return {Array} The characters that make up str.
    */
    extractSymbols : function(str) {
        var s = [];
        var w = "";
        for(var i = 0; i <= str.length; i++){
            if(str[i] === " " | this.isWsp(str[i]) | i === str.length){
                if(w !== ""){
                    s[s.length] = w;
                    w = "";
                }
            }
            else w = w + str[i];
        }
        return s;
    },

    /**
    * Computes the union of two sets.
    *
    * @method union
    * @param {Set} set1
    * @param {Set} set2
    * @return {Set} The set union of set1 and set2
    */
    union : function(set1, set2) {
        var unionSet = new Set();
        unionSet.objects = set1;    // get all objects from set1, a little hack
        for (var i = 0; i < set1.length; i++)
            // get all objects from set2
            unionSet.add(set2.getObject(i));
        return unionSet;
    },

    /**
    * Computes the intersection of two sets.
    *
    * @method intersect
    * @param {Set} set1
    * @param {Set} set2
    * @return {Set} The set intersection of set1 and set2
    */
    intersect : function(set1, set2) {
        var intersectSet = new Set();

        for (var i = 0; i < set1.length(); i++) {
            // For every object in set1, add it to
            // unionSet if it's in set2 as well.
            var obj_i = set1.getObject(i);
            if (set2.contains(obj_i))
                intersectSet.add(obj_i);
        }
        return intersectSet;
    },

    /**
    * Indicates whether two sets are intersecting.
    *
    * @method areIntersecting
    * @param {Set} set1
    * @param {Set} set2
    * @return {Boolean} true iiff set1 and set2 are intersecting.
    */
    areInterSecting : function(set1, set2) {
        return this.intersect(set1, set2).length() > 0;
    },

    /**
    * Computes the size/length of an object.
    *
    * @method objSize
    * @param {Object} obj
    * @return {Number} Size/length of obj.
    */
    objSize : function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    },

    /**
    * @method hasUnmarkedStateSet
    */
    hasUnmarkedStateSet : function(setArray) {
        for (var i = 0; i < setArray.length; i++)
            if (!setArray[i].isMarked)
                return true;
        return false;
    }
};