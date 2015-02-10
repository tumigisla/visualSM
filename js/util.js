var util = {

    // Find out if A contains i
    // Works for arrays and strings. 
    contains : function(A, i) {
        for (var j = 0; j < A.length; j++) {
            if (A[j] === i) {
                return true;
            }
        }
        return false;
    },

    // Pre : x is a number
    // Input : x
    // Output : x^2
    square : function(x) {return x*x},

    // Input : x and y coords of two entities
    // Output : The squared distance between the
    //          two given entities.
    distSq : function(x1, y1, x2, y2) {
        return this.square(x2-x1) + this.square(y2-y1);
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
    }

};
