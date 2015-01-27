var util = {

    // S : [Strings]
    // str : String
    containsStr : function(S, str) {
        for (var i = 0; i < S.length; i++) {
            if (S[i] === str) {
                return true;
            }
        }
        return false;
    },

    containsIndex : function(A, i) {
        for (var j = 0; j < A.length; j++) {
            if (A[j] === i) {
                return true;
            }
        }
        return false;
    }

};