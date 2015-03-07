var util = {

    // Pre : A is an array, i is some object.
    // Return value : True if i is in A.
    contains : function(A, i) {
        if (A.length === 0) return false;
        for (var j = 0; j < A.length; j++)
            if (A[j] === i)
                return true;
        return false;
    },

    // Pre : A is an array
    // Return value : True if A is empty.
    isEmpty : function(A) {
        return A.length === 0;
    },

    // Pre : x is a number
    // Input : x
    // Output : x^2
    square : function(x) {return x*x},

    // Pre : x is a number
    // Input : x
    // Output : absolute value of x
    abs : function(x) {
        return x < 0 ? -x : x;
    },

    // Input : x and y coords of two entities
    // Output : The squared distance between the
    //          two given entities.
    distSq : function(x1, y1, x2, y2) {
        return this.square(x2-x1) + this.square(y2-y1);
    },

    // Input : Mouse coords, circle coords and circle radius.
    // Output : True if mouse cursor is inside the circle.
    inCircle : function(mouseX, mouseY, cx, cy, rad) {
        var pointDistSq = this.distSq(mouseX, mouseY, cx, cy);
        var radSq = this.square(rad);
        return pointDistSq < radSq;
    },

    // Input: chr is a String of length 1
    // Output : true if chr is punctuation.
    isWsp : function(chr) {
        return chr === ' ';
    },

    // Input : str is a String.
    // Output : An array of all the symbols.
    //          Punctuations have been cut out.
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

    // Input : set1 and set2 are instances of the Set object.
    // Output : A new set, the union of set1 and set2.
    union : function(set1, set2) {
        var unionSet = new Set();
        unionSet.objects = set1;    // get all objects from set1, a little hack
        for (var i = 0; i < set1.length; i++)
            // get all objects from set2
            unionSet.add(set2.getObject(i));
        return unionSet;
    },

    // Input : set1 and set2 are instances of the Set object.
    // Output : A new set, the intersection of set1 and set2
    intersect : function(set1, set2) {
        var intersectSet = new Set();
        for (var i = 0; i < set1.length; i++) {
            // For every object in set1, add it to
            // unionSet if it's in set2 as well.
            var obj_i = set1.getObject(i);
            if (set2.contains(obj_i))
                intersectSet.add(obj_i);
        }
        return intersectSet;
    }

};
