/**
* Main update wrapper.
*
* Based on the framework provided by Patrick Kerr in the
* Computer Game Programming Class, fall 2014.
*
* @class update
* @constructor
*/

var NOMINAL_UPDATE_INTERVAL = 16.666;
var prevUpdateDt = null;
var prevUpdateDu = null;
var isUpdateOdd = false;

/**
* @method update
*/
var update = function(dt) {

    var original_dt = dt;

    var du = (dt / NOMINAL_UPDATE_INTERVAL);

    updateSimulation(du);

    prevUpdateDt = original_dt;
    prevUpdateDu = du;

    isUpdateOdd = !isUpdateOdd;

};