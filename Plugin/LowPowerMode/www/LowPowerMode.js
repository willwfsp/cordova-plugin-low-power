var exec = require('cordova/exec');

exports.isLowPowerModeEnabled = function(arg0, success, error) {
    exec(success, error, "LowPowerMode", "isLowPowerModeEnabled", [arg0]);
};
