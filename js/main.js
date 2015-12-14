/**
* The simulation main loop.
*
* Based on the framework provided by Patrick Kerr in the
* Computer Game Programming Class, fall 2014.
*
* @class main
* @constructor
*/
var main = {
    _frameTime_ms : null,
    _frameTimeDelta_ms : null
};

/**
* @method iter
*/
main.iter = function(frameTime) {
    this._updateClocks(frameTime);
    this._iterCore(this._frameTimeDelta_ms);
    this._requestNextIteration();
};

/**
* @method _iterCore
*/
main._iterCore = function(dt) {
    update(dt);
    render(g_ctx);
};

/**
* @method _updateClocks
*/
main._updateClocks = function(frameTime) {
    // Initialization for the first time
    if (this._frameTime_ms === null) this._frameTime_ms = frameTime;
    // Track the frameTime and its delta
    this._frameTimeDelta_ms = frameTime - this._frameTime_ms;
    this._frameTime_ms = frameTime;
};

/**
* @method _requestNextIteration
*/
main._requestNextIteration = function() {
    window.requestAnimationFrame(mainIterFrame);
};

/**
* @method init
*/
main.init = function() {
    this._requestNextIteration();
};

/**
* @method mainIterFrame
*/
var mainIterFrame = function(frameTime) {
    main.iter(frameTime);
};

// For cross browser compatibility
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

// Start the simulation
main.init();