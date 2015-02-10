var NOMINAL_UPDATE_INTERVAL = 16.666;

var prevUpdateDt = null;
var prevUpdateDu = null;
var isUpdateOdd = false;

var update = function(dt) {

    var original_dt = dt;

    var du = (dt / NOMINAL_UPDATE_INTERVAL);

    updateSimulation(du);

    prevUpdateDt = original_dt;
    prevUpdateDu = du;

    isUpdateOdd = !isUpdateOdd;

};