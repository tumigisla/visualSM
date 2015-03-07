var main = {
    _frameTime_ms : null,
    _frameTimeDelta_ms : null
};

main.iter = function(frameTime) {
    this._updateClocks(frameTime);
    this._iterCore(this._frameTimeDelta_ms);
    this._requestNextIteration();
};

main._iterCore = function(dt) {
    update(dt);
    render(g_ctx);
};

main._updateClocks = function(frameTime) {
    // Initialization for the first time
    if (this._frameTime_ms === null) this._frameTime_ms = frameTime;
    // Track the frameTime and its delta
    this._frameTimeDelta_ms = frameTime - this._frameTime_ms;
    this._frameTime_ms = frameTime;
};

main._requestNextIteration = function() {
    window.requestAnimationFrame(mainIterFrame);
};

main.init = function() {
    this._requestNextIteration();
};

//////////////////////

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
//main.init();
