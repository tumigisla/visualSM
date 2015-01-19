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
    }

};