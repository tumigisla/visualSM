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
    }

};
